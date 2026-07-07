import {loadFont} from '@remotion/google-fonts/BebasNeue';
import {AbsoluteFill, Audio} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {Bet} from './scenes/Bet';
import {CTA} from './scenes/CTA';
import {Hook} from './scenes/Hook';
import {Match} from './scenes/Match';
import {Payout} from './scenes/Payout';
import {ScannerAlert} from './scenes/ScannerAlert';
import {VideoProps} from './types';
import {
  SCANNER_DURATION,
  HOOK_DURATION,
  MATCH_DURATION,
  BET_DURATION,
  PAYOUT_DURATION,
  CTA_DURATION,
  TRANSITION_FRAMES,
} from './shared/timeline';
import React from 'react';

const {fontFamily} = loadFont();

const AUDIO_URL =
  'https://drive.google.com/uc?export=download&id=1lT-yyCKyHz0Vinv9y5t7OUnx1sNs7Vmz';

export const SoccerVideo: React.FC<VideoProps> = (props) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000', fontFamily}}>
      <Audio src={AUDIO_URL} volume={0.3} />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCANNER_DURATION}>
          <ScannerAlert {...props} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />

        <TransitionSeries.Sequence durationInFrames={HOOK_DURATION}>
          <Hook {...props} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({direction: 'from-right'})}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />

        <TransitionSeries.Sequence durationInFrames={MATCH_DURATION}>
          <Match {...props} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({direction: 'from-right'})}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />

        <TransitionSeries.Sequence durationInFrames={BET_DURATION}>
          <Bet {...props} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />

        <TransitionSeries.Sequence durationInFrames={PAYOUT_DURATION}>
          <Payout {...props} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({direction: 'from-bottom'})}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />

        <TransitionSeries.Sequence durationInFrames={CTA_DURATION}>
          <CTA {...props} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
