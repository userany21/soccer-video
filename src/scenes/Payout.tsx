import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  OffthreadVideo,
} from 'remotion';
import {VideoProps} from '../types';
import React from 'react';
import {CompetitionHeader} from '../shared/CompetitionHeader';
import {COLORS, FONT, cinematicGradient, glow, glassCard} from '../shared/tokens';
import {PAYOUT_START, PAYOUT_DURATION} from '../shared/timeline';

export const Payout: React.FC<VideoProps> = (props) => {
  const frame = useCurrentFrame();
  const localFrame = frame - PAYOUT_START;
  const {betAmount, featuredPayout, gifPayout, competition} = props;
  const profit = Number((featuredPayout - betAmount).toFixed(2));
  const multiplier = (featuredPayout / betAmount).toFixed(2);

  // count-up with a slight overshoot bounce when it lands
  const rawProgress = interpolate(localFrame, [0, 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bounce = interpolate(localFrame, [26, 32, 36], [1, 1.06, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const animatedPayout = betAmount + (featuredPayout - betAmount) * rawProgress;

  const opacity = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bgScale = interpolate(localFrame, [0, PAYOUT_DURATION], [1, 1.03], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Sequence from={PAYOUT_START} durationInFrames={PAYOUT_DURATION}>
      <AbsoluteFill>
        {gifPayout ? (
          <OffthreadVideo
            src={staticFile(gifPayout)}
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

        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity}}>
          <div style={{textAlign: 'center', marginBottom: 28}}>
            <span
              style={{
                fontFamily: FONT,
                fontSize: 90,
                color: COLORS.primaryGreen,
                fontWeight: 900,
                ...glow(COLORS.primaryGreen, 'sm'),
              }}
            >
              PAYOUT
            </span>
          </div>

          <div
            style={{
              ...glassCard,
              width: '84%',
              padding: '44px 36px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              transform: `scale(${bounce})`,
            }}
          >
            <span
              style={{
                fontFamily: FONT,
                fontSize: 130,
                color: COLORS.white,
                fontWeight: 900,
                ...glow(COLORS.white, 'md'),
              }}
            >
              ${animatedPayout.toFixed(0)}
            </span>

            <div
              style={{
                background: 'rgba(0,255,102,0.14)',
                border: `1px solid ${COLORS.primaryGreen}`,
                borderRadius: 100,
                padding: '10px 26px',
              }}
            >
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 40,
                  color: COLORS.primaryGreen,
                  fontWeight: 900,
                  ...glow(COLORS.primaryGreen, 'sm'),
                }}
              >
                +${profit} PROFIT · +{((profit / betAmount) * 100).toFixed(1)}%
              </span>
            </div>

            <div style={{display: 'flex', gap: 16, width: '100%', marginTop: 8}}>
              <MiniStat label="Stake" value={`$${betAmount}`} />
              <MiniStat label="Profit" value={`$${profit}`} />
              <MiniStat label="Return" value={`${multiplier}x`} />
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </Sequence>
  );
};

const MiniStat: React.FC<{label: string; value: string}> = ({label, value}) => (
  <div
    style={{
      flex: 1,
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 16,
      padding: '14px 0',
      textAlign: 'center',
    }}
  >
    <div style={{fontFamily: FONT, fontSize: 16, color: 'rgba(255,255,255,0.55)', letterSpacing: 1.5}}>
      {label.toUpperCase()}
    </div>
    <div style={{fontFamily: FONT, fontSize: 30, color: COLORS.white, fontWeight: 900}}>{value}</div>
  </div>
);
