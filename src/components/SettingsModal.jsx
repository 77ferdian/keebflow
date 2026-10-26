import React from 'react';
import PropTypes from 'prop-types';
import { X, Volume2, ShieldCheck, Sliders, Type, Globe } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { getTheme } from '../utils/themeConfig';
import { useLocale } from '../contexts/LocaleContext';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) {
  if (!isOpen) return null;
  const themeObj = getTheme(settings.theme);
  const { locale, setLocale, t } = useLocale();

  const handleVolumeChange = (vol) => {
    const val = parseFloat(vol);
    soundEngine.setVolume(val);
    onUpdateSettings({ ...settings, soundVolume: val });
    soundEngine.playKey('a');
  };

  const handleToggle = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    if (key === 'soundOnError') {
      soundEngine.setSoundOnError(updated.soundOnError);
    }
    onUpdateSettings(updated);
  };

  const handleSelect = (key, value) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center space-x-2 text-zinc-100 font-bold text-sm">
            <Sliders size={16} style={{ color: themeObj.primary }} />
            <span>{t.settingsTitle}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Isi Pengaturan */}
        <div className="p-5 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* 1. PENGATURAN BAHASA (BAHASA WEB & BAHASA PENGETIKAN) */}
          <div className="space-y-3">
            <div
              className="text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1.5"
              style={{ color: themeObj.primary }}
            >
              <Globe size={13} />
              <span>{t.languageSection}</span>
            </div>

            {/* A. Bahasa Tampilan Web (UI Interface) */}
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <div>
                  <div className="text-zinc-200 font-medium">{t.webLanguageLabel}</div>
                  <div className="text-[10px] text-zinc-500 font-sans">{t.webLanguageDesc}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLocale('id')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    locale === 'id'
                      ? 'font-bold'
                      : 'border-zinc-800 text-zinc-400 hover:bg-zinc-850'
                  }`}
                  style={locale === 'id' ? { backgroundColor: `${themeObj.primary}18`, borderColor: `${themeObj.primary}50`, color: themeObj.primary } : {}}
                >
                  <div className="flex items-center space-x-1.5">
                    <span>🇮🇩</span>
                    <span>{t.langIndonesian}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-sans font-normal mt-0.5">
                    {t.langIndonesianDesc}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setLocale('en')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    locale === 'en'
                      ? 'font-bold'
                      : 'border-zinc-800 text-zinc-400 hover:bg-zinc-850'
                  }`}
                  style={locale === 'en' ? { backgroundColor: `${themeObj.primary}18`, borderColor: `${themeObj.primary}50`, color: themeObj.primary } : {}}
                >
                  <div className="flex items-center space-x-1.5">
                    <span>🇬🇧</span>
                    <span>{t.langEnglish}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-sans font-normal mt-0.5">
                    {t.langEnglishDesc}
                  </div>
                </button>
              </div>
            </div>

            {/* B. Bahasa Kosakata Pengetikan (Word Bank / Practice Words) */}
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <div>
                  <div className="text-zinc-200 font-medium">{t.typingLanguageLabel}</div>
                  <div className="text-[10px] text-zinc-500 font-sans">{t.typingLanguageDesc}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelect('language', 'id')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    (settings.language || 'id') === 'id'
                      ? 'font-bold'
                      : 'border-zinc-800 text-zinc-400 hover:bg-zinc-850'
                  }`}
                  style={(settings.language || 'id') === 'id' ? { backgroundColor: `${themeObj.primary}18`, borderColor: `${themeObj.primary}50`, color: themeObj.primary } : {}}
                >
                  <div className="flex items-center space-x-1.5">
                    <span>🇮🇩</span>
                    <span>{t.langIndonesian}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-sans font-normal mt-0.5">
                    {t.typingIndonesianDesc}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect('language', 'en')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    (settings.language || 'id') === 'en'
                      ? 'font-bold'
                      : 'border-zinc-800 text-zinc-400 hover:bg-zinc-850'
                  }`}
                  style={(settings.language || 'id') === 'en' ? { backgroundColor: `${themeObj.primary}18`, borderColor: `${themeObj.primary}50`, color: themeObj.primary } : {}}
                >
                  <div className="flex items-center space-x-1.5">
                    <span>🇬🇧</span>
                    <span>{t.langEnglish}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-sans font-normal mt-0.5">
                    {t.typingEnglishDesc}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* 2. AUDIO & SUARA SWITCH */}
          <div className="space-y-3">
            <div
              className="text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1.5"
              style={{ color: themeObj.primary }}
            >
              <Volume2 size={13} />
              <span>{t.soundSection}</span>
            </div>

            {/* Slider Volume */}
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300">{t.soundVolumeLabel}</span>
                <span className="font-mono font-bold" style={{ color: themeObj.primary }}>
                  {Math.round((settings.soundVolume ?? 0.35) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.soundVolume ?? 0.35}
                onChange={(e) => handleVolumeChange(e.target.value)}
                className={`w-full ${themeObj.accentSlider} cursor-pointer h-1.5 bg-zinc-800 rounded-lg`}
              />
            </div>

            {/* Suara Saat Typo */}
            <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3 text-xs">
              <div>
                <div className="text-zinc-200 font-medium">{t.soundOnErrorLabel}</div>
                <div className="text-[10px] text-zinc-500 font-sans">{t.soundOnErrorDesc}</div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('soundOnError')}
                className="w-11 h-6 rounded-full transition-colors relative"
                style={{ backgroundColor: settings.soundOnError ? themeObj.primary : '#27272a' }}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-zinc-950 transition-transform absolute top-1 ${
                    settings.soundOnError ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 2. KENYAMANAN & TOLERANSI KOREKSI */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-sky-400/90 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck size={13} />
              <span>{t.strictModeSection}</span>
            </div>

            {/* Toleransi Kesalahan */}
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-zinc-200 font-medium">{t.strictModeLabel}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelect('strictMode', 'free')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    settings.strictMode === 'free'
                      ? 'font-bold'
                      : 'border-zinc-800 text-zinc-400 hover:bg-zinc-850'
                  }`}
                  style={settings.strictMode === 'free' ? { backgroundColor: `${themeObj.primary}18`, borderColor: `${themeObj.primary}50`, color: themeObj.primary } : {}}
                >
                  <div>{locale === 'id' ? 'Santai (Bebas)' : 'Standard (Relaxed)'}</div>
                  <div className="text-[10px] text-zinc-500 font-sans font-normal">
                    {locale === 'id' ? 'Bisa lanjut kata meski ada typo' : 'Continue typing despite typos'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect('strictMode', 'strict')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    settings.strictMode === 'strict'
                      ? 'font-bold'
                      : 'border-zinc-800 text-zinc-400 hover:bg-zinc-850'
                  }`}
                  style={settings.strictMode === 'strict' ? { backgroundColor: `${themeObj.primary}18`, borderColor: `${themeObj.primary}50`, color: themeObj.primary } : {}}
                >
                  <div>{locale === 'id' ? 'Ketat (Disiplin)' : 'Strict (Discipline)'}</div>
                  <div className="text-[10px] text-zinc-500 font-sans font-normal">
                    {locale === 'id' ? 'Wajib perbaiki typo sebelum spasi' : 'Must fix typos before hitting space'}
                  </div>
                </button>
              </div>
            </div>

            {/* Zen Mode */}
            <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3 text-xs">
              <div>
                <div className="text-zinc-200 font-medium">{t.zenModeLabel}</div>
                <div className="text-[10px] text-zinc-500 font-sans">{t.zenModeDesc}</div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('zenMode')}
                className="w-11 h-6 rounded-full transition-colors relative"
                style={{ backgroundColor: settings.zenMode ? themeObj.primary : '#27272a' }}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-zinc-950 transition-transform absolute top-1 ${
                    settings.zenMode ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Peringatan Caps Lock */}
            <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3 text-xs">
              <div>
                <div className="text-zinc-200 font-medium">{t.capsLockAlertLabel}</div>
                <div className="text-[10px] text-zinc-500 font-sans">{t.capsLockAlertDesc}</div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('capsLockWarning')}
                className="w-11 h-6 rounded-full transition-colors relative"
                style={{ backgroundColor: settings.capsLockWarning ? themeObj.primary : '#27272a' }}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-zinc-950 transition-transform absolute top-1 ${
                    settings.capsLockWarning ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 3. VISUAL & KURSOR */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-emerald-400/90 uppercase tracking-wider flex items-center space-x-1.5">
              <Type size={13} />
              <span>{t.visualSection}</span>
            </div>

            {/* Bentuk Kursor */}
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3.5 space-y-2">
              <span className="text-zinc-200 font-medium text-xs">{t.caretStyleLabel}</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'line', label: t.caretLine },
                  { id: 'block', label: t.caretBlock },
                  { id: 'underline', label: t.caretUnderline },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelect('caretStyle', c.id)}
                    className={`py-2 px-1.5 rounded-lg border text-center transition-all ${
                      settings.caretStyle === c.id
                        ? 'font-bold'
                        : 'border-zinc-800 text-zinc-400 hover:bg-zinc-850'
                    }`}
                    style={settings.caretStyle === c.id ? { backgroundColor: `${themeObj.primary}18`, borderColor: `${themeObj.primary}50`, color: themeObj.primary } : {}}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ukuran Huruf */}
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3.5 space-y-2">
              <span className="text-zinc-200 font-medium text-xs">{t.fontSizeLabel}</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'normal', label: t.fontNormal },
                  { id: 'large', label: t.fontLarge },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleSelect('fontSize', f.id)}
                    className={`py-2 rounded-lg border text-center transition-all ${
                      settings.fontSize === f.id
                        ? 'font-bold'
                        : 'border-zinc-800 text-zinc-400 hover:bg-zinc-850'
                    }`}
                    style={settings.fontSize === f.id ? { backgroundColor: `${themeObj.primary}18`, borderColor: `${themeObj.primary}50`, color: themeObj.primary } : {}}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-5 py-3 border-t border-zinc-800/80 bg-zinc-900/30 flex items-center justify-between text-[11px] text-zinc-500">
          <span>{t.autoSaveNotice}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-zinc-950 font-bold text-xs transition-colors font-mono"
            style={{ backgroundColor: themeObj.primary }}
          >
            {t.doneBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

SettingsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    soundProfile: PropTypes.string,
    soundVolume: PropTypes.number,
    soundOnError: PropTypes.bool,
    showGhostCaret: PropTypes.bool,
    ghostPaceWpm: PropTypes.number,
    caretStyle: PropTypes.string,
    fontSize: PropTypes.string,
    strictMode: PropTypes.string,
    zenMode: PropTypes.bool,
    capsLockWarning: PropTypes.bool,
    theme: PropTypes.string,
    language: PropTypes.string
  }).isRequired,
  onUpdateSettings: PropTypes.func.isRequired
};
