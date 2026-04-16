import { useEffect, useState } from "react";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";
import "../../../style.css";

interface User {
  _id: string;
  userName?: string;
  lastMessage?: string;
  time?: string;
  unread?: number;
}

const AdminSupportList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("get_users");

    const handleUsers = (data: User[]) => {
      setUsers(data || []);
    };

    const handleReceive = () => {
      socket.emit("get_users");
    };

    socket.on("users_list", handleUsers);
    socket.on("receive_message", handleReceive);

    // ✅ FIX (IMPORTANT)
    return () => {
      socket.off("users_list", handleUsers);
      socket.off("receive_message", handleReceive);
    };
  }, []);

  return (
    <div className="admin-list-page">

      <div className="admin-list-card">

        {/* HEADER */}
        <div className="admin-list-header">
          <h2>Support Inbox</h2>
          <span>{users.length} Conversations</span>
        </div>

        {/* USER LIST */}
        <div className="admin-list-body">
          {users.map((u) => (
            <div
              key={u._id}
              className="user-row"
              onClick={() => navigate(`/admin/support/${u._id}`)}
            >
              {/* LEFT */}
              <div className="user-left">
                <div className="avatar">
                  {u.userName?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="user-info">
                  <h4>{u.userName}</h4>
                  <p>{u.lastMessage || "No messages yet"}</p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="user-right">
                <span className="time">
                  {u.time
                    ? new Date(u.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>

                {u.unread && u.unread > 0 && (
                  <span className="badge">{u.unread}</span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default AdminSupportList;