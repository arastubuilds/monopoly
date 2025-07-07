import { useAuthStore } from "../store/authStore";
import { useGameStore } from "../store/gameStore";


const socket = useAuthStore.getState().socket;
const game = useGameStore.getState().game;
const voiceOffer = useGameStore.getState().offer;
const voiceAnswer = useGameStore.getState().answer;
const voiceCandidate = useGameStore.getState().iceCandidate;


let localStream = null;
let onRemoteStream = () => {};

const peerConnections = {};
const pendingCandidates = {};


export const initLocalAudio = async() => {
    localStream = await navigator.mediaDevices.getUserMedia({audio: true});
    localStream.getAudioTracks()[0].enabled = false;
    
}
export const registerSignallingSocketEvents = () => {
    socket.on("offer", async ({fromId, offer}) => {
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
        voiceAnswer(game.code, fromId, answer);
    });
    socket.on("answer", async({fromId, answer})=> {
        const pc = peerConnections[fromId];
        if (!pc) return;

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
export const offerUsersInRoom = async () => {
    const usersInRoom = useGameStore().getState().usersInRoom;
    for (const userId of usersInRoom) {
        const pc = createPeerConnection(userId);
        localStream?.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        });
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        voiceOffer(game.code, userId, offer);
    }
}

const createPeerConnection = (userId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnections[userId] = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        voiceCandidate(game.code, userId, event.candidate);
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
