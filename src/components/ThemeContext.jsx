import { useState, useContext, createContext } from "react";

const ThemeContext = createContext();
const ThemeUpdateContext = createContext();

export const useDarkTheme = () => useContext(ThemeContext);
export const useDarkThemeUpdate = () => useContext(ThemeUpdateContext);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false); // or true?

  const toggleDarkMode = () => setDark(prevDarkTheme => !prevDarkTheme)

  return (
    <ThemeContext.Provider value={dark}>
      <ThemeUpdateContext.Provider value={toggleDarkMode}>
        {children}
      </ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  )
}

