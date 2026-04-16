import { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import { useParams } from "react-router-dom";
import "../../../style.css";

interface Msg {
  text: string;
  sender?: string;
  userId?: string;
  time?: string;
}

const AdminSupport = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [reply, setReply] = useState("");

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;

    socket.emit("load_messages", userId);

    const handleAll = (data: Msg[]) => {
      setMessages(data || []);
    };

    const handleReceive = (data: Msg) => {
      if (data.userId === userId) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("all_messages", handleAll);
    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("all_messages", handleAll);
      socket.off("receive_message", handleReceive);
    };
  }, [userId]);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendReply = () => {
    if (!reply.trim()) return;

    socket.emit("send_message", {
      text: reply,
      sender: "admin",
      userId,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    setReply("");
  };

  return (
  <div className="admin-chat-page">

    <div className="admin-chat-container">

      {/* HEADER */}
      <div className="admin-chat-header">
        <div className="header-left">
          <div className="avatar">U</div>
          <div>
            <h3>User Conversation</h3>
            <span className="status">● Active</span>
          </div>
        </div>
      </div>

      {/* CHAT BODY */}
      <div className="admin-chat-body" ref={chatRef}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-row ${
              msg.sender === "admin" ? "right" : "left"
            }`}
          >
            <div className="chat-bubble-wrap">

              {msg.sender !== "admin" && (
                <div className="mini-avatar">U</div>
              )}

              <div
                className={`chat-bubble ${
                  msg.sender === "admin" ? "admin" : "user"
                }`}
              >
                <p>{msg.text}</p>
                <span>{msg.time}</span>
              </div>

              {msg.sender === "admin" && (
                <div className="mini-avatar admin">A</div>
              )}

            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="admin-chat-input">
        <input
          type="text"
          placeholder="Type your reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendReply()}
        />
        <button onClick={sendReply}>Send</button>
      </div>

    </div>

  </div>
);
};

export default AdminSupport;