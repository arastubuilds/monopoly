import { useAuthStore } from "../store/authStore";


let localStream = null;
let onRemoteStream = () => {};

const peerConnections = {};
const pendingCandidates = {};


export const initLocalAudio = async() => {
    localStream = await navigator.mediaDevices.getUserMedia({audio: true});
    localStream.getAudioTracks()[0].enabled = true;
    console.log("local stream init");
}
export const getLocalStream = () => {
    return localStream;
}
export const registerSignallingSocketEvents = async() => {
    await initLocalAudio();
    
    const socket = useAuthStore.getState().socket;

    console.log("signalling events registered");

    socket.on("existing-users", async ({usersInRoom}) => {
      console.log("received existing users", usersInRoom);

      for (const userId of usersInRoom) {
        const pc = createPeerConnection(userId);
        localStream?.getTracks().forEach((track) => {
          console.log("Adding tracks to", userId, localStream?.getAudioTracks());
          pc.addTrack(track, localStream);
        });

        const offer = await pc.createOffer();
        try {
            await pc.setLocalDescription(offer);
            console.log("local description set");
        } catch (error) {
            console.error("fail local description", error);
        }

        socket.emit("offer", { targetId: userId, offer });
      }
    });

    socket.on("offer", async ({fromId, offer}) => {
        console.log("received offer from", fromId);
        
        const pc = createPeerConnection(fromId);
        localStream?.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        });
        
        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        if (pendingCandidates[fromId]){
            for (const c of pendingCandidates[fromId]) {
                pc.addIceCandidate(c);
            }
            delete pendingCandidates[fromId];
        }
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", {targetId: fromId, answer});
        // voiceAnswer(game.code, fromId, answer);
    });

    socket.on("answer", async({fromId, answer})=> {
        console.log("received answer from", fromId);

        const pc = peerConnections[fromId];
        if (!pc) { console.log("returning"); return};

        if (pc.signalingState === "have-local-offer"){
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
            if (pendingCandidates[fromId]){
                for (const c of pendingCandidates[fromId]) {
                    peerConnections[fromId].addIceCandidate(c);
                }
                delete pendingCandidates[fromId];
            }
        }
    });

    socket.on("ice-candidate", ({fromId, candidate}) => {
        console.log("received candidate from", fromId);

        const pc = peerConnections[fromId];
        const iceCandidate = new RTCIceCandidate(candidate);
        if (pc?.remoteDescription && pc.remoteDescription.type) {
            pc.addIceCandidate(iceCandidate);
        } else {
            if (!pendingCandidates[fromId]){
                pendingCandidates[fromId] = [];
            }
            pendingCandidates[fromId].push(iceCandidate);
        }
    });
}
export const registerOnRemoteStream = (callback) => {
    onRemoteStream = callback;
}

const createPeerConnection = (userId) => {
    // const {game, iceCandidate: voiceCandidate} = useGameStore.getState();
    console.log("creating peer connection for", userId);

    const socket = useAuthStore.getState().socket;
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnections[userId] = pc;

    pc.onicecandidate = (event) => {
      console.log("trying to generate ice candidate");
      console.log(event);

      if (event.candidate) {
        // voiceCandidate(game.code, userId, event.candidate);
        socket.emit("ice-candidate", {targetId: userId, candidate: event.candidate});
        console.log("ice-candidate emitted");
      }else{
        console.log("all ice candidates sent");
      }
    };

    pc.ontrack = (event) => {
      console.log("received remote stream:", event.streams[0]);
        if (typeof onRemoteStream === "function"){
            onRemoteStream(userId, event.streams[0]);
        }
    };
    return pc;
}
