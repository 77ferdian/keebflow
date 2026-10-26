import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Volume2,
  VolumeX,
  Sliders,
  ChevronDown,
  LayoutGrid,
  Trophy,
  Flame,
  Check
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { THEMES, getTheme } from '../utils/themeConfig';
import { useLocale } from '../contexts/LocaleContext';

export default function Header({
  streak,
  personalBest,
  soundProfile,
  onSoundChange,
  theme,
  onThemeChange,
  currentView,
  onToggleView,
  onOpenSettings
}) {
  const [isSoundOpen, setIsSoundOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const soundMenuRef = useRef(null);
  const themeMenuRef = useRef(null);

  const themeObj = getTheme(theme);
  const { locale, t } = useLocale();

  const soundProfileList = [
    { id: 'thock', ...t.soundProfiles.thock },
    { id: 'clicky', ...t.soundProfiles.clicky },
    { id: 'creamy', ...t.soundProfiles.creamy },
    { id: 'typewriter', ...t.soundProfiles.typewriter },
    { id: 'off', ...t.soundProfiles.off }
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (soundMenuRef.current && !soundMenuRef.current.contains(e.target)) {
        setIsSoundOpen(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target)) {
        setIsThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSound = (id) => {
    onSoundChange(id);
    setIsSoundOpen(false);
    if (id !== 'off') {
      soundEngine.setProfile(id);
      setTimeout(() => soundEngine.playKey('a'), 50);
    }
  };

  return (
    <header className="max-w-6xl mx-auto w-full flex items-center justify-between text-xs tracking-wider border-b border-zinc-800/40 pb-3.5 select-none relative z-50">
      {/* Brand & Tautan Beranda */}
      <div className="flex items-center space-x-3">
        <div
          className="flex items-center space-x-2 group cursor-pointer"
          onClick={() => onToggleView('hub')}
          title={locale === 'id' ? 'Kembali ke Beranda' : 'Return to Home'}
        >
          <div
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{
              backgroundColor: themeObj.primary,
              boxShadow: `0 0 10px ${themeObj.primary}`
            }}
          />
          <span className="font-extrabold text-zinc-100 text-sm tracking-tight font-mono">
            keeb<span style={{ color: themeObj.primary }}>flow</span>
          </span>
        </div>

        <span className="text-zinc-700">/</span>

        {/* Tombol Alih Tampilan (Beranda / Area Latihan) */}
        <button
          type="button"
          onClick={() => onToggleView(currentView === 'hub' ? 'typing' : 'hub')}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all"
          style={
            currentView === 'hub'
              ? {
                  backgroundColor: `${themeObj.primary}20`,
                  color: themeObj.primary,
                  borderColor: `${themeObj.primary}40`,
                  borderWidth: '1px'
                }
              : { color: '#a1a1aa' }
          }
        >
          <LayoutGrid size={12} />
          <span>
            {currentView === 'hub'
              ? (locale === 'id' ? 'Area Latihan' : 'Typing Arena')
              : (locale === 'id' ? 'Beranda' : 'Home')}
          </span>
        </button>

        <span className="text-zinc-700 hidden sm:inline">/</span>

        {/* Lencana Konsistensi (Streak) */}
        <div
          className="hidden sm:flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full"
          style={{
            backgroundColor: `${themeObj.secondary}15`,
            borderColor: `${themeObj.secondary}35`,
            borderWidth: '1px',
            color: themeObj.secondary
          }}
          title={locale === 'id' ? 'Konsistensi Mengetik Harian' : 'Daily Typing Streak'}
        >
          <Flame size={13} style={{ color: themeObj.secondary }} />
          <span className="font-mono font-bold">
            {streak} {locale === 'id' ? 'hari' : 'days'}
          </span>
        </div>
      </div>

      {/* Kontrol Navigasi Kanan */}
      <div className="flex items-center space-x-2 sm:space-x-2.5">
        {/* Menu Dropdown Profil Suara Switch */}
        <div className="relative" ref={soundMenuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsSoundOpen(!isSoundOpen);
              setIsThemeOpen(false);
            }}
            className="flex items-center space-x-1.5 bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 rounded-lg px-2.5 py-1.5 text-zinc-300 transition-all shadow-sm active:scale-95"
            title={t.soundMenuTitle}
          >
            {soundProfile === 'off' ? (
              <VolumeX size={13} className="text-zinc-500" />
            ) : (
              <Volume2 size={13} style={{ color: themeObj.primary }} />
            )}
            <span className="font-mono text-xs uppercase font-medium">{soundProfile}</span>
            <ChevronDown size={11} className={`text-zinc-500 transition-transform ${isSoundOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSoundOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-60 bg-zinc-950 border border-zinc-800 rounded-xl p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-2.5 py-1.5 text-[10px] text-zinc-500 font-mono uppercase tracking-wider border-b border-zinc-800/80 mb-1">
                {t.soundMenuTitle}
              </div>
              {soundProfileList.map((p) => {
                const isSelected = soundProfile === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectSound(p.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors text-xs font-mono ${
                      isSelected
                        ? 'font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                    }`}
                    style={
                      isSelected
                        ? { backgroundColor: `${themeObj.primary}18`, color: themeObj.primary }
                        : {}
                    }
                  >
                    <div>
                      <div className="font-medium text-zinc-200">{p.label}</div>
                      <div className="text-[10px] text-zinc-500 font-sans">{p.desc}</div>
                    </div>
                    {isSelected && <Check size={14} className="shrink-0 ml-2" style={{ color: themeObj.primary }} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Menu Dropdown Preset Tema Lengkap (12 Pilihan Monkeytype Style) */}
        <div className="relative" ref={themeMenuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsThemeOpen(!isThemeOpen);
              setIsSoundOpen(false);
            }}
            className="flex items-center space-x-2 bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 rounded-lg px-2.5 py-1.5 text-zinc-300 transition-all shadow-sm active:scale-95"
            title={t.themeMenuTitle}
          >
            <div className="flex items-center space-x-1">
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/30 inline-block"
                style={{ backgroundColor: themeObj.primary }}
              />
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/30 inline-block"
                style={{ backgroundColor: themeObj.secondary }}
              />
            </div>
            <span className="font-mono text-xs font-semibold text-zinc-200 hidden md:inline">
              {themeObj.name}
            </span>
            <ChevronDown size={11} className={`text-zinc-500 transition-transform ${isThemeOpen ? 'rotate-180' : ''}`} />
          </button>

          {isThemeOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-72 max-h-96 overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-xl p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-2.5 py-1.5 text-[10px] text-zinc-500 font-mono uppercase tracking-wider border-b border-zinc-800/80 mb-1.5 flex items-center justify-between">
                <span>{t.themeMenuTitle} ({THEMES.length})</span>
                <span className="text-[9px] text-zinc-600">
                  {locale === 'id' ? 'Klik untuk menerapkan' : 'Click to apply'}
                </span>
              </div>
              <div className="space-y-1">
                {THEMES.map((themeItem) => {
                  const isSelected = theme === themeItem.id || getTheme(theme).id === themeItem.id;
                  return (
                    <button
                      key={themeItem.id}
                      type="button"
                      onClick={() => {
                        onThemeChange(themeItem.id);
                        setIsThemeOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors text-xs font-mono group ${
                        isSelected
                          ? 'bg-zinc-900/90 font-semibold'
                          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                      }`}
                      style={
                        isSelected
                          ? { borderLeft: `3px solid ${themeItem.primary}` }
                          : {}
                      }
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="flex items-center -space-x-1 shrink-0">
                          {themeItem.dots.map((dot, dIdx) => (
                            <span
                              key={dIdx}
                              className="w-3 h-3 rounded-full border border-black/40 inline-block shadow-sm"
                              style={{ backgroundColor: dot }}
                            />
                          ))}
                        </div>
                        <div>
                          <div
                            className="font-medium text-zinc-200 group-hover:text-white"
                            style={isSelected ? { color: themeItem.primary } : {}}
                          >
                            {themeItem.name}
                          </div>
                          <div className="text-[10px] text-zinc-500 font-sans leading-tight">
                            {themeItem.desc}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <Check size={14} className="shrink-0 ml-2" style={{ color: themeItem.primary }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Tombol Pengaturan */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 transition-all active:scale-95 shadow-sm"
          title={t.settingsBtn}
        >
          <Sliders size={14} />
        </button>

        {/* Rekor Kecepatan Pribadi */}
        <div className="hidden sm:flex items-center space-x-1.5 text-zinc-400 font-mono ml-1">
          <Trophy size={13} style={{ color: themeObj.primary }} />
          <span>{t.recordLabel}:</span>
          <span className="font-bold text-zinc-100">{personalBest || 0}</span>
          <span className="text-[10px] text-zinc-500">{t.wpmUnit}</span>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  streak: PropTypes.number,
  personalBest: PropTypes.number,
  soundProfile: PropTypes.string,
  onSoundChange: PropTypes.func.isRequired,
  theme: PropTypes.string,
  onThemeChange: PropTypes.func.isRequired,
  currentView: PropTypes.string.isRequired,
  onToggleView: PropTypes.func.isRequired,
  onOpenSettings: PropTypes.func.isRequired
};
