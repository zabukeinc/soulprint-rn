// src/lib/astrology/natal.ts

import { ZodiacSign } from './zodiac'

export type Planet = 'sun' | 'moon' | 'mercury' | 'venus' | 'mars'

export interface NatalPosition {
  planet: Planet; sign: ZodiacSign; degrees: number; fullDegrees: number; retrograde: boolean; meaning: string
}

export interface NatalChart {
  sun: NatalPosition; moon: NatalPosition; mercury: NatalPosition
  venus: NatalPosition; mars: NatalPosition
  birthDate: string; birthTime: string | null
  location: { city: string; lat: number; lng: number; timezone: string }
}

const J2000_JD = 2451545.0

const PLANETARY_ELEMENTS: Record<Planet, { L0: number; n: number }> = {
  sun:     { L0: 280.460,  n: 0.9856474 },
  moon:    { L0: 218.316,  n: 13.176396 },
  mercury: { L0: 252.250,  n: 4.0923771 },
  venus:   { L0: 181.979,  n: 1.6021687 },
  mars:    { L0: 355.433,  n: 0.5240207 },
}

function toJulianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5
}

function normalize(deg: number): number {
  return ((deg % 360) + 360) % 360
}

const SIGNS_ORDER: ZodiacSign[] = [
  'aries','taurus','gemini','cancer','leo','virgo',
  'libra','scorpio','sagittarius','capricorn','aquarius','pisces'
]

const PLANET_MEANINGS: Record<Planet, Partial<Record<ZodiacSign, string>>> = {
  sun: {
    aries: 'Your identity is forged through action and initiative.',
    taurus: 'Your identity is rooted in stability and the senses.',
    gemini: 'Your identity is shaped by curiosity and communication.',
    cancer: 'Your identity flows from emotional connection and care.',
    leo: 'Your identity radiates through creativity and self-expression.',
    virgo: 'Your identity is crafted through precision and service.',
    libra: 'Your identity is found in balance and relationship.',
    scorpio: 'Your identity is forged through intensity and transformation.',
    sagittarius: 'Your identity is shaped by adventure and meaning.',
    capricorn: 'Your identity is built through discipline and ambition.',
    aquarius: 'Your identity is rooted in independence and vision.',
    pisces: 'Your identity flows from compassion and imagination.',
  },
  moon: {
    aries: 'Your emotions are immediate and fiery.',
    taurus: 'Your emotions seek stability and comfort.',
    gemini: 'Your emotions are processed through thought.',
    cancer: 'Your emotions are deep and nurturing.',
    leo: 'Your emotions are warm and expressive.',
    virgo: 'Your emotions are processed through analysis.',
    libra: 'Your emotions seek harmony and balance.',
    scorpio: 'Your emotions are intense and private.',
    sagittarius: 'Your emotions are expansive and optimistic.',
    capricorn: 'Your emotions are controlled and reserved.',
    aquarius: 'Your emotions are detached and observant.',
    pisces: 'Your emotions are fluid and empathic.',
  },
  mercury: {
    aries: 'You communicate directly and quickly.',
    taurus: 'You communicate deliberately and practically.',
    gemini: 'You communicate with versatility and wit.',
    cancer: 'You communicate with feeling and memory.',
    leo: 'You communicate with warmth and drama.',
    virgo: 'You communicate precisely and analytically.',
    libra: 'You communicate diplomatically and fairly.',
    scorpio: 'You communicate with depth and probing.',
    sagittarius: 'You communicate with enthusiasm and vision.',
    capricorn: 'You communicate concisely and authoritatively.',
    aquarius: 'You communicate with originality and objectivity.',
    pisces: 'You communicate intuitively and poetically.',
  },
  venus: {
    aries: 'You love passionately and impulsively.',
    taurus: 'You love sensually and steadfastly.',
    gemini: 'You love through conversation and play.',
    cancer: 'You love nurturing and protectively.',
    leo: 'You love generously and proudly.',
    virgo: 'You love through devotion and acts of service.',
    libra: 'You love harmoniously and romantically.',
    scorpio: 'You love intensely and exclusively.',
    sagittarius: 'You love freely and adventurously.',
    capricorn: 'You love committedly and responsibly.',
    aquarius: 'You love unconventionally and as a friend first.',
    pisces: 'You love unconditionally and romantically.',
  },
  mars: {
    aries: 'You act with urgency and courage.',
    taurus: 'You act with patience and persistence.',
    gemini: 'You act through adaptability and quick thinking.',
    cancer: 'You act driven by emotional need.',
    leo: 'You act with confidence and flair.',
    virgo: 'You act with precision and technique.',
    libra: 'You act through cooperation and strategy.',
    scorpio: 'You act with intensity and strategy.',
    sagittarius: 'You act with conviction and speed.',
    capricorn: 'You act with discipline and purpose.',
    aquarius: 'You act with innovation and idealism.',
    pisces: 'You act guided by intuition and feeling.',
  },
}

function calcPlanetPosition(planet: Planet, daysSinceJ2000: number): NatalPosition {
  const elements = PLANETARY_ELEMENTS[planet]
  const meanLongitude = normalize(elements.L0 + elements.n * daysSinceJ2000)
  const signIndex = Math.floor(meanLongitude / 30)
  const sign = SIGNS_ORDER[signIndex] || 'aries'
  const degreesInSign = meanLongitude % 30
  const meaning = PLANET_MEANINGS[planet]?.[sign] ?? ''

  return { planet, sign, degrees: degreesInSign, fullDegrees: meanLongitude, retrograde: false, meaning }
}

export function calculateNatalChart(birth: {
  date: string; time: string | null
  location: { city: string; lat: number; lng: number; timezone: string }
}): NatalChart {
  const [year, month, day] = birth.date.split('-').map(Number)
  let hour = 12, minute = 0
  if (birth.time) {
    const [h, m] = birth.time.split(':').map(Number)
    hour = h; minute = m
  }
  const birthDate = new Date(year, month - 1, day, hour, minute)
  const jd = toJulianDay(birthDate)
  const daysSinceJ2000 = jd - J2000_JD

  return {
    sun: calcPlanetPosition('sun', daysSinceJ2000),
    moon: calcPlanetPosition('moon', daysSinceJ2000),
    mercury: calcPlanetPosition('mercury', daysSinceJ2000),
    venus: calcPlanetPosition('venus', daysSinceJ2000),
    mars: calcPlanetPosition('mars', daysSinceJ2000),
    birthDate: birth.date, birthTime: birth.time, location: birth.location,
  }
}
