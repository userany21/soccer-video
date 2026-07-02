import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  Video,
} from 'remotion';
import {VideoProps} from '../types';
import React from 'react';

const START_FRAME = 160;

export const Payout: React.FC<VideoProps> = (props) => {
  const frame = useCurrentFrame();
  const localFrame = frame - START_FRAME;
  const {betAmount, featuredPayout, gifPayout, competition} = props;
  const profit = Number((featuredPayout - betAmount).toFixed(2));

  const animatedPayout = interpolate(localFrame, [0, 30], [
    betAmount,
    featuredPayout,
  ], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Sequence from={START_FRAME} durationInFrames={64}>
      <AbsoluteFill>
        {gifPayout ? (
          <Video
            src={staticFile(gifPayout)}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
            loop
          />
        ) : null}
        <AbsoluteFill style={{backgroundColor: 'rgba(0,0,0,0.81)'}} />

        <AbsoluteFill style={{opacity}}>
          <div style={styles.competition}>{competition}</div>
          <div style={styles.title}>PAYOUT</div>
          <div style={styles.betAmount}>${betAmount}</div>
          <div style={styles.arrow}>&darr;</div>
          <div style={styles.payout}>${animatedPayout.toFixed(0)}</div>
          <div style={styles.profit}>+${profit} PROFIT</div>
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
  title: {
    position: 'absolute',
    top: '16.5%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 132,
    color: '#00FF00',
    fontWeight: 900,
  },
  betAmount: {
    position: 'absolute',
    top: '40.4%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 134,
    color: '#fff',
    fontWeight: 600,
  },
  arrow: {
    position: 'absolute',
    top: '47.1%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 99,
    color: '#fff',
    fontWeight: 600,
  },
  payout: {
    position: 'absolute',
    top: '58.1%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 173,
    color: 'rgba(0,255,0,1)',
    fontWeight: 900,
  },
  profit: {
    position: 'absolute',
    top: '73.5%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 63,
    color: 'rgba(0,255,0,1)',
    fontWeight: 900,
  },
};
