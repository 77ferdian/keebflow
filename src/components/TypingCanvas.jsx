import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getTheme } from '../utils/themeConfig';
import { useLocale } from '../contexts/LocaleContext';

export default function TypingCanvas({
  words,
  currentWordIdx,
  inputVal,
  wordHistory = {},
  ghostIndex,
  showGhostCaret,
  timeLeft,
  liveWpm,
  isActive,
  mode,
  zenMode = false,
  caretStyle = 'line',
  fontSize = 'normal',
  isCapsLock = false,
  theme = 'nord'
}) {
  const activeWordRef = useRef(null);
  const containerRef = useRef(null);
  const themeObj = getTheme(theme);
  const { locale, t } = useLocale();

  // Auto-scroll inside canvas if many words, keeping the page viewport fixed (no window scroll!)
  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      const activeEl = activeWordRef.current;
      const containerEl = containerRef.current;
      const offsetTop = activeEl.offsetTop - containerEl.offsetTop;

      // Scroll smoothly inside container if words exceed 2 lines
      if (offsetTop > 80) {
        containerEl.scrollTo({
          top: offsetTop - 40,
          behavior: 'smooth'
        });
      } else {
        containerEl.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [currentWordIdx]);

  // Render Caret based on style
  const renderCaret = () => {
    switch (caretStyle) {
      case 'block':
        return (
          <span
            className="absolute -left-[2px] top-1/2 -translate-y-1/2 w-2.5 sm:w-3 h-[90%] animate-caret rounded-[2px] z-10"
            style={{
              backgroundColor: `${themeObj.primary}b0`,
              boxShadow: `0 0 8px ${themeObj.primary}90`
            }}
          />
        );
      case 'underline':
        return (
          <span
            className="absolute left-0 -bottom-1 w-full h-[3px] animate-caret rounded-full z-10"
            style={{
              backgroundColor: themeObj.primary,
              boxShadow: `0 0 8px ${themeObj.primary}`
            }}
          />
        );
      case 'line':
      default:
        return (
          <span
            className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-[2.5px] h-[85%] animate-caret rounded-full z-10"
            style={{
              backgroundColor: themeObj.primary,
              boxShadow: `0 0 8px ${themeObj.primary}`
            }}
          />
        );
    }
  };

  const fontClasses =
    fontSize === 'large'
      ? 'text-2xl sm:text-3xl md:text-4xl leading-relaxed sm:leading-loose'
      : 'text-xl sm:text-2xl md:text-3xl leading-relaxed sm:leading-loose';

  return (
    <div className="w-full max-w-6xl mx-auto relative select-none">
      {/* Caps Lock Floating Warning */}
      {isCapsLock && (
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center space-x-1.5 animate-bounce z-20"
          style={{
            backgroundColor: `${themeObj.primary}18`,
            borderColor: `${themeObj.primary}45`,
            borderWidth: '1px',
            color: themeObj.primary
          }}
        >
          <span>⇪</span>
          <span>{t.capsLockWarning}</span>
        </div>
      )}

      {/* Live Timer & Stats (Hidden during test if Zen Mode is enabled) */}
      <div className="flex items-center justify-between mb-4 text-sm select-none h-9">
        {zenMode && isActive ? (
          <div className="text-xs text-zinc-600 font-mono tracking-widest uppercase">
            ✦ Zen Mode ✦
          </div>
        ) : (
          <>
            <span
              className="text-3xl font-light font-mono tracking-tight transition-all"
              style={{ color: themeObj.primary }}
            >
              {mode === 'time' ? timeLeft : `${currentWordIdx} / ${words.length}`}
            </span>
            <span className="text-xs text-zinc-500 font-mono tracking-wider">
              {isActive ? `${liveWpm} wpm` : (locale === 'id' ? 'ketik untuk mulai' : 'type to start')}
            </span>
          </>
        )}
      </div>

      {/* Widescreen Fixed-Height Words Canvas (No Window Scroll!) */}
      <div
        ref={containerRef}
        className={`${fontClasses} h-[38vh] max-h-[280px] overflow-hidden tracking-wide font-normal flex flex-wrap gap-x-3.5 gap-y-2 relative font-mono transition-all duration-150`}
      >
        {words.map((word, wIdx) => {
          const isCurrent = wIdx === currentWordIdx;
          const isPast = wIdx < currentWordIdx;
          const isGhost = showGhostCaret && wIdx === ghostIndex && isActive;
          const history = wordHistory[wIdx];
          const isPastCorrect = history ? history.isCorrect : true;

          return (
            <span
              key={wIdx}
              ref={isCurrent ? activeWordRef : null}
              className="relative inline-flex items-center rounded px-0.5"
            >
              {/* Ghost Caret Indicator */}
              {isGhost && (
                <span
                  className="absolute -top-5 left-0 text-[10px] font-sans tracking-tight flex items-center space-x-0.5 pointer-events-none select-none animate-pulse"
                  style={{ color: themeObj.secondary }}
                >
                  <span>▲</span>
                  <span className="uppercase text-[9px] font-bold">PB</span>
                </span>
              )}

              {/* Characters inside word */}
              {word.split('').map((char, cIdx) => {
                let charStyle = 'text-zinc-600';

                if (isPast) {
                  charStyle = isPastCorrect
                    ? 'text-zinc-100 font-medium'
                    : 'text-rose-400 bg-rose-500/20 underline decoration-rose-500 font-medium';
                } else if (isCurrent) {
                  const isTyped = cIdx < inputVal.length;
                  if (isTyped) {
                    charStyle =
                      inputVal[cIdx] === char
                        ? 'text-zinc-100 font-semibold'
                        : 'text-rose-400 bg-rose-500/25 rounded px-[1px] font-semibold';
                  } else {
                    charStyle = 'text-zinc-600';
                  }
                }

                const showCaretHere = isCurrent && cIdx === inputVal.length;

                return (
                  <span key={cIdx} className="relative inline-block">
                    {showCaretHere && renderCaret()}
                    <span className={`transition-colors duration-75 ${charStyle}`}>
                      {char}
                    </span>
                  </span>
                );
              })}

              {/* Overflow characters and Caret at word end */}
              {isCurrent && inputVal.length >= word.length && (
                <span className="relative inline-block">
                  {renderCaret()}
                  {inputVal.length > word.length && (
                    <span className="text-rose-400 bg-rose-500/25 rounded px-[1px] font-semibold">
                      {inputVal.slice(word.length)}
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

TypingCanvas.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentWordIdx: PropTypes.number.isRequired,
  inputVal: PropTypes.string.isRequired,
  wordHistory: PropTypes.object,
  ghostIndex: PropTypes.number,
  showGhostCaret: PropTypes.bool,
  timeLeft: PropTypes.number,
  liveWpm: PropTypes.number,
  isActive: PropTypes.bool,
  mode: PropTypes.string,
  zenMode: PropTypes.bool,
  caretStyle: PropTypes.string,
  fontSize: PropTypes.string,
  isCapsLock: PropTypes.bool,
  theme: PropTypes.string
};
