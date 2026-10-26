import React from 'react';
import PropTypes from 'prop-types';

/**
 * Keebflow Logo Component
 * Generated using logo-generator-skill (https://github.com/op7418/logo-generator-skill)
 * 
 * Supports variants:
 * - 'cross-stem' (default): The Mechanical Switch Stem & Flow Arc
 * - 'infinity': The Infinite Keeb Möbius Loop
 * - 'thock': Acoustic Thock Keycap & Soundwaves
 * - 'stagger': Columnar Stagger Ergonomic Capsules
 * - 'tactile': Tactile Actuation Force-Curve
 * - 'monogram': Monogram K-Flow Ribbon
 * - 'matrix': 3x3 Key Plate Matrix
 */
export default function KeebflowLogo({ variant = 'cross-stem', className = 'w-5 h-5 text-amber-400', ...props }) {
  switch (variant) {
    case 'infinity':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <path d="M 50 50 C 38 32, 16 34, 16 50 C 16 66, 38 68, 50 50 C 62 32, 84 34, 84 50 C 84 66, 62 68, 50 50 Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 24 44 C 28 40, 36 40, 40 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          <path d="M 60 56 C 64 60, 72 60, 76 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          <circle cx="28" cy="50" r="3.5" fill="currentColor" />
          <circle cx="72" cy="50" r="3.5" fill="currentColor" />
          <circle cx="50" cy="50" r="2.2" fill="currentColor" />
        </svg>
      );

    case 'thock':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <path d="M 32 38 L 54 28 L 68 38 L 46 48 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          <path d="M 32 38 L 24 64 L 52 76 L 74 62 L 68 38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 46 48 L 52 76" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="38" r="3" fill="currentColor" />
          <path d="M 72 26 C 77 31, 80 37, 80 44" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M 79 19 C 86 26, 90 35, 90 46" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
          <path d="M 86 12 C 95 21, 98 32, 98 44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        </svg>
      );

    case 'stagger':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <rect x="20" y="42" width="9" height="22" rx="4.5" fill="currentColor" opacity="0.4" />
          <rect x="35" y="32" width="9" height="34" rx="4.5" fill="currentColor" opacity="0.7" />
          <rect x="50" y="24" width="9" height="42" rx="4.5" fill="currentColor" />
          <rect x="65" y="36" width="9" height="30" rx="4.5" fill="currentColor" opacity="0.85" />
          <path d="M 16 74 C 32 74, 40 68, 54 68 C 68 68, 76 74, 88 74" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <circle cx="88" cy="62" r="3" fill="currentColor" />
        </svg>
      );

    case 'tactile':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <path d="M 50 16 A 34 34 0 1 1 20 62" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 22 56 C 32 56, 38 34, 48 34 C 54 34, 58 48, 68 48 C 76 48, 80 40, 84 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <circle cx="48" cy="34" r="4.5" fill="currentColor" />
          <circle cx="50" cy="50" r="14" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.35" />
        </svg>
      );

    case 'monogram':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <rect x="22" y="22" width="8" height="56" rx="4" fill="currentColor" />
          <path d="M 32 50 C 44 50, 52 38, 62 26 L 76 26" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 40 44 L 56 64 C 62 72, 68 74, 78 74" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="38" cy="50" r="3" fill="currentColor" />
        </svg>
      );

    case 'matrix':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <rect x="22" y="22" width="14" height="14" rx="4" fill="currentColor" opacity="0.3" />
          <rect x="43" y="22" width="14" height="14" rx="4" fill="currentColor" opacity="0.6" />
          <rect x="64" y="22" width="14" height="14" rx="4" fill="currentColor" opacity="0.3" />
          <rect x="22" y="43" width="14" height="14" rx="4" fill="currentColor" opacity="0.6" />
          <rect x="41" y="41" width="18" height="18" rx="5" fill="currentColor" />
          <rect x="48.5" y="44" width="3" height="12" rx="1" fill="#0b0d13" />
          <rect x="44" y="48.5" width="12" height="3" rx="1" fill="#0b0d13" />
          <rect x="64" y="43" width="14" height="14" rx="4" fill="currentColor" opacity="0.6" />
          <rect x="22" y="64" width="14" height="14" rx="4" fill="currentColor" opacity="0.3" />
          <rect x="43" y="64" width="14" height="14" rx="4" fill="currentColor" opacity="0.6" />
          <rect x="64" y="64" width="14" height="14" rx="4" fill="currentColor" opacity="0.3" />
        </svg>
      );

    case 'cross-stem':
    default:
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <rect x="18" y="18" width="64" height="64" rx="16" stroke="currentColor" strokeWidth="3.5" strokeDasharray="190 28" strokeDashoffset="14" />
          <rect x="46" y="36" width="8" height="28" rx="2.5" fill="currentColor" />
          <rect x="36" y="46" width="28" height="8" rx="2.5" fill="currentColor" />
          <path d="M 50 26 C 68 26, 82 40, 82 58 C 82 72, 70 82, 56 82 C 44 82, 34 74, 30 64" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
          <circle cx="82" cy="54" r="3" fill="currentColor" />
        </svg>
      );
  }
}

KeebflowLogo.propTypes = {
  variant: PropTypes.oneOf([
    'cross-stem',
    'infinity',
    'thock',
    'stagger',
    'tactile',
    'monogram',
    'matrix'
  ]),
  className: PropTypes.string
};
