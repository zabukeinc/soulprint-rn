// src/lib/astrology/compatibility.ts

import { ZodiacSign, Element, getZodiacInfo } from './zodiac'

export interface CompatibilityResult {
  userSign: ZodiacSign; partnerSign: ZodiacSign
  overallScore: number; loveScore: number; communicationScore: number; friendshipScore: number
  summary: string; strengths: string[]; challenges: string[]; advice: string
}

const elementCompatibility: Record<Element, Record<Element, { score: number; dynamic: string }>> = {
  fire: {
    fire:  { score: 75, dynamic: 'high energy, passionate, may compete' },
    earth: { score: 40, dynamic: 'challenging \u2014 impulse meets caution' },
    air:   { score: 85, dynamic: 'high energy, passionate, inspiring' },
    water: { score: 45, dynamic: 'steam \u2014 intense but volatile' },
  },
  earth: {
    fire:  { score: 40, dynamic: 'challenging \u2014 caution meets impulse' },
    earth: { score: 80, dynamic: 'stable, grounded, may lack spark' },
    air:   { score: 50, dynamic: 'challenging \u2014 practical vs abstract' },
    water: { score: 85, dynamic: 'nurturing, stable, emotionally rich' },
  },
  air: {
    fire:  { score: 85, dynamic: 'high energy, passionate, inspiring' },
    earth: { score: 50, dynamic: 'challenging \u2014 abstract vs practical' },
    air:   { score: 70, dynamic: 'mental connection, may lack depth' },
    water: { score: 55, dynamic: 'challenging \u2014 logic meets emotion' },
  },
  water: {
    fire:  { score: 45, dynamic: 'steam \u2014 intense but volatile' },
    earth: { score: 85, dynamic: 'nurturing, stable, emotionally rich' },
    air:   { score: 55, dynamic: 'challenging \u2014 emotion meets logic' },
    water: { score: 75, dynamic: 'deep emotional bond, may overwhelm' },
  },
}

export function calculateCompatibility(userSign: ZodiacSign, partnerSign: ZodiacSign): CompatibilityResult {
  const userElement = getZodiacInfo(userSign).element
  const partnerElement = getZodiacInfo(partnerSign).element
  const compat = elementCompatibility[userElement][partnerElement]

  const sameSign = userSign === partnerSign
  const overallScore = sameSign ? 65 : compat.score

  const loveScore = Math.min(95, overallScore + (userElement === partnerElement ? 10 : 5))
  const communicationScore = Math.min(90, overallScore + (userElement === 'air' || partnerElement === 'air' ? 10 : 0))
  const friendshipScore = Math.min(92, overallScore + 5)

  const userZodiac = getZodiacInfo(userSign)
  const partnerZodiac = getZodiacInfo(partnerSign)

  const summary = sameSign
    ? `Two ${userZodiac.name}s \u2014 deep understanding, but watch for blind spots.`
    : `${userZodiac.name} and ${partnerZodiac.name}: ${compat.dynamic}.`

  const strengths = sameSign
    ? ['Deep mutual understanding', 'Shared values', 'Natural rhythm']
    : [`${userElement} meets ${partnerElement}`, compat.dynamic.split(',')[0], 'Complementary perspectives']

  const challenges = sameSign
    ? ['Shared blind spots', 'No one to balance you', 'Amplified weaknesses']
    : [compat.dynamic, 'Different needs for stimulation', 'Learning each other\u2019s language']

  const advice = sameSign
    ? 'Celebrate your mirror \u2014 but seek outside perspectives to grow.'
    : `Your differences are your strength. ${userElement} and ${partnerElement} teach each other what they lack.`

  return { userSign, partnerSign, overallScore, loveScore, communicationScore, friendshipScore, summary, strengths, challenges, advice }
}
