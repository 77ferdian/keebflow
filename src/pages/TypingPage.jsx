import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import ModeSelector from '../components/ModeSelector';
import TypingCanvas from '../components/TypingCanvas';
import IdeCodeCanvas from '../components/IdeCodeCanvas';
import ResultModal from '../components/ResultModal';
import { soundEngine } from '../utils/soundEngine';
import {
  getRandomWords,
  generateWeaknessDrill,
  INDONESIAN_QUOTES,
  ENGLISH_QUOTES,
  CODE_SNIPPETS,
  parseCodeSnippet
} from '../utils/words';
import { useTheme } from '../contexts/ThemeContext';
import { useLocale } from '../contexts/LocaleContext';

export default function TypingPage({
  settings,
  onUpdateSettings,
  personalBest = 0,
  onUpdatePersonalBest,
  allTimeErrors = {},
  onUpdateAllTimeErrors,
  onIncrementStreak,
  isCapsLock = false,
  onTestStatusChange
}) {
  const { modeParam } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { locale } = useLocale();

  // Mode & Opsi dari Parameter Rute (Grounded React Router useParams Pattern)
  const [mode, setMode] = useState(() => {
    if (['time', 'words', 'code', 'daily', 'drill'].includes(modeParam)) {
      return modeParam === 'drill' ? 'time' : modeParam;
    }
    return 'time';
  });

  const [subOption, setSubOption] = useState(() => {
    const qSub = Number(searchParams.get('sub'));
    if (qSub && [15, 30, 60, 10, 25, 50].includes(qSub)) return qSub;
    return 30;
  });

  const [codeLanguage, setCodeLanguage] = useState(() => {
    const qLang = searchParams.get('lang');
    if (['javascript', 'python', 'mysql'].includes(qLang)) return qLang;
    return 'javascript';
  });

  const [isDrillActive, setIsDrillActive] = useState(modeParam === 'drill');
  const [activeDrillKeys, setActiveDrillKeys] = useState([]);

  // Status Kata & Ketikan Aktif
  const [words, setWords] = useState([]);
  const [codeTokens, setCodeTokens] = useState([]);
  const [activeSnippet, setActiveSnippet] = useState(null);
  const [inputVal, setInputVal] = useState('');
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [wordHistory, setWordHistory] = useState({});

  // Timer & Metrik Real-time
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Statistik Hasil
  const [stats, setStats] = useState({
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    consistency: 100,
    isNewPB: false,
    sessionErrors: {},
    chartData: [],
    characterStats: { correct: 0, incorrect: 0, extra: 0, missed: 0 },
    wordsHistoryData: [],
    replayEvents: [],
    timeElapsedSec: 30
  });

  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  const inputRef = useRef(null);
  const keystrokeHistoryRef = useRef([]);
  const keystrokeTimelineRef = useRef([]);
  const errorTimestampsRef = useRef([]);
  const replayEventsRef = useRef([]);
  const totalKeystrokesRef = useRef(0);
  const correctKeystrokesRef = useRef(0);
  const sessionErrorsRef = useRef({});
  const sessionHitsRef = useRef({});

  // Sinkronisasi Sound Engine
  useEffect(() => {
    soundEngine.setProfile(settings.soundProfile);
    soundEngine.setVolume(settings.soundVolume ?? 0.35);
    soundEngine.setSoundOnError(settings.soundOnError ?? true);
  }, [settings.soundProfile, settings.soundVolume, settings.soundOnError]);

  // Inisialisasi Kata (Deklaratif & Mendukung Pembaruan Langsung Nilai Target)
  const initTestWords = (
    drillKeys = null,
    forcedLang = null,
    targetMode = null,
    targetTextLang = null,
    targetSubOption = null
  ) => {
    sessionErrorsRef.current = {};
    sessionHitsRef.current = {};
    const activeMode = targetMode || mode;
    const langToUse = forcedLang || codeLanguage;
    const currentTextLanguage = targetTextLang || settings.language || 'id';

    // Kalkulasi subOption target secara langsung agar tidak terkena stale closure
    let activeSubOption =
      targetSubOption !== null && targetSubOption !== undefined
        ? targetSubOption
        : subOption;

    if (activeMode === 'time' && ![15, 30, 60].includes(activeSubOption)) {
      activeSubOption = 30;
    } else if (activeMode === 'words' && ![10, 25, 50].includes(activeSubOption)) {
      activeSubOption = 25;
    }

    let newWords = [];
    let newCodeTokens = [];
    let selectedSnippet = null;

    if (drillKeys && drillKeys.length > 0) {
      newWords = generateWeaknessDrill(drillKeys, 30, currentTextLanguage);
      setIsDrillActive(true);
    } else {
      setIsDrillActive(false);

      if (activeMode === 'code') {
        const snippets = CODE_SNIPPETS[langToUse] || CODE_SNIPPETS.javascript;
        selectedSnippet = snippets[Math.floor(Math.random() * snippets.length)];
        newCodeTokens = parseCodeSnippet(selectedSnippet);
        newWords = newCodeTokens.map((t) => t.text);
      } else if (activeMode === 'daily') {
        const quotesPool = currentTextLanguage === 'id' ? INDONESIAN_QUOTES : ENGLISH_QUOTES;
        const quote = quotesPool[Math.floor(Math.random() * quotesPool.length)];
        newWords = quote.split(' ');
      } else if (activeMode === 'words') {
        newWords = getRandomWords(activeSubOption, 'common', currentTextLanguage);
      } else {
        newWords = getRandomWords(60, 'common', currentTextLanguage);
      }
    }

    setWords(newWords);
    setCodeTokens(newCodeTokens);
    setActiveSnippet(selectedSnippet);
    setCurrentWordIdx(0);
    setInputVal('');
    setWordHistory({});
    setTimeLeft(activeMode === 'time' ? activeSubOption : 0);
    setIsActive(false);
    setIsFinished(false);
    if (onTestStatusChange) onTestStatusChange(false);
    keystrokeHistoryRef.current = [];
    keystrokeTimelineRef.current = [];
    errorTimestampsRef.current = [];
    replayEventsRef.current = [];
    totalKeystrokesRef.current = 0;
    correctKeystrokesRef.current = 0;
    sessionErrorsRef.current = {};

    if (timerRef.current) clearInterval(timerRef.current);
    if (inputRef.current) inputRef.current.focus({ preventScroll: true });
  };

  // Muat kata awal & sinkronisasi penuh dengan rute URL (Single Source of Truth)
  useEffect(() => {
    const isDrill = modeParam === 'drill';
    const validModes = ['time', 'words', 'code', 'daily'];
    const resolvedMode = isDrill ? 'time' : (validModes.includes(modeParam) ? modeParam : 'time');

    setMode(resolvedMode);
    setIsDrillActive(isDrill);

    const qSub = Number(searchParams.get('sub'));
    let resolvedSub = 30;
    if (resolvedMode === 'time') {
      resolvedSub = (qSub && [15, 30, 60].includes(qSub)) ? qSub : 30;
    } else if (resolvedMode === 'words') {
      resolvedSub = (qSub && [10, 25, 50].includes(qSub)) ? qSub : 25;
    }
    setSubOption(resolvedSub);

    const qLang = searchParams.get('lang');
    const resolvedCodeLang = (qLang && ['javascript', 'python', 'mysql'].includes(qLang)) ? qLang : 'javascript';
    setCodeLanguage(resolvedCodeLang);

    const currentTypingLang = settings.language || 'id';
    if (isDrill) {
      const qKeys = searchParams.get('keys');
      let targetKeys = [];
      if (qKeys) {
        targetKeys = qKeys.split(',').map((k) => k.trim().toLowerCase()).filter(Boolean);
      }
      if (targetKeys.length === 0) {
        targetKeys = Object.entries(allTimeErrors || {})
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([k]) => k.toLowerCase());
      }
      if (targetKeys.length === 0) {
        targetKeys = ['q', 'z', 'x'];
      }
      setActiveDrillKeys(targetKeys);
      initTestWords(targetKeys, resolvedCodeLang, 'time', currentTypingLang, resolvedSub);
    } else {
      setActiveDrillKeys([]);
      initTestWords(null, resolvedCodeLang, resolvedMode, currentTypingLang, resolvedSub);
    }
  }, [modeParam, searchParams, settings.language]);

  // Interval Waktu
  useEffect(() => {
    if (isActive && mode === 'time' && timeLeft > 0 && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, mode, timeLeft, isFinished]);

  // Selesaikan Tes
  const finishTest = (overrideWordHistory = null) => {
    setIsActive(false);
    setIsFinished(true);
    if (onTestStatusChange) onTestStatusChange(true);
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // noop
    }

    const timeElapsedSec =
      mode === 'time'
        ? subOption - timeLeft || subOption
        : Math.max(1, (Date.now() - (startTimeRef.current || Date.now())) / 1000);

    const timeElapsedMin = timeElapsedSec / 60;
    const finalWpm = Math.round(correctKeystrokesRef.current / 5 / timeElapsedMin) || 0;
    const finalRawWpm = Math.round(totalKeystrokesRef.current / 5 / timeElapsedMin) || 0;
    const finalAcc =
      totalKeystrokesRef.current > 0
        ? Math.round((correctKeystrokesRef.current / totalKeystrokesRef.current) * 100)
        : 100;

    let finalConsistency = 85;
    const intervals = [];
    const history = keystrokeHistoryRef.current;
    for (let i = 1; i < history.length; i++) {
      intervals.push(history[i] - history[i - 1]);
    }
    if (intervals.length > 5) {
      const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / intervals.length;
      const stdDev = Math.sqrt(variance);
      finalConsistency = Math.max(50, Math.min(100, Math.round(100 - stdDev / 10)));
    }

    const isNew = onUpdatePersonalBest(finalWpm);
    onIncrementStreak();
    onUpdateAllTimeErrors(
      sessionErrorsRef.current,
      sessionHitsRef.current,
      isDrillActive ? activeDrillKeys : [],
      finalAcc
    );

    // Timeline Grafik Detik demi Detik
    const totalSecs = Math.max(1, Math.ceil(timeElapsedSec));
    const generatedChartData = [];
    for (let s = 1; s <= totalSecs; s++) {
      const tLimit = s * 1000;
      const correctUpToS = keystrokeTimelineRef.current.filter((k) => k.t <= tLimit && k.isCorrect).length;
      const totalUpToS = keystrokeTimelineRef.current.filter((k) => k.t <= tLimit).length;
      const sMin = s / 60;
      const wpmAtS = Math.round((correctUpToS / 5) / sMin);
      const rawAtS = Math.round((totalUpToS / 5) / sMin);
      const errorsAtS = errorTimestampsRef.current.filter((t) => t > (s - 1) * 1000 && t <= tLimit).length;

      generatedChartData.push({
        second: s,
        wpm: Math.max(0, wpmAtS),
        raw: Math.max(0, rawAtS),
        errors: errorsAtS
      });
    }

    // Statistik Karakter
    const activeHistory = overrideWordHistory || wordHistory;
    let correctCount = 0;
    let incorrectCount = 0;
    let extraCount = 0;
    let missedCount = 0;

    const wordsHistoryList = words.map((targetWord, idx) => {
      const historyItem = activeHistory[idx] || (idx === currentWordIdx ? { typed: inputVal } : null);
      const typed = historyItem ? historyItem.typed || '' : '';
      const isWordMatch = typed === targetWord;

      if (historyItem) {
        const minLen = Math.min(targetWord.length, typed.length);
        for (let c = 0; c < minLen; c++) {
          if (typed[c] === targetWord[c]) correctCount += 1;
          else incorrectCount += 1;
        }
        if (typed.length > targetWord.length) extraCount += typed.length - targetWord.length;
        else if (typed.length < targetWord.length) missedCount += targetWord.length - typed.length;
      } else {
        missedCount += targetWord.length;
      }

      return {
        target: targetWord,
        typed: typed,
        isCorrect: isWordMatch
      };
    });

    setStats({
      wpm: finalWpm,
      rawWpm: finalRawWpm,
      accuracy: finalAcc,
      consistency: finalConsistency,
      isNewPB: isNew,
      sessionErrors: { ...sessionErrorsRef.current },
      chartData: generatedChartData,
      characterStats: {
        correct: correctCount,
        incorrect: incorrectCount,
        extra: extraCount,
        missed: missedCount
      },
      wordsHistoryData: wordsHistoryList,
      timeElapsedSec: timeElapsedSec,
      replayEvents: [...replayEventsRef.current]
    });
  };

  // WPM Real-time
  const liveWpm = useMemo(() => {
    if (!isActive || !startTimeRef.current) return 0;
    const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
    if (elapsedMinutes <= 0) return 0;
    return Math.round(correctKeystrokesRef.current / 5 / elapsedMinutes);
  }, [isActive, currentWordIdx, inputVal]);

  // Ghost Caret PB
  const ghostIndex = useMemo(() => {
    if (!isActive || !personalBest || personalBest <= 0) return 0;
    const elapsedSeconds =
      mode === 'time'
        ? subOption - timeLeft
        : (Date.now() - (startTimeRef.current || Date.now())) / 1000;
    const targetWords = (personalBest / 60) * elapsedSeconds;
    return Math.min(words.length - 1, Math.floor(targetWords));
  }, [isActive, timeLeft, personalBest, words.length, mode, subOption]);

  // Pindah Kata
  const advanceToNextWord = (rawTyped, isEnter = false) => {
    const currentTargetWord = words[currentWordIdx] || '';
    const typedWord = rawTyped.trim();
    if (typedWord.length === 0 && !isEnter) return;

    const isWordCorrect = typedWord === currentTargetWord;
    if (settings.strictMode === 'strict' && !isWordCorrect) {
      soundEngine.playError();
      return;
    }

    const now = Date.now();
    const relTime = now - (startTimeRef.current || now);

    if (isEnter) soundEngine.playEnter();
    else soundEngine.playSpace();

    const nextIdx = currentWordIdx + 1;
    replayEventsRef.current.push({
      t: relTime,
      val: '',
      wordIdx: nextIdx,
      typedWord: typedWord,
      completedIdx: currentWordIdx,
      isAdvance: true,
      type: isEnter ? 'enter' : 'space',
      isError: !isWordCorrect
    });

    const updatedHistory = {
      ...wordHistory,
      [currentWordIdx]: { isCorrect: isWordCorrect, typed: typedWord }
    };
    setWordHistory(updatedHistory);

    if (isWordCorrect) {
      correctKeystrokesRef.current += 1;
      keystrokeTimelineRef.current.push({ t: relTime, isCorrect: true });
    } else {
      for (let i = 0; i < currentTargetWord.length; i++) {
        if (typedWord[i] !== currentTargetWord[i]) {
          const wrongChar = currentTargetWord[i];
          sessionErrorsRef.current[wrongChar] = (sessionErrorsRef.current[wrongChar] || 0) + 1;
        }
      }
      errorTimestampsRef.current.push(relTime);
      keystrokeTimelineRef.current.push({ t: relTime, isCorrect: false });
    }

    if (mode === 'time' && nextIdx >= words.length - 5) {
      const currentTextLanguage = settings.language || 'id';
      const moreWords = getRandomWords(40, 'common', currentTextLanguage);
      setWords((prev) => [...prev, ...moreWords]);
    }

    if (mode !== 'time' && nextIdx >= words.length) {
      finishTest(updatedHistory);
    } else {
      setCurrentWordIdx(nextIdx);
      setInputVal('');
    }
  };

  // Tangani Input Karakter
  const handleInputChange = (e) => {
    if (isFinished) return;
    const val = e.target.value;

    if (!isActive) {
      setIsActive(true);
      startTimeRef.current = Date.now();
    }

    const now = Date.now();
    const relTime = now - (startTimeRef.current || now);
    keystrokeHistoryRef.current.push(now);

    if (val.length < inputVal.length) {
      const deletedIdx = inputVal.length - 1;
      const currentTargetWord = words[currentWordIdx] || '';
      if (deletedIdx < currentTargetWord.length && inputVal[deletedIdx] === currentTargetWord[deletedIdx]) {
        correctKeystrokesRef.current = Math.max(0, correctKeystrokesRef.current - 1);
        const delKey = inputVal[deletedIdx].toLowerCase();
        if (sessionHitsRef.current[delKey]) {
          sessionHitsRef.current[delKey] = Math.max(0, sessionHitsRef.current[delKey] - 1);
        }
      }

      totalKeystrokesRef.current += 1;
      replayEventsRef.current.push({
        t: relTime,
        val: val,
        wordIdx: currentWordIdx,
        type: 'backspace',
        isError: false
      });
      setInputVal(val);
      soundEngine.playKey('Backspace');
      return;
    }

    totalKeystrokesRef.current += 1;
    if (val.endsWith(' ')) {
      advanceToNextWord(val, false);
      return;
    }

    const lastCharTyped = val[val.length - 1];
    const currentTargetWord = words[currentWordIdx] || '';
    const charIndex = val.length - 1;
    let isCharCorrect = false;

    if (charIndex < currentTargetWord.length) {
      if (val[charIndex] === currentTargetWord[charIndex]) {
        correctKeystrokesRef.current += 1;
        isCharCorrect = true;
        soundEngine.playKey(lastCharTyped);
        const hitKey = currentTargetWord[charIndex].toLowerCase();
        if (/^[a-z0-9]$/i.test(hitKey)) {
          sessionHitsRef.current[hitKey] = (sessionHitsRef.current[hitKey] || 0) + 1;
        }
      } else {
        const expected = currentTargetWord[charIndex].toLowerCase();
        if (/^[a-z0-9]$/i.test(expected)) {
          sessionErrorsRef.current[expected] = (sessionErrorsRef.current[expected] || 0) + 1;
        }
        errorTimestampsRef.current.push(relTime);
        soundEngine.playError();
      }
    } else {
      errorTimestampsRef.current.push(relTime);
      soundEngine.playError();
    }

    keystrokeTimelineRef.current.push({ t: relTime, isCorrect: isCharCorrect });
    replayEventsRef.current.push({
      t: relTime,
      val: val,
      wordIdx: currentWordIdx,
      type: 'char',
      isError: !isCharCorrect
    });

    setInputVal(val);

    // Otomatis selesai pada kata/kalimat terakhir tanpa perlu spasi (Monkeytype behavior)
    const isLastWord = mode !== 'time' && currentWordIdx === words.length - 1;
    if (isLastWord) {
      const isWordComplete =
        val === currentTargetWord ||
        (val.length >= currentTargetWord.length && settings.strictMode !== 'strict');

      if (isWordComplete) {
        const isWordCorrect = val === currentTargetWord;
        const updatedHistory = {
          ...wordHistory,
          [currentWordIdx]: { isCorrect: isWordCorrect, typed: val }
        };
        setWordHistory(updatedHistory);

        replayEventsRef.current.push({
          t: relTime,
          val: val,
          wordIdx: currentWordIdx,
          typedWord: val,
          completedIdx: currentWordIdx,
          isAdvance: true,
          type: 'complete',
          isError: !isWordCorrect
        });

        finishTest(updatedHistory);
      }
    }
  };

  // Tangani Backspace untuk kembali ke kata sebelumnya jika input saat ini kosong (Monkeytype style)
  const handleInputKeyDown = (e) => {
    if (isFinished) return;

    if (e.key === 'Backspace') {
      const isWordJump = e.ctrlKey || e.metaKey || e.altKey;

      if (inputVal === '' && currentWordIdx > 0) {
        e.preventDefault();
        const prevIdx = currentWordIdx - 1;
        const prevWord = words[prevIdx] || '';
        const prevHistory = wordHistory[prevIdx];
        const prevTyped = prevHistory ? prevHistory.typed : prevWord;

        // Kurangi bonus spasi antar-kata jika kata sebelumnya tercatat benar
        if (prevHistory && prevHistory.isCorrect) {
          correctKeystrokesRef.current = Math.max(0, correctKeystrokesRef.current - 1);
        }

        // Hapus status kata sebelumnya agar kembali dalam mode aktif pengetikan
        const updatedHistory = { ...wordHistory };
        delete updatedHistory[prevIdx];
        setWordHistory(updatedHistory);

        const restoredVal = isWordJump ? '' : prevTyped;
        setCurrentWordIdx(prevIdx);
        setInputVal(restoredVal);
        soundEngine.playKey('Backspace');

        const now = Date.now();
        const relTime = now - (startTimeRef.current || now);
        totalKeystrokesRef.current += 1;
        replayEventsRef.current.push({
          t: relTime,
          val: restoredVal,
          wordIdx: prevIdx,
          type: 'backspace_word',
          isError: false
        });

        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.selectionStart = restoredVal.length;
            inputRef.current.selectionEnd = restoredVal.length;
          }
        }, 0);
        return;
      }
    }
  };

  // Keyboard Shortcuts di Typing Arena
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        initTestWords();
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate('/');
        return;
      }
      if (e.key === 'Enter' && !isFinished && mode === 'code') {
        e.preventDefault();
        advanceToNextWord(inputVal, true);
        return;
      }

      // Pastikan input tersembunyi tetap terfokus saat pengguna mengetik di arena
      if (!isFinished && inputRef.current && document.activeElement !== inputRef.current) {
        if (!['BUTTON', 'SELECT', 'INPUT'].includes(e.target.tagName)) {
          inputRef.current.focus({ preventScroll: true });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputVal, currentWordIdx, isFinished, mode]);

  const handleModeChange = (newMode) => {
    const defaultSub = newMode === 'time' ? 30 : newMode === 'words' ? 25 : null;
    const search = defaultSub ? `?sub=${defaultSub}` : '';
    navigate(`/type/${newMode}${search}`);
  };

  const handleSubOptionChange = (newVal) => {
    setSubOption(newVal);
    setSearchParams({ sub: newVal });
  };

  const handleCodeLanguageChange = (lang) => {
    setCodeLanguage(lang);
    setSearchParams({ lang });
  };

  const handleClearDrill = () => {
    navigate('/type/time?sub=30');
  };

  const handleStartWeaknessDrill = (targetKeys = []) => {
    let keysParam = '';
    if (Array.isArray(targetKeys) && targetKeys.length > 0) {
      keysParam = `?keys=${targetKeys.join(',').toLowerCase()}`;
    } else if (activeDrillKeys.length > 0) {
      keysParam = `?keys=${activeDrillKeys.join(',').toLowerCase()}`;
    }
    navigate(`/type/drill${keysParam}`);
  };

  const testTypeInfo = useMemo(() => {
    let modeText = 'time 30s';
    if (isDrillActive) {
      const keysSuffix = activeDrillKeys.length > 0 ? ` (${activeDrillKeys.map(k => k.toUpperCase()).join(', ')})` : '';
      modeText = locale === 'id' ? `latihan tombol lemah${keysSuffix}` : `weak key drill${keysSuffix}`;
    }
    else if (mode === 'time') modeText = `time ${subOption}s`;
    else if (mode === 'words') modeText = `words ${subOption}`;
    else if (mode === 'code') modeText = `code (${codeLanguage})`;
    else if (mode === 'daily') modeText = 'daily quote';

    return {
      mode: modeText,
      language: (settings.language || 'id') === 'id' ? (locale === 'id' ? 'indonesia' : 'indonesian') : 'english',
      strictness: settings.strictMode === 'strict'
        ? (locale === 'id' ? 'ketat' : 'strict')
        : (locale === 'id' ? 'standar' : 'standard'),
      isDrill: isDrillActive,
      drillKeys: activeDrillKeys
    };
  }, [mode, isDrillActive, activeDrillKeys, subOption, codeLanguage, locale, settings.strictMode, settings.language]);

  return (
    <div
      className={`w-full flex-1 flex flex-col transition-all duration-300 ${
        isFinished ? 'justify-start py-4' : 'justify-center py-2'
      }`}
      onClick={() => {
        if (!isFinished) {
          inputRef.current?.focus({ preventScroll: true });
        }
      }}
    >
      {/* Input tersembunyi untuk penangkapan ketukan 0ms */}
      <input
        ref={inputRef}
        type="text"
        value={inputVal}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        className="opacity-0 fixed top-0 left-0 -z-50 pointer-events-none"
        autoFocus={!isFinished}
        tabIndex={isFinished ? -1 : 0}
      />

      {!isFinished && (
        <div className="mb-4">
          <ModeSelector
            mode={mode}
            onModeChange={handleModeChange}
            subOption={subOption}
            onSubOptionChange={handleSubOptionChange}
            codeLanguage={codeLanguage}
            onCodeLanguageChange={handleCodeLanguageChange}
            language={settings.language || 'id'}
            onLanguageChange={(newLang) => {
              onUpdateSettings({ ...settings, language: newLang });
              initTestWords(null, null, mode, newLang, subOption);
            }}
            isDrillActive={isDrillActive}
            drillKeys={activeDrillKeys}
            onClearDrill={handleClearDrill}
            theme={theme}
          />
        </div>
      )}

      {!isFinished ? (
        mode === 'code' && activeSnippet ? (
          <IdeCodeCanvas
            snippet={activeSnippet}
            tokenList={codeTokens}
            currentWordIdx={currentWordIdx}
            inputVal={inputVal}
            wordHistory={wordHistory}
            activeLanguage={codeLanguage}
            onSelectLanguage={(lang) => {
              setCodeLanguage(lang);
              initTestWords(null, lang);
            }}
            showGhostCaret={settings.showGhostCaret}
            ghostIndex={ghostIndex}
            isActive={isActive}
            liveWpm={liveWpm}
            caretStyle={settings.caretStyle}
            isCapsLock={isCapsLock}
            theme={theme}
          />
        ) : (
          <TypingCanvas
            words={words}
            currentWordIdx={currentWordIdx}
            inputVal={inputVal}
            wordHistory={wordHistory}
            ghostIndex={ghostIndex}
            showGhostCaret={settings.showGhostCaret}
            timeLeft={timeLeft}
            liveWpm={liveWpm}
            isActive={isActive}
            mode={mode}
            zenMode={settings.zenMode}
            caretStyle={settings.caretStyle}
            fontSize={settings.fontSize}
            isCapsLock={isCapsLock}
            theme={theme}
          />
        )
      ) : (
        <ResultModal
          wpm={stats.wpm}
          accuracy={stats.accuracy}
          consistency={stats.consistency}
          rawWpm={stats.rawWpm}
          isNewPB={stats.isNewPB}
          personalBest={personalBest}
          weakKeys={stats.sessionErrors}
          allTimeErrors={allTimeErrors}
          theme={theme}
          testTypeInfo={testTypeInfo}
          characterStats={stats.characterStats}
          chartData={stats.chartData}
          wordsHistoryData={stats.wordsHistoryData}
          replayEvents={stats.replayEvents}
          words={words}
          timeElapsedSec={stats.timeElapsedSec}
          onRestart={() => {
            const currentTypingLang = settings.language || 'id';
            if (isDrillActive) {
              const keysToUse = activeDrillKeys.length > 0
                ? activeDrillKeys
                : Object.entries(allTimeErrors || {}).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k.toLowerCase());
              initTestWords(keysToUse.length > 0 ? keysToUse : ['q', 'z', 'x'], codeLanguage, 'time', currentTypingLang, subOption);
            } else {
              initTestWords(null, codeLanguage, mode, currentTypingLang, subOption);
            }
          }}
          onStartWeaknessDrill={handleStartWeaknessDrill}
        />
      )}
    </div>
  );
}

TypingPage.propTypes = {
  settings: PropTypes.object.isRequired,
  onUpdateSettings: PropTypes.func.isRequired,
  personalBest: PropTypes.number,
  onUpdatePersonalBest: PropTypes.func.isRequired,
  allTimeErrors: PropTypes.object,
  onUpdateAllTimeErrors: PropTypes.func.isRequired,
  onIncrementStreak: PropTypes.func.isRequired,
  isCapsLock: PropTypes.bool,
  onTestStatusChange: PropTypes.func
};
