import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Zap,
  Flame,
  Target,
  ArrowRight,
  Volume2,
  Trophy,
  Terminal,
  Activity
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { getTheme } from '../utils/themeConfig';
import { useLocale } from '../contexts/LocaleContext';

export default function CommandHub({
  personalBest,
  streak,
  weakKeys,
  soundProfile,
  onStartMode,
  codeLanguage,
  onChangeCodeLanguage,
  timeSelected,
  onChangeTimeSelected,
  theme = 'nord'
}) {
  const [warmupText, setWarmupText] = useState('');
  const [activeKeyEffect, setActiveKeyEffect] = useState(null);
  const themeObj = getTheme(theme);
  const { t } = useLocale();

  const sortedWeakKeys = Object.entries(weakKeys || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k.toUpperCase());

  const handleWarmupKeyDown = (e) => {
    if (e.key === 'Backspace') {
      soundEngine.playKey('backspace');
      return;
    }
    if (e.key === ' ') {
      soundEngine.playSpace();
      setActiveKeyEffect(t.warmupSpace);
      setTimeout(() => setActiveKeyEffect(null), 300);
      return;
    }
    if (e.key.length === 1) {
      soundEngine.playKey(e.key);
      setActiveKeyEffect(e.key.toUpperCase());
      setTimeout(() => setActiveKeyEffect(null), 300);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-2 select-none animate-in fade-in duration-500 relative">
      {/* Pendaran Latar Belakang */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10"
        style={{ backgroundColor: `${themeObj.primary}15` }}
      />

      {/* 1. Bagian Tajuk Utama (Hero) */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-[11px] font-medium tracking-wide mb-4 shadow-sm backdrop-blur-md"
          style={{
            backgroundColor: `${themeObj.primary}15`,
            borderColor: `${themeObj.primary}35`,
            borderWidth: '1px',
            color: themeObj.primary
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: themeObj.primary }}
          />
          <span className="uppercase tracking-widest text-[10px] font-semibold">
            {t.heroBadge}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-100 font-mono tracking-tight mb-3">
          {t.heroTitle}.{' '}
          <span style={{ color: themeObj.primary }}>
            Keebflow.
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto font-sans leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* 2. Kolom Uji Coba Suara Interaktif */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-2xl p-2.5 px-4 backdrop-blur-md shadow-xl flex items-center space-x-3 group focus-within:border-zinc-700 transition-all">
            <Volume2
              size={16}
              className="shrink-0 animate-pulse"
              style={{ color: themeObj.primary }}
            />
            <input
              type="text"
              value={warmupText}
              onChange={(e) => setWarmupText(e.target.value)}
              onKeyDown={handleWarmupKeyDown}
              placeholder={t.warmupInputPlaceholder}
              className="bg-transparent text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none w-full font-mono"
            />
            {activeKeyEffect && (
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded text-zinc-950 font-bold animate-bounce shrink-0"
                style={{ backgroundColor: themeObj.primary }}
              >
                {activeKeyEffect}
              </span>
            )}
            <button
              onClick={() => onStartMode('time')}
              className="px-3.5 py-1.5 rounded-xl text-zinc-950 font-bold text-xs font-mono tracking-tight transition-all active:scale-95 shadow-md shrink-0 flex items-center space-x-1"
              style={{ backgroundColor: themeObj.primary }}
            >
              <span>{t.startNow}</span>
              <ArrowRight size={12} />
            </button>
          </div>
          <div className="mt-1.5 text-[10px] text-zinc-500 flex items-center justify-center space-x-2 font-mono">
            <span>{t.hubPressKeyHint}</span>
          </div>
        </div>
      </div>

      {/* 3. Grid Kartu Pilihan Mode (Bento Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* KARTU 1: UJI KECEPATAN (SPEED RUN) */}
        <div
          onClick={() => onStartMode('time')}
          className="group relative p-6 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/90 border border-zinc-800/80 transition-all duration-300 cursor-pointer shadow-lg flex flex-col justify-between overflow-hidden"
          style={{ borderColor: `${themeObj.primary}25` }}
        >
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl transition-all"
            style={{ backgroundColor: `${themeObj.primary}10` }}
          />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{
                  backgroundColor: `${themeObj.primary}20`,
                  color: themeObj.primary,
                  border: `1px solid ${themeObj.primary}40`
                }}
              >
                <Zap size={20} />
              </div>
              <div className="flex items-center space-x-1.5 bg-zinc-950/60 border border-zinc-800 px-2 py-0.5 rounded-lg">
                <span className="text-[10px] text-zinc-500 font-sans">{t.hotkeyHint}</span>
                <kbd className="text-[10px] font-mono font-bold" style={{ color: themeObj.primary }}>1</kbd>
              </div>
            </div>

            <h3 className="text-lg font-bold text-zinc-100 font-mono transition-colors mb-1 flex items-center space-x-2">
              <span>{t.modeTimeTitle}</span>
              <span
                className="text-[10px] font-normal px-2 py-0.5 rounded-full font-sans"
                style={{
                  backgroundColor: `${themeObj.primary}18`,
                  color: themeObj.primary,
                  border: `1px solid ${themeObj.primary}30`
                }}
              >
                {t.modeTime}
              </span>
            </h3>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-5">
              {t.modeTimeDesc}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs">
            <span className="text-[11px] text-zinc-500 font-sans">{t.selectDuration}</span>
            <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
              {[15, 30, 60].map((sec) => (
                <button
                  key={sec}
                  onClick={() => onChangeTimeSelected(sec)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    timeSelected === sec
                      ? 'text-zinc-950 font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                  style={timeSelected === sec ? { backgroundColor: themeObj.primary } : {}}
                >
                  {sec}{t.secondsSuffix}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KARTU 2: STUDIO KODING (IDE STUDIO) */}
        <div
          onClick={() => onStartMode('code')}
          className="group relative p-6 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-sky-400/40 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-sky-400/5 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/[0.03] group-hover:bg-sky-500/[0.08] rounded-full blur-2xl transition-all" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-400 group-hover:scale-110 group-hover:bg-sky-400 group-hover:text-zinc-950 transition-all duration-200">
                <Terminal size={20} />
              </div>
              <div className="flex items-center space-x-1.5 bg-zinc-950/60 border border-zinc-800 px-2 py-0.5 rounded-lg">
                <span className="text-[10px] text-zinc-500 font-sans">{t.hotkeyHint}</span>
                <kbd className="text-[10px] font-mono font-bold text-sky-400">2</kbd>
              </div>
            </div>

            <h3 className="text-lg font-bold text-zinc-100 font-mono group-hover:text-sky-400 transition-colors mb-1 flex items-center space-x-2">
              <span>{t.modeCodeTitle}</span>
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-sky-400/10 text-sky-300 border border-sky-400/20 font-sans">
                IDE
              </span>
            </h3>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-5">
              {t.modeCodeDesc}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs">
            <span className="text-[11px] text-zinc-500 font-sans">{t.selectCodeLang}</span>
            <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
              {[
                { id: 'javascript', label: 'JS' },
                { id: 'python', label: 'Python' },
                { id: 'mysql', label: 'MySQL' }
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => onChangeCodeLanguage(lang.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    codeLanguage === lang.id
                      ? 'bg-sky-400 text-zinc-950 font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KARTU 3: TANTANGAN HARIAN (DAILY CHALLENGE) */}
        <div
          onClick={() => onStartMode('daily')}
          className="group relative p-6 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-orange-400/40 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-orange-400/5 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/[0.03] group-hover:bg-orange-500/[0.08] rounded-full blur-2xl transition-all" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-400/10 border border-orange-400/20 flex items-center justify-center text-orange-400 group-hover:scale-110 group-hover:bg-orange-400 group-hover:text-zinc-950 transition-all duration-200">
                <Flame size={20} />
              </div>
              <div className="flex items-center space-x-1.5 bg-zinc-950/60 border border-zinc-800 px-2 py-0.5 rounded-lg">
                <span className="text-[10px] text-zinc-500 font-sans">{t.hotkeyHint}</span>
                <kbd className="text-[10px] font-mono font-bold text-orange-400">3</kbd>
              </div>
            </div>

            <h3 className="text-lg font-bold text-zinc-100 font-mono group-hover:text-orange-400 transition-colors mb-1 flex items-center space-x-2">
              <span>{t.modeDailyTitle}</span>
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-orange-400/10 text-orange-300 border border-orange-400/20 font-sans">
                {t.quoteBadge}
              </span>
            </h3>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-5">
              {t.modeDailyDesc}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs">
            <span className="text-[11px] text-zinc-500 font-sans">{t.streakStatus}</span>
            <span className="text-xs font-mono font-bold text-orange-400 flex items-center space-x-1">
              <span>🔥 {streak} {t.daysStreakSuffix}</span>
            </span>
          </div>
        </div>

        {/* KARTU 4: KLINIK TOMBOL LEMAH (WEAKNESS CLINIC) */}
        <div
          onClick={() => onStartMode('drill')}
          className="group relative p-6 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-rose-400/40 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-rose-400/5 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/[0.03] group-hover:bg-rose-500/[0.08] rounded-full blur-2xl transition-all" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-400/10 border border-rose-400/20 flex items-center justify-center text-rose-400 group-hover:scale-110 group-hover:bg-rose-400 group-hover:text-zinc-950 transition-all duration-200">
                <Target size={20} />
              </div>
              <div className="flex items-center space-x-1.5 bg-zinc-950/60 border border-zinc-800 px-2 py-0.5 rounded-lg">
                <span className="text-[10px] text-zinc-500 font-sans">{t.hotkeyHint}</span>
                <kbd className="text-[10px] font-mono font-bold text-rose-400">4</kbd>
              </div>
            </div>

            <h3 className="text-lg font-bold text-zinc-100 font-mono group-hover:text-rose-400 transition-colors mb-1 flex items-center space-x-2">
              <span>{t.modeDrillTitle}</span>
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-rose-400/10 text-rose-300 border border-rose-400/20 font-sans">
                AI Drill
              </span>
            </h3>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-5">
              {t.modeDrillDesc}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs">
            <span className="text-[11px] text-zinc-500 font-sans">{t.flawedKeysLabel}</span>
            <span className={`text-xs font-mono font-bold ${sortedWeakKeys.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {sortedWeakKeys.length > 0 ? sortedWeakKeys.join(', ') : t.zeroFlawsLabel}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Pita Ringkasan Kinerja & Status */}
      <div className="bg-gradient-to-r from-zinc-950/80 via-zinc-900/60 to-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-6 text-zinc-300">
          <div className="flex items-center space-x-2">
            <Trophy size={15} style={{ color: themeObj.primary }} />
            <span>{t.hubRecord}: <strong className="text-zinc-100 font-bold">{personalBest || 0} {t.wpmUnit}</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Activity size={15} className="text-emerald-400" />
            <span>{t.hubSwitch}: <strong className="text-zinc-100 uppercase">{soundProfile}</strong></span>
          </div>
        </div>

        <div className="text-zinc-500 text-xs hidden sm:flex items-center space-x-1.5">
          <span>{t.hubPressKeyHint}</span>
        </div>
      </div>
    </div>
  );
}

CommandHub.propTypes = {
  personalBest: PropTypes.number,
  streak: PropTypes.number,
  weakKeys: PropTypes.object,
  soundProfile: PropTypes.string,
  onStartMode: PropTypes.func.isRequired,
  codeLanguage: PropTypes.string,
  onChangeCodeLanguage: PropTypes.func.isRequired,
  timeSelected: PropTypes.number,
  onChangeTimeSelected: PropTypes.func.isRequired,
  theme: PropTypes.string
};
