import React, { useState, useEffect, useRef } from "react";
import { ChatClient } from "./proto/ChatServiceClientPb.js";
import { JoinRequest, ChatMessage } from "./proto/chat_pb.js";

const client = new ChatClient("http://localhost:7227");

export default function ChatApp() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const chatRef = useRef(null);

  const joinChat = () => {
    if (!username) return;
    const req = new JoinRequest();
    req.setUsername(username);
    const stream = client.joinChat(req, {});
    stream.on("data", (msg) => {
      setMessages((prev) => [
        ...prev,
        { user: msg.getUser(), text: msg.getText(), time: msg.getTimestamp() },
      ]);
    });
    setJoined(true);
  };

  const sendMessage = () => {
    if (!text) return;
    const msg = new ChatMessage();
    msg.setUser(username);
    msg.setText(text);
    msg.setTimestamp(new Date().toLocaleTimeString());
    client.sendMessage(msg, {}, () => {});

    setText("");
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  if (!joined) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Join the Chat
          </h2>
          <input
            value={username}
            placeholder="Enter your name"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-500"
          />
          <button
            onClick={joinChat}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg shadow-md hover:shadow-xl transition-all"
          >
            Join Chat
          </button>
        </div>
      </div>
    );
  }

  // ----- Chat Room -----
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 text-xl font-bold shadow-md">
        Welcome, {username}
      </header>

      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 border-b border-gray-300"
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${
              m.user === username ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-3 rounded-2xl shadow-md text-white max-w-xs break-words ${
                m.user === username ? "bg-blue-500" : "bg-gray-600"
              }`}
            >
              <div className="text-sm font-semibold">{m.user}</div>
              <div className="mt-1">{m.text}</div>
              <div className="text-xs opacity-70 mt-2 text-right">{m.time}</div>
            </div>
          </div>
        ))}
      </div>

      <footer className="p-4 bg-white shadow-lg flex gap-2 border-t border-gray-200">
        <input
          value={text}
          placeholder="Type your message..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-500"
        />
        <button
          onClick={sendMessage}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg shadow hover:shadow-xl transition-all"
        >
          Send
        </button>
      </footer>
    </div>
  );
}
