import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

const socket = io("https://medifypro-backend.onrender.com"); // Replace with your backend

const VideoCall = () => {
  const localVideo = useRef();
  const remoteVideo = useRef();
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const [joined, setJoined] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

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

    localStream.current = stream;
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
  };

  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (localVideo.current && localVideo.current.srcObject) {
      localVideo.current.srcObject.getTracks().forEach((track) => track.stop());
      localVideo.current.srcObject = null;
    }

    if (remoteVideo.current && remoteVideo.current.srcObject) {
      remoteVideo.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
      remoteVideo.current.srcObject = null;
    }

    localStream.current = null;
    setJoined(false);
    setAudioEnabled(true);
    setVideoEnabled(true);

    socket.emit("end-call", { roomID });
    console.log("Call ended");
  };

  const toggleAudio = () => {
    const track = localStream.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setAudioEnabled(track.enabled);
    }
  };

  const toggleVideo = () => {
    const track = localStream.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setVideoEnabled(track.enabled);
    }
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

    localStream.current = stream;
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
      <div className="mb-6 mt-8 flex flex-wrap gap-4">
        {!joined ? (
          <button
            onClick={startCall}
            className="px-6 py-3 rounded-lg text-lg font-semibold shadow bg-violet-600 text-white hover:bg-violet-700"
          >
            Start Call
          </button>
        ) : (
          <>
            <div className="flex flex-wrap gap-4">
              {/* End Call */}
              <button
                onClick={endCall}
                className="px-6 py-3 rounded-lg text-lg font-semibold shadow bg-red-600 text-white hover:bg-red-700"
              >
                End Call
              </button>

              {/* Toggle Audio */}
              <button
                onClick={toggleAudio}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium shadow transition ${
                  audioEnabled
                    ? "bg-violet-100 text-violet-700 hover:bg-violet-200"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {audioEnabled ? (
                  <Mic className="w-5 h-5" />
                ) : (
                  <MicOff className="w-5 h-5" />
                )}
                {audioEnabled ? "Mute Audio" : "Unmute Audio"}
              </button>

              {/* Toggle Video */}
              <button
                onClick={toggleVideo}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium shadow transition ${
                  videoEnabled
                    ? "bg-violet-100 text-violet-700 hover:bg-violet-200"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {videoEnabled ? (
                  <Video className="w-5 h-5" />
                ) : (
                  <VideoOff className="w-5 h-5" />
                )}
                {videoEnabled ? "Turn Off Video" : "Turn On Video"}
              </button>
            </div>
          </>
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
