import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Video,
} from 'remotion';
import {VideoProps} from '../types';
import React from 'react';

const START_FRAME = 47;

export const Match: React.FC<VideoProps> = (props) => {
  const frame = useCurrentFrame();
  const localFrame = frame - START_FRAME;
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
  const favPct = Math.max(homeWinPct, awayWinPct).toFixed(1);

  const slideIn = spring({
    frame: localFrame,
    fps,
    config: {damping: 20, stiffness: 180},
  });
  const opacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Sequence from={START_FRAME} durationInFrames={62}>
      <AbsoluteFill>
        {gifMatch ? (
          <Video
            src={staticFile(gifMatch)}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
            loop
          />
        ) : null}
        <AbsoluteFill style={{backgroundColor: 'rgba(0,0,0,0.81)'}} />

        <AbsoluteFill style={{opacity}}>
          <div style={styles.competition}>{competition}</div>

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

          <Img src={homeLogo} style={styles.homeLogo} />
          <div style={styles.logoDivider}>X</div>
          <Img src={awayLogo} style={styles.awayLogo} />

          <div style={styles.favWin}>{favTeam.toUpperCase()} WIN</div>
          <div style={styles.winPct}>{favPct}%</div>
          <div style={styles.label}>MARKET PROBABILITY</div>
        </AbsoluteFill>
      </AbsoluteFill>
    </Sequence>
  );
};

const styles: Record<string, React.CSSProperties> = {
  competition: {
    position: 'absolute',
    top: '4.9%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 24,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: 700,
  },
  teamName: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    color: '#fff',
    fontWeight: 900,
  },
  vs: {
    position: 'absolute',
    top: '21.6%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 47,
    color: '#9cff00',
    fontWeight: 900,
  },
  homeLogo: {
    position: 'absolute',
    left: '13%',
    top: '41%',
    width: '30%',
    height: '13%',
    objectFit: 'contain',
  },
  logoDivider: {
    position: 'absolute',
    top: '44%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 47,
    color: '#fff',
    fontWeight: 900,
  },
  awayLogo: {
    position: 'absolute',
    right: '13%',
    top: '41%',
    width: '30%',
    height: '13%',
    objectFit: 'contain',
  },
  favWin: {
    position: 'absolute',
    top: '61.6%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 105,
    color: '#00FF00',
    fontWeight: 900,
  },
  winPct: {
    position: 'absolute',
    top: '71.2%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 137,
    color: '#fff',
    fontWeight: 900,
  },
  label: {
    position: 'absolute',
    top: '79.3%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 54,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 600,
    letterSpacing: '8px',
  },
};
