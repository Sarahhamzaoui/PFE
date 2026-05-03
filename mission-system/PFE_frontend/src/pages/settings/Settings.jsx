import { useEffect } from "react";
import "./Settings.css";

export default function Settings({ darkMode, setDarkMode }) {
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleToggle = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.body.classList.toggle("dark", next);
  };

  return (
    <div className="st-wrap">

      <div className="st-header">
        <h1 className="st-title">Settings</h1>
        <p className="st-sub">Manage your app preferences</p>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <span className="st-card-title">Appearance</span>
        </div>
        <div className="st-row">
          <span>Dark Mode</span>
          <button className="st-toggle" onClick={handleToggle}>
            {darkMode ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <span className="st-card-title">Language</span>
        </div>
        <p style={{ fontSize: "13px", color: "#8a93a8" }}>English only</p>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <span className="st-card-title">About</span>
        </div>
        <p>Corporate Travel System v1.0.0</p>
      </div>

    </div>
  );
}