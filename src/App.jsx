import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import TypingPage from './pages/TypingPage';
import NotFoundPage from './pages/NotFoundPage';
import CommandPalette from './components/CommandPalette';
import SettingsModal from './components/SettingsModal';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LocaleProvider, useLocale } from './contexts/LocaleContext';
import {
  getSettings,
  saveSettings,
  getPersonalBest,
  savePersonalBest,
  getStreak,
  updateStreak,
  getKeyAnalytics,
  recordKeyErrors,
  clearKeyAnalytics
} from './utils/storage';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, themeObj, changeTheme } = useTheme();
  const { locale, setLocale, toggleLocale, t } = useLocale();

  // Dialog Modal
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Status Pengguna
  const [settings, setSettings] = useState(() => getSettings());
  const [streak, setStreak] = useState(() => getStreak().count);
  const [personalBest, setPersonalBest] = useState(() => getPersonalBest());
  const [allTimeErrors, setAllTimeErrors] = useState(() => getKeyAnalytics());
  const [isCapsLock, setIsCapsLock] = useState(false);
  const [isTestFinished, setIsTestFinished] = useState(false);

  // Opsi Beranda
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [timeSelected, setTimeSelected] = useState(30);

  const currentView = location.pathname === '/' ? 'hub' : 'typing';

  useEffect(() => {
    if (location.pathname === '/') {
      setIsTestFinished(false);
    }
  }, [location.pathname]);

  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleUpdatePersonalBest = (newWpm) => {
    const isNew = savePersonalBest(newWpm);
    if (isNew) setPersonalBest(newWpm);
    return isNew;
  };

  const handleIncrementStreak = () => {
    const newStreak = updateStreak();
    setStreak(newStreak);
  };

  const handleUpdateAllTimeErrors = (sessionErrors, sessionHits = {}, drilledKeys = [], accuracy = 100) => {
    const updated = recordKeyErrors(sessionErrors, sessionHits, drilledKeys, accuracy);
    setAllTimeErrors(updated);
  };

  const handleCommandPaletteAction = (type, value) => {
    if (type === 'mode') {
      navigate(`/type/${value}`);
    } else if (type === 'codeLang') {
      setCodeLanguage(value);
      navigate('/type/code');
    } else if (type === 'webLocale' || type === 'language') {
      setLocale(value);
    } else if (type === 'typingLang') {
      handleUpdateSettings({ ...settings, language: value });
    } else if (type === 'theme') {
      changeTheme(value);
    } else if (type === 'sound') {
      handleUpdateSettings({ ...settings, soundProfile: value });
    } else if (type === 'toggleZen') {
      handleUpdateSettings({ ...settings, zenMode: !settings.zenMode });
    } else if (type === 'clearWeakKeys') {
      const cleared = clearKeyAnalytics();
      setAllTimeErrors(cleared);
    }
  };

  // Pintasan Keyboard Global (Caps Lock & Command Palette)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (settings.capsLockWarning) {
        setIsCapsLock(e.getModifierState('CapsLock'));
      }

      // Shortcut: Ctrl+Shift+P atau Cmd+K
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'P' || e.key === 'p')) ||
        (e.metaKey && (e.key === 'k' || e.key === 'K'))
      ) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    const handleKeyUp = (e) => {
      if (settings.capsLockWarning) {
        setIsCapsLock(e.getModifierState('CapsLock'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [settings.capsLockWarning]);

  const containerLayout =
    currentView === 'hub' || isTestFinished
      ? 'min-h-screen overflow-y-auto'
      : 'min-h-screen sm:h-screen sm:overflow-hidden';

  return (
    <div
      className={`${containerLayout} text-[#94a3b8] font-mono flex flex-col justify-between py-3.5 px-6 sm:px-10 select-none transition-colors duration-300`}
      style={{ backgroundColor: themeObj.bgHex }}
    >
      {/* Modal Menu Perintah (Command Palette) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectAction={handleCommandPaletteAction}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Modal Pengaturan Lengkap */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* 1. Bilah Navigasi Atas (Header Global) */}
      <Header
        streak={streak}
        personalBest={personalBest}
        soundProfile={settings.soundProfile}
        onSoundChange={(profile) => handleUpdateSettings({ ...settings, soundProfile: profile })}
        theme={theme}
        onThemeChange={changeTheme}
        currentView={currentView}
        onToggleView={(targetView) => {
          if (targetView === 'hub') navigate('/');
          else navigate('/type');
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 2. Area Rute Utama (Single-Page Application dengan React Router v6) */}
      <main
        className={`max-w-6xl mx-auto w-full flex-1 flex flex-col transition-all duration-300 ${
          isTestFinished ? 'justify-start py-4' : 'justify-center'
        }`}
      >
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                personalBest={personalBest}
                streak={streak}
                weakKeys={allTimeErrors}
                soundProfile={settings.soundProfile}
                codeLanguage={codeLanguage}
                onChangeCodeLanguage={setCodeLanguage}
                timeSelected={timeSelected}
                onChangeTimeSelected={setTimeSelected}
              />
            }
          />
          <Route
            path="/type"
            element={<Navigate to="/type/time?sub=30" replace />}
          />
          <Route
            path="/type/:modeParam"
            element={
              <TypingPage
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                personalBest={personalBest}
                onUpdatePersonalBest={handleUpdatePersonalBest}
                allTimeErrors={allTimeErrors}
                onUpdateAllTimeErrors={handleUpdateAllTimeErrors}
                onIncrementStreak={handleIncrementStreak}
                isCapsLock={isCapsLock}
                onTestStatusChange={setIsTestFinished}
              />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* 3. Bilah Footer & Kredit Pembuat */}
      <footer className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 border-t border-zinc-800/40 pt-3 pb-1 select-none gap-2">
        <div className="flex items-center space-x-2">
          {currentView === 'hub' ? (
            <span>
              {locale === 'id' ? 'Pilih kartu ' : 'Select card '}
              <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 font-mono text-[10px]">
                1-4
              </kbd>{' '}
              /{' '}
              <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 font-mono text-[10px]">
                {locale === 'id' ? 'Spasi' : 'Space'}
              </kbd>{' '}
              {locale === 'id' ? 'untuk mulai' : 'to start'}
            </span>
          ) : (
            <>
              <kbd className="bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-zinc-400 font-mono text-[10px]">
                esc
              </kbd>
              <span>{t.footerEscHint}</span>
              <span className="text-zinc-700 ml-1.5">•</span>
              <kbd className="bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-zinc-400 font-mono text-[10px] ml-1.5">
                tab
              </kbd>
              <span>{t.footerTabHint}</span>
            </>
          )}
          <span className="text-zinc-700 ml-1.5 hidden sm:inline">•</span>
          <span className="text-zinc-500 hidden sm:inline">
            <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 font-mono text-[10px]">
              Ctrl+Shift+P
            </kbd>{' '}
            {t.footerCmdHint}
          </span>
        </div>

        {/* Status Mode Singkat */}
        <div className="hidden md:flex items-center space-x-3 text-[11px] text-zinc-500 font-sans">
          <span>Web: {locale === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}</span>
          <span>•</span>
          <span>Teks: {(settings.language || 'id') === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}</span>
          <span>•</span>
          <span>{t.footerCaretPrefix}: {settings.caretStyle}</span>
          <span>•</span>
          <span>Mode: {settings.strictMode === 'strict' ? t.footerModeStrict : t.footerModeRelaxed}</span>
        </div>

        {/* Kredit Pembuat dengan Tautan GitHub */}
        <div className="flex items-center space-x-1.5 font-mono text-[11px] text-zinc-500">
          <span>{t.footerMadeBy}</span>
          <a
            href="https://github.com/77ferdian"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 font-bold underline transition-colors flex items-center space-x-0.5"
            style={{ textDecorationColor: '#3f3f46' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = themeObj.primary;
              e.currentTarget.style.textDecorationColor = themeObj.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#d4d4d8';
              e.currentTarget.style.textDecorationColor = '#3f3f46';
            }}
            title="Kunjungi Profil GitHub 77ferdian"
          >
            <span>77ferdian</span>
            <ExternalLink size={10} className="inline ml-0.5" />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </LocaleProvider>
  );
}
