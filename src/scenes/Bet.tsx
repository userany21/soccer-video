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

const START_FRAME = 103;

export const Bet: React.FC<VideoProps> = (props) => {
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
    betAmount,
    gifBet,
    competition,
  } = props;

  const favTeam = homeWinPct > awayWinPct ? homeTeam : awayTeam;
  const favLogo = homeWinPct > awayWinPct ? homeLogo : awayLogo;

  const scale = spring({
    frame: localFrame,
    fps,
    config: {damping: 18, stiffness: 200},
  });
  const opacity = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Sequence from={START_FRAME} durationInFrames={66}>
      <AbsoluteFill>
        {gifBet ? (
          <Video
            src={staticFile(gifBet)}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
            loop
          />
        ) : null}
        <AbsoluteFill style={{backgroundColor: 'rgba(0,0,0,0.81)'}} />

        <AbsoluteFill style={{opacity}}>
          <div style={styles.competition}>{competition}</div>

          <div
            style={{
              ...styles.buy,
              transform: `scale(${scale})`,
            }}
          >
            BUY
          </div>

          <div style={styles.teamName}>{favTeam.toUpperCase()}</div>
          <Img src={favLogo} style={styles.favLogo} />
          <div style={styles.amountLabel}>AMOUNT</div>
          <div style={styles.betAmount}>${betAmount}</div>
          <div style={styles.buyNow}>BUY NOW</div>
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
  buy: {
    position: 'absolute',
    top: '18.3%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 148,
    color: '#00FF00',
    fontWeight: 900,
  },
  teamName: {
    position: 'absolute',
    top: '28.7%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 116,
    color: '#fff',
    fontWeight: 900,
  },
  favLogo: {
    position: 'absolute',
    left: '37.5%',
    top: '40%',
    width: '25%',
    height: '12%',
    objectFit: 'contain',
  },
  amountLabel: {
    position: 'absolute',
    top: '59.8%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 67,
    color: '#fff',
    fontWeight: 600,
  },
  betAmount: {
    position: 'absolute',
    top: '69.1%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 146,
    color: 'rgba(0,255,0,1)',
    fontWeight: 900,
  },
  buyNow: {
    position: 'absolute',
    top: '79.2%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 52,
    color: '#fff',
    fontWeight: 600,
  },
};
