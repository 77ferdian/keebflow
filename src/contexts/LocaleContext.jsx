import React, { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { dictionary } from '../utils/i18n';

export const LocaleContext = createContext();

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    try {
      const saved = localStorage.getItem('keebflow_locale');
      return saved === 'en' ? 'en' : 'id';
    } catch {
      return 'id';
    }
  });

  const setLocale = (newLocale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('keebflow_locale', newLocale);
    } catch (e) {
      console.warn('Gagal menyimpan locale ke localStorage:', e);
    }
  };

  const toggleLocale = () => {
    setLocaleState((prevLocale) => {
      const nextLocale = prevLocale === 'id' ? 'en' : 'id';
      try {
        localStorage.setItem('keebflow_locale', nextLocale);
      } catch (e) {
        console.warn('Gagal menyimpan locale ke localStorage:', e);
      }
      return nextLocale;
    });
  };

  const t = useMemo(() => {
    return dictionary[locale] || dictionary.id;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t
    }),
    [locale, t]
  );

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

LocaleProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale harus digunakan di dalam LocaleProvider');
  }
  return context;
}
