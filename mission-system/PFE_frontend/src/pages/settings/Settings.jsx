import { useLanguage } from "../../context/LanguageContext";
import { useEffect } from "react";
import "./Settings.css";

export default function Settings({ darkMode, setDarkMode }) {
  const { lang, changeLanguage } = useLanguage();

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleToggle = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.body.classList.toggle("dark", next);
  };

  const t = (en, ar) => (lang === "ar" ? ar : en);

  return (
    <div className="st-wrap">

      {/* HEADER */}
      <div className="st-header">
        <h1 className="st-title">
          {t("Settings", "الإعدادات")}
        </h1>
        <p className="st-sub">
          {t("Manage your app preferences", "إدارة إعدادات التطبيق")}
        </p>
      </div>

      {/* DARK MODE */}
      <div className="st-card">
        <div className="st-card-head">
          <span className="st-card-title">
            {t("Appearance", "المظهر")}
          </span>
        </div>

        <div className="st-row">
          <span>
            {darkMode
              ? t("Dark mode ON", "الوضع الداكن مفعل")
              : t("Light mode ON", "الوضع الفاتح مفعل")}
          </span>

          <button className="st-toggle" onClick={handleToggle}>
            Toggle
          </button>
        </div>
      </div>

      {/* LANGUAGE */}
      <div className="st-card">
        <div className="st-card-head">
          <span className="st-card-title">
            {t("Language", "اللغة")}
          </span>
        </div>

        <select
          value={lang}
          onChange={(e) => changeLanguage(e.target.value)}
          className="st-select"
        >
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </div>

      {/* INFO */}
      <div className="st-card">
        <div className="st-card-head">
          <span className="st-card-title">
            {t("About", "حول")}
          </span>
        </div>

        <p>Corporate Travel System v1.0.0</p>
      </div>

    </div>
  );
}