import { useState, useEffect, useRef } from "react";

const TYPE_STYLES = {
  info:    { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6", label: "Info" },
  success: { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e", label: "Success" },
  error:   { bg: "#fef2f2", color: "#b91c1c", dot: "#ef4444", label: "Error" },
  warning: { bg: "#fffbeb", color: "#b45309", dot: "#f59e0b", label: "Warning" },
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)   return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen]                   = useState(false);
  const [loading, setLoading]             = useState(false);
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
    setLoading(true);
    await fetch("/api/notifications/mark-read.php", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ user_id: user.user_id }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    setLoading(false);
  };

  const handleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next) markAllRead();
  };

  const unread = notifications.filter((n) => n.is_read == 0).length;

  return (
    <div ref={ref} style={{ position: "relative", fontFamily: "'Outfit', sans-serif" }}>

      {/* Bell Button */}
      <button onClick={handleOpen} style={{
        background: open ? "#eff6ff" : "transparent",
        border: "1px solid",
        borderColor: open ? "#bfdbfe" : "transparent",
        borderRadius: "10px",
        cursor: "pointer",
        width: "38px", height: "38px",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
        transition: "all 0.18s ease",
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={open ? "#2563eb" : "#64748b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span style={{
            position: "absolute", top: "4px", right: "4px",
            background: "#ef4444", color: "white",
            borderRadius: "50%", fontSize: "9px",
            width: "15px", height: "15px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "700", border: "1.5px solid white",
            lineHeight: 1,
          }}>{unread > 9 ? "9+" : unread}</span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 8px)",
          width: "340px",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,.07), 0 10px 40px -4px rgba(0,0,0,.12)",
          border: "1px solid #e2e8f0",
          zIndex: 9999,
          overflow: "hidden",
          animation: "notif-in 0.18s ease",
        }}>

          <style>{`
            @keyframes notif-in {
              from { opacity: 0; transform: translateY(-6px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            .notif-item:hover { background: #f8fafc !important; }
            .notif-scroll::-webkit-scrollbar { width: 4px; }
            .notif-scroll::-webkit-scrollbar-track { background: transparent; }
            .notif-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
          `}</style>

          {/* Header */}
          <div style={{
            padding: "14px 16px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a" }}>Notifications</span>
              {unread > 0 && (
                <span style={{
                  background: "#eff6ff", color: "#2563eb",
                  fontSize: "11px", fontWeight: 700,
                  padding: "1px 7px", borderRadius: "100px",
                  border: "1px solid #bfdbfe",
                }}>{unread} new</span>
              )}
            </div>
            {notifications.length > 0 && (
              <button onClick={markAllRead} disabled={loading} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "12px", color: "#2563eb", fontWeight: 600,
                fontFamily: "'Outfit', sans-serif",
                opacity: loading ? 0.5 : 1,
                padding: 0,
              }}>
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="notif-scroll" style={{ maxHeight: "360px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "40px 16px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔕</div>
                <div style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 500 }}>You're all caught up</div>
              </div>
            ) : (
              notifications.map((n) => {
                const s = TYPE_STYLES[n.type] || TYPE_STYLES.info;
                return (
                  <div key={n.id} className="notif-item" style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #f1f5f9",
                    background: n.is_read == 1 ? "white" : "#fafcff",
                    cursor: "default",
                    transition: "background 0.15s",
                    position: "relative",
                  }}>
                    {n.is_read == 0 && (
                      <div style={{
                        position: "absolute", left: "6px", top: "50%",
                        transform: "translateY(-50%)",
                        width: "4px", height: "4px",
                        borderRadius: "50%", background: "#2563eb",
                      }} />
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px" }}>
                      <span style={{
                        background: s.bg, color: s.color,
                        borderRadius: "100px", fontSize: "10.5px",
                        padding: "1px 8px", fontWeight: 700,
                        letterSpacing: "0.3px",
                        textTransform: "capitalize",
                      }}>{s.label}</span>
                      <span style={{ fontSize: "11px", color: "#94a3b8", marginLeft: "auto" }}>
                        {timeAgo(n.created_at)}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: "13px", color: "#0f172a", marginBottom: "2px" }}>{n.title}</div>
                    <div style={{ fontSize: "12.5px", color: "#64748b", lineHeight: 1.5 }}>{n.message}</div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div style={{
              padding: "10px 16px",
              borderTop: "1px solid #f1f5f9",
              textAlign: "center",
            }}>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                {notifications.length} notification{notifications.length !== 1 ? "s" : ""} total
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}