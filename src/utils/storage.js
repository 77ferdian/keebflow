// Local-First Storage & Analytics Engine

const STORAGE_KEYS = {
  PB: 'keebflow_pb',
  STREAK: 'keebflow_streak',
  STATS_HISTORY: 'keebflow_history',
  KEY_ANALYTICS: 'keebflow_keys',
  SETTINGS: 'keebflow_settings',
  CUSTOM_TEXT: 'keebflow_custom_text',
};

export const defaultSettings = {
  theme: 'oled', // 'oled' | 'amber' | 'emerald' | 'slate'
  soundProfile: 'thock',
  soundVolume: 0.35,
  soundOnError: true,
  pacerWpm: 80,
  showGhostCaret: true,
  language: 'id', // 'id' (Bahasa Indonesia) | 'en' (English)
  caretStyle: 'line', // 'line' | 'block' | 'underline'
  strictMode: 'free', // 'free' | 'strict' (strict stops on error)
  zenMode: false, // hide timer & live stats while typing
  fontSize: 'normal', // 'normal' | 'large'
  capsLockWarning: true,
};

export function getSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function getPersonalBest() {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.PB);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export function savePersonalBest(wpm) {
  try {
    const current = getPersonalBest();
    if (wpm > current) {
      localStorage.setItem(STORAGE_KEYS.PB, wpm.toString());
      return true;
    }
  } catch (e) {
    console.error('Failed to save PB', e);
  }
  return false;
}

export function getStreak() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STREAK);
    if (!raw) return { count: 1, lastDate: new Date().toISOString().split('T')[0] };
    return JSON.parse(raw);
  } catch {
    return { count: 1, lastDate: new Date().toISOString().split('T')[0] };
  }
}

export function updateStreak() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const streak = getStreak();
    
    if (streak.lastDate === today) {
      return streak.count;
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let newCount = 1;
    if (streak.lastDate === yesterday) {
      newCount = streak.count + 1;
    }

    const updated = { count: newCount, lastDate: today };
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(updated));
    return newCount;
  } catch {
    return 1;
  }
}

export function getKeyAnalytics() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.KEY_ANALYTICS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Pembaruan Adaptif Analisis Tombol Lemah (Adaptive Mastery & Decay Engine)
 * - Menambah error baru jika terjadi kesalahan
 * - Memulihkan/menyembuhkan (healing) tombol yang berhasil diketik akurat dalam sesi
 * - Memberi bonus pemulihan besar jika menyelesaikan Weakness Drill dengan akurasi tinggi
 * - Menghapus tombol yang skor errornya telah mencapai 0 sehingga daftar tombol lemah selalu dinamis
 */
export function updateKeyAnalytics(sessionErrors = {}, sessionHits = {}, drilledKeys = [], sessionAccuracy = 100) {
  try {
    const current = getKeyAnalytics();

    // 1. Tambah error baru dari sesi pengetikan ini
    for (const [key, count] of Object.entries(sessionErrors || {})) {
      const lower = key.toLowerCase();
      if (/^[a-z0-9]$/i.test(lower)) {
        current[lower] = (current[lower] || 0) + count;
      }
    }

    // 2. Pemulihan adaptif (Adaptive Healing):
    // Jika tombol yang sebelumnya bermasalah diketik dengan benar dalam sesi ini
    for (const [key, hits] of Object.entries(sessionHits || {})) {
      const lower = key.toLowerCase();
      if (current[lower] !== undefined) {
        const errorCount = (sessionErrors && sessionErrors[lower]) || 0;
        if (errorCount === 0 && hits >= 2) {
          // Tombol diketik bersih tanpa salah: sembuhkan 1 poin per 2 ketukan benar
          const healAmount = Math.max(1, Math.floor(hits / 2));
          current[lower] = Math.max(0, current[lower] - healAmount);
        } else if (hits > errorCount * 2) {
          // Rasio benar jauh melampaui salah
          current[lower] = Math.max(0, current[lower] - 1);
        }
      }
    }

    // 3. Bonus khusus klinik latihan tombol lemah (Weakness Drill Mastery Bonus)
    // Jika pengguna menyelesaikan drill tombol lemah dengan akurasi memuaskan (>= 85%)
    if (drilledKeys && drilledKeys.length > 0 && sessionAccuracy >= 85) {
      drilledKeys.forEach((key) => {
        const lower = key.toLowerCase();
        if (current[lower] !== undefined) {
          const errorsInSession = (sessionErrors && sessionErrors[lower]) || 0;
          if (errorsInSession === 0) {
            // Bersih sempurna pada target drill: kurangi beban error secara drastis (-4)
            current[lower] = Math.max(0, current[lower] - 4);
          } else if (errorsInSession <= 2) {
            current[lower] = Math.max(0, current[lower] - 2);
          }
        }
      });
    }

    // 4. Hapus tombol yang skor errornya telah sembuh menjadi 0 (Jemari Bersih)
    for (const [key, val] of Object.entries(current)) {
      if (val <= 0) {
        delete current[key];
      }
    }

    localStorage.setItem(STORAGE_KEYS.KEY_ANALYTICS, JSON.stringify(current));
    return current;
  } catch (e) {
    console.error('Failed to update key analytics', e);
    return getKeyAnalytics();
  }
}

export function recordKeyErrors(errorsMap, hitsMap = {}, drilledKeys = [], sessionAccuracy = 100) {
  return updateKeyAnalytics(errorsMap, hitsMap, drilledKeys, sessionAccuracy);
}

export function clearKeyAnalytics() {
  try {
    localStorage.removeItem(STORAGE_KEYS.KEY_ANALYTICS);
    return {};
  } catch {
    return {};
  }
}

/**
 * Pengelolaan Riwayat Tes & Perkembangan Historis (Progress History)
 */
export function getStatsHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS_HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTestResult(testResult) {
  try {
    const history = getStatsHistory();
    const newEntry = {
      id: Date.now(),
      timestamp: Date.now(),
      date: new Date().toISOString(),
      wpm: testResult.wpm || 0,
      rawWpm: testResult.rawWpm || 0,
      accuracy: testResult.accuracy || 100,
      consistency: testResult.consistency || 85,
      mode: testResult.mode || 'time',
      subOption: testResult.subOption || 30,
      language: testResult.language || 'id',
      isNewPB: !!testResult.isNewPB
    };
    // Simpan hingga 100 catatan tes terakhir
    const updated = [newEntry, ...history].slice(0, 100);
    localStorage.setItem(STORAGE_KEYS.STATS_HISTORY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save test result', e);
    return getStatsHistory();
  }
}

export function clearStatsHistory() {
  try {
    localStorage.removeItem(STORAGE_KEYS.STATS_HISTORY);
    return [];
  } catch {
    return [];
  }
}

/**
 * Pengelolaan Teks Kustom Pengguna (Custom Word List / Custom Text)
 */
export const DEFAULT_CUSTOM_TEXT =
  "Keebflow dirancang untuk memberikan kenyamanan dan ketepatan ritme pengetikan setiap hari.";

export function getCustomText() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_TEXT);
    if (!raw) {
      return {
        text: DEFAULT_CUSTOM_TEXT,
        shuffle: false
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      text: DEFAULT_CUSTOM_TEXT,
      shuffle: false
    };
  }
}

export function saveCustomText(text, shuffle = false) {
  try {
    const payload = {
      text: text && text.trim() ? text.trim() : DEFAULT_CUSTOM_TEXT,
      shuffle: !!shuffle
    };
    localStorage.setItem(STORAGE_KEYS.CUSTOM_TEXT, JSON.stringify(payload));
    return payload;
  } catch (e) {
    console.error('Failed to save custom text', e);
    return { text, shuffle };
  }
}
