import React from 'react';
import dynamic from 'next/dynamic';

const VideoCallPage = dynamic(() => import('@/components/VideoCallPage'), {
  loading: () => <p>Loading...</p>,
  ssr: false
});

const VideoCall = () => {
  return (
    <VideoCallPage />
  );
}

export default VideoCall
