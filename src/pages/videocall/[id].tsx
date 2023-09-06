import React, { useEffect, useState, useRef, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import io, { Socket } from 'socket.io-client';
import { SocketContext } from '@/hooks/VideoCallContext';
import VideoCallPlayer from '@/components/VideoCallPlayer';
import VideoCallNotification from '@/components/VideoCallNotification';
import VideoCallSidebar from '@/components/VideoCallSideBar';

type ChatMessage = {
    username: string;
    message: string;
    timestamp?: Date;
};

type UserInRoom = {
    username: string;
    id: string;
    room: string;
}

const Videocall = () => {

    const router = useRouter();
    const roomId = router.query.id;
    const { data: session } = useSession()

    const context = useContext(SocketContext);

    if (!context) {
        throw new Error("You must use this component within a <ContextProvider>");
    }

    const { me, name, usersInRoom, messages, message, sendMessage, setMessage } = context

    if (
        // !session || 
        !roomId) {
        return <p>Cargando...</p>;
    }



    return (
        <div className="p-12 bg-gray-100 min-h-screen">

            <button onClick={(e) => { e.preventDefault(); console.log("NAME:", name, "ME:", me, "USERS", usersInRoom) }}>
                LoG
            </button>


            <VideoCallPlayer />

            <VideoCallSidebar>
                <VideoCallNotification />
            </VideoCallSidebar>

            <div className="chat-display mt-6 border p-4 bg-white rounded-md">
                {usersInRoom.map(({ name }, index) => (
                    <div key={index} className="mb-2">
                        <strong className="text-blue-500">{name === session!.user!.name ? "Yo" : name}</strong>
                    </div>
                ))}
            </div>

            <div className="messages">
                {messages.map((e: ChatMessage, idx) => {
                    return(
                        <div key={idx}>
                            <p><strong>{e.username}</strong>: {e.message}</p>

                        </div>
                    )
                })}
            </div>


            <div className="mt-6 flex items-center">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow p-2 border rounded-md focus:outline-none focus:border-blue-500"
                />

                <button
                    onClick={sendMessage}
                    className="ml-2 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                >
                    Send
                </button>
            </div>
        </div>

    );
};

export default Videocall;
