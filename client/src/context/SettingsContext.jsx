import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  // Dark Mode Logic
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Currency Logic
  const [currency, setCurrency] = useState("USD"); // USD or LKR
  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "USD" ? "LKR" : "USD"));
  };

  return (
    <SettingsContext.Provider value={{ theme, toggleTheme, currency, toggleCurrency }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);