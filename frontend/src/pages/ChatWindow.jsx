import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

const ChatWindow = ({ room, userId, userName, onClose }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit("joinRoom", { room });

    socket.on("previousMessages", (messages) => {
      setChat(messages);
    });

    socket.on("receiveMessage", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("previousMessages");
      socket.off("receiveMessage");
    };
  }, [room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("sendMessage", {
        room,
        message,
        sender: userId,
        senderName: userName,
      });
    //   console.log(userName)
      setMessage("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 border rounded p-4 bg-white z-50 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        ✕
      </button>
      <h2 className="text-xl font-bold mb-4">Chat Room: {room}</h2>
      <div className="h-64 overflow-y-auto mb-4 bg-gray-100 p-2 rounded">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={msg.sender === userId ? "text-right" : "text-left"}
          >
            <span className="font-semibold">
              {msg.sender === userId ? "You" : msg.senderName || msg.sender}:{" "}
            </span>
            <span>{msg.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="bg-blue-500 text-white px-4 rounded" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
