import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { getLocalStream, registerOnRemoteStream } from "../lib/voice-chat"; // Adjust path if needed

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
  const [remoteStreams, setRemoteStreams] = useState({});
  const [localStream, setLocalStream] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    const audioTrack = localStream?.getAudioTracks?.()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  useEffect(() => {
    
    const stream = getLocalStream();
    setLocalStream(stream);
    setIsMuted(!stream?.getAudioTracks()[0].enabled);

    registerOnRemoteStream((userId, stream) => {
      setRemoteStreams(prev => ({
        ...prev,
        [userId]: stream,
      }));
    });
  }, []);

  return (
    <div className="mt-4">
      <button
        onClick={toggleMute}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
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
