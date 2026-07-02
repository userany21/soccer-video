import {AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {VideoProps} from '../types';
import React from 'react';

const START_FRAME = 222;

export const CTA: React.FC<VideoProps> = ({gifCta, competition}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - START_FRAME;
  const opacity = interpolate(localFrame, [0, 11], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Sequence from={START_FRAME} durationInFrames={76}>
      <AbsoluteFill>
        {gifCta ? (
          <OffthreadVideo
            src={staticFile(gifCta)}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        ) : null}
        <AbsoluteFill style={{backgroundColor: 'rgba(0,0,0,0.81)'}} />

        <AbsoluteFill style={{opacity}}>
          <div style={styles.competition}>{competition}</div>
          <div style={styles.signUp}>sign up</div>
          <div style={styles.free}>for free</div>
          <div style={styles.now}>RIGHT NOW</div>
          <div style={styles.link}>whop.com/polybot</div>
          <div style={styles.linkInBio}>LINK IN BIO</div>
          <div style={styles.startWinning}>START WINNING TODAY</div>
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
  signUp: {
    position: 'absolute',
    top: '11.7%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 64,
    color: '#fff',
    fontWeight: 800,
  },
  free: {
    position: 'absolute',
    top: '20%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 156,
    color: '#fff',
    fontWeight: 800,
  },
  now: {
    position: 'absolute',
    top: '28.4%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 79,
    color: 'rgba(0,255,0,1)',
    fontWeight: 800,
  },
  link: {
    position: 'absolute',
    top: '36%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 92,
    color: 'rgba(0,255,0,1)',
    fontWeight: 800,
  },
  linkInBio: {
    position: 'absolute',
    top: '70.1%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 126,
    color: '#00FF00',
    fontWeight: 700,
  },
  startWinning: {
    position: 'absolute',
    top: '78%',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Bebas Neue',
    fontSize: 56,
    color: '#fff',
    fontWeight: 700,
  },
};
