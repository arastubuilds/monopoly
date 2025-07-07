import { useEffect } from "react";
import { useState } from "react";
import { registerOnRemoteStream } from "../lib/voice-chat";

const WebRTC = () => {

    const [isMuted, setIsMuted] = useState(true);
    const [remoteStreams, setRemoteStreams] = useState({});

    useEffect(() => {
        registerOnRemoteStream((userId, stream) => {
            setRemoteStreams(prev => ({
                ...prev, [userId]:stream,
            }));
        });
    }, []);
        
    return (
        <></>
    );
}
export default WebRTC;