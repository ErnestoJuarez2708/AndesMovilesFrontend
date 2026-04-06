/**
 * Design System Constants
 * Central export point for all design system tokens
 */

export { Colors, type ColorKey } from './colors';
export { Spacing, getSpacing, type SpacingKey } from './spacing';
export { BorderRadius, getBorderRadius, type BorderRadiusKey } from './borderRadius';
export {
  FontSizes,
  FontWeights,
  LineHeights,
  TextStyles,
  getFontSize,
  getFontWeight,
  getLineHeight,
  type FontSizeKey,
  type FontWeightKey,
  type LineHeightKey,
} from './typography';
export { Shadows, getShadow, type ShadowKey } from './shadows';

// Legacy theme support - kept for compatibility
export { Colors as Colors_Legacy, Fonts } from './theme';
