// src/lib/astrology/moonPhase.ts

export type MoonPhase =
  | 'new' | 'waxingCrescent' | 'firstQuarter' | 'waxingGibbous'
  | 'full' | 'waningGibbous' | 'lastQuarter' | 'waningCrescent'

export interface MoonPhaseInfo {
  phase: MoonPhase; name: string; symbol: string; illumination: number; meaning: string
}

const KNOWN_NEW_MOON_JDE = 2451550.1
const SYNODIC_MONTH = 29.530588853

function toJulianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5
}

const MOON_PHASE_INFO: Record<MoonPhase, Omit<MoonPhaseInfo, 'illumination'>> = {
  new:            { phase: 'new',             name: 'New Moon',          symbol: '\uD83C\uDF11', meaning: 'A time for beginnings and setting intentions.' },
  waxingCrescent: { phase: 'waxingCrescent',  name: 'Waxing Crescent',   symbol: '\uD83C\uDF12', meaning: 'Growth and building momentum.' },
  firstQuarter:   { phase: 'firstQuarter',    name: 'First Quarter',     symbol: '\uD83C\uDF13', meaning: 'Action and commitment to your path.' },
  waxingGibbous:  { phase: 'waxingGibbous',   name: 'Waxing Gibbous',    symbol: '\uD83C\uDF14', meaning: 'Refinement and preparation.' },
  full:           { phase: 'full',            name: 'Full Moon',         symbol: '\uD83C\uDF15', meaning: 'Illumination and culmination.' },
  waningGibbous:  { phase: 'waningGibbous',   name: 'Waning Gibbous',    symbol: '\uD83C\uDF16', meaning: 'Gratitude and sharing.' },
  lastQuarter:    { phase: 'lastQuarter',     name: 'Last Quarter',      symbol: '\uD83C\uDF17', meaning: 'Release and forgiveness.' },
  waningCrescent: { phase: 'waningCrescent',  name: 'Waning Crescent',   symbol: '\uD83C\uDF18', meaning: 'Rest and reflection.' },
}

export function getMoonPhase(date = new Date()): MoonPhaseInfo {
  const jde = toJulianDay(date)
  const daysSinceNew = ((jde - KNOWN_NEW_MOON_JDE) % SYNODIC_MONTH + SYNODIC_MONTH) % SYNODIC_MONTH
  const phaseFraction = daysSinceNew / SYNODIC_MONTH
  const illumination = Math.round((1 - Math.cos(2 * Math.PI * phaseFraction)) / 2 * 100)

  let phase: MoonPhase
  if (phaseFraction < 0.03 || phaseFraction > 0.97) phase = 'new'
  else if (phaseFraction < 0.22) phase = 'waxingCrescent'
  else if (phaseFraction < 0.28) phase = 'firstQuarter'
  else if (phaseFraction < 0.47) phase = 'waxingGibbous'
  else if (phaseFraction < 0.53) phase = 'full'
  else if (phaseFraction < 0.72) phase = 'waningGibbous'
  else if (phaseFraction < 0.78) phase = 'lastQuarter'
  else phase = 'waningCrescent'

  return { ...MOON_PHASE_INFO[phase], illumination }
}
