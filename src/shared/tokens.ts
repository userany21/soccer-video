import React from 'react';

/**
 * PolyBot premium design system
 * Drop this next to your scene files (adjust the relative import paths
 * in each scene if your folder structure differs).
 */

export const COLORS = {
  primaryGreen: '#00FF66',
  accentLime: '#B8FF2C',
  white: '#FFFFFF',
  deepBlack: '#101010',
  polybotBlue: '#2A7BFF',
};

export const FONT = 'Bebas Neue';

/**
 * Cinematic vignette overlay — dark at top/bottom, lets footage
 * breathe through the middle. Replaces the old flat rgba(0,0,0,0.81).
 */
export const cinematicGradient: React.CSSProperties = {
  background: `linear-gradient(to bottom,
    rgba(16,16,16,0.90) 0%,
    rgba(16,16,16,0.55) 18%,
    rgba(16,16,16,0.32) 40%,
    rgba(16,16,16,0.32) 60%,
    rgba(16,16,16,0.55) 82%,
    rgba(16,16,16,0.92) 100%)`,
};

/** Glow text-shadow for hero numbers / money. Pass a hex color. */
export const glow = (hex: string, strength: 'sm' | 'md' | 'lg' = 'md'): React.CSSProperties => {
  const rgb = hexToRgb(hex);
  const sizes = {
    sm: [8, 18],
    md: [12, 30],
    lg: [16, 42],
  }[strength];
  return {
    textShadow: `0 0 ${sizes[0]}px rgba(${rgb},0.9), 0 0 ${sizes[1]}px rgba(${rgb},0.55), 0 6px 14px rgba(0,0,0,0.8)`,
  };
};

export const glassCard: React.CSSProperties = {
  background: 'rgba(16,16,16,0.55)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: 32,
  boxShadow: '0 24px 70px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
};

export const bluePillBorder: React.CSSProperties = {
  border: `1px solid ${COLORS.polybotBlue}`,
  boxShadow: `0 0 18px rgba(42,123,255,0.45)`,
};

export const greenButton: React.CSSProperties = {
  background: `linear-gradient(180deg, ${COLORS.primaryGreen} 0%, #00CC52 100%)`,
  boxShadow: `0 0 24px rgba(0,255,102,0.55), 0 10px 24px rgba(0,0,0,0.35)`,
  borderRadius: 100,
};

function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}
