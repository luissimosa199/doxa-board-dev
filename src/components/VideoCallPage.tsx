import { useState, useEffect, useRef } from 'react';
import { ClientConfig, IAgoraRTCRemoteUser, createClient, createMicrophoneAndCameraTracks } from 'agora-rtc-react';
import { useRouter } from 'next/router';


const config = { mode: "rtc", codec: "vp8", appid: "c2a17faedf124435a895dab019e37429" };

const useClient = createClient(config as ClientConfig);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const VideoCallPage = () => {

    const router = useRouter();
    const channelName = router.query.id as string;

    const [inCall, setInCall] = useState(false);
    const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
    const [isClientReady, setIsClientReady] = useState(false);

    const client = useClient();
    const { ready, tracks } = useMicrophoneAndCameraTracks();

    const localVideoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ready && tracks && !isClientReady) {
            client.join(config.appid, channelName, null).then(uid => {
                client.publish(tracks);
                setInCall(true);
                setIsClientReady(true);  // Set the client as ready after joining
            });
        }
    }, [client, tracks, ready, isClientReady, channelName]);

    // This useEffect handles the local video track
    useEffect(() => {
        if (tracks && localVideoRef.current) {
            tracks[1].play(localVideoRef.current);
            return () => {
                tracks[1].stop();
                tracks[1].close();
            };
        }
    }, [tracks]);

    // This useEffect handles user-published events and other client events
    useEffect(() => {
        const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'video' | 'audio') => {
            await client.subscribe(user, mediaType);
            if (mediaType === 'video' && user.videoTrack) {
                setRemoteUsers(prevUsers => [...prevUsers, user]);
                user.videoTrack.play(`video-${user.uid}`);
            }
            if (mediaType === 'audio' && user.audioTrack) {
                user.audioTrack.play();
            }
        };

        const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
            setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
        };

        client.on('user-published', handleUserPublished);
        client.on('user-unpublished', handleUserUnpublished);

        return () => {
            client.off('user-published', handleUserPublished);
            client.off('user-unpublished', handleUserUnpublished);
        };
    }, [client]);

    // This useEffect handles client disconnection
    useEffect(() => {
        const handleClientDisconnected = () => {
            setIsClientReady(false);
        };
        client.on('disconnected', handleClientDisconnected);
        return () => {
            client.off('disconnected', handleClientDisconnected);
        };
    }, [client]);

    useEffect(() => {
        remoteUsers.forEach(user => {
            if (user.videoTrack) {
                user.videoTrack.play(`video-${user.uid}`);
            }
        });
    }, [remoteUsers]);

    return (
        <div className="relative w-full h-screen flex items-center justify-center bg-black">
            <p className="absolute top-4 left-4 text-white">VideoCallComponent</p>
    
            {/* Local Stream */}
            <div 
                ref={localVideoRef} 
                className="absolute bottom-4 right-4 w-1/4 h-1/4 border-2 border-white rounded-md z-50 "
            ></div>
    
            {/* Remote Streams */}
            {remoteUsers.map(user => (
                <div 
                    key={user.uid} 
                    id={`video-${user.uid}`} 
                    className="w-full h-full border-2 border-white rounded-md"
                ></div>
            ))}
        </div>
    );
    
}

export default VideoCallPage;