import { Binding } from "@babel/traverse";
import React, { createContext, useState, useEffect, useCallback } from "react";

import { patch } from "src/utils/requests";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
  themeName: () => {},
  mode: () => {},
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
    const newTheme = currentTheme == "light-body" ? "dark" : "light";

    await patch(`/api/v1/users/${user.id}`, {
      user: { theme_preference: newTheme },
    });

    document.body.className = `${newTheme}-body`;

    const event = new CustomEvent("themeChanged", {
      detail: `${newTheme}-body`,
    });
    document.dispatchEvent(event);

    setCurrentTheme(`${newTheme}-body`);
  };

  const themeName = () => {
    if (currentTheme == "light-body") {
      return "Light";
    } else if (currentTheme == "dark-body") {
      return "Dark";
    }
  };

  const mode = () => {
    if (currentTheme == "light-body") {
      return "light";
    } else if (currentTheme == "dark-body") {
      return "dark";
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme: currentTheme, toggleTheme, themeName, mode }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext };
export default ThemeContainer;
