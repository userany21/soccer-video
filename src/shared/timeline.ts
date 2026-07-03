// Single source of truth for scene timing.
// Change SCANNER_FRAMES and every scene shifts together.

export const FPS = 30;

// ~0.45s flash intro ("Opportunity detected") before the Hook scene.
export const SCANNER_FRAMES = 14;

// Original absolute start frames (before the scanner intro existed) were:
// Hook 0, Match 47, Bet 103, Payout 160, CTA 222.
// We keep the same spacing, just shifted by SCANNER_FRAMES.
export const HOOK_START = SCANNER_FRAMES;
export const MATCH_START = SCANNER_FRAMES + 47;
export const BET_START = SCANNER_FRAMES + 103;
export const PAYOUT_START = SCANNER_FRAMES + 160;
export const CTA_START = SCANNER_FRAMES + 222;

export const HOOK_DURATION = 56;
export const MATCH_DURATION = 62;
export const BET_DURATION = 66;
export const PAYOUT_DURATION = 64;
export const CTA_DURATION = 76;

// Total composition length — bump durationInFrames on your <Composition> to this.
export const TOTAL_DURATION = CTA_START + CTA_DURATION;
