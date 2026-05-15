// Mock natal chart data based on onboarding inputs
// Positions in degrees (0-360), 0 = 0° Aries at left, going counter-clockwise
export interface PlanetPosition {
  name: string;
  symbol: string;
  degree: number; // 0-360
  sign: string;
  signSymbol: string;
  house: number;
  meaning: string;
}

export const natalPlanets: PlanetPosition[] = [
  { name: 'Sun', symbol: '☉', degree: 318, sign: 'Aquarius', signSymbol: '♒', house: 10, meaning: 'Your core identity. You process deeply before expressing.' },
  { name: 'Moon', symbol: '☽', degree: 172, sign: 'Libra', signSymbol: '♎', house: 6, meaning: 'Your emotional world. You seek balance in close connections.' },
  { name: 'Mercury', symbol: '☿', degree: 305, sign: 'Aquarius', signSymbol: '♒', house: 10, meaning: 'How you think and communicate. You see patterns others miss.' },
  { name: 'Venus', symbol: '♀', degree: 28, sign: 'Aries', signSymbol: '♈', house: 1, meaning: 'How you love and what you value. You lead with honesty.' },
  { name: 'Mars', symbol: '♂', degree: 265, sign: 'Capricorn', signSymbol: '♑', house: 9, meaning: 'Your drive and assertion. You move with quiet strategy.' },
  { name: 'Jupiter', symbol: '♃', degree: 118, sign: 'Leo', signSymbol: '♌', house: 5, meaning: 'Where you grow and expand. You thrive when seen for your depth.' },
  { name: 'Saturn', symbol: '♄', degree: 198, sign: 'Scorpio', signSymbol: '♏', house: 7, meaning: 'Your lessons and structure. You build trust slowly, but fully.' },
  { name: 'Uranus', symbol: '♅', degree: 12, sign: 'Aries', signSymbol: '♈', house: 1, meaning: 'Your uniqueness and rebellion. You disrupt patterns gracefully.' },
  { name: 'Neptune', symbol: '♆', degree: 342, sign: 'Pisces', signSymbol: '♓', house: 11, meaning: 'Your intuition and imagination. You feel the room before it speaks.' },
  { name: 'Pluto', symbol: '♇', degree: 278, sign: 'Capricorn', signSymbol: '♑', house: 9, meaning: 'Your transformation. You regenerate through quiet power shifts.' },
];

export const zodiacSigns = [
  { name: 'Aries', symbol: '♈', start: 0, element: 'Fire', color: '#E8A87C' },
  { name: 'Taurus', symbol: '♉', start: 30, element: 'Earth', color: '#C8A876' },
  { name: 'Gemini', symbol: '♊', start: 60, element: 'Air', color: '#8EC8D0' },
  { name: 'Cancer', symbol: '♋', start: 90, element: 'Water', color: '#9FD9D0' },
  { name: 'Leo', symbol: '♌', start: 120, element: 'Fire', color: '#F7D875' },
  { name: 'Virgo', symbol: '♍', start: 150, element: 'Earth', color: '#A8C8A0' },
  { name: 'Libra', symbol: '♎', start: 180, element: 'Air', color: '#E8DDFB' },
  { name: 'Scorpio', symbol: '♏', start: 210, element: 'Water', color: '#B890C8' },
  { name: 'Sagittarius', symbol: '♐', start: 240, element: 'Fire', color: '#D8A878' },
  { name: 'Capricorn', symbol: '♑', start: 270, element: 'Earth', color: '#8898A8' },
  { name: 'Aquarius', symbol: '♒', start: 300, element: 'Air', color: '#8B72CF' },
  { name: 'Pisces', symbol: '♓', start: 330, element: 'Water', color: '#98C8D8' },
];

export const dailyHoroscopes = [
  {
    overview: "Your Aquarius Sun is asking you to trust the pattern you've been observing. The thing you keep noticing isn't random — it's your intuition organizing data before your mind catches up.",
    love: "The Moon in Libra softens your edges today. If there's something you've been rehearsing how to say, the words will come easier than you think.",
    career: "Mercury in your 10th house sharpens your professional instincts. A small decision today about how you communicate your value will echo further than you expect.",
    growth: "Mars in Capricorn gives your actions weight. Don't mistake slow for weak — your persistence is your actual superpower.",
  },
  {
    overview: "Venus in Aries brings a directness to your emotional world. You may feel less patient with games today — that's not impatience, it's clarity.",
    love: "Your love pattern today rewards honesty over performance. The person who matters won't be shocked by your truth. They'll be relieved.",
    career: "Saturn in Scorpio asks you to look at what's working, not just what isn't. Acknowledge the structure you've built. It's more solid than you give it credit for.",
    growth: "Uranus in your first house stirs restlessness. Before you change something external, ask: what internal pattern am I actually trying to outrun?",
  },
  {
    overview: "Neptune in Pisces deepens your intuition today. You may feel things before you can explain them. Don't rush the explanation — the feeling is the data.",
    love: "Jupiter in Leo expands your heart space. A generous gesture, even a small one, will travel further than you imagine.",
    career: "Pluto in Capricorn brings a quiet transformation to how you show up professionally. The version of you that's emerging doesn't need to announce itself.",
    growth: "Your 12-month theme whispers today: the pause before you speak is not hesitation. It's wisdom gathering itself.",
  },
];

export const moonPhases = [
  { phase: 'New Moon', emoji: '🌑', meaning: 'Plant intentions. Begin quietly.' },
  { phase: 'Waxing Crescent', emoji: '🌒', meaning: 'Build momentum. Take small steps.' },
  { phase: 'First Quarter', emoji: '🌓', meaning: 'Make decisions. Face the tension.' },
  { phase: 'Waxing Gibbous', emoji: '🌔', meaning: 'Refine and adjust. Almost there.' },
  { phase: 'Full Moon', emoji: '🌕', meaning: 'Illuminate what was hidden. Release.' },
  { phase: 'Waning Gibbous', emoji: '🌖', meaning: 'Share what you learned. Gratitude.' },
  { phase: 'Last Quarter', emoji: '🌗', meaning: 'Let go. Clean house internally.' },
  { phase: 'Waning Crescent', emoji: '🌘', meaning: 'Rest. Gather before the next cycle.' },
];

export function getDailyHoroscopeIndex() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay) % dailyHoroscopes.length;
}

export function getTodayHoroscope() {
  return dailyHoroscopes[getDailyHoroscopeIndex()];
}

export function getMoonPhase() {
  const day = new Date().getDate();
  return moonPhases[day % moonPhases.length];
}
