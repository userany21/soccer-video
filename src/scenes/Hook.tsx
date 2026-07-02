import {
  AbsoluteFill,
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

export const Hook: React.FC<VideoProps> = ({
  gifHook,
  featuredPayout,
  betAmount,
  competition,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const profit = Number((featuredPayout - betAmount).toFixed(2));

  const slideIn = spring({
    frame,
    fps,
    config: {damping: 20, stiffness: 200},
  });
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(frame, [46, 56], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Sequence durationInFrames={56}>
      <AbsoluteFill>
        {gifHook ? (
          <Video
            src={staticFile(gifHook)}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
            loop
          />
        ) : null}
        <AbsoluteFill style={{backgroundColor: 'rgba(0,0,0,0.81)'}} />

        <AbsoluteFill style={{opacity: exitOpacity}}>
          <div
            style={{
              position: 'absolute',
              top: '4.9%',
              width: '100%',
              textAlign: 'center',
              fontFamily: 'Bebas Neue',
              fontSize: 24,
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 700,
            }}
          >
            {competition}
          </div>

          <div
            style={{
              position: 'absolute',
              top: '42.4%',
              width: '100%',
              textAlign: 'center',
              fontFamily: 'Bebas Neue',
              fontSize: 89,
              color: '#fff',
              fontWeight: 900,
              letterSpacing: '-2px',
              transform: `translateY(${interpolate(slideIn, [0, 1], [60, 0])}px)`,
              opacity,
            }}
          >
            I FOUND A
          </div>

          <div
            style={{
              position: 'absolute',
              top: '50.9%',
              width: '100%',
              textAlign: 'center',
              fontFamily: 'Bebas Neue',
              fontSize: 123,
              color: '#c7ff00',
              fontWeight: 900,
              transform: `translateY(${interpolate(slideIn, [0, 1], [-60, 0])}px)`,
              opacity,
            }}
          >
            FREE ${profit}
          </div>

          <div
            style={{
              position: 'absolute',
              top: '62%',
              width: '100%',
              textAlign: 'center',
              fontFamily: 'Bebas Neue',
              fontSize: 60,
              color: '#fff',
              fontWeight: 900,
              letterSpacing: '-2px',
              transform: `translateX(${interpolate(slideIn, [0, 1], [100, 0])}px)`,
              opacity,
            }}
          >
            IN THE WORLD CUP
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </Sequence>
  );
};
