import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  TrendingUp,
  Target,
  Trophy,
  History,
  Trash2,
  Calendar,
  X,
  Sparkles
} from 'lucide-react';
import { getTheme } from '../utils/themeConfig';
import { useLocale } from '../contexts/LocaleContext';

// Fungsi kurva spline halus SVG
function getSvgSpline(points, tension = 0.3) {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension * 3;
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension * 3;
    const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension * 3;
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension * 3;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export default function ProgressHistoryChart({
  isOpen = true,
  onClose = null,
  historyData = [],
  onClearHistory = null,
  theme = 'oled',
  isEmbedded = false
}) {
  const { t } = useLocale();
  const themeObj = getTheme(theme);
  const [filterCount, setFilterCount] = useState(25);
  const [hoverIndex, setHoverIndex] = useState(null);
  const svgRef = useRef(null);

  if (!isOpen && !isEmbedded) return null;

  // Urutkan riwayat dari yang paling lama ke yang terbaru untuk grafik tren progresif
  const chronological = [...historyData].reverse();
  const displayedData =
    filterCount === 'all'
      ? chronological
      : chronological.slice(-Number(filterCount));

  // Kalkulasi KPI Agregat
  const totalTests = historyData.length;
  const avgWpm =
    totalTests > 0
      ? Math.round(historyData.reduce((acc, item) => acc + (item.wpm || 0), 0) / totalTests)
      : 0;
  const avgAcc =
    totalTests > 0
      ? Math.round(historyData.reduce((acc, item) => acc + (item.accuracy || 0), 0) / totalTests)
      : 0;
  const peakWpm =
    totalTests > 0
      ? Math.max(...historyData.map((item) => item.wpm || 0))
      : 0;

  // Dimensi SVG
  const width = 740;
  const height = 240;
  const padLeft = 45;
  const padRight = 30;
  const padTop = 25;
  const padBottom = 35;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const maxVal = Math.max(
    ...displayedData.map((d) => Math.max(d.wpm || 0, d.rawWpm || 0)),
    60
  );
  const yMax = Math.ceil(maxVal / 20) * 20;

  const getX = (idx) => {
    if (displayedData.length <= 1) return padLeft + plotW / 2;
    return padLeft + (idx / (displayedData.length - 1)) * plotW;
  };

  const getY = (val) => {
    const clamped = Math.max(0, Math.min(yMax, val || 0));
    return padTop + plotH - (clamped / yMax) * plotH;
  };

  const wpmPoints = displayedData.map((d, i) => ({ x: getX(i), y: getY(d.wpm) }));
  const rawPoints = displayedData.map((d, i) => ({ x: getX(i), y: getY(d.rawWpm) }));

  const wpmPath = getSvgSpline(wpmPoints);
  const rawPath = getSvgSpline(rawPoints);

  const yTicks = [0, Math.round(yMax / 3), Math.round((yMax * 2) / 3), yMax];

  const handleMouseMove = (e) => {
    if (!svgRef.current || displayedData.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const normX = (clientX / rect.width) * width;

    let closestIdx = 0;
    let minDist = Infinity;
    displayedData.forEach((_, idx) => {
      const ptX = getX(idx);
      const dist = Math.abs(normX - ptX);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = idx;
      }
    });

    setHoverIndex(closestIdx);
  };

  const hoveredItem = hoverIndex !== null ? displayedData[hoverIndex] : null;

  const content = (
    <div className="space-y-6">
      {/* 1. KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center space-x-1.5 text-zinc-500 text-[11px]">
            <History size={12} />
            <span>{t.historyTotalTests}</span>
          </div>
          <div className="text-2xl font-black text-zinc-100 font-mono">
            {totalTests}
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center space-x-1.5 text-zinc-500 text-[11px]">
            <TrendingUp size={12} style={{ color: themeObj.primary }} />
            <span>{t.historyAvgWpm}</span>
          </div>
          <div className="text-2xl font-black font-mono" style={{ color: themeObj.primary }}>
            {avgWpm} <span className="text-xs font-normal text-zinc-500">wpm</span>
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center space-x-1.5 text-zinc-500 text-[11px]">
            <Target size={12} style={{ color: themeObj.secondary }} />
            <span>{t.historyAvgAcc}</span>
          </div>
          <div className="text-2xl font-black text-zinc-100 font-mono">
            {avgAcc}%
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center space-x-1.5 text-zinc-500 text-[11px]">
            <Trophy size={12} className="text-amber-400" />
            <span>{t.historyBestWpm}</span>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {peakWpm} <span className="text-xs font-normal text-zinc-500">wpm</span>
          </div>
        </div>
      </div>

      {/* 2. Grafik SVG Interaktif */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 space-y-3 relative">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1 text-zinc-300 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: themeObj.primary }} />
              <span>WPM Net</span>
            </span>
            <span className="flex items-center space-x-1 text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-zinc-600" />
              <span>Raw</span>
            </span>
          </div>

          <div className="flex items-center space-x-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 text-[11px]">
            {[10, 25, 50, 'all'].map((cnt) => (
              <button
                type="button"
                key={cnt}
                onClick={() => setFilterCount(cnt)}
                className={`px-2 py-0.5 rounded-lg transition-colors ${
                  filterCount === cnt ? 'font-bold bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                style={filterCount === cnt ? { color: themeObj.primary } : {}}
              >
                {cnt === 'all' ? 'Semua' : cnt}
              </button>
            ))}
          </div>
        </div>

        {displayedData.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center space-y-2 text-zinc-500 font-sans p-6">
            <Sparkles size={24} style={{ color: themeObj.primary }} className="opacity-40 animate-pulse" />
            <p className="text-xs max-w-sm">{t.historyEmpty}</p>
          </div>
        ) : (
          <div className="relative">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto overflow-visible cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {/* Garis Grid Horizontal */}
              {yTicks.map((val) => {
                const yPos = getY(val);
                return (
                  <g key={val}>
                    <line
                      x1={padLeft}
                      y1={yPos}
                      x2={width - padRight}
                      y2={yPos}
                      stroke="currentColor"
                      className="text-zinc-800/80"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={padLeft - 8}
                      y={yPos + 3.5}
                      textAnchor="end"
                      fill="currentColor"
                      className="text-zinc-600 text-[10px] font-mono"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Kurva Raw WPM */}
              <path
                d={rawPath}
                fill="none"
                stroke="currentColor"
                className="text-zinc-600/70"
                strokeWidth={1.8}
                strokeDasharray="4 4"
              />

              {/* Kurva Utama WPM */}
              <path
                d={wpmPath}
                fill="none"
                stroke={themeObj.primary}
                strokeWidth={2.5}
                strokeLinecap="round"
              />

              {/* Titik-Titik Sesi */}
              {displayedData.map((d, i) => {
                const pt = wpmPoints[i];
                const isHovered = hoverIndex === i;
                return (
                  <circle
                    key={d.id || i}
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 5.5 : 3}
                    fill={isHovered ? '#ffffff' : themeObj.primary}
                    stroke={themeObj.bgHex}
                    strokeWidth={2}
                    className="transition-all duration-150"
                  />
                );
              })}

              {/* Garis Vertikal Penunjuk Hover */}
              {hoverIndex !== null && wpmPoints[hoverIndex] && (
                <line
                  x1={wpmPoints[hoverIndex].x}
                  y1={padTop}
                  x2={wpmPoints[hoverIndex].x}
                  y2={padTop + plotH}
                  stroke={themeObj.primary}
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  className="opacity-70"
                />
              )}
            </svg>

            {/* Tooltip Hover Dinamis */}
            {hoveredItem && hoverIndex !== null && wpmPoints[hoverIndex] && (
              <div
                className="absolute pointer-events-none bg-zinc-950/95 border border-zinc-700 rounded-xl p-2.5 shadow-2xl text-[11px] font-mono z-20 space-y-1 backdrop-blur-md"
                style={{
                  left: `${(wpmPoints[hoverIndex].x / width) * 100}%`,
                  top: '10px',
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="font-bold flex items-center justify-between space-x-3 text-zinc-200">
                  <span>Sesi #{hoverIndex + 1}</span>
                  <span className="text-[10px] text-zinc-500 font-sans">
                    {new Date(hoveredItem.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span style={{ color: themeObj.primary }} className="font-bold">
                    {hoveredItem.wpm} wpm
                  </span>
                  <span className="text-zinc-500">raw: {hoveredItem.rawWpm}</span>
                  <span className="text-zinc-300">acc: {hoveredItem.accuracy}%</span>
                </div>
                <div className="text-[10px] text-zinc-500">
                  mode: {hoveredItem.mode} {hoveredItem.subOption ? `(${hoveredItem.subOption})` : ''}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Aksi */}
        {totalTests > 0 && onClearHistory && (
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[11px]">
            <span className="text-zinc-500 font-sans">
              Menampilkan {displayedData.length} dari {totalTests} rekaman sesi
            </span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(t.historyConfirmClear)) {
                  onClearHistory();
                }
              }}
              className="flex items-center space-x-1 text-zinc-500 hover:text-red-400 transition-colors"
            >
              <Trash2 size={12} />
              <span>{t.historyClear}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 bg-zinc-900/40 shrink-0">
          <div className="flex items-center space-x-2 text-zinc-100 font-bold text-sm">
            <TrendingUp size={16} style={{ color: themeObj.primary }} />
            <span>{t.historyTitle}</span>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Konten Scrollable */}
        <div className="p-5 overflow-y-auto">{content}</div>
      </div>
    </div>
  );
}

ProgressHistoryChart.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  historyData: PropTypes.arrayOf(PropTypes.object),
  onClearHistory: PropTypes.func,
  theme: PropTypes.string,
  isEmbedded: PropTypes.bool
};
