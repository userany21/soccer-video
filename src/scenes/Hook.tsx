import {
  AbsoluteFill,
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
import {COLORS, FONT, cinematicGradient, glow} from '../shared/tokens';
import {HOOK_DURATION} from '../shared/timeline';

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
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // slow 2-4% push-in on the background footage
  const bgScale = interpolate(frame, [0, HOOK_DURATION], [1, 1.04], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      {gifHook ? (
        <OffthreadVideo
          src={staticFile(gifHook)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${bgScale})`,
          }}
        />
      ) : null}
      <AbsoluteFill style={cinematicGradient} />

      <AbsoluteFill>
        <CompetitionHeader competition={competition} />

        <div
          style={{
            position: 'absolute',
            top: '42.4%',
            width: '100%',
            textAlign: 'center',
            fontFamily: FONT,
            fontSize: 89,
            color: COLORS.white,
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
            fontFamily: FONT,
            fontSize: 123,
            color: COLORS.accentLime,
            fontWeight: 900,
            transform: `translateY(${interpolate(slideIn, [0, 1], [-60, 0])}px)`,
            opacity,
            ...glow(COLORS.accentLime, 'lg'),
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
            fontFamily: FONT,
            fontSize: 60,
            color: COLORS.white,
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
  );
};
