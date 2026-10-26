import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { getTheme } from '../utils/themeConfig';
import { useLocale } from '../contexts/LocaleContext';

export default function WatchReplay({
  replayEvents = [],
  words = [],
  durationMs = 18000,
  theme = 'oled'
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const themeObj = getTheme(theme);
  const { locale, t } = useLocale();

  const reqAnimRef = useRef(null);
  const lastTimeRef = useRef(null);
  const containerRef = useRef(null);
  const activeWordRef = useRef(null);

  // Auto-scroll saat kata aktif bergerak dalam replay
  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      const activeEl = activeWordRef.current;
      const containerEl = containerRef.current;
      const offsetTop = activeEl.offsetTop - containerEl.offsetTop;

      if (offsetTop > 60) {
        containerEl.scrollTo({ top: offsetTop - 30, behavior: 'smooth' });
      } else {
        containerEl.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [currentTimeMs]);

  // RequestAnimationFrame Loop untuk Replay Halus
  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      if (reqAnimRef.current) cancelAnimationFrame(reqAnimRef.current);
      return;
    }

    const step = (timestamp) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const delta = (timestamp - lastTimeRef.current) * playbackSpeed;
      lastTimeRef.current = timestamp;

      setCurrentTimeMs((prev) => {
        const nextTime = prev + delta;
        if (nextTime >= durationMs) {
          setIsPlaying(false);
          return durationMs;
        }
        return nextTime;
      });

      reqAnimRef.current = requestAnimationFrame(step);
    };

    reqAnimRef.current = requestAnimationFrame(step);

    return () => {
      if (reqAnimRef.current) cancelAnimationFrame(reqAnimRef.current);
    };
  }, [isPlaying, playbackSpeed, durationMs]);

  // Cari event yang sudah terjadi sebelum currentTimeMs
  const pastEvents = replayEvents.filter((ev) => ev.t <= currentTimeMs);
  const latestEvent = pastEvents[pastEvents.length - 1];

  const currentWordIdx = latestEvent ? latestEvent.wordIdx : 0;
  const currentInputVal = latestEvent ? latestEvent.val : '';

  // Mainkan audio ketukan saat replay jika tidak dimute
  const lastAudioEventRef = useRef(null);
  useEffect(() => {
    if (isPlaying && !isAudioMuted && latestEvent && latestEvent !== lastAudioEventRef.current) {
      lastAudioEventRef.current = latestEvent;
      if (latestEvent.isError) {
        soundEngine.playError();
      } else if (latestEvent.type === 'space') {
        soundEngine.playSpace();
      } else if (latestEvent.type === 'enter') {
        soundEngine.playEnter();
      } else if (latestEvent.type === 'backspace' || latestEvent.type === 'backspace_word') {
        soundEngine.playKey('Backspace');
      } else {
        soundEngine.playKey('a');
      }
    }
  }, [isPlaying, isAudioMuted, latestEvent]);

  // Hitung kata yang sudah terselesaikan sebelum currentWordIdx
  const completedWordsState = {};
  pastEvents.forEach((ev) => {
    if (ev.isAdvance && ev.completedIdx !== undefined) {
      completedWordsState[ev.completedIdx] = {
        typed: ev.typedWord,
        isCorrect: ev.typedWord === words[ev.completedIdx]
      };
    } else if (ev.type === 'backspace_word') {
      delete completedWordsState[ev.wordIdx];
    }
  });

  // WPM real-time pada frame saat ini
  const replaySeconds = Math.max(0.5, currentTimeMs / 1000);
  const correctEventsCount = pastEvents.filter((e) => !e.isError && e.type !== 'backspace' && e.type !== 'backspace_word').length;
  const currentWpm = Math.round((correctEventsCount / 5) / (replaySeconds / 60)) || 0;

  // Kontrol Aksi
  const togglePlay = () => {
    if (currentTimeMs >= durationMs) {
      setCurrentTimeMs(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentTimeMs(0);
  };

  const handleSeek = (e) => {
    const newMs = Number(e.target.value);
    setCurrentTimeMs(newMs);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-4 font-mono select-none backdrop-blur-md transition-all"
    >
      {/* Header Replay & Toolbar Baris Atas */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 mb-3 border-b border-zinc-800/60 gap-2">
        <div className="flex items-center space-x-3">
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-bold flex items-center space-x-1.5">
            <span>{t.replayTitle}</span>
          </span>

          {/* Badge WPM & Waktu Real-time Replay */}
          <div className="flex items-center space-x-2 text-[11px] bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md text-zinc-300">
            <span className={`${themeObj.textPrimary} font-bold`}>{currentWpm} wpm</span>
            <span className="text-zinc-600">•</span>
            <span>
              {(currentTimeMs / 1000).toFixed(1)}s / {(durationMs / 1000).toFixed(1)}s
            </span>
          </div>
        </div>

        {/* Kontrol Player */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          {/* Pilihan Kecepatan Playback (1x, 1.5x, 2x) */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-[10px]">
            {[1, 1.5, 2].map((spd) => (
              <button
                type="button"
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  playbackSpeed === spd
                    ? `${themeObj.bgPrimary} text-zinc-950 shadow`
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Suara Replay */}
          <button
            type="button"
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`p-1.5 rounded-lg border transition-all ${
              isAudioMuted
                ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                : `${themeObj.bgSubtle} ${themeObj.borderSubtle} ${themeObj.textLight}`
            }`}
            title={isAudioMuted ? t.replayUnmute : t.replayMute}
          >
            {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          {/* Restart */}
          <button
            type="button"
            onClick={handleRestart}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
            title={locale === 'id' ? 'Mulai ulang replay dari detik ke-0' : 'Restart replay from 0s'}
          >
            <RotateCcw size={14} />
          </button>

          {/* Tombol Play/Pause Utama */}
          <button
            type="button"
            onClick={togglePlay}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg ${themeObj.bgPrimary} ${themeObj.bgPrimaryHover} text-zinc-950 font-bold text-xs shadow-md transition-all active:scale-95`}
          >
            {isPlaying ? (
              <>
                <Pause size={13} className="fill-zinc-950" />
                <span>{t.replayPause}</span>
              </>
            ) : (
              <>
                <Play size={13} className="fill-zinc-950" />
                <span>{t.replayPlay}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar / Scrubber Interaktif */}
      <div className="relative mb-3 flex items-center">
        <input
          type="range"
          min="0"
          max={durationMs}
          value={currentTimeMs}
          onChange={handleSeek}
          className={`w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer ${themeObj.accentSlider} transition-all`}
        />
      </div>

      {/* Kanvas Teks Replay */}
      <div
        ref={containerRef}
        className="h-28 max-h-32 overflow-y-auto bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-3 text-sm sm:text-base leading-relaxed tracking-wide flex flex-wrap gap-x-2.5 gap-y-1.5 relative font-mono transition-all"
      >
        {words.map((word, wIdx) => {
          const isCurrent = wIdx === currentWordIdx;
          const isPast = wIdx < currentWordIdx;
          const completedInfo = completedWordsState[wIdx];

          return (
            <span
              key={wIdx}
              ref={isCurrent ? activeWordRef : null}
              className="relative inline-flex items-center rounded px-0.5"
            >
              {word.split('').map((char, cIdx) => {
                let charStyle = 'text-zinc-600';

                if (isPast) {
                  const wasCorrect = completedInfo ? completedInfo.isCorrect : true;
                  charStyle = wasCorrect
                    ? 'text-zinc-100 font-medium'
                    : 'text-rose-400 bg-rose-500/20 underline decoration-rose-500 font-medium';
                } else if (isCurrent) {
                  const isTyped = cIdx < currentInputVal.length;
                  if (isTyped) {
                    charStyle =
                      currentInputVal[cIdx] === char
                        ? 'text-zinc-100 font-semibold'
                        : 'text-rose-400 bg-rose-500/25 rounded px-[0.5px] font-semibold';
                  } else {
                    charStyle = 'text-zinc-600';
                  }
                }

                const showCaretHere = isCurrent && cIdx === currentInputVal.length;

                return (
                  <span key={cIdx} className="relative inline-block">
                    {showCaretHere && (
                      <span
                        className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-[2px] h-[80%] animate-pulse rounded-full z-10"
                        style={{ backgroundColor: themeObj.hex, boxShadow: `0 0 6px ${themeObj.hex}` }}
                      />
                    )}
                    <span className={charStyle}>{char}</span>
                  </span>
                );
              })}

              {/* Ekstra huruf melebihi panjang kata */}
              {isCurrent && currentInputVal.length >= word.length && (
                <span className="relative inline-block">
                  <span
                    className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-[2px] h-[80%] animate-pulse rounded-full z-10"
                    style={{ backgroundColor: themeObj.hex, boxShadow: `0 0 6px ${themeObj.hex}` }}
                  />
                  {currentInputVal.length > word.length && (
                    <span className="text-rose-400 bg-rose-500/25 rounded px-[0.5px] font-semibold">
                      {currentInputVal.slice(word.length)}
                    </span>
                  )}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

WatchReplay.propTypes = {
  replayEvents: PropTypes.arrayOf(PropTypes.object),
  words: PropTypes.arrayOf(PropTypes.string),
  durationMs: PropTypes.number,
  theme: PropTypes.string
};
