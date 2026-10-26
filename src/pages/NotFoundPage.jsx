import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLocale } from '../contexts/LocaleContext';

export default function NotFoundPage() {
  const { themeObj } = useTheme();
  const { t } = useLocale();

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 select-none font-mono">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border"
        style={{
          backgroundColor: `${themeObj.secondary}15`,
          borderColor: `${themeObj.secondary}40`,
          color: themeObj.secondary
        }}
      >
        <AlertTriangle size={32} />
      </div>

      <h1 className="text-4xl font-extrabold text-zinc-100 mb-2">{t.notFoundTitle}</h1>
      <p className="text-sm text-zinc-400 mb-6 max-w-sm">
        {t.notFoundDesc}
      </p>

      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs text-zinc-950 shadow-md transition-all active:scale-95"
        style={{ backgroundColor: themeObj.primary }}
      >
        <RotateCcw size={14} />
        <span>{t.backHomeBtn}</span>
      </Link>
    </div>
  );
}
