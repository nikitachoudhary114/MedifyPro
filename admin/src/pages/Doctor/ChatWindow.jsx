import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

const ChatWindow = ({ room, userId, userName, onClose }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);


  useEffect(() => {
    socket.on("typing", (name) => {
      setTypingUser(name);
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    });
  }, []);
  

  useEffect(() => {
    socket.emit("joinRoom", { room });

    socket.on("previousMessages", (messages) => {
      setChat(messages);
      setLoading(false);
    });

    socket.on("recievedMessage", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("previousMessages");
      socket.off("recievedMessage");
    };
  }, [room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMsg = {
        room,
        message,
        sender: userId,
        senderName: userName,
      };

      socket.emit("sendMessage", newMsg);
      setChat((prev) => [...prev, newMsg]);
      setMessage("");
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col md:max-w-2xl md:mx-auto md:my-10 md:rounded-2xl md:shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-violet-400 to-violet-500 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Chat with Patient</h2>
        <button
          onClick={onClose}
          className="text-white text-xl hover:scale-110 transition"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-violet-50 space-y-2">
        {loading ? (
          <div className="text-center text-gray-500 mt-4">Loading chat...</div>
        ) : (
          chat.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-5 py-3 rounded-lg max-w-xs shadow ${
                  msg.sender === userId
                    ? "bg-violet-200 text-black"
                    : "bg-white  "
                }`}
              >
                <div className="text-xs text-gray-700 mb-1 font-medium">
                  {msg.sender === userId ? "You" : msg.senderName || msg.sender}
                </div>
                <div className="text-sm">{msg.message}</div>
                <div className="text-xs text-gray-500 text-right mt-1">
                  {new Date(msg.timestamp || Date.now()).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {isTyping && typingUser !== userName && (
          <div className="text-sm text-gray-500 italic">
            {typingUser} is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="p-4 flex gap-2 bg-white border-t border-gray-200"
      >
        <input
          className="flex-1 border border-violet-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-violet-300"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            socket.emit("typing", { room, senderName: userName });
          }}
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
