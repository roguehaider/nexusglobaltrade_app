export const colors = {
  background: '#0D0D0D',
  backgroundSecondary: '#1A1A1A',
  accent: '#FFA726',
  accentMuted: 'rgba(255, 167, 38, 0.15)',
  secondaryAccent: '#0A2A4F',
  secondaryAccentLight: 'rgba(10, 42, 79, 0.45)',
  textPrimary: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#2A2A2A',
  error: '#FF5252',
  success: '#66BB6A',
  overlay: 'rgba(0,0,0,0.65)',
  card: '#141414',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const typography = {
  title: 28,
  h1: 22,
  h2: 18,
  body: 16,
  small: 14,
  caption: 12,
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  soft: {
    shadowColor: '#FFA726',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
} as const;
