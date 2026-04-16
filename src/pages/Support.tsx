import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { useAppSelector } from "../hooks/reduxHooks";
import { useNavigate } from "react-router-dom"; 
import "../../style.css";

interface Msg {
  text: string;
  time?: string;
  sender?: string;
  userId?: string;
}

const Support = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [message, setMessage] = useState("");

  const chatRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate(); 

  // REDUX USER
  const { user } = useAppSelector((s: any) => s.auth || {});

  //  SAFE USER GETTER ( MAIN FIX)
  const getUser = () => {
    if (user && (user._id || user.id)) {
      return {
        ...user,
        _id: user._id || user.id,
      };
    }

    try {
      
      const stored = sessionStorage.getItem("user");
      if (!stored) return null;

      const parsed = JSON.parse(stored);

      if (parsed._id) return parsed;
      if (parsed.id) {
        return { ...parsed, _id: parsed.id };
      }

      return null;
    } catch {
      return null;
    }
  };

  const currentUser = getUser();

  //  LOAD CHAT
  useEffect(() => {
    if (!currentUser?._id) return;

    socket.emit("load_messages", currentUser._id);

    const handleAll = (data: Msg[]) => {
      setMessages(data || []);
    };

    const handleReceive = (data: Msg) => {
      if (data.userId === currentUser._id) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("all_messages", handleAll);
    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("all_messages", handleAll);
      socket.off("receive_message", handleReceive);
    };
  }, [currentUser?._id]);

  //  AUTO SCROLL
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  //  SEND MESSAGE
  const sendMessage = () => {
    if (!message.trim()) return;

    if (!currentUser?._id) {
      alert(" Please login again");
      return;
    }

    socket.emit("send_message", {
      text: message,
      sender: "user",
      userId: currentUser._id,
      userName: currentUser.name || "User",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    setMessage("");
  };

  //  FALLBACK UI
  if (!currentUser?._id) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f5f0",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "40px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            textAlign: "center",
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "15px" }}>🔒</div>

          <h4 style={{ marginBottom: "10px", fontWeight: 600 }}>
            Session Expired
          </h4>

          <p style={{ color: "#666", fontSize: "0.95rem" }}>
            Your session has ended. Please login again to continue.
          </p>

          <button
            type="button" 
            onClick={() => navigate("/login")}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#c76509",
              color: "#fff",
              fontWeight: 500,
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "#a65305")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "#c76509")
            }
          >
            Go to Login →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="support-page">
      {/* LEFT PANEL */}
      <div className="support-left">
        <div className="left-content">
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
            alt="Open book"
          />

          <div className="left-text">
            <h1>We’re here to help</h1>
            <p>
              Have questions about your orders, books, or account? Our support
              team is ready to assist you anytime.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="support-right">
        <div className="support-card">
          <div className="support-header">
            <div className="support-title">
              <div className="avatar">S</div>
              <div>
                <h3>StoryTeller Customer Support</h3>
                <span className="status">● Online</span>
              </div>
            </div>
          </div>

          <div className="support-body" ref={chatRef}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-row ${
                  msg.sender === "user" ? "right" : "left"
                }`}
              >
                <div className="chat-meta">
                  {msg.sender !== "user" && (
                    <div className="mini-avatar">A</div>
                  )}

                  <div
                    className={`chat-bubble ${
                      msg.sender === "user" ? "user" : "admin"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span>{msg.time}</span>
                  </div>

                  {msg.sender === "user" && (
                    <div className="mini-avatar user">U</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="support-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;