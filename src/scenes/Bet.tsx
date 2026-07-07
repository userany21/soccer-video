import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  OffthreadVideo,
} from 'remotion';
import {VideoProps} from '../types';
import React from 'react';
import {CompetitionHeader} from '../shared/CompetitionHeader';
import {
  COLORS,
  FONT,
  cinematicGradient,
  glow,
  glassCard,
  greenButton,
  bluePillBorder,
} from '../shared/tokens';
import {BET_DURATION} from '../shared/timeline';

export const Bet: React.FC<VideoProps> = (props) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {
    homeTeam,
    awayTeam,
    homeLogo,
    awayLogo,
    homeWinPct,
    awayWinPct,
    betAmount,
    featuredPayout,
    gifBet,
    competition,
  } = props;

  const favTeam = homeWinPct > awayWinPct ? homeTeam : awayTeam;
  const favLogo = homeWinPct > awayWinPct ? homeLogo : awayLogo;
  const favPct = Math.max(homeWinPct, awayWinPct);
  const multiplier = (featuredPayout / betAmount).toFixed(2);

  // card slides up from the bottom with a spring
  const cardSpring = spring({
    frame,
    fps,
    config: {damping: 18, stiffness: 160},
  });
  const cardY = interpolate(cardSpring, [0, 1], [140, 0]);
  const cardOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // BUY NOW button pulses gently once the card has landed
  const pulse = 1 + Math.sin(Math.max(frame - 14, 0) / 5) * 0.02;

  const bgScale = interpolate(frame, [0, BET_DURATION], [1, 1.03], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      {gifBet ? (
        <OffthreadVideo
          src={staticFile(gifBet)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${bgScale})`,
          }}
        />
      ) : null}
      <AbsoluteFill style={cinematicGradient} />

      <CompetitionHeader competition={competition} />

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity: cardOpacity,
        }}
      >
        <div
          style={{
            ...glassCard,
            width: '84%',
            padding: '40px 36px',
            transform: `translateY(${cardY}px)`,
            display: 'flex',
            flexDirection: 'column',
            gap: 26,
          }}
        >
          {/* header row: team + WIN pill */}
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <div
              style={{
                width: 74,
                height: 74,
                borderRadius: 18,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.06)',
                ...bluePillBorder,
              }}
            >
              <Img src={favLogo} style={{width: '78%', height: '78%', objectFit: 'contain'}} />
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 44,
                color: COLORS.white,
                fontWeight: 900,
              }}
            >
              {favTeam}
            </div>

            <div
              style={{
                marginLeft: 'auto',
                ...greenButton,
                padding: '10px 22px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span style={{fontFamily: FONT, fontSize: 18, color: COLORS.deepBlack, letterSpacing: 2}}>
                WIN
              </span>
              <span style={{fontFamily: FONT, fontSize: 26, color: COLORS.deepBlack, fontWeight: 900}}>
                {favPct.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* stat row: potential + amount */}
          <div style={{display: 'flex', gap: 16}}>
            <StatBlock label="Potential" value={`${multiplier}x`} />
            <StatBlock label="Amount" value={`$${betAmount}`} />
          </div>

          <div style={{height: 1, background: 'rgba(255,255,255,0.12)'}} />

          {/* est. payout hero number */}
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
            <span
              style={{
                fontFamily: FONT,
                fontSize: 22,
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: 2,
              }}
            >
              EST. PAYOUT
            </span>
            <span
              style={{
                fontFamily: FONT,
                fontSize: 90,
                color: COLORS.primaryGreen,
                fontWeight: 900,
                ...glow(COLORS.primaryGreen, 'lg'),
              }}
            >
              ${featuredPayout}
            </span>
          </div>

          {/* BUY NOW button */}
          <div
            style={{
              ...greenButton,
              textAlign: 'center',
              padding: '20px 0',
              transform: `scale(${pulse})`,
            }}
          >
            <span
              style={{
                fontFamily: FONT,
                fontSize: 34,
                color: COLORS.deepBlack,
                fontWeight: 900,
                letterSpacing: 3,
              }}
            >
              BUY NOW
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const StatBlock: React.FC<{label: string; value: string}> = ({label, value}) => (
  <div
    style={{
      flex: 1,
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 18,
      padding: '16px 0',
      textAlign: 'center',
    }}
  >
    <div style={{fontFamily: FONT, fontSize: 18, color: 'rgba(255,255,255,0.55)', letterSpacing: 2}}>
      {label.toUpperCase()}
    </div>
    <div style={{fontFamily: FONT, fontSize: 40, color: COLORS.white, fontWeight: 900}}>{value}</div>
  </div>
);
