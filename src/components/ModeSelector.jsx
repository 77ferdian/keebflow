import React from 'react';
import PropTypes from 'prop-types';
import {
  Clock,
  Type,
  Code2,
  Quote,
  Sliders,
  Target,
  Globe,
  X,
  FileText,
  Hash,
  AtSign
} from 'lucide-react';
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
  hasPunctuation = false,
  onTogglePunctuation = null,
  hasNumbers = false,
  onToggleNumbers = null,
  onOpenCustomModal = null,
  theme = 'nord'
}) {
  const themeObj = getTheme(theme);
  const { t } = useLocale();

  const isQuoteMode = mode === 'quote' || mode === 'daily';

  return (
    <div className="max-w-fit mx-auto bg-zinc-900/80 border border-zinc-800/80 rounded-full px-3.5 sm:px-4 py-1.5 flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-1.5 text-xs backdrop-blur-md shadow-lg transition-all duration-200">
      {/* 1. Toggle Punctuation & Numbers (Monkeytype Style) */}
      {onTogglePunctuation && onToggleNumbers && (mode === 'time' || mode === 'words') && !isDrillActive && (
        <>
          <div className="flex items-center space-x-2 text-[11px]">
            <button
              type="button"
              onClick={onTogglePunctuation}
              className={`flex items-center space-x-1 px-1.5 py-0.5 rounded transition-all ${
                hasPunctuation ? 'font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              style={hasPunctuation ? { color: themeObj.primary } : {}}
              title="Sertakan tanda baca dan huruf besar"
            >
              <AtSign size={11} />
              <span>{t.togglePunctuation}</span>
            </button>

            <button
              type="button"
              onClick={onToggleNumbers}
              className={`flex items-center space-x-1 px-1.5 py-0.5 rounded transition-all ${
                hasNumbers ? 'font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              style={hasNumbers ? { color: themeObj.primary } : {}}
              title="Sertakan angka acak di antara kata"
            >
              <Hash size={11} />
              <span>{t.toggleNumbers}</span>
            </button>
          </div>

          <span className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:inline-block" />
        </>
      )}

      {/* 2. Kategori Mode Utama */}
      <div className="flex items-center space-x-3 text-zinc-400">
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
          onClick={() => onModeChange('quote')}
          className={`flex items-center space-x-1 transition-colors ${
            isQuoteMode && !isDrillActive ? 'font-semibold' : 'hover:text-zinc-200'
          }`}
          style={isQuoteMode && !isDrillActive ? { color: themeObj.primary } : {}}
          title={t.quoteBadge}
        >
          <Quote size={12} />
          <span>{t.modeQuote}</span>
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
          onClick={() => onModeChange('custom')}
          className={`flex items-center space-x-1 transition-colors ${
            mode === 'custom' && !isDrillActive ? 'font-semibold' : 'hover:text-zinc-200'
          }`}
          style={mode === 'custom' && !isDrillActive ? { color: themeObj.primary } : {}}
          title={t.customModalTitle}
        >
          <FileText size={12} />
          <span>{t.modeCustom}</span>
        </button>
      </div>

      {/* Pembatas */}
      <span className="w-1 h-1 rounded-full bg-zinc-700" />

      {/* 3. Sub-Pilihan Berdasarkan Mode */}
      <div className="flex items-center space-x-2">
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
        ) : isQuoteMode ? (
          ['all', 'short', 'medium', 'long'].map((len) => (
            <button
              type="button"
              key={len}
              onClick={() => onSubOptionChange(len)}
              className={`transition-colors duration-150 text-[11px] ${
                subOption === len || (!subOption && len === 'all')
                  ? 'font-bold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              style={
                subOption === len || (!subOption && len === 'all')
                  ? { color: themeObj.primary }
                  : {}
              }
            >
              {len === 'all'
                ? t.quoteLengthAll
                : len === 'short'
                ? t.quoteLengthShort
                : len === 'medium'
                ? t.quoteLengthMedium
                : t.quoteLengthLong}
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
        ) : mode === 'custom' ? (
          <button
            type="button"
            onClick={onOpenCustomModal}
            className="flex items-center space-x-1 text-zinc-400 hover:text-zinc-200 px-2 py-0.5 rounded-lg border border-zinc-800 bg-zinc-900/60 transition-colors"
          >
            <Sliders size={11} style={{ color: themeObj.primary }} />
            <span>Ubah Teks</span>
          </button>
        ) : (
          <span className="text-zinc-500">{t.quoteBadge}</span>
        )}
      </div>

      {/* 4. Penanda Bahasa Kosakata */}
      {mode !== 'code' && mode !== 'custom' && (
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
  hasPunctuation: PropTypes.bool,
  onTogglePunctuation: PropTypes.func,
  hasNumbers: PropTypes.bool,
  onToggleNumbers: PropTypes.func,
  onOpenCustomModal: PropTypes.func,
  theme: PropTypes.string
};
