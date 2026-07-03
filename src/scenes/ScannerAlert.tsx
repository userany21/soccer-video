import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {VideoProps} from '../types';
import React from 'react';
import {COLORS, FONT, glassCard, bluePillBorder} from '../shared/tokens';
import {SCANNER_FRAMES} from '../shared/timeline';

/**
 * "AI found a trade" flash — plays for ~0.45s before the Hook.
 * Signals this is an automated scanner result, not a random edit.
 */
export const ScannerAlert: React.FC<VideoProps> = ({
  homeTeam,
  awayTeam,
  betAmount,
  featuredPayout,
}) => {
  const frame = useCurrentFrame();
  const profit = Number((featuredPayout - betAmount).toFixed(2));
  const edgePct = ((profit / betAmount) * 100).toFixed(1);

  const opacity = interpolate(
    frame,
    [0, 2, SCANNER_FRAMES - 4, SCANNER_FRAMES],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const scale = interpolate(frame, [0, 4], [0.92, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Sequence from={0} durationInFrames={SCANNER_FRAMES}>
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.deepBlack,
          opacity,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            ...glassCard,
            ...bluePillBorder,
            transform: `scale(${scale})`,
            width: '84%',
            padding: '44px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: COLORS.primaryGreen,
                boxShadow: `0 0 12px ${COLORS.primaryGreen}`,
              }}
            />
            <span
              style={{
                fontFamily: FONT,
                fontSize: 30,
                color: COLORS.white,
                letterSpacing: 2,
              }}
            >
              POLYBOT SCANNER
            </span>
            <span
              style={{
                marginLeft: 'auto',
                fontFamily: FONT,
                fontSize: 22,
                color: COLORS.primaryGreen,
              }}
            >
              LIVE
            </span>
          </div>

          <Row label="MARKET" value={`${homeTeam} vs ${awayTeam}`} />
          <Row label="EDGE" value={`+${edgePct}%`} accent />
          <Row label="EXPECTED PROFIT" value={`$${profit}`} accent />

          <div
            style={{
              fontFamily: FONT,
              fontSize: 20,
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: 1,
            }}
          >
            Opportunity detected · Just now
          </div>
        </div>
      </AbsoluteFill>
    </Sequence>
  );
};

const Row: React.FC<{label: string; value: string; accent?: boolean}> = ({
  label,
  value,
  accent,
}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
    <span
      style={{
        fontFamily: FONT,
        fontSize: 22,
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 1,
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontFamily: FONT,
        fontSize: 28,
        color: accent ? COLORS.primaryGreen : COLORS.white,
        fontWeight: 700,
      }}
    >
      {value}
    </span>
  </div>
);
