import { useState, useEffect, useRef } from "react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen]                   = useState(false);
  const ref                               = useRef();
  const user                              = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchNotifications = async () => {
    try {
      const res  = await fetch(`/api/notifications/get.php?user_id=${user.user_id}`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications/mark-read.php", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ user_id: user.user_id }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
  };

  const unread = notifications.filter((n) => n.is_read == 0).length;

  const typeColors = {
    info:    { bg: "#e6f1fb", color: "#185fa5" },
    success: { bg: "#d1fae5", color: "#065f46" },
    error:   { bg: "#fcebeb", color: "#a32d2d" },
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => { setOpen(!open); if (!open) markAllRead(); }} style={{
        background: "none", border: "none", cursor: "pointer",
        fontSize: "22px", position: "relative", padding: "4px"
      }}>
        🔔
        {unread > 0 && (
          <span style={{
            position: "absolute", top: 0, right: 0,
            background: "#e24b4a", color: "white",
            borderRadius: "50%", fontSize: "10px",
            width: "16px", height: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "600"
          }}>{unread}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute", right: 0, top: "110%",
          width: "320px", background: "white",
          borderRadius: "12px", boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          border: "0.5px solid rgba(100,160,255,0.2)",
          zIndex: 9999, overflow: "hidden"
        }}>
          <div style={{ padding: "14px 16px", borderBottom: "0.5px solid #eee", fontWeight: 600, color: "#1a3a5c" }}>
            Notifications
          </div>

          <div style={{ maxHeight: "340px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "24px", textAlign: "center", color: "#8a9ab8" }}>No notifications</div>
            ) : (
              notifications.map((n) => {
                const style = typeColors[n.type] || typeColors.info;
                return (
                  <div key={n.id} style={{
                    padding: "12px 16px",
                    borderBottom: "0.5px solid #f0f0f0",
                    background: n.is_read == 1 ? "white" : "#f0f7ff",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{
                        background: style.bg, color: style.color,
                        borderRadius: "20px", fontSize: "11px",
                        padding: "2px 8px", fontWeight: 600
                      }}>{n.type}</span>
                      <span style={{ fontSize: "11px", color: "#8a9ab8", marginLeft: "auto" }}>
                        {new Date(n.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ fontWeight: 500, fontSize: "13px", color: "#1a3a5c" }}>{n.title}</div>
                    <div style={{ fontSize: "12px", color: "#5a7a9a", marginTop: "2px" }}>{n.message}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}