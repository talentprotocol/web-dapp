import { Binding } from "@babel/traverse";
import React, { createContext, useState, useContext } from "react";

import { patch } from "src/utils/requests";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
  simpleToggleTheme: () => {},
  mode: () => {},
});
ThemeContext.displayName = "ThemeContext";

const ThemeContainer = ({ user, children }) => {
  const [currentTheme, setCurrentTheme] = useState(
    document.body.className.split(" ").find((name) => name.includes("body"))
  );

  document.addEventListener("themeChanged", (e) => {
    if (currentTheme != e.detail) {
      setCurrentTheme(e.detail);
    }
  });

  const toggleTheme = async () => {
    const newTheme = currentTheme.includes("light-body") ? "dark" : "light";

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

  const simpleToggleTheme = () => {
    const newTheme = currentTheme == "light-body" ? "dark" : "light";

    document.body.className = `${newTheme}-body`;
    setCurrentTheme(`${newTheme}-body`);
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
      value={{
        theme: currentTheme,
        toggleTheme,
        simpleToggleTheme,
        mode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

export { ThemeContext, useTheme };

export default ThemeContainer;
