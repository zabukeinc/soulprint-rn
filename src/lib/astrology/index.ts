// src/lib/astrology/index.ts

export { getZodiacSign, getZodiacInfo } from './zodiac'
export type { ZodiacSign, Element, Modality, ZodiacInfo } from './zodiac'

export { calculateLifePath, getNumerologyInfo } from './numerology'
export type { LifePathNumber, NumerologyInfo } from './numerology'

export { getMoonPhase } from './moonPhase'
export type { MoonPhase, MoonPhaseInfo } from './moonPhase'

export { calculateNatalChart } from './natal'
export type { Planet, NatalPosition, NatalChart } from './natal'

export { deriveArchetype } from './archetype'
export type { Archetype } from './archetype'

export { generateDailyHoroscope } from './horoscope'
export type { DailyHoroscope } from './horoscope'

export { calculateCompatibility } from './compatibility'
export type { CompatibilityResult } from './compatibility'
