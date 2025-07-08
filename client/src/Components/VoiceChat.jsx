import { useState, useEffect, useRef } from "react";
import { registerOnRemoteStream } from "../lib/voice-chat";


const RemoteAudio = ({ stream }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.srcObject = stream;
    }
  }, [stream]);

  return <audio ref={audioRef} autoPlay controls muted={false} />;
}


const VoiceChat = () => {
    // const [isMuted, setIsMuted] = useState(true);
    const [remoteStreams, setRemoteStreams] = useState({});

    // const toggleMute = () => {
    // const audioTrack = localStreamRef.current?.getAudioTracks?.()[0];
    //     if (audioTrack) {
    //         audioTrack.enabled = !audioTrack.enabled;
    //         setIsMuted(!audioTrack.enabled);
    //     }
    // };

    useEffect(() => {
        registerOnRemoteStream((userId, stream) => {
            setRemoteStreams(prev => ({
                ...prev, [userId]:stream,
            }));
        });
    }, []);
        
    return (
        <>
            <div className="mt-4">
                {Object.entries(remoteStreams).map(([id, stream]) => (
                    <RemoteAudio key={id} stream={stream} />
                ))}
            </div>
        </>
    );
}
export default VoiceChat;