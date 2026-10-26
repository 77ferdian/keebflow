import React from 'react';
import PropTypes from 'prop-types';
import { getTheme } from '../utils/themeConfig';
import { useLocale } from '../contexts/LocaleContext';

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

export default function KeyboardHeatmap({ sessionErrors = {}, allTimeErrors = {}, theme = 'nord' }) {
  const themeObj = getTheme(theme);
  const { t } = useLocale();

  const getKeyColor = (key) => {
    const sessionCount = sessionErrors[key] || 0;
    const allTimeCount = allTimeErrors[key] || 0;

    if (sessionCount > 2) return 'bg-rose-500/30 border-rose-500 text-rose-300';
    if (sessionCount > 0) return 'border font-bold';
    if (allTimeCount > 5) return 'bg-zinc-800 border-zinc-700 text-zinc-300';
    return 'bg-zinc-900/60 border-zinc-800/80 text-zinc-500';
  };

  const getKeyStyle = (key) => {
    const sessionCount = sessionErrors[key] || 0;
    if (sessionCount > 0 && sessionCount <= 2) {
      return {
        backgroundColor: `${themeObj.secondary}20`,
        borderColor: `${themeObj.secondary}60`,
        color: themeObj.secondary
      };
    }
    return {};
  };

  return (
    <div className="flex flex-col items-center space-y-1.5 p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/60 max-w-md mx-auto select-none">
      <div className="flex items-center justify-between w-full mb-1 text-[11px] text-zinc-400">
        <span className="font-semibold text-zinc-300 font-mono">{t.heatmapTitle}</span>
        <div className="flex items-center space-x-2 text-[10px]">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded bg-zinc-800 border border-zinc-700" />
            <span className="text-zinc-500">{t.heatmapClean}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span
              className="w-2 h-2 rounded border"
              style={{ backgroundColor: `${themeObj.secondary}40`, borderColor: themeObj.secondary }}
            />
            <span style={{ color: themeObj.secondary }}>{t.heatmapDoubtful}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded bg-rose-500/40 border border-rose-500" />
            <span className="text-rose-400">{t.heatmapError}</span>
          </span>
        </div>
      </div>

      {KEYBOARD_ROWS.map((row, rIdx) => (
        <div key={rIdx} className="flex space-x-1 justify-center">
          {row.map((char) => {
            const hasError = (sessionErrors[char] || 0) > 0;
            return (
              <div
                key={char}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md border flex flex-col items-center justify-center text-xs font-mono uppercase font-medium transition-all ${getKeyColor(char)}`}
                style={getKeyStyle(char)}
              >
                <span>{char}</span>
                {hasError && (
                  <span className="text-[8px] leading-none text-rose-400 font-sans">
                    ×{sessionErrors[char]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

KeyboardHeatmap.propTypes = {
  sessionErrors: PropTypes.object,
  allTimeErrors: PropTypes.object,
  theme: PropTypes.string
};
