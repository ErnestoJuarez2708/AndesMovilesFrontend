/**
 * Border Radius Scale
 * Used for rounded corners on components
 */

export const BorderRadius = {
  sm: 8,      // Small rounded corners
  md: 12,     // Medium rounded corners
  lg: 16,     // Large rounded corners
  xl: 20,     // Extra large rounded corners
  full: 999,  // Fully rounded (pill shape)
} as const;

export type BorderRadiusKey = keyof typeof BorderRadius;

/**
 * Helper to access border radius values
 * @param key - The border radius key (sm, md, lg, xl, full)
 * @returns The pixel value
 */
export const getBorderRadius = (key: BorderRadiusKey): number => BorderRadius[key];
