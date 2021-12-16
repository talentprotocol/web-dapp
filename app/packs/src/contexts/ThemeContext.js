import { Binding } from "@babel/traverse";
import React, { createContext, useState, useEffect, useCallback } from "react";

import { patch } from "src/utils/requests";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});
ThemeContext.displayName = "ThemeContext";

const ThemeContainer = ({ user, children }) => {
  const [currentTheme, setCurrentTheme] = useState(document.body.className);

  document.addEventListener("themeChanged", (e) => {
    if (currentTheme != e.detail) {
      setCurrentTheme(e.detail);
    }
  });

  const toggleTheme = async () => {
    const newTheme = currentTheme == "light" ? "dark" : "light";

    await patch(`/api/v1/users/${user.id}`, {
      theme_preference: newTheme,
    });

    document.body.className = newTheme;

    const event = new CustomEvent("themeChanged", { detail: newTheme });
    document.dispatchEvent(event);

    setCurrentTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext };
export default ThemeContainer;
