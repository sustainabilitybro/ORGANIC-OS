// Design System Tokens
// Comprehensive design tokens for consistent theming

// ============ Colors ============

export const colors = {
  // Primary palette
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  
  // Secondary palette
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
  },
  
  // Neutral palette
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },
  
  // Semantic colors
  success: {
    light: '#86efac',
    main: '#22c55e',
    dark: '#15803d',
    bg: '#f0fdf4',
  },
  warning: {
    light: '#fde047',
    main: '#eab308',
    dark: '#a16207',
    bg: '#fefce8',
  },
  error: {
    light: '#fca5a5',
    main: '#ef4444',
    dark: '#b91c1c',
    bg: '#fef2f2',
  },
  info: {
    light: '#93c5fd',
    main: '#3b82f6',
    dark: '#1d4ed8',
    bg: '#eff6ff',
  },
};

// ============ Typography ============

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
    serif: ['Merriweather', 'Georgia', 'serif'],
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
};

// ============ Spacing ============

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
};

// ============ Border Radius ============

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

// ============ Shadows ============

export const shadows = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
};

// ============ Z-Index ============

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
  toast: 1700,
};

// ============ Transitions ============

export const transitions = {
  fast: '150ms ease',
  DEFAULT: '200ms ease',
  slow: '300ms ease',
  spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
};

// ============ Breakpoints ============

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============ Theme Configuration ============

export const themeConfig = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  zIndex,
  transitions,
  breakpoints,
};

// ============ Dark Mode ============

export const darkModeColors = {
  background: colors.neutral[950],
  surface: colors.neutral[900],
  surfaceHover: colors.neutral[800],
  border: colors.neutral[700],
  text: {
    primary: colors.neutral[50],
    secondary: colors.neutral[400],
    tertiary: colors.neutral[500],
  },
  accent: colors.primary[500],
};

// ============ Light Mode ============

export const lightModeColors = {
  background: colors.neutral[0],
  surface: colors.neutral[50],
  surfaceHover: colors.neutral[100],
  border: colors.neutral[200],
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[600],
    tertiary: colors.neutral[400],
  },
  accent: colors.primary[600],
};

// ============ Semantic Tokens ============

export const semanticTokens = {
  colors: {
    bg: {
      DEFAULT: lightModeColors.background,
      dark: darkModeColors.background,
    },
    surface: {
      DEFAULT: lightModeColors.surface,
      dark: darkModeColors.surface,
    },
    border: {
      DEFAULT: lightModeColors.border,
      dark: darkModeColors.border,
    },
    text: {
      primary: {
        DEFAULT: lightModeColors.text.primary,
        dark: darkModeColors.text.primary,
      },
      secondary: {
        DEFAULT: lightModeColors.text.secondary,
        dark: darkModeColors.text.secondary,
      },
    },
  },
};
