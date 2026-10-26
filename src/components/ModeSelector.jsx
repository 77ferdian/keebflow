import React from 'react';
import PropTypes from 'prop-types';
import { Clock, Type, Code2, Calendar, Target, Globe, X } from 'lucide-react';
import { getTheme } from '../utils/themeConfig';
import { useLocale } from '../contexts/LocaleContext';

export default function ModeSelector({
  mode,
  onModeChange,
  subOption,
  onSubOptionChange,
  codeLanguage,
  onCodeLanguageChange,
  language,
  onLanguageChange,
  isDrillActive,
  drillKeys = [],
  onClearDrill,
  theme = 'nord'
}) {
  const themeObj = getTheme(theme);
  const { t } = useLocale();

  return (
    <div className="max-w-fit mx-auto bg-zinc-900/70 border border-zinc-800/80 rounded-full px-4 py-1.5 flex items-center space-x-4 sm:space-x-5 text-xs backdrop-blur-md shadow-lg transition-all duration-200">
      {/* Pilihan Kategori Mode */}
      <div className="flex items-center space-x-3.5 text-zinc-400">
        <button
          type="button"
          onClick={() => onModeChange('time')}
          className={`flex items-center space-x-1 transition-colors ${
            mode === 'time' && !isDrillActive ? 'font-semibold' : 'hover:text-zinc-200'
          }`}
          style={mode === 'time' && !isDrillActive ? { color: themeObj.primary } : {}}
          title={t.modeTimeTitle}
        >
          <Clock size={12} />
          <span>{t.modeTime}</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange('words')}
          className={`flex items-center space-x-1 transition-colors ${
            mode === 'words' && !isDrillActive ? 'font-semibold' : 'hover:text-zinc-200'
          }`}
          style={mode === 'words' && !isDrillActive ? { color: themeObj.primary } : {}}
          title={t.modeWordsTitle}
        >
          <Type size={12} />
          <span>{t.modeWords}</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange('code')}
          className={`flex items-center space-x-1 transition-colors ${
            mode === 'code' && !isDrillActive ? 'font-semibold' : 'hover:text-zinc-200'
          }`}
          style={mode === 'code' && !isDrillActive ? { color: themeObj.primary } : {}}
          title={t.modeCodeTitle}
        >
          <Code2 size={12} />
          <span>{t.modeCode}</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange('daily')}
          className={`flex items-center space-x-1 transition-colors ${
            mode === 'daily' && !isDrillActive ? 'font-semibold' : 'hover:text-zinc-200'
          }`}
          style={mode === 'daily' && !isDrillActive ? { color: themeObj.primary } : {}}
          title={t.modeDailyTitle}
        >
          <Calendar size={12} />
          <span>{t.modeDaily}</span>
        </button>
      </div>

      {/* Pembatas */}
      <span className="w-1 h-1 rounded-full bg-zinc-700" />

      {/* Sub-Pilihan */}
      <div className="flex items-center space-x-2.5">
        {isDrillActive ? (
          <div className="flex items-center space-x-1.5">
            <span
              className="flex items-center space-x-1 font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${themeObj.secondary}20`,
                color: themeObj.secondary
              }}
            >
              <Target size={11} />
              <span>
                {t.modeDrillBadge}
                {drillKeys && drillKeys.length > 0
                  ? ` (${drillKeys.map((k) => k.toUpperCase()).join(', ')})`
                  : ''}
              </span>
            </span>
            <button
              type="button"
              onClick={onClearDrill}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5 rounded"
              title="Keluar dari mode latihan tombol lemah"
            >
              <X size={12} />
            </button>
          </div>
        ) : mode === 'time' ? (
          [15, 30, 60].map((sec) => (
            <button
              type="button"
              key={sec}
              onClick={() => onSubOptionChange(sec)}
              className={`transition-colors duration-150 ${
                subOption === sec ? 'font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              style={subOption === sec ? { color: themeObj.primary } : {}}
            >
              {sec}{t.secondsSuffix}
            </button>
          ))
        ) : mode === 'words' ? (
          [10, 25, 50].map((w) => (
            <button
              type="button"
              key={w}
              onClick={() => onSubOptionChange(w)}
              className={`transition-colors duration-150 ${
                subOption === w ? 'font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              style={subOption === w ? { color: themeObj.primary } : {}}
            >
              {w} {t.wordsCountSuffix}
            </button>
          ))
        ) : mode === 'code' ? (
          <div className="flex items-center space-x-2">
            {[
              { id: 'javascript', label: 'JS' },
              { id: 'python', label: 'Python' },
              { id: 'mysql', label: 'MySQL' }
            ].map((lang) => (
              <button
                type="button"
                key={lang.id}
                onClick={() => onCodeLanguageChange(lang.id)}
                className={`transition-colors ${
                  codeLanguage === lang.id ? 'font-bold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                style={codeLanguage === lang.id ? { color: themeObj.primary } : {}}
              >
                {lang.label}
              </button>
            ))}
          </div>
        ) : (
          <span className="text-zinc-500">{t.quoteBadge}</span>
        )}
      </div>

      {/* Penanda Bahasa Kosakata */}
      {mode !== 'code' && (
        <>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <button
            type="button"
            onClick={() => onLanguageChange(language === 'id' ? 'en' : 'id')}
            className="flex items-center space-x-1 text-[11px] font-mono text-zinc-400 transition-colors hover:text-white"
            title={t.toggleLanguageBtn}
          >
            <Globe size={11} style={{ color: themeObj.primary }} />
            <span className="font-bold">{language.toUpperCase()}</span>
          </button>
        </>
      )}
    </div>
  );
}

ModeSelector.propTypes = {
  mode: PropTypes.string.isRequired,
  onModeChange: PropTypes.func.isRequired,
  subOption: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSubOptionChange: PropTypes.func.isRequired,
  codeLanguage: PropTypes.string,
  onCodeLanguageChange: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
  isDrillActive: PropTypes.bool,
  drillKeys: PropTypes.arrayOf(PropTypes.string),
  onClearDrill: PropTypes.func.isRequired,
  theme: PropTypes.string
};
