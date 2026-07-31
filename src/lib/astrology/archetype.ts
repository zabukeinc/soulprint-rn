// src/lib/astrology/archetype.ts

import { ZodiacSign, Element, getZodiacInfo } from './zodiac'
import { LifePathNumber, getNumerologyInfo } from './numerology'

export interface Archetype {
  name: string; tagline: string; description: string
  patterns: string[]; strengths: string[]; growth: string[]
}

const elementAdjectives: Record<Element, { vibe: string; trait: string }> = {
  fire:  { vibe: 'Bold',     trait: 'passionate' },
  earth: { vibe: 'Grounded', trait: 'practical' },
  air:   { vibe: 'Quiet',    trait: 'analytical' },
  water: { vibe: 'Deep',     trait: 'intuitive' },
}

const lifePathRoles: Record<LifePathNumber, string> = {
 1: 'Pioneer', 2: 'Diplomat', 3: 'Creator', 4: 'Builder',
 5: 'Adventurer', 6: 'Healer', 7: 'Strategist', 8: 'Achiever',
 9: 'Humanitarian', 11: 'Visionary', 22: 'Architect', 33: 'Guide',
}

const focusPatterns: Record<string, string[]> = {
  love:        ['Private Processor', 'Pattern Reader', 'Consistency Seeker', 'Quiet Intensity'],
  lost:        ['Wayfinder', 'Meaning Seeker', 'Crossroads Watcher', 'Inner Compass'],
  'self-worth':['Quiet Validator', 'Self Observer', 'Worth Builder', 'Gentle Advocate'],
  career:      ['Strategic Mover', 'Pattern Optimizer', 'Vision Holder', 'Steady Climber'],
  healing:     ['Gentle Healer', 'Past Integrator', 'Emotion Processor', 'Slow Bloomer'],
  purpose:     ['Purpose Seeker', 'Meaning Weaver', 'Deep Diver', 'North Star Follower'],
}

const elementGrowth: Record<Element, string[]> = {
  fire:  ['Slow down before acting', 'Listen before deciding', 'Patience with others'],
  earth: ['Embrace change', 'Feel before planning', 'Let go of control'],
  air:   ['Stay with feelings', 'Finish what you start', 'Ground your ideas'],
  water: ['Set boundaries', 'Act on your feelings', 'Trust your strength'],
}

export function deriveArchetype(zodiacSign: ZodiacSign, lifePath: LifePathNumber, focus: string): Archetype {
  const zodiacInfo = getZodiacInfo(zodiacSign)
  const element = zodiacInfo.element
  const numInfo = getNumerologyInfo(lifePath)

  const adjective = elementAdjectives[element].vibe
  const role = lifePathRoles[lifePath]
  const name = `The ${adjective} ${role}`

  const tagline = `${element.charAt(0).toUpperCase() + element.slice(1)} \u00B7 ${zodiacInfo.modality.charAt(0).toUpperCase() + zodiacInfo.modality.slice(1)} \u00B7 ${role}`
  const patterns = focusPatterns[focus] || focusPatterns.purpose
  const strengths = [...zodiacInfo.traits.slice(0, 2), ...numInfo.strengths.slice(0, 2)]
  const growth = elementGrowth[element]
  const description = `As ${name}, you carry the ${elementAdjectives[element].trait} nature of ${zodiacInfo.name} with the life path of ${numInfo.name}. Your focus on ${focus} shapes how these qualities express themselves day to day.`

  return { name, tagline, description, patterns, strengths, growth }
}
