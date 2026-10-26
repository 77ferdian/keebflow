import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Search, Zap, Terminal, Flame, Target, Palette, Volume2, Globe, Sliders, EyeOff, X, RotateCcw } from 'lucide-react';
import { THEMES } from '../utils/themeConfig';
import { useLocale } from '../contexts/LocaleContext';

export default function CommandPalette({
  isOpen,
  onClose,
  onSelectAction,
  onOpenSettings
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const { locale, t } = useLocale();

  const commands = [
    // Pilihan Mode
    { id: 'mode-time', title: `${t.catMode}: ${t.modeTimeTitle} (15s / 30s / 60s)`, category: t.catMode, icon: Zap, action: () => onSelectAction('mode', 'time') },
    { id: 'mode-words', title: `${t.catMode}: ${t.modeWordsTitle} (10 / 25 / 50)`, category: t.catMode, icon: Zap, action: () => onSelectAction('mode', 'words') },
    { id: 'mode-code', title: `${t.catMode}: ${t.modeCodeTitle}`, category: t.catMode, icon: Terminal, action: () => onSelectAction('mode', 'code') },
    { id: 'mode-daily', title: `${t.catMode}: ${t.modeDailyTitle}`, category: t.catMode, icon: Flame, action: () => onSelectAction('mode', 'daily') },
    { id: 'mode-drill', title: `${t.catMode}: ${t.modeDrillTitle}`, category: t.catMode, icon: Target, action: () => onSelectAction('mode', 'drill') },

    // Bahasa Koding
    { id: 'lang-js', title: `${t.catIde}: JavaScript (.js)`, category: t.catIde, icon: Terminal, action: () => onSelectAction('codeLang', 'javascript') },
    { id: 'lang-py', title: `${t.catIde}: Python (.py)`, category: t.catIde, icon: Terminal, action: () => onSelectAction('codeLang', 'python') },
    { id: 'lang-sql', title: `${t.catIde}: MySQL (.sql)`, category: t.catIde, icon: Terminal, action: () => onSelectAction('codeLang', 'mysql') },

    // Bahasa Tampilan Web & Bahasa Kosakata
    { id: 'web-lang-id', title: `${t.webLanguageLabel}: 🇮🇩 Bahasa Indonesia`, category: t.catLanguage, icon: Globe, action: () => onSelectAction('webLocale', 'id') },
    { id: 'web-lang-en', title: `${t.webLanguageLabel}: 🇬🇧 English`, category: t.catLanguage, icon: Globe, action: () => onSelectAction('webLocale', 'en') },
    { id: 'dict-id', title: `${t.typingLanguageLabel}: 🇮🇩 Bahasa Indonesia`, category: t.catLanguage, icon: Globe, action: () => onSelectAction('typingLang', 'id') },
    { id: 'dict-en', title: `${t.typingLanguageLabel}: 🇬🇧 English`, category: t.catLanguage, icon: Globe, action: () => onSelectAction('typingLang', 'en') },

    // Tema Warna (12 Pilihan Monkeytype Style)
    ...THEMES.map((themeItem) => ({
      id: `theme-${themeItem.id}`,
      title: `${t.catTheme}: ${themeItem.name} (${themeItem.desc})`,
      category: t.catTheme,
      icon: Palette,
      action: () => onSelectAction('theme', themeItem.id)
    })),

    // Suara Switch
    { id: 'sound-thock', title: `${t.catAudio}: ${t.soundProfiles.thock.label}`, category: t.catAudio, icon: Volume2, action: () => onSelectAction('sound', 'thock') },
    { id: 'sound-clicky', title: `${t.catAudio}: ${t.soundProfiles.clicky.label}`, category: t.catAudio, icon: Volume2, action: () => onSelectAction('sound', 'clicky') },
    { id: 'sound-creamy', title: `${t.catAudio}: ${t.soundProfiles.creamy.label}`, category: t.catAudio, icon: Volume2, action: () => onSelectAction('sound', 'creamy') },
    { id: 'sound-typewriter', title: `${t.catAudio}: ${t.soundProfiles.typewriter.label}`, category: t.catAudio, icon: Volume2, action: () => onSelectAction('sound', 'typewriter') },
    { id: 'sound-off', title: `${t.catAudio}: ${t.soundProfiles.off.label}`, category: t.catAudio, icon: Volume2, action: () => onSelectAction('sound', 'off') },

    // Fitur Cepat
    { id: 'toggle-zen', title: `${t.catConvenience}: ${t.zenModeLabel}`, category: t.catConvenience, icon: EyeOff, action: () => onSelectAction('toggleZen') },
    { id: 'clear-weak-keys', title: `${t.catConvenience}: ${locale === 'id' ? 'Reset Analisis Tombol Lemah (Jemari Bersih)' : 'Reset Flawed Keys Analytics'}`, category: t.catConvenience, icon: RotateCcw, action: () => onSelectAction('clearWeakKeys') },
    { id: 'open-settings', title: `${t.catSettings}: ${t.settingsTitle}...`, category: t.catSettings, icon: Sliders, action: () => onOpenSettings() },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Kolom Pencarian */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-800/80 bg-zinc-900/40">
          <Search size={16} className="text-zinc-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.palettePlaceholder}
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Daftar Perintah */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-400/15 text-amber-300 font-semibold border border-amber-400/30'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={14} className={isSelected ? 'text-amber-400' : 'text-zinc-500'} />
                    <span>{cmd.title}</span>
                  </div>
                  <span className="text-[10px] uppercase font-sans text-zinc-600 px-1.5 py-0.5 rounded bg-zinc-900">
                    {cmd.category}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-zinc-600 font-sans text-xs">
              {t.noCommandsFound} "{query}"
            </div>
          )}
        </div>

        {/* Petunjuk Tombol */}
        <div className="px-4 py-2 border-t border-zinc-800/60 bg-zinc-900/30 text-[10px] text-zinc-500 flex items-center justify-between select-none">
          <div className="flex items-center space-x-3">
            <span><kbd className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-400">↑↓</kbd> {t.navHelp}</span>
            <span><kbd className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-400">↵</kbd> {t.selectHelp}</span>
            <span><kbd className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-400">Esc</kbd> {t.closeHelp}</span>
          </div>
          <span>{t.paletteTitle}</span>
        </div>
      </div>
    </div>
  );
}

CommandPalette.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectAction: PropTypes.func.isRequired,
  onOpenSettings: PropTypes.func.isRequired
};
