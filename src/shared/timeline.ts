// Single source of truth for scene timing.

export const FPS = 30;

// ~0.45s flash intro ("Opportunity detected") before the Hook scene.
export const SCANNER_FRAMES = 14;

// Length of the crossfade/slide/wipe between each scene, in frames.
export const TRANSITION_FRAMES = 10;

export const SCANNER_DURATION = SCANNER_FRAMES;
export const HOOK_DURATION = 56;
export const MATCH_DURATION = 62;
export const BET_DURATION = 66;
export const PAYOUT_DURATION = 64;
export const CTA_DURATION = 76;

const SCENE_COUNT = 6;
const TRANSITION_COUNT = SCENE_COUNT - 1;

// Total composition length — bump durationInFrames on your <Composition>
// to this. Each transition eats TRANSITION_FRAMES from the naive sum.
export const TOTAL_DURATION =
  SCANNER_DURATION +
  HOOK_DURATION +
  MATCH_DURATION +
  BET_DURATION +
  PAYOUT_DURATION +
  CTA_DURATION -
  TRANSITION_COUNT * TRANSITION_FRAMES;
