// src/design/tokens.ts

export const colors = {
  deepSpace:     '#0F0F23',
  royalViolet:   '#7B61FF',
  softLavender:  '#B39DFF',
  pastelLilac:   '#E2C6FF',
  lightBg:       '#F3F0FF',
  cosmicGray:    '#6B6B7D',
  white:         '#FFFFFF',
} as const

export const contrast = {
  textOnLight:  { color: colors.deepSpace,    bg: colors.white,       ratio: '15.3:1' },
  textOnCTA:    { color: colors.white,         bg: colors.royalViolet, ratio: '5.1:1'  },
  accentOnDark: { color: colors.softLavender,  bg: colors.deepSpace,   ratio: '6.8:1'  },
} as const

export const gradients = {
  cosmicViolet: ['#A78BFF', '#7B61FF'],
  deepOrbit:    ['#7B61FF', '#0F0F23'],
  nebula:       ['#E2C6FF', '#B39DFF', '#7B61FF'],
} as const

export const typography = {
  families: { heading: 'Poppins', body: 'DM Sans' },
  weights: {
    light: '300', regular: '400', medium: '500',
    semibold: '600', bold: '700', extrabold: '800',
  },
  scale: {
    display:    { fontFamily: 'Poppins',  fontSize: 88, fontWeight: '800' as const, lineHeight: 96,  letterSpacing: -2.64 },
    h1:         { fontFamily: 'Poppins',  fontSize: 48, fontWeight: '700' as const, lineHeight: 56,  letterSpacing: -0.96 },
    h2:         { fontFamily: 'Poppins',  fontSize: 32, fontWeight: '600' as const, lineHeight: 40,  letterSpacing: -0.32 },
    h3:         { fontFamily: 'Poppins',  fontSize: 24, fontWeight: '600' as const, lineHeight: 32,  letterSpacing: 0 },
    bodyLarge:  { fontFamily: 'DM Sans',  fontSize: 18, fontWeight: '400' as const, lineHeight: 30.6 },
    body:       { fontFamily: 'DM Sans',  fontSize: 16, fontWeight: '400' as const, lineHeight: 27.2 },
    caption:    { fontFamily: 'DM Sans',  fontSize: 12, fontWeight: '500' as const, lineHeight: 19.2 },
    eyebrow:    { fontFamily: 'DM Sans',  fontSize: 11, fontWeight: '700' as const, lineHeight: 16,  letterSpacing: 2.2 },
  },
} as const

export const spacing = {
  xs: 4, sm: 8, smMd: 12, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64, huge: 80,
} as const

export const radii = {
  none: 0, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, full: 100,
} as const

export const shadows = {
  ctaPrimary:      { shadowColor: '#7B61FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 3 },
  ctaPrimaryHover: { shadowColor: '#7B61FF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.45, shadowRadius: 24, elevation: 4 },
  card:            { shadowColor: '#7B61FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 2 },
  cardHover:       { shadowColor: '#7B61FF', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.15, shadowRadius: 40, elevation: 4 },
} as const

export const motion = {
  durations: { micro: 100, fast: 200, base: 300, medium: 400, slow: 600, ambient: 1000 },
  easings: {
    easeOut: [0, 0, 0.2, 1] as const,
    easeIn:  [0.4, 0, 1, 1] as const,
    spring:  [0.34, 1.56, 0.64, 1] as const,
    linear:  [0, 0, 1, 1] as const,
  },
} as const
