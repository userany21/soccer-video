import {Composition} from 'remotion';
import {SoccerVideo} from './SoccerVideo';
import {VideoProps} from './types';
import React from 'react';

const defaultProps: VideoProps = {
  title: 'Brazil vs. Japan',
  gameTime: '2026-06-29T17:00:00Z',
  eventDate: '2026-06-29',
  homeTeam: 'Brazil',
  homeLogo:
    'https://polymarket-upload.s3.us-east-2.amazonaws.com/Brazil-113390b1cc.png',
  homeColor: '#128143',
  homeAbbr: 'bra',
  awayTeam: 'Japan',
  awayLogo:
    'https://polymarket-upload.s3.us-east-2.amazonaws.com/Japan-0aa0acf283.png',
  awayColor: '#a51839',
  awayAbbr: 'jpn',
  homeWinPct: 57.5,
  awayWinPct: 17.5,
  drawPct: 25.5,
  homeMultiplier: 1.74,
  awayMultiplier: 5.71,
  drawMultiplier: 3.92,
  competition: 'FIFA World Cup',
  starPlayer: 'Neymar Brazil',
  betAmount: 150,
  featuredOutcome: 'Brazil',
  featuredMultiplier: 1.74,
  featuredPayout: 261,
  betHook: '$150 -> $261',
  isFavorite: true,
  gifHook: 'https://media3.giphy.com/media/WQZuyEo0OMs80/giphy.mp4',
  gifMatch: 'https://media0.giphy.com/media/1b5geaxCTir4Y/giphy.mp4',
  gifBet: 'https://media0.giphy.com/media/IgcledM3VUBFt4JlFq/giphy.mp4',
  gifPayout: 'https://media2.giphy.com/media/rUcTDm4OJRJ4nVkx7H/giphy.mp4',
  gifCta: 'https://media2.giphy.com/media/EUTdi2ymFabzUykxQj/giphy.mp4',
};

export const RemotionRoot = () => {
  return (
    <Composition
      id="SoccerVideo"
      component={SoccerVideo as React.FC}
      durationInFrames={298}
      fps={30}
      width={720}
      height={1280}
      defaultProps={defaultProps}
    />
  );
};
