export const getLanguage = () => {
  return localStorage.getItem("lang") || "en";
};

export const setLanguage = (lang) => {
  localStorage.setItem("lang", lang);

  // optional RTL support for Arabic
  if (lang === "ar") {
    document.documentElement.dir = "rtl";
  } else {
    document.documentElement.dir = "ltr";
  }
};