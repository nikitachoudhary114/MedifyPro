import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:8080"); // Replace with your backend

const VideoCall = () => {
  const localVideo = useRef();
  const remoteVideo = useRef();
  const peerConnection = useRef(null);
  const [joined, setJoined] = useState(false);
  const { roomID } = useParams();

  const config = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    socket.on("user-joined", handleUserJoined);
    socket.on("offer", handleReceiveOffer);
    socket.on("answer", handleReceiveAnswer);
    socket.on("ice-candidate", handleNewICECandidate);

    return () => {
      socket.disconnect();
    };
  }, []);

  const startCall = async () => {
    setJoined(true);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideo.current.srcObject = stream;

    peerConnection.current = new RTCPeerConnection(config);

    stream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, stream);
    });

    peerConnection.current.ontrack = (event) => {
      remoteVideo.current.srcObject = event.streams[0];
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { roomID, candidate: event.candidate });
      }
    };

    socket.emit("join-video-room", roomID);
    socket.on("user-joined", handleUserJoined);
  };

  const endCall = () => {
    // Close the peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    // Stop all local media tracks (video & audio)
    if (localVideo.current && localVideo.current.srcObject) {
      localVideo.current.srcObject.getTracks().forEach((track) => track.stop());
      localVideo.current.srcObject = null;
    }

    // Stop remote video stream if needed
    if (remoteVideo.current && remoteVideo.current.srcObject) {
      remoteVideo.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
      remoteVideo.current.srcObject = null;
    }

    setJoined(false);

    // Notify other users in the room that call ended (optional)
    socket.emit("end-call", { roomID });

    console.log("Call ended");
  };
  

  const handleUserJoined = async () => {
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit("offer", { roomID, offer });
  };

  const handleReceiveOffer = async (offer) => {
    await peerConnection.current.setRemoteDescription(
      new window.RTCSessionDescription(offer)
    );
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideo.current.srcObject = stream;

    stream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, stream);
    });

    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    socket.emit("answer", { roomID, answer });
  };

  const handleReceiveAnswer = async (answer) => {
    await peerConnection.current.setRemoteDescription(
      new window.RTCSessionDescription(answer)
    );
  };

  const handleNewICECandidate = async (candidate) => {
    try {
      await peerConnection.current.addIceCandidate(
        new window.RTCIceCandidate(candidate)
      );
    } catch (error) {
      console.error("Error adding received ice candidate", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-violet-100 to-indigo-200">
      <div className="mb-8 mt-8">
        {!joined ? (
          <button
            onClick={startCall}
            className="px-8 py-3 rounded-lg text-lg font-semibold shadow transition bg-violet-600 text-white hover:bg-violet-700"
          >
            Start Call
          </button>
        ) : (
          <button
            onClick={endCall}
            className="px-8 py-3 rounded-lg text-lg font-semibold shadow transition bg-red-600 text-white hover:bg-red-700"
          >
            End Call
          </button>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full">
        <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-violet-300 bg-white">
            <video
              ref={localVideo}
              autoPlay
              muted
              playsInline
              style={{ width: "420px", height: "320px", background: "#e5e7fa" }}
              className="object-cover"
            />
          </div>
          <span className="mt-3 text-lg font-medium text-violet-700">You</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-indigo-300 bg-white">
            <video
              ref={remoteVideo}
              autoPlay
              playsInline
              style={{ width: "420px", height: "320px", background: "#e5e7fa" }}
              className="object-cover"
            />
          </div>
          <span className="mt-3 text-lg font-medium text-indigo-700">
            Patient
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
