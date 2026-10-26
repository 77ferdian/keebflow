import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff, Check, Copy, Filter } from 'lucide-react';
import { getTheme } from '../utils/themeConfig';
import { useLocale } from '../contexts/LocaleContext';

export default function WordsHistory({ wordsData = [], defaultOpen = true, theme = 'oled' }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [filterOnlyErrors, setFilterOnlyErrors] = useState(false);
  const [copied, setCopied] = useState(false);
  const themeObj = getTheme(theme);
  const { locale, t } = useLocale();

  // Filter daftar kata jika pengguna memilih hanya kata yang salah
  const displayedWords = filterOnlyErrors
    ? wordsData.filter((w) => !w.isCorrect && w.typed !== '')
    : wordsData;

  const errorCount = wordsData.filter((w) => !w.isCorrect && w.typed !== '').length;

  const handleCopyInput = () => {
    const text = wordsData
      .filter((w) => w.typed !== '')
      .map((w) => w.typed || w.target)
      .join(' ');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-4 font-mono select-none backdrop-blur-md transition-all"
    >
      {/* Header Input History dengan Ikon Toolbar Monkeytype */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800/60">
        <div className="flex items-center space-x-2.5">
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
            {t.inputHistoryTitle}
          </span>
          {errorCount > 0 && (
            <span className="text-[10px] bg-rose-500/15 border border-rose-500/30 text-rose-400 px-2 py-0.5 rounded-full font-semibold">
              {errorCount} {t.wordsErrorBadge}
            </span>
          )}
        </div>

        {/* Toolbar Tombol Aksi */}
        <div className="flex items-center space-x-1 sm:space-x-2 text-zinc-400">
          {/* Filter Hanya Kata Salah */}
          <button
            onClick={() => setFilterOnlyErrors(!filterOnlyErrors)}
            className={`p-1.5 rounded-lg text-[11px] flex items-center space-x-1 transition-all ${
              filterOnlyErrors
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'hover:bg-zinc-800/80 text-zinc-400'
            }`}
            title={t.filterErrorsOnly}
          >
            <Filter size={13} />
            <span className="hidden sm:inline">
              {locale === 'id' ? 'hanya salah' : 'errors only'}
            </span>
          </button>

          {/* Salin Teks yang Diketik */}
          <button
            onClick={handleCopyInput}
            className="p-1.5 rounded-lg text-[11px] hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 transition-all flex items-center space-x-1"
            title={t.copyInputBtn}
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span className="hidden sm:inline">
              {copied ? (locale === 'id' ? 'tersalin' : 'copied') : (locale === 'id' ? 'salin' : 'copy')}
            </span>
          </button>

          {/* Tombol Toggle Buka/Tutup Riwayat Kata */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`p-1.5 rounded-lg text-[11px] hover:bg-zinc-800/80 text-zinc-300 transition-all flex items-center space-x-1 border border-zinc-800 hover:${themeObj.textPrimary}`}
            title={isOpen ? (locale === 'id' ? 'Sembunyikan riwayat kata' : 'Hide word history') : (locale === 'id' ? 'Tampilkan riwayat kata' : 'Show word history')}
          >
            {isOpen ? <EyeOff size={13} /> : <Eye size={13} />}
            <span className="text-[11px]">
              {isOpen ? (locale === 'id' ? 'sembunyikan' : 'hide') : (locale === 'id' ? 'buka' : 'show')}
            </span>
          </button>
        </div>
      </div>

      {/* Konten Riwayat Kata */}
      {isOpen ? (
        <div className="flex flex-wrap gap-x-2.5 gap-y-2 text-sm leading-relaxed max-h-56 overflow-y-auto pr-1">
          {displayedWords.map((item, idx) => {
            const { target, typed = '', isCorrect } = item;

            if (!typed && typed !== '') {
              return (
                <span key={idx} className="text-zinc-600 opacity-60">
                  {target}
                </span>
              );
            }

            if (isCorrect) {
              return (
                <span
                  key={idx}
                  className={`text-zinc-200 transition-colors cursor-default hover:${themeObj.textLight}`}
                  title={`${locale === 'id' ? 'Sempurna' : 'Correct'}: "${target}"`}
                >
                  {target}
                </span>
              );
            }

            const maxLen = Math.max(target.length, typed.length);
            const chars = [];

            for (let i = 0; i < maxLen; i++) {
              const targetChar = target[i];
              const typedChar = typed[i];

              if (typedChar !== undefined && targetChar !== undefined) {
                if (typedChar === targetChar) {
                  chars.push(
                    <span key={i} className="text-zinc-200">
                      {targetChar}
                    </span>
                  );
                } else {
                  chars.push(
                    <span
                      key={i}
                      className="text-rose-400 bg-rose-500/25 underline decoration-rose-500 font-bold px-[0.5px]"
                    >
                      {typedChar}
                    </span>
                  );
                }
              } else if (typedChar !== undefined && targetChar === undefined) {
                chars.push(
                  <span
                    key={i}
                    className="text-rose-400 bg-rose-500/30 underline decoration-wavy font-bold"
                  >
                    {typedChar}
                  </span>
                );
              } else if (typedChar === undefined && targetChar !== undefined) {
                chars.push(
                  <span key={i} className="text-zinc-600 line-through opacity-75">
                    {targetChar}
                  </span>
                );
              }
            }

            return (
              <span
                key={idx}
                className="inline-block relative cursor-help px-1 py-0.5 rounded bg-rose-950/20 border border-rose-900/30"
                title={`Target: "${target}" | ${locale === 'id' ? 'Diketik' : 'Typed'}: "${typed}"`}
              >
                {chars}
              </span>
            );
          })}
        </div>
      ) : (
        <div
          onClick={() => setIsOpen(true)}
          className="py-2.5 text-center text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors"
        >
          {t.hiddenHistoryPrompt}
        </div>
      )}
    </div>
  );
}

WordsHistory.propTypes = {
  wordsData: PropTypes.arrayOf(
    PropTypes.shape({
      target: PropTypes.string.isRequired,
      typed: PropTypes.string,
      isCorrect: PropTypes.bool
    })
  ),
  defaultOpen: PropTypes.bool,
  theme: PropTypes.string
};
