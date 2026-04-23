import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('reelvibe-theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    document.body.className = dark ? 'dark' : 'light';
    localStorage.setItem('reelvibe-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggleTheme = () => setDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
