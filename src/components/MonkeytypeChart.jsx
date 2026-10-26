import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { getTheme } from '../utils/themeConfig';

// Fungsi kalkulasi Cardinal Spline ke Bezier untuk kurva halus Monkeytype
function getSvgSpline(points, tension = 0.35) {
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

export default function MonkeytypeChart({ data = [], theme = 'oled' }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const svgRef = useRef(null);
  const themeObj = getTheme(theme);

  // Jika data belum cukup, buat placeholder minimal 2 detik
  const chartData = data.length > 0 ? data : [
    { second: 1, wpm: 0, raw: 0, errors: 0 },
    { second: 2, wpm: 0, raw: 0, errors: 0 }
  ];

  // Dimensi SVG
  const width = 760;
  const height = 220;
  const padLeft = 45;
  const padRight = 45;
  const padTop = 25;
  const padBottom = 35;

  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  // Skala Maksimum WPM (kelipatan 50 atau minimal 100)
  const maxWpmValue = Math.max(...chartData.map(d => Math.max(d.wpm || 0, d.raw || 0)), 60);
  const yWpmMax = Math.ceil(maxWpmValue / 50) * 50;

  // Skala Maksimum Error (kelipatan 5 atau minimal 5)
  const maxErrorsValue = Math.max(...chartData.map(d => d.errors || 0), 1);
  const yErrorMax = Math.max(5, Math.ceil(maxErrorsValue / 5) * 5);

  const totalPoints = chartData.length;

  // Konversi koordinat
  const getX = (idx) => {
    if (totalPoints <= 1) return padLeft + plotW / 2;
    return padLeft + (idx / (totalPoints - 1)) * plotW;
  };

  const getYWpm = (val) => {
    const clamped = Math.max(0, Math.min(yWpmMax, val));
    return padTop + plotH - (clamped / yWpmMax) * plotH;
  };

  const getYError = (val) => {
    const clamped = Math.max(0, Math.min(yErrorMax, val));
    return padTop + plotH - (clamped / yErrorMax) * plotH;
  };

  // Titik koordinat kurva
  const wpmPoints = chartData.map((d, i) => ({ x: getX(i), y: getYWpm(d.wpm) }));
  const rawPoints = chartData.map((d, i) => ({ x: getX(i), y: getYWpm(d.raw) }));

  const wpmPath = getSvgSpline(wpmPoints);
  const rawPath = getSvgSpline(rawPoints);

  // Titik error
  const errorPoints = chartData
    .map((d, i) => ({ ...d, x: getX(i), y: getYError(d.errors), index: i }))
    .filter(d => d.errors > 0);

  // Ticks Sumbu Y Kiri (WPM)
  const wpmTicks = [0, Math.round(yWpmMax / 3), Math.round((yWpmMax * 2) / 3), yWpmMax];

  // Ticks Sumbu Y Kanan (Errors)
  const errorTicks = [0, Math.round(yErrorMax / 2), yErrorMax];

  // Interaksi Mouse Hover
  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const normalizedX = (clientX / rect.width) * width;

    if (normalizedX < padLeft || normalizedX > width - padRight) {
      setHoverIndex(null);
      return;
    }

    const ratio = (normalizedX - padLeft) / plotW;
    const closestIdx = Math.round(ratio * (totalPoints - 1));
    if (closestIdx >= 0 && closestIdx < totalPoints) {
      setHoverIndex(closestIdx);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const activeData = hoverIndex !== null ? chartData[hoverIndex] : null;
  const activeX = hoverIndex !== null ? getX(hoverIndex) : null;

  return (
    <div className="relative w-full bg-zinc-950/40 border border-zinc-800/70 rounded-xl p-3 sm:p-4 select-none backdrop-blur-md">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-44 sm:h-52 overflow-visible cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          {/* Efek Glow Garis */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Garis Grid Horizontal */}
        {wpmTicks.map((tick, i) => {
          const y = getYWpm(tick);
          return (
            <g key={i}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="#27272a"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {/* Label Sumbu Kiri (WPM) */}
              <text
                x={padLeft - 8}
                y={y + 3.5}
                textAnchor="end"
                className="text-[10px] fill-zinc-500 font-mono font-medium"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Label Sumbu Kanan (Errors - Mengikuti Tema) */}
        {errorTicks.map((tick, i) => {
          const y = getYError(tick);
          return (
            <text
              key={i}
              x={width - padRight + 8}
              y={y + 3.5}
              textAnchor="start"
              className="text-[10px] font-mono font-medium"
              style={{ fill: themeObj.chartError, opacity: 0.85 }}
            >
              {tick}
            </text>
          );
        })}

        {/* Label Sumbu Vertikal (Judul Sumbu) */}
        <text
          x={padLeft - 22}
          y={padTop + plotH / 2}
          textAnchor="middle"
          transform={`rotate(-90 ${padLeft - 22} ${padTop + plotH / 2})`}
          className="text-[9px] fill-zinc-500 font-mono uppercase tracking-widest font-semibold"
        >
          Words per Minute
        </text>

        <text
          x={width - padRight + 26}
          y={padTop + plotH / 2}
          textAnchor="middle"
          transform={`rotate(90 ${width - padRight + 26} ${padTop + plotH / 2})`}
          className="text-[9px] font-mono uppercase tracking-widest font-semibold"
          style={{ fill: themeObj.chartError, opacity: 0.9 }}
        >
          Errors
        </text>

        {/* Label Sumbu X (Detik) */}
        {chartData.map((d, i) => {
          // Tampilkan setiap kelipatan detik tertentu agar tidak terlalu rapat
          const step = Math.max(1, Math.floor(totalPoints / 12));
          if (i === 0 || i === totalPoints - 1 || i % step === 0) {
            return (
              <text
                key={i}
                x={getX(i)}
                y={height - 10}
                textAnchor="middle"
                className="text-[10px] fill-zinc-500 font-mono"
              >
                {d.second}
              </text>
            );
          }
          return null;
        })}

        {/* 1. Kurva Raw WPM (Garis Putus-putus Sesuai Tema) */}
        <path
          d={rawPath}
          fill="none"
          stroke={themeObj.chartRaw}
          strokeWidth="1.8"
          strokeDasharray="4 4"
          strokeOpacity="0.85"
        />

        {/* 2. Kurva Net WPM (Sesuai Warna Tema Aktif) */}
        <path
          d={wpmPath}
          fill="none"
          stroke={themeObj.chartLine}
          strokeWidth="2.5"
          filter="url(#glow)"
        />

        {/* Titik-titik Net WPM */}
        {wpmPoints.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={hoverIndex === i ? 4 : 2}
            className={`${hoverIndex === i ? 'stroke-zinc-950 stroke-2' : ''} transition-all`}
            style={{ fill: hoverIndex === i ? themeObj.primary : '#d4d4d8' }}
          />
        ))}

        {/* 3. Penanda Kesalahan / Error (Simbol ✕ Sesuai Aksen Tema) */}
        {errorPoints.map((ep, i) => {
          const sz = 3.5;
          return (
            <g key={i}>
              <line
                x1={ep.x - sz}
                y1={ep.y - sz}
                x2={ep.x + sz}
                y2={ep.y + sz}
                stroke={themeObj.chartError}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1={ep.x + sz}
                y1={ep.y - sz}
                x2={ep.x - sz}
                y2={ep.y + sz}
                stroke={themeObj.chartError}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* Garis Kursor Hover Vertikal */}
        {hoverIndex !== null && (
          <line
            x1={activeX}
            y1={padTop}
            x2={activeX}
            y2={padTop + plotH}
            stroke={themeObj.primary}
            strokeWidth="1"
            strokeDasharray="2 2"
            opacity="0.8"
          />
        )}
      </svg>

      {/* Floating Tooltip saat Hover */}
      {hoverIndex !== null && activeData && (
        <div
          className="absolute pointer-events-none -top-1.5 py-1.5 px-3 rounded-lg bg-zinc-900 border border-zinc-700/80 shadow-2xl text-[11px] font-mono flex items-center space-x-3 text-zinc-300 z-30 transition-all duration-75"
          style={{
            left: `${Math.max(10, Math.min(85, (activeX / width) * 100))}%`,
            transform: 'translateX(-50%)'
          }}
        >
          <span className="text-zinc-400 font-bold">{activeData.second}s</span>
          <span className="text-zinc-100 font-semibold">
            wpm: <strong style={{ color: themeObj.primary }}>{activeData.wpm}</strong>
          </span>
          <span style={{ color: themeObj.chartRaw }}>
            raw: <strong>{activeData.raw}</strong>
          </span>
          <span style={{ color: activeData.errors > 0 ? themeObj.chartError : '#71717a', fontWeight: activeData.errors > 0 ? 'bold' : 'normal' }}>
            err: {activeData.errors}
          </span>
        </div>
      )}

      {/* Legenda Grafik Bawah */}
      <div className="flex items-center justify-center space-x-6 mt-2 text-[11px] font-mono text-zinc-400 select-none">
        <div className="flex items-center space-x-1.5">
          <span
            className="w-3.5 h-[2.5px] rounded-full inline-block"
            style={{ backgroundColor: themeObj.chartLine }}
          />
          <span>wpm</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span
            className="w-3.5 h-[2px] border-b border-dashed inline-block"
            style={{ backgroundColor: themeObj.chartRaw, borderColor: themeObj.chartRaw }}
          />
          <span style={{ color: themeObj.chartRaw }}>raw wpm</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="font-bold text-xs" style={{ color: themeObj.chartError }}>✕</span>
          <span style={{ color: themeObj.chartError }}>errors</span>
        </div>
      </div>
    </div>
  );
}

MonkeytypeChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      second: PropTypes.number.isRequired,
      wpm: PropTypes.number.isRequired,
      raw: PropTypes.number.isRequired,
      errors: PropTypes.number.isRequired
    })
  ),
  theme: PropTypes.string
};
