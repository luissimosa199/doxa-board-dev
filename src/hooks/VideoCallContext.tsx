import React, { createContext, useState, useRef, useEffect } from 'react';
import { Socket, io } from 'socket.io-client';
import Peer from 'simple-peer';
import { useSession } from 'next-auth/react';

type SocketContextType = {
  call: any,
  callAccepted: boolean,
  myVideo: any,
  userVideo: any,
  stream: any,
  name: string,
  setName: (name: string) => void,
  callEnded: boolean,
  me: string,
  callUser: (id: string) => void,
  leaveCall: () => void,
  answerCall: () => void,
  usersInRoom: UserInRoom[],
  messages: ChatMessage[],
  message: string,
  sendMessage: () => void,
  setMessage: (message: string) => void
};

type ContextProviderProps = {
  children: React.ReactNode;
};

type CallType = {
  isReceivingCall?: boolean;
  from?: string;
  name?: string;
  signal?: any;
};

type UserInRoom = {
  name: string;
  id: string;
  room: string;
}

type ChatMessage = {
    username: string;
    message: string;
    timestamp?: Date;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);


const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {

  const [socket, setSocket] = useState<Socket | null>(null)

  if (!socket) {
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket)
  }

  const { data: session } = useSession()

  const roomName = "1234"

  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState<MediaStream | undefined>()
  const [name, setName] = useState<string>('');
  const [call, setCall] = useState<CallType>({});
  const [me, setMe] = useState('');

  // const [] = useState()

  const [connectedToRoom, setConnectedToRoom] = useState<boolean>(false)
  const [usersInRoom, setUsersInRoom] = useState<UserInRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState<string>('');

  const myVideo = useRef<HTMLVideoElement | null>(null);
  const userVideo = useRef<HTMLVideoElement | null>(null);
  const connectionRef = useRef<Peer.Instance | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });

    if (socket) {
      socket.on('me', (id) => setMe(id));

      socket.on('usersInRoom', (usersInRoom: UserInRoom[]) => {
        setUsersInRoom(usersInRoom);
      });

      socket.on('roomMessages', (roomMessages) => {
        setMessages(roomMessages);
      });

      socket.on('callUser', ({ from, name: callerName, signal }) => {
        setCall({ isReceivingCall: true, from, name: callerName, signal });
      });
    }

    return () => {
      if (socket) {
        socket.off('me');
        socket.off('usersInRoom');
        socket.off('roomMessages');
        socket.off('callUser');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (roomName && name && !connectedToRoom) { // Ensure name is also available
      socket!.emit("joinRoomOnConnect", roomName, name, () => {
        // No need to emit getUsersInRoom here. The backend will handle it.
      });
      setConnectedToRoom(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedToRoom, name]); // Added name as a dependency

  useEffect(() => {
    if (session && session.user) {
      setName(session?.user?.name as string)
    }
  }, [session])

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.emit('sendMessage', { room: roomName, message, username: name });
      setMessage(''); // Clear the input after sending
    }
  };



  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket?.emit('answerCall', { signal: data, room: roomName }); // Specify the room name here
    });

    peer.on('stream', (currentStream) => {
      userVideo.current!.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = () => { // Removed the id parameter
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket?.emit('callUser', { roomToCall: roomName, signalData: data, from: me, name }); // Specify the room name here
    });

    peer.on('stream', (currentStream) => {
      userVideo.current!.srcObject = currentStream;
    });

    socket?.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };


  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current!.destroy();

    window.location.reload();
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
      usersInRoom,
      messages,
      sendMessage,
      message,
      setMessage
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };