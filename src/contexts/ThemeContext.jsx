import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { THEMES, getTheme } from '../utils/themeConfig';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('keebflow_theme');
      return saved ? saved : 'nord';
    } catch {
      return 'nord';
    }
  });

  const themeObj = useMemo(() => getTheme(theme), [theme]);

  const changeTheme = (newThemeId) => {
    setTheme(newThemeId);
    try {
      localStorage.setItem('keebflow_theme', newThemeId);
    } catch (e) {
      console.warn('Gagal menyimpan tema ke localStorage:', e);
    }
  };

  useEffect(() => {
    // Sinkronisasi warna background root DOM
    document.documentElement.style.backgroundColor = themeObj.bgHex;
  }, [themeObj]);

  const value = useMemo(
    () => ({
      theme,
      themeObj,
      changeTheme,
      themes: THEMES
    }),
    [theme, themeObj]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme harus digunakan di dalam ThemeProvider');
  }
  return context;
}
