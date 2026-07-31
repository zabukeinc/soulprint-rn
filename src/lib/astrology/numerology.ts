// src/lib/astrology/numerology.ts

export type LifePathNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11 | 22 | 33

export interface NumerologyInfo {
  lifePath: LifePathNumber; name: string; description: string
  strengths: string[]; challenges: string[]
}

function reduceNumber(n: number): LifePathNumber {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, b) => a + Number(b), 0)
  }
  return n as LifePathNumber
}

export function calculateLifePath(year: number, month: number, day: number): LifePathNumber {
  const digits = `${year}${month}${day}`.split('').map(Number)
  const sum = digits.reduce((a, b) => a + b, 0)
  return reduceNumber(sum)
}

const NUMEROLOGY_INFO: Record<LifePathNumber, NumerologyInfo> = {
 1:  { lifePath: 1,  name: 'The Pioneer',     description: 'Leadership, independence, and the drive to forge new paths.', strengths: ['Independent', 'Determined', 'Innovative'], challenges: ['Stubborn', 'Impatient'] },
 2:  { lifePath: 2,  name: 'The Diplomat',    description: 'Cooperation, sensitivity, and the gift of mediation.', strengths: ['Cooperative', 'Empathetic', 'Patient'], challenges: ['Over-sensitive', 'Indecisive'] },
 3:  { lifePath: 3,  name: 'The Creator',     description: 'Expression, joy, and the power of communication.', strengths: ['Creative', 'Expressive', 'Optimistic'], challenges: ['Scattered', 'Superficial'] },
 4:  { lifePath: 4,  name: 'The Builder',     description: 'Structure, discipline, and the ability to manifest.', strengths: ['Disciplined', 'Reliable', 'Hardworking'], challenges: ['Rigid', 'Controlling'] },
 5:  { lifePath: 5,  name: 'The Adventurer',  description: 'Freedom, change, and the hunger for experience.', strengths: ['Adaptable', 'Curious', 'Magnetic'], challenges: ['Restless', 'Impulsive'] },
 6:  { lifePath: 6,  name: 'The Nurturer',    description: 'Responsibility, love, and the instinct to care for others.', strengths: ['Caring', 'Responsible', 'Harmonious'], challenges: ['Self-sacrificing', 'Worrier'] },
 7:  { lifePath: 7,  name: 'The Seeker',      description: 'Wisdom, introspection, and the search for deeper truth.', strengths: ['Analytical', 'Intuitive', 'Wise'], challenges: ['Isolated', 'Skeptical'] },
 8:  { lifePath: 8,  name: 'The Powerhouse',  description: 'Ambition, material mastery, and the drive to achieve.', strengths: ['Ambitious', 'Confident', 'Strategic'], challenges: ['Workaholic', 'Controlling'] },
 9:  { lifePath: 9,  name: 'The Humanitarian',description: 'Compassion, completion, and the desire to serve.', strengths: ['Compassionate', 'Idealistic', 'Generous'], challenges: ['Martyr complex', 'Aloof'] },
 11: { lifePath: 11, name: 'The Visionary',   description: 'Intuition, inspiration, and the bridge to higher knowing.', strengths: ['Intuitive', 'Inspiring', 'Sensitive'], challenges: ['Anxious', 'Overwhelmed'] },
 22: { lifePath: 22, name: 'The Architect',   description: 'Manifestation at scale \u2014 turning visions into reality.', strengths: ['Practical visionary', 'Powerful', 'Capable'], challenges: ['Pressure', 'Self-doubt'] },
 33: { lifePath: 33, name: 'The Teacher',     description: 'Service, healing, and the calling to uplift others.', strengths: ['Compassionate', 'Wise', 'Healing'], challenges: ['Self-neglect', 'Overwhelmed'] },
}

export function getNumerologyInfo(lifePath: LifePathNumber): NumerologyInfo {
  return NUMEROLOGY_INFO[lifePath]
}
