const COLORS = {
  ink: '#111111',
  paper: '#fffdf5',
  page: '#f4e9d8',
  yellow: '#ffe98f',
  pink: '#ffb8e6',
  blue: '#b3c5ff',
  onAccent: '#111111',
  focus: '#2a5cff',
} as const;

export const THEME = {
  colors: COLORS,
  fonts: { regular: 'SpaceGrotesk_400Regular', bold: 'SpaceGrotesk_700Bold' },
  fontSizes: { small: 14, body: 17, heading: 24, title: 56 },
  spacing: { xs: 4, s: 8, m: 12, l: 20, xl: 32 },
  border: { borderWidth: 3, borderColor: COLORS.ink },
  shadows: { large: `6px 6px 0 ${COLORS.ink}`, small: `4px 4px 0 ${COLORS.ink}` },
  pressedOffset: 4,
  pageWidth: 672,
} as const;
