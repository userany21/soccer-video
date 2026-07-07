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
import {COLORS, FONT, cinematicGradient, glow, bluePillBorder} from '../shared/tokens';
import {MATCH_DURATION} from '../shared/timeline';

export const Match: React.FC<VideoProps> = (props) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {
    homeTeam,
    awayTeam,
    homeLogo,
    awayLogo,
    homeWinPct,
    awayWinPct,
    gifMatch,
    competition,
  } = props;

  const favTeam = homeWinPct > awayWinPct ? homeTeam : awayTeam;
  const favPct = Math.max(homeWinPct, awayWinPct);

  const slideIn = spring({
    frame,
    fps,
    config: {damping: 20, stiffness: 180},
  });
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bgScale = interpolate(frame, [0, MATCH_DURATION], [1, 1.03], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // progress bar fills 0 -> favPct over the first ~1s while the header settles
  const barFill = interpolate(frame, [8, 34], [0, favPct], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      {gifMatch ? (
        <OffthreadVideo
          src={staticFile(gifMatch)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${bgScale})`,
          }}
        />
      ) : null}
      <AbsoluteFill style={cinematicGradient} />

      <AbsoluteFill style={{opacity}}>
        <CompetitionHeader competition={competition} />

        <div
          style={{
            ...styles.teamName,
            top: '13%',
            fontSize: 99,
            transform: `translateX(${interpolate(slideIn, [0, 1], [200, 0])}px)`,
          }}
        >
          {homeTeam.toUpperCase()}
        </div>

        <div style={styles.vs}>VS</div>

        <div
          style={{
            ...styles.teamName,
            top: '25.5%',
            fontSize: 93,
            transform: `translateX(${interpolate(slideIn, [0, 1], [-200, 0])}px)`,
          }}
        >
          {awayTeam.toUpperCase()}
        </div>

        <div style={{...styles.flagBadge, left: '13%'}}>
          <Img src={homeLogo} style={styles.flagImg} />
        </div>
        <div style={styles.logoDivider}>X</div>
        <div style={{...styles.flagBadge, right: '13%'}}>
          <Img src={awayLogo} style={styles.flagImg} />
        </div>

        <div style={styles.favWin}>{favTeam.toUpperCase()} WIN</div>
        <div style={{...styles.winPct, ...glow(COLORS.white, 'sm')}}>
          {favPct.toFixed(1)}%
        </div>

        {/* animated probability bar */}
        <div style={styles.barTrack}>
          <div
            style={{
              ...styles.barFill,
              width: `${barFill}%`,
            }}
          />
        </div>

        <div style={styles.label}>MARKET PROBABILITY</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const styles: Record<string, React.CSSProperties> = {
  teamName: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontFamily: FONT,
    color: COLORS.white,
    fontWeight: 900,
  },
  vs: {
    position: 'absolute',
    top: '21.6%',
    width: '100%',
    textAlign: 'center',
    fontFamily: FONT,
    fontSize: 47,
    color: COLORS.primaryGreen,
    fontWeight: 900,
  },
  flagBadge: {
    position: 'absolute',
    top: '39%',
    width: '30%',
    height: '15%',
    borderRadius: 20,
    overflow: 'hidden',
    ...bluePillBorder,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(16,16,16,0.4)',
  },
  flagImg: {
    width: '82%',
    height: '82%',
    objectFit: 'contain',
    borderRadius: 8,
  },
  logoDivider: {
    position: 'absolute',
    top: '44%',
    width: '100%',
    textAlign: 'center',
    fontFamily: FONT,
    fontSize: 47,
    color: COLORS.white,
    fontWeight: 900,
  },
  favWin: {
    position: 'absolute',
    top: '61%',
    width: '100%',
    textAlign: 'center',
    fontFamily: FONT,
    fontSize: 100,
    color: COLORS.primaryGreen,
    fontWeight: 900,
  },
  winPct: {
    position: 'absolute',
    top: '70%',
    width: '100%',
    textAlign: 'center',
    fontFamily: FONT,
    fontSize: 130,
    color: COLORS.white,
    fontWeight: 900,
  },
  barTrack: {
    position: 'absolute',
    top: '81.5%',
    left: '15%',
    width: '70%',
    height: 14,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 8,
    background: `linear-gradient(90deg, ${COLORS.polybotBlue}, ${COLORS.primaryGreen})`,
    boxShadow: `0 0 14px rgba(0,255,102,0.6)`,
  },
  label: {
    position: 'absolute',
    top: '85%',
    width: '100%',
    textAlign: 'center',
    fontFamily: FONT,
    fontSize: 40,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 600,
    letterSpacing: '8px',
  },
};
