import { useLanguage } from "../../context/LanguageContext";
import { useEffect } from "react";
import "./Settings.css";

export default function Settings({ darkMode, setDarkMode }) {
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  const handleToggle = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.body.classList.toggle("dark", next);
  };

  return (
    <div className="st-wrap">

      <div className="st-header">
        <h1 className="st-title">{t("settings")}</h1>
        <p className="st-sub">
          {language === "ar" ? "إدارة إعدادات التطبيق" : "Manage your app preferences"}
        </p>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <span className="st-card-title">{t("appearance")}</span>
        </div>
        <div className="st-row">
          <span>{t("darkMode")}</span>
          <button className="st-toggle" onClick={handleToggle}>
            {darkMode ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <span className="st-card-title">{t("language")}</span>
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="st-select"
        >
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <span className="st-card-title">{t("about")}</span>
        </div>
        <p>Corporate Travel System v1.0.0</p>
      </div>

    </div>
  );
}