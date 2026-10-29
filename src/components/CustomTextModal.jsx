import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, FileText, Shuffle, Check, Sparkles } from 'lucide-react';
import { getTheme } from '../utils/themeConfig';
import { useLocale } from '../contexts/LocaleContext';
import { getCustomText, saveCustomText } from '../utils/storage';

const PRESETS = {
  id: [
    {
      label: 'Pangram Indonesia',
      text: 'Muh faiz ghaisan zacky berniat pergi ke jawa timur melewati bukit indah untuk melihat parade vokalis jazz condet yang super ekspresif.'
    },
    {
      label: 'Kosa Kata Teknologi',
      text: 'Algoritma kecerdasan buatan komputasi awan enkripsi data arsitektur mikroservis basis data terdistribusi protokol jaringan pengembangan perangkat lunak.'
    },
    {
      label: 'Refleksi Mengetik',
      text: 'Ketepatan jemari menari di atas tuts tuts mekanik bukan sekadar kecepatan angka melainkan keindahan ritme yang harmonis dan konsisten.'
    }
  ],
  en: [
    {
      label: 'Classic Pangram',
      text: 'The quick brown fox jumps over the lazy dog while Sphinx of black quartz judges my vow with pack my box with five dozen liquor jugs.'
    },
    {
      label: 'Tech Terminology',
      text: 'Artificial intelligence cloud computing distributed database microservices architecture asynchronous execution reactive state management.'
    },
    {
      label: 'Flow & Focus',
      text: 'Simplicity is prerequisite for reliability. Flow follows precision and consistency is the playground of deliberate mastery.'
    }
  ]
};

export default function CustomTextModal({
  isOpen,
  onClose,
  onApplyCustomText,
  theme = 'oled'
}) {
  const { locale, t } = useLocale();
  const themeObj = getTheme(theme);

  const [text, setText] = useState('');
  const [shuffle, setShuffle] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getCustomText();
      setText(stored.text || '');
      setShuffle(!!stored.shuffle);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const wordsCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;

  const handleSaveAndApply = (e) => {
    e.preventDefault();
    const cleanText = text.trim() || 'Keebflow custom typing practice';
    saveCustomText(cleanText, shuffle);
    if (onApplyCustomText) {
      onApplyCustomText(cleanText, shuffle);
    }
    onClose();
  };

  const handleSelectPreset = (presetText) => {
    setText(presetText);
  };

  const currentPresets = locale === 'id' ? PRESETS.id : PRESETS.en;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center space-x-2 text-zinc-100 font-bold text-sm">
            <FileText size={16} style={{ color: themeObj.primary }} />
            <span>{t.customModalTitle}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Konten Modal */}
        <form onSubmit={handleSaveAndApply} className="p-5 space-y-4">
          <p className="text-zinc-400 font-sans text-xs leading-relaxed">
            {t.customModalDesc}
          </p>

          {/* Preset Cepat */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-zinc-400 flex items-center space-x-1">
              <Sparkles size={11} style={{ color: themeObj.primary }} />
              <span>{t.customModalPreset}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentPresets.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => handleSelectPreset(preset.text)}
                  className="px-2.5 py-1 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all text-[11px]"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Area Teks Kustom */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <label htmlFor="custom-typing-text" className="font-semibold">
                Teks Input:
              </label>
              <span className="text-zinc-500">
                {wordsCount} {t.customWordCount}
              </span>
            </div>
            <textarea
              id="custom-typing-text"
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.customModalPlaceholder}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 text-zinc-200 font-mono text-xs focus:outline-none focus:border-zinc-600 transition-colors resize-none"
            />
          </div>

          {/* Opsi Acak Kata */}
          <div className="flex items-center justify-between bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-3">
            <div className="flex items-center space-x-2 text-zinc-300">
              <Shuffle size={14} style={{ color: themeObj.primary }} />
              <span>{t.customModalShuffle}</span>
            </div>
            <button
              type="button"
              onClick={() => setShuffle(!shuffle)}
              className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-200 ${
                shuffle ? 'justify-end' : 'justify-start bg-zinc-800'
              }`}
              style={shuffle ? { backgroundColor: themeObj.primary } : {}}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Tombol Simpan & Terapkan */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-zinc-800/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl font-bold flex items-center space-x-1.5 transition-all shadow-md active:scale-95"
              style={{
                backgroundColor: themeObj.primary,
                color: themeObj.bgHex
              }}
            >
              <Check size={14} />
              <span>{t.customModalSave}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

CustomTextModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApplyCustomText: PropTypes.func,
  theme: PropTypes.string
};
