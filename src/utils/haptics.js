/**
 * Haptic Feedback Utility
 * Provides tactile feedback for a "High-Performance Tactical" UX
 * Works in PWA and native contexts with navigator.vibrate support
 */

const isHapticsSupported = () => 
  typeof navigator !== 'undefined' && 'vibrate' in navigator;

/**
 * Light haptic - for selections, toggles, minor interactions
 */
export const lightHaptic = () => {
  if (isHapticsSupported()) {
    navigator.vibrate(10);
  }
};

/**
 * Medium haptic - for confirmations, button presses
 */
export const mediumHaptic = () => {
  if (isHapticsSupported()) {
    navigator.vibrate(25);
  }
};

/**
 * Heavy haptic - for major achievements like PRs
 */
export const heavyHaptic = () => {
  if (isHapticsSupported()) {
    navigator.vibrate(50);
  }
};

/**
 * Success pattern - two quick pulses for positive feedback
 * Used for: rest timer end, workout complete, PR celebration
 */
export const successHaptic = () => {
  if (isHapticsSupported()) {
    navigator.vibrate([30, 50, 30]);
  }
};

/**
 * Warning pattern - single longer pulse
 * Used for: errors, form warnings
 */
export const warningHaptic = () => {
  if (isHapticsSupported()) {
    navigator.vibrate(100);
  }
};

/**
 * PR Celebration - intense pattern for personal records
 */
export const prCelebrationHaptic = () => {
  if (isHapticsSupported()) {
    navigator.vibrate([50, 30, 50, 30, 100]);
  }
};

/**
 * Countdown tick - very light for timer countdowns
 */
export const tickHaptic = () => {
  if (isHapticsSupported()) {
    navigator.vibrate(5);
  }
};

export default {
  light: lightHaptic,
  medium: mediumHaptic,
  heavy: heavyHaptic,
  success: successHaptic,
  warning: warningHaptic,
  prCelebration: prCelebrationHaptic,
  tick: tickHaptic,
};
