import {loadFont} from '@remotion/google-fonts/BebasNeue';
import {AbsoluteFill, Audio} from 'remotion';
import {Bet} from './scenes/Bet';
import {CTA} from './scenes/CTA';
import {Hook} from './scenes/Hook';
import {Match} from './scenes/Match';
import {Payout} from './scenes/Payout';
import {VideoProps} from './types';
import React from 'react';

const {fontFamily} = loadFont();

const AUDIO_URL =
  'https://drive.google.com/uc?export=download&id=1WN1h4626WiqPxz10yXVgRPl5Tu3NObr6';

export const SoccerVideo: React.FC<VideoProps> = (props) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000', fontFamily}}>
      <Audio src={AUDIO_URL} volume={0.3} />
      <Hook {...props} />
      <Match {...props} />
      <Bet {...props} />
      <Payout {...props} />
      <CTA {...props} />
    </AbsoluteFill>
  );
};
