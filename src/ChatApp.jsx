import React, { useState, useEffect, useRef } from "react";
import { ChatClient } from "./proto/ChatServiceClientPb.js";
import { JoinRequest, ChatMessage } from "./proto/chat_pb.js";

const client = new ChatClient("https://localhost:7227");

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
      <div style={{ padding: 20 }}>
        <h2>Join Chat</h2>
        <input
          value={username}
          placeholder="Your name"
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={joinChat}>Join</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat Room</h2>
      <div
        ref={chatRef}
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "auto",
          padding: "5px",
          marginBottom: "10px",
        }}
      >
        {messages.map((m, idx) => (
          <div key={idx}>
            <b>
              [{m.time}] {m.user}:
            </b>{" "}
            {m.text}
          </div>
        ))}
      </div>
      <input
        value={text}
        placeholder="Message"
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
