import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../config/socket";
import { useAuth } from "../context/AuthContext";
import { fetchMessages } from "../api/team";

function TeamChat() {
  const { teamId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ Fetch old messages from DB
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const data = await fetchMessages(teamId);
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchChatHistory();
  }, [teamId]);

  // ✅ Join socket room & listen for messages
  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.emit("join_room", { teamId, userName: user.name });

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.emit("leave_room", { teamId, userName: user.name });
      socket.off("receive_message");
    };
  }, [teamId, user.name]);

  // ✅ Send message
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", {
        teamId,
        senderId: user._id,
        message,
      });

      setMessage("");
    }
  };

  return (
    <div className="chat-room">
      <h2>Team Chat</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <p key={msg._id || index}>
            <b>{msg.sender?.name || msg.user || "Unknown"}:</b> {msg.message}
          </p>
        ))}
      </div>
      <div className="input-box">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default TeamChat;
