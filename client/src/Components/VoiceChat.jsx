import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { getLocalStream, getRemoteStreams, localStreamSetter, registerOnRemoteStream } from "../lib/voice-chat"; 

const RemoteAudio = ({ stream }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <audio
            ref={audioRef}
            autoPlay
            playsInline
            controls
            muted={false}
            className="hidden"
        />
    );
};

const VoiceChat = () => {
    const [remoteStreams, setRemoteStreams] = useState(getRemoteStreams());
    const [localStream, setLocalStream] = useState(null);
    const [isMuted, setIsMuted] = useState(true);

    const toggleMute = () => {
        const audioTrack = localStream?.getAudioTracks?.()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setIsMuted(!audioTrack.enabled);
            localStreamSetter(localStream);
        }
    };

    useEffect(() => {
        console.log("voice chat mounted");
        const stream = getLocalStream();
        setLocalStream(stream);
        setIsMuted(!stream?.getAudioTracks()[0].enabled);

        registerOnRemoteStream((userId, stream) => {
            setRemoteStreams(prev => ({
                ...prev,
                [userId]: stream,
            }));
        });

        return (() => {console.log("voice chat unmounted"); });
    }, []);

    return (
        <div className="">
            <button
                onClick={toggleMute}
                className="px-4 py-2 bg-red-500 text-white rounded-xl"
            >
                {isMuted ? <MicOff /> : <Mic />}
            </button>

            {Object.entries(remoteStreams).map(([id, stream]) => (
                <RemoteAudio key={id} stream={stream} />
            ))}
        </div>
    );
};

export default VoiceChat;
