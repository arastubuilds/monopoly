import { useAuthStore } from "../store/authStore";

let localStream = null;
let onRemoteStream = () => {};
const remoteStreams = {};
const peerConnections = {};
const pendingCandidates = {};

export const initLocalAudio =  async() => {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({audio: true});
        localStream.getAudioTracks()[0].enabled = true;
        console.log("local stream initted");
    } catch (error) {
        console.error("error accessing mic", error);
    }
};
export const getLocalStream = () => { return localStream };
export const localStreamSetter = (stream) => { localStream = stream };

export const addRemoteStream = (userId, stream) => {
    remoteStreams[userId] = stream;
    if (typeof onRemoteStream === "function"){
        onRemoteStream(userId, stream);
    }
};

export const getRemoteStreams = () => { return remoteStreams };

export const registerSignallingSocketEvents = () => {

  const socket = useAuthStore.getState().socket;

  console.log("Signalling events registered");
  initLocalAudio().then(() => {console.log("local audio initted")});

  socket.on("existing-users", async ({ usersInRoom }) => {
    console.log("Received existing users", usersInRoom);

    for (const userId of usersInRoom) {
      const pc = createPeerConnection(userId);
      localStream?.getTracks().forEach((track) => {
        console.log("Adding track to", userId);
        pc.addTrack(track, localStream);
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", { targetId: userId, offer });
    }
  });

  socket.on("offer", async ({ fromId, offer }) => {
    console.log("Received offer from", fromId);

    const pc = createPeerConnection(fromId);
    localStream?.getTracks().forEach((track) => {
        console.log(track);
      pc.addTrack(track, localStream);
    });

    await pc.setRemoteDescription(new RTCSessionDescription(offer));

    // Add pending candidates if any
    if (pendingCandidates[fromId]) {
      for (const c of pendingCandidates[fromId]) {
        await pc.addIceCandidate(c);
      }
      delete pendingCandidates[fromId];
    }
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("answer", { targetId: fromId, answer });
  });

  socket.on("answer", async ({ fromId, answer }) => {
    console.log("Received answer from", fromId);

    const pc = peerConnections[fromId];
    if (!pc) {
      console.warn("No peer connection for", fromId);
      return;
    }

    if (pc.signalingState === "have-local-offer") {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));

      if (pendingCandidates[fromId]) {
        for (const c of pendingCandidates[fromId]) {
          await pc.addIceCandidate(c);
        }
        delete pendingCandidates[fromId];
      }
    }
  });

  socket.on("ice-candidate", async ({ fromId, candidate }) => {
    console.log("Received ICE candidate from", fromId);
    const pc = peerConnections[fromId];
    const iceCandidate = new RTCIceCandidate(candidate);

    if (pc?.remoteDescription?.type) {
      await pc.addIceCandidate(iceCandidate);
    } else {
      if (!pendingCandidates[fromId]){
        pendingCandidates[fromId] = [];
      }
      pendingCandidates[fromId].push(iceCandidate);
    }
  });
};
export const registerOnRemoteStream = (callback) => {
    onRemoteStream = callback;
}

const createPeerConnection = (userId) => {
    // const { peerConnections, setPeerConnections, addRemoteStream } = useVoiceStore.getState();
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
        addRemoteStream(userId, event.streams[0]);
    };
    return pc;
}
