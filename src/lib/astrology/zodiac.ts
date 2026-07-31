// src/lib/astrology/zodiac.ts

export type ZodiacSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces'

export type Element = 'fire' | 'earth' | 'air' | 'water'
export type Modality = 'cardinal' | 'fixed' | 'mutable'

export interface ZodiacInfo {
  sign: ZodiacSign; name: string; symbol: string; element: Element
  modality: Modality; rulingPlanet: string; dates: string; traits: string[]
}

const ZODIAC_RANGES: { sign: ZodiacSign; start: [number, number]; end: [number, number] }[] = [
  { sign: 'capricorn',   start: [12, 22], end: [1, 19] },
  { sign: 'aquarius',    start: [1, 20],  end: [2, 18] },
  { sign: 'pisces',      start: [2, 19],  end: [3, 20] },
  { sign: 'aries',       start: [3, 21],  end: [4, 19] },
  { sign: 'taurus',      start: [4, 20],  end: [5, 20] },
  { sign: 'gemini',      start: [5, 21],  end: [6, 20] },
  { sign: 'cancer',      start: [6, 21],  end: [7, 22] },
  { sign: 'leo',         start: [7, 23],  end: [8, 22] },
  { sign: 'virgo',       start: [8, 23],  end: [9, 22] },
  { sign: 'libra',       start: [9, 23],  end: [10, 22] },
  { sign: 'scorpio',     start: [10, 23], end: [11, 21] },
  { sign: 'sagittarius', start: [11, 22], end: [12, 21] },
]

const ZODIAC_INFO: Record<ZodiacSign, ZodiacInfo> = {
  aries:       { sign: 'aries', name: 'Aries', symbol: '\u2648', element: 'fire', modality: 'cardinal', rulingPlanet: 'Mars', dates: 'Mar 21 - Apr 19', traits: ['Bold', 'Direct', 'Energetic', 'Pioneering'] },
  taurus:      { sign: 'taurus', name: 'Taurus', symbol: '\u2649', element: 'earth', modality: 'fixed', rulingPlanet: 'Venus', dates: 'Apr 20 - May 20', traits: ['Grounded', 'Patient', 'Loyal', 'Sensual'] },
  gemini:      { sign: 'gemini', name: 'Gemini', symbol: '\u264A', element: 'air', modality: 'mutable', rulingPlanet: 'Mercury', dates: 'May 21 - Jun 20', traits: ['Curious', 'Adaptable', 'Witty', 'Communicative'] },
  cancer:      { sign: 'cancer', name: 'Cancer', symbol: '\u264B', element: 'water', modality: 'cardinal', rulingPlanet: 'Moon', dates: 'Jun 21 - Jul 22', traits: ['Nurturing', 'Intuitive', 'Protective', 'Emotional'] },
  leo:         { sign: 'leo', name: 'Leo', symbol: '\u264C', element: 'fire', modality: 'fixed', rulingPlanet: 'Sun', dates: 'Jul 23 - Aug 22', traits: ['Confident', 'Generous', 'Warm', 'Creative'] },
  virgo:       { sign: 'virgo', name: 'Virgo', symbol: '\u264D', element: 'earth', modality: 'mutable', rulingPlanet: 'Mercury', dates: 'Aug 23 - Sep 22', traits: ['Analytical', 'Practical', 'Diligent', 'Grounded'] },
  libra:       { sign: 'libra', name: 'Libra', symbol: '\u264E', element: 'air', modality: 'cardinal', rulingPlanet: 'Venus', dates: 'Sep 23 - Oct 22', traits: ['Diplomatic', 'Fair', 'Social', 'Harmonious'] },
  scorpio:     { sign: 'scorpio', name: 'Scorpio', symbol: '\u264F', element: 'water', modality: 'fixed', rulingPlanet: 'Pluto', dates: 'Oct 23 - Nov 21', traits: ['Intense', 'Passionate', 'Loyal', 'Magnetic'] },
  sagittarius: { sign: 'sagittarius', name: 'Sagittarius', symbol: '\u2650', element: 'fire', modality: 'mutable', rulingPlanet: 'Jupiter', dates: 'Nov 22 - Dec 21', traits: ['Adventurous', 'Optimistic', 'Honest', 'Free-spirited'] },
  capricorn:   { sign: 'capricorn', name: 'Capricorn', symbol: '\u2651', element: 'earth', modality: 'cardinal', rulingPlanet: 'Saturn', dates: 'Dec 22 - Jan 19', traits: ['Disciplined', 'Ambitious', 'Patient', 'Responsible'] },
  aquarius:    { sign: 'aquarius', name: 'Aquarius', symbol: '\u2652', element: 'air', modality: 'fixed', rulingPlanet: 'Uranus', dates: 'Jan 20 - Feb 18', traits: ['Independent', 'Innovative', 'Humanitarian', 'Analytical'] },
  pisces:      { sign: 'pisces', name: 'Pisces', symbol: '\u2653', element: 'water', modality: 'mutable', rulingPlanet: 'Neptune', dates: 'Feb 19 - Mar 20', traits: ['Compassionate', 'Intuitive', 'Artistic', 'Gentle'] },
}

export function getZodiacSign(month: number, day: number): ZodiacSign {
  for (const range of ZODIAC_RANGES) {
    const [sm, sd] = range.start
    const [em, ed] = range.end
    if (sm > em) {
      if ((month === sm && day >= sd) || (month === em && day <= ed) || (month > sm) || (month < em)) {
        return range.sign
      }
    } else {
      if ((month === sm && day >= sd) || (month === em && day <= ed) || (month > sm && month < em)) {
        return range.sign
      }
    }
  }
  return 'capricorn'
}

export function getZodiacInfo(sign: ZodiacSign): ZodiacInfo {
  return ZODIAC_INFO[sign]
}
