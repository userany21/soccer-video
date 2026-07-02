export interface VideoProps {
  title: string;
  gameTime: string;
  eventDate: string;

  homeTeam: string;
  homeLogo: string;
  homeColor: string;
  homeAbbr: string;

  awayTeam: string;
  awayLogo: string;
  awayColor: string;
  awayAbbr: string;

  homeWinPct: number;
  awayWinPct: number;
  drawPct: number;

  homeMultiplier: number;
  awayMultiplier: number;
  drawMultiplier: number;

  competition: string;
  starPlayer: string;

  betAmount: number;
  featuredOutcome: string;
  featuredMultiplier: number;
  featuredPayout: number;
  betHook: string;
  isFavorite: boolean;

  gifHook: string;
  gifMatch: string;
  gifBet: string;
  gifPayout: string;
  gifCta: string;
}
