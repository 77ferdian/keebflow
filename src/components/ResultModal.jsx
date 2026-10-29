import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Share2,
  Target,
  Check,
  Sparkles,
  Keyboard,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import MonkeytypeChart from './MonkeytypeChart';
import WordsHistory from './WordsHistory';
import WatchReplay from './WatchReplay';
import KeyboardHeatmap from './KeyboardHeatmap';
import ProgressHistoryChart from './ProgressHistoryChart';
import { getTheme } from '../utils/themeConfig';
import { useLocale } from '../contexts/LocaleContext';
import { getStatsHistory, clearStatsHistory } from '../utils/storage';

export default function ResultModal({
  wpm = 0,
  accuracy = 100,
  consistency = 85,
  rawWpm = 0,
  isNewPB = false,
  personalBest = 0,
  weakKeys = {},
  allTimeErrors = {},
  onRestart,
  onStartWeaknessDrill,
  theme = 'oled',
  testTypeInfo = {
    mode: 'time 30s',
    language: 'indonesian',
    strictness: 'standar'
  },
  characterStats = { correct: 0, incorrect: 0, extra: 0, missed: 0 },
  chartData = [],
  wordsHistoryData = [],
  replayEvents = [],
  words = [],
  timeElapsedSec = 30
}) {
  const [copied, setCopied] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyList, setHistoryList] = useState(() => getStatsHistory());
  const themeObj = getTheme(theme);
  const { locale, t } = useLocale();

  useEffect(() => {
    if (isNewPB && wpm > 0) {
      const confettiColors = {
        emerald: ['#10b981', '#34d399', '#6ee7b7', '#ffffff'],
        slate: ['#38bdf8', '#0ea5e9', '#7dd3fc', '#ffffff'],
        amber: ['#fb923c', '#f97316', '#fdba74', '#ffffff'],
        oled: ['#f59e0b', '#fbbf24', '#fde68a', '#ffffff']
      };

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: confettiColors[theme] || confettiColors.oled
      });
    }
  }, [isNewPB, wpm, theme]);

  const sortedWeakKeys = Object.entries(weakKeys || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k.toUpperCase());

  const remainingAllTimeKeys = Object.entries(allTimeErrors || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k.toUpperCase());

  const handleShare = () => {
    const text = `⚡ keebflow test result\n` +
      `wpm: ${wpm} | acc: ${accuracy}% | raw: ${rawWpm}\n` +
      `type: ${testTypeInfo.mode} (${testTypeInfo.language})\n` +
      `characters: ${characterStats.correct}/${characterStats.incorrect}/${characterStats.extra}/${characterStats.missed}\n` +
      `${isNewPB ? (locale === 'id' ? '🏆 Rekor Baru!' : '🏆 New PB!') : ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format durasi sesi: "18s" dan "00:00:18 session"
  const formattedSeconds = Math.max(1, Math.round(timeElapsedSec));
  const formatSessionTime = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${h}:${m}:${s} session`;
  };

  // Status Validitas Tes (seperti di Monkeytype)
  const isValidTest = accuracy >= 50;
  const statusOther = !isValidTest
    ? (locale === 'id' ? 'tidak valid (akurasi)' : 'invalid (accuracy)')
    : isNewPB
    ? (locale === 'id' ? 'rekor baru!' : 'new pb!')
    : 'valid';

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-5xl mx-auto space-y-6 font-mono select-none transition-all duration-300 pb-16"
    >
      {/* Banner Rekor Baru */}
      {isNewPB && (
        <div className={`py-1.5 px-4 rounded-full ${themeObj.bgSubtle} ${themeObj.borderSubtle} ${themeObj.textLight} text-xs font-semibold flex items-center justify-center space-x-1.5 max-w-fit mx-auto animate-bounce shadow-lg ${themeObj.shadow}`}>
          <Sparkles size={14} className={themeObj.textPrimary} />
          <span>{t.resultNewPbBadge}</span>
        </div>
      )}

      {/* 1. Baris Atas: Skor Raksasa WPM & ACC + Monkeytype Chart */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6">
        {/* Kolom Angka Besar WPM & ACC (Gaya Khas Monkeytype dengan Tema Aktif) */}
        <div className="flex flex-row lg:flex-col justify-around lg:justify-center items-start lg:w-44 shrink-0 bg-zinc-950/40 border border-zinc-800/70 rounded-xl p-5 backdrop-blur-md">
          {/* WPM */}
          <div className="mb-0 lg:mb-5">
            <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold block mb-0.5">
              {t.resultWpm}
            </span>
            <span
              className={`text-5xl sm:text-6xl font-extrabold tracking-tight ${
                accuracy < 50 ? 'text-rose-400' : themeObj.textPrimary
              }`}
            >
              {wpm}
            </span>
          </div>

          {/* ACCURACY */}
          <div>
            <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold block mb-0.5">
              {t.resultAcc}
            </span>
            <span
              className={`text-5xl sm:text-6xl font-extrabold tracking-tight ${
                accuracy < 50
                  ? 'text-rose-400'
                  : accuracy >= 95
                  ? 'text-zinc-100'
                  : themeObj.textLight
              }`}
            >
              {accuracy}%
            </span>
          </div>
        </div>

        {/* Grafik Sumbu Ganda WPM, Raw & Errors */}
        <div className="flex-1 min-w-0">
          <MonkeytypeChart data={chartData} theme={theme} />
        </div>
      </div>

      {/* 2. Baris Statistik 6 Kolom (Presisi Monkeytype dengan Tema Aktif) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 bg-zinc-950/40 border border-zinc-800/70 rounded-xl p-4 backdrop-blur-md text-left">
        {/* Kolom 1: test type */}
        <div>
          <span className="text-[11px] uppercase tracking-wider text-zinc-500 block">
            {t.resultTestType}
          </span>
          <p className={`text-sm font-bold ${themeObj.textPrimary} leading-tight mt-0.5`}>
            {testTypeInfo.mode || 'time 30'}
          </p>
          <p className={`text-xs ${themeObj.textLight} leading-tight`}>
            {testTypeInfo.language || 'indonesian'}
          </p>
          <p className={`text-[11px] ${themeObj.textLight} opacity-80 leading-tight`}>
            {testTypeInfo.strictness || 'standard'}
          </p>
        </div>

        {/* Kolom 2: other */}
        <div>
          <span className="text-[11px] uppercase tracking-wider text-zinc-500 block">
            {t.resultOther}
          </span>
          <p
            className={`text-sm font-semibold leading-tight mt-0.5 ${
              !isValidTest
                ? 'text-rose-400'
                : isNewPB
                ? `${themeObj.textPrimary} font-bold`
                : `${themeObj.textLight}`
            }`}
          >
            {statusOther}
          </p>
        </div>

        {/* Kolom 3: raw */}
        <div>
          <span className="text-[11px] uppercase tracking-wider text-zinc-500 block">
            {t.resultRaw}
          </span>
          <p className="text-2xl font-bold text-zinc-200 leading-tight mt-0.5">{rawWpm}</p>
        </div>

        {/* Kolom 4: characters */}
        <div>
          <span className="text-[11px] uppercase tracking-wider text-zinc-500 block">
            {t.resultCharacters}
          </span>
          <p className={`text-sm sm:text-base font-bold ${themeObj.textPrimary} leading-tight mt-0.5`}>
            {characterStats.correct}/{characterStats.incorrect}/{characterStats.extra}/
            {characterStats.missed}
          </p>
          <span className="text-[10px] text-zinc-500 block mt-0.5">{t.charsDetail}</span>
        </div>

        {/* Kolom 5: consistency */}
        <div>
          <span className="text-[11px] uppercase tracking-wider text-zinc-500 block">
            {t.resultConsistency}
          </span>
          <p className="text-2xl font-bold text-zinc-200 leading-tight mt-0.5">{consistency}%</p>
        </div>

        {/* Kolom 6: time */}
        <div>
          <span className="text-[11px] uppercase tracking-wider text-zinc-500 block">
            {t.resultTime}
          </span>
          <p className={`text-2xl font-bold ${themeObj.textPrimary} leading-tight mt-0.5`}>
            {formattedSeconds}s
          </p>
          <p className="text-[10px] text-zinc-500 leading-tight">
            {formatSessionTime(formattedSeconds)}
          </p>
        </div>
      </div>

      {/* 3. Input History (dengan Toggle Sesuai Permintaan) */}
      <WordsHistory wordsData={wordsHistoryData} defaultOpen={true} theme={theme} />

      {/* 4. Watch Replay Player (Sesuai Permintaan) */}
      <WatchReplay
        replayEvents={replayEvents}
        words={words}
        durationMs={formattedSeconds * 1000}
        theme={theme}
      />

      {/* 5. Analisis Tombol Lemah & Latihan Cepat */}
      <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-md">
        <div className="text-xs text-zinc-400 text-center sm:text-left">
          {testTypeInfo?.isDrill ? (
            sortedWeakKeys.length === 0 ? (
              <span className="text-emerald-400 font-medium flex items-center space-x-1.5">
                <span>🎉</span>
                <span>
                  {locale === 'id'
                    ? `Target latihan (${testTypeInfo?.drillKeys?.map((k) => k.toUpperCase()).join(', ') || ''}) berhasil dikuasai! Beban error telah dipulihkan.`
                    : `Target drill keys (${testTypeInfo?.drillKeys?.map((k) => k.toUpperCase()).join(', ') || ''}) mastered cleanly! Error burden reduced.`}
                </span>
              </span>
            ) : (
              <span>
                <span className="inline-block w-2 h-2 rounded-full bg-rose-400 mr-2" />
                {locale === 'id' ? 'Tombol masih tersendat: ' : 'Keys still flawed: '}
                <strong className="text-zinc-100">{sortedWeakKeys.join(', ')}</strong>.
                {locale === 'id' ? ' Lanjutkan latihan untuk memulihkannya.' : ' Keep practicing to cure them.'}
              </span>
            )
          ) : sortedWeakKeys.length > 0 ? (
            <span>
              <span className="inline-block w-2 h-2 rounded-full bg-rose-400 mr-2" />
              {locale === 'id' ? 'Tombol penghambat: ' : 'Flawed keys: '}
              <strong className="text-zinc-100">{sortedWeakKeys.join(', ')}</strong>.
              {locale === 'id' ? ' Kecepatan jari melambat pada kombinasi huruf ini.' : ' Finger velocity drops on these key combinations.'}
            </span>
          ) : (
            <span className="text-emerald-400 font-medium">
              {locale === 'id'
                ? '✨ Ketukan sempurna! Tidak ditemukan tombol bermasalah pada tes ini.'
                : '✨ Flawless strokes! No problem keys identified during this session.'}
            </span>
          )}
        </div>

        {sortedWeakKeys.length > 0 ? (
          <button
            type="button"
            onClick={() => onStartWeaknessDrill(sortedWeakKeys)}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg ${themeObj.bgPrimary} ${themeObj.bgPrimaryHover} text-zinc-950 font-bold text-xs tracking-tight transition-all duration-150 shadow-md ${themeObj.shadow} active:scale-95 shrink-0`}
          >
            <Target size={13} />
            <span>{locale === 'id' ? `Latih (${sortedWeakKeys.join(', ')})` : `Train (${sortedWeakKeys.join(', ')})`}</span>
          </button>
        ) : remainingAllTimeKeys.length > 0 ? (
          <button
            type="button"
            onClick={() => onStartWeaknessDrill(remainingAllTimeKeys)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs tracking-tight transition-all duration-150 border border-zinc-700 active:scale-95 shrink-0"
          >
            <Target size={13} />
            <span>{locale === 'id' ? `Latih Tombol Lain (${remainingAllTimeKeys.join(', ')})` : `Train Next (${remainingAllTimeKeys.join(', ')})`}</span>
          </button>
        ) : null}
      </div>

      {/* 6. Accordion Peta Akurasi Keyboard (Heatmap) */}
      <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-xl overflow-hidden backdrop-blur-md">
        <button
          type="button"
          onClick={() => setShowHeatmap(!showHeatmap)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Keyboard size={14} className={themeObj.textPrimary} />
            <span className="font-semibold uppercase tracking-wider">
              {t.heatmapTitle}
            </span>
          </div>
          {showHeatmap ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {showHeatmap && (
          <div className="p-4 pt-1 border-t border-zinc-800/60">
            <KeyboardHeatmap sessionErrors={weakKeys} allTimeErrors={allTimeErrors} theme={theme} />
          </div>
        )}
      </div>

      {/* 7. Bilah Tombol Aksi Bawah */}
      <div className="flex items-center justify-center space-x-4 pt-2">
        <button
          type="button"
          onClick={onRestart}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl ${themeObj.bgPrimary} ${themeObj.bgPrimaryHover} text-zinc-950 text-xs font-bold transition-all active:scale-95 shadow-md ${themeObj.shadow}`}
        >
          <RotateCcw size={14} />
          <span>{t.repeatTestBtn}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium transition-all active:scale-95 border border-zinc-800"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
          <span>{copied ? t.copiedToClipboard : t.shareScoreBtn}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setHistoryList(getStatsHistory());
            setShowHistoryModal(true);
          }}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-all active:scale-95 border border-zinc-800"
        >
          <Sparkles size={14} style={{ color: themeObj.primary }} />
          <span>{t.viewHistoryBtn}</span>
        </button>
      </div>

      {/* Modal Grafik Progress Historis */}
      <ProgressHistoryChart
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        historyData={historyList}
        onClearHistory={() => {
          clearStatsHistory();
          setHistoryList([]);
        }}
        theme={theme}
      />
    </div>
  );
}

ResultModal.propTypes = {
  wpm: PropTypes.number,
  accuracy: PropTypes.number,
  consistency: PropTypes.number,
  rawWpm: PropTypes.number,
  isNewPB: PropTypes.bool,
  personalBest: PropTypes.number,
  weakKeys: PropTypes.object,
  allTimeErrors: PropTypes.object,
  onRestart: PropTypes.func.isRequired,
  onStartWeaknessDrill: PropTypes.func.isRequired,
  theme: PropTypes.string,
  testTypeInfo: PropTypes.shape({
    mode: PropTypes.string,
    language: PropTypes.string,
    strictness: PropTypes.string
  }),
  characterStats: PropTypes.shape({
    correct: PropTypes.number,
    incorrect: PropTypes.number,
    extra: PropTypes.number,
    missed: PropTypes.number
  }),
  chartData: PropTypes.arrayOf(PropTypes.object),
  wordsHistoryData: PropTypes.arrayOf(PropTypes.object),
  replayEvents: PropTypes.arrayOf(PropTypes.object),
  words: PropTypes.arrayOf(PropTypes.string),
  timeElapsedSec: PropTypes.number
};
