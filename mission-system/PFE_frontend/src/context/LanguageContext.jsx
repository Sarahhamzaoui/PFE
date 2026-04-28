import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem("lang") || "en"
  );

  useEffect(() => {
    localStorage.setItem("lang", language);
  }, [language]);

  const translations = {
    en: {
      settings: "Settings",
      appearance: "Appearance",
      darkMode: "Dark Mode",
      language: "Language",
      about: "About",
    },
    ar: {
      settings: "الإعدادات",
      appearance: "المظهر",
      darkMode: "الوضع الداكن",
      language: "اللغة",
      about: "حول",
    },
  };

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);