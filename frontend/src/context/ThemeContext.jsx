import React, { createContext, useEffect, useContext } from 'react';

const ThemeContext = createContext({ isDark: true });

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark: true }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
