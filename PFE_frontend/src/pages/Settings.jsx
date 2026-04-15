import "../Styles/Settings.css";

export default function Settings({ darkMode, setDarkMode }) {
  const handleToggle = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  return (
    <div className="st-wrap">

      {/* ── Header ── */}
      <div className="st-header">
        <h1 className="st-title">Settings</h1>
        <p className="st-sub">Manage your app preferences</p>
      </div>

      {/* ── Appearance Card ── */}
      <div className="st-card">
        <div className="st-card-head">
          <span className="st-card-title">Appearance</span>
          <span className="st-card-tag">Display</span>
        </div>

        <div className="st-row">
          <div className="st-row__left">
            <div className="st-row__icon">{darkMode ? "" : ""}</div>
            <div className="st-row__body">
              <span className="st-row__label">Dark Mode</span>
              <span className="st-row__desc">
                {darkMode ? "Dark theme is on" : "Light theme is on"}
              </span>
            </div>
          </div>

          {/* Toggle switch */}
          <button
            className={`st-toggle ${darkMode ? "st-toggle--on" : ""}`}
            onClick={handleToggle}
            aria-label="Toggle dark mode"
          >
            <span className="st-toggle__knob" />
          </button>
        </div>
      </div>

      {/* ── Info Card ── */}
      <div className="st-card">
        <div className="st-card-head">
          <span className="st-card-title">About</span>
          <span className="st-card-tag">System</span>
        </div>
        <div className="st-info-row">
          <span className="st-info-label">App Name</span>
          <span className="st-info-value">Corporate Travel System</span>
        </div>
        <div className="st-info-row">
          <span className="st-info-label">Version</span>
          <span className="st-info-value">1.0.0</span>
        </div>
        <div className="st-info-row">
          <span className="st-info-label">Theme resets on refresh</span>
          <span className="st-info-value">Yes</span>
        </div>
      </div>

    </div>
  );
}