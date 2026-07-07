import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {VideoProps} from '../types';
import React from 'react';
import {CompetitionHeader} from '../shared/CompetitionHeader';
import {COLORS, FONT, cinematicGradient, glow, bluePillBorder} from '../shared/tokens';

export const CTA: React.FC<VideoProps> = ({gifCta, competition}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 11], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // slow scale pulse on the logo lockup
  const logoPulse = 1 + Math.sin(frame / 10) * 0.03;

  return (
    <AbsoluteFill>
      {gifCta ? (
        <OffthreadVideo
          src={staticFile(gifCta)}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      ) : null}
      <AbsoluteFill style={cinematicGradient} />

      <AbsoluteFill style={{opacity}}>
        <CompetitionHeader competition={competition} />

        <div style={styles.signUp}>sign up</div>
        <div
          style={{
            ...styles.free,
            transform: `scale(${logoPulse})`,
            ...glow(COLORS.white, 'sm'),
          }}
        >
          for free
        </div>
        <div style={styles.now}>RIGHT NOW</div>

        {/* pill badges */}
        <div style={styles.pillRow}>
          <div style={{...styles.pill, ...bluePillBorder}}>FREE ACCESS</div>
          <div style={styles.pill}>LIVE MARKETS</div>
        </div>

        <div style={{...styles.link, ...glow(COLORS.primaryGreen, 'sm')}}>whop.com/polybot</div>

        <div style={{...styles.linkInBio, ...glow(COLORS.primaryGreen, 'md')}}>LINK IN BIO</div>
        <div style={styles.startWinning}>START WINNING TODAY</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const styles: Record<string, React.CSSProperties> = {
  signUp: {
    position: 'absolute',
    top: '10%',
    width: '100%',
    textAlign: 'center',
    fontFamily: FONT,
    fontSize: 64,
    color: COLORS.white,
    fontWeight: 800,
  },
  free: {
    position: 'absolute',
    top: '18%',
    width: '100%',
    textAlign: 'center',
    fontFamily: FONT,
    fontSize: 156,
    color: COLORS.white,
    fontWeight: 800,
  },
  now: {
    position: 'absolute',
    top: '30%',
    width: '100%',
    textAlign: 'center',
    fontFamily: FONT,
    fontSize: 79,
    color: COLORS.primaryGreen,
    fontWeight: 800,
  },
  pillRow: {
    position: 'absolute',
    top: '39%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    gap: 14,
  },
  pill: {
    fontFamily: FONT,
    fontSize: 20,
    color: COLORS.white,
    letterSpacing: 2,
    padding: '10px 22px',
    borderRadius: 100,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.16)',
  },
  link: {
    position: 'absolute',
    top: '46%',
    width: '100%',
    textAlign: 'center',
    fontFamily: FONT,
    fontSize: 60,
    color: COLORS.primaryGreen,
    fontWeight: 800,
  },
  linkInBio: {
    position: 'absolute',
    top: '70.1%',
    width: '100%',
    textAlign: 'center',
    fontFamily: FONT,
    fontSize: 126,
    color: COLORS.primaryGreen,
    fontWeight: 700,
  },
  startWinning: {
    position: 'absolute',
    top: '78%',
    width: '100%',
    textAlign: 'center',
    fontFamily: FONT,
    fontSize: 56,
    color: COLORS.white,
    fontWeight: 700,
  },
};
