// src/lib/astrology/horoscope.ts

import { NatalChart } from './natal'
import { ZodiacSign } from './zodiac'
import { getMoonPhase, MoonPhaseInfo } from './moonPhase'
import { getDayOfYear } from '@/src/lib/dates'

export interface DailyHoroscope {
  date: string
  categories: { overview: string; love: string; career: string; growth: string }
  moonPhase: MoonPhaseInfo
  luckyHour: number
  affirmation: string
}

const HOROSCOPE_CONTENT: Record<ZodiacSign, {
  overview: string[]; love: string[]; career: string[]; growth: string[]
}> = {
  aries: {
    overview: ['Your fire is your compass today. Trust where it points.', 'Slow down \u2014 the rush is hiding the real opportunity.', 'Your boldness opens a door you didn\u2019t expect.'],
    love: ['Say what you mean. Directness is your love language.', 'Passion is close. Don\u2019t confuse it with urgency.', 'Your warmth draws someone in today.'],
    career: ['Lead with conviction. Others are waiting for your signal.', 'A quick decision pays off. Trust your gut.', 'Don\u2019t let impatience rush a good plan.'],
    growth: ['Pausing is not weakness. It\u2019s strategy.', 'Channel your fire into one thing today.', 'Your independence is a gift \u2014 share it.'],
  },
  taurus: {
    overview: ['Stability is your superpower. Don\u2019t abandon it for novelty.', 'Your senses are speaking. Listen with your body.', 'Patience pays today \u2014 let things ripen.'],
    love: ['Show your loyalty through small acts, not grand gestures.', 'Comfort is your love language. Share it.', 'Don\u2019t confuse stubbornness with devotion.'],
    career: ['Your consistency is noticed. Keep showing up.', 'A practical approach wins over flash.', 'Don\u2019t resist change \u2014 adapt at your pace.'],
    growth: ['Let go of one thing you\u2019re holding too tightly.', 'Pleasure is not indulgence. It\u2019s restoration.', 'Your groundedness anchors others.'],
  },
  gemini: {
    overview: ['Your curiosity unlocks a new perspective today.', 'Too many options? Pick one and go deep.', 'Your words carry more weight than you think.'],
    love: ['Conversation is your foreplay. Talk first.', 'Don\u2019t let restlessness sabotage connection.', 'Your wit opens a heart today.'],
    career: ['Your adaptability is your edge. Use it.', 'Follow through \u2014 don\u2019t just start.', 'A new idea is worth pursuing.'],
    growth: ['Finish what you start today.', 'Depth over breadth \u2014 choose one thing.', 'Your silence is also communication.'],
  },
  cancer: {
    overview: ['Your intuition is loud today. Trust it.', 'Your emotions are information, not a problem.', 'Home is where your power resets.'],
    love: ['Show your care through presence, not words.', 'Your vulnerability is your strength.', 'Don\u2019t retreat \u2014 reach out.'],
    career: ['Your memory and care are assets. Use them.', 'Don\u2019t take criticism personally.', 'A nurturing approach solves a problem.'],
    growth: ['Boundaries are self-care, not rejection.', 'Feel the feeling, then decide.', 'Your sensitivity is a radar, not a weakness.'],
  },
  leo: {
    overview: ['Your warmth lights up the room. Share it.', 'Don\u2019t confuse attention with connection.', 'Your creativity is asking for expression.'],
    love: ['Generosity is your love language. Give freely.', 'Let others shine too \u2014 it doesn\u2019t dim you.', 'Your pride is protecting something. What?'],
    career: ['Your confidence opens doors. Walk through.', 'Lead with warmth, not ego.', 'Recognition is coming. Stay grounded.'],
    growth: ['You don\u2019t need an audience to be worthy.', 'Let someone else take the lead today.', 'Your vulnerability is brave, not weak.'],
  },
  virgo: {
    overview: ['Your precision is your gift. Don\u2019t apologize for it.', 'Perfection is the enemy of done.', 'Your service is love in action.'],
    love: ['Show care through acts, not words.', 'Don\u2019t criticize what you love.', 'Your devotion runs deep. Let it show.'],
    career: ['Your analysis solves a problem others missed.', 'Done is better than perfect.', 'Your reliability is your reputation.'],
    growth: ['Let go of one thing that\u2019s not quite right.', 'Rest is productive.', 'You are enough as you are.'],
  },
  libra: {
    overview: ['Balance is your gift. Don\u2019t lose yourself maintaining it.', 'Your fairness is needed today.', 'Beauty restores your peace.'],
    love: ['Harmony is your love language. Create it.', 'Don\u2019t avoid conflict \u2014 address it gently.', 'Your charm opens a door today.'],
    career: ['Your diplomacy diffuses tension. Use it.', 'Make a decision \u2014 don\u2019t wait for perfect balance.', 'Your aesthetic sense is an asset.'],
    growth: ['Your opinion matters too.', 'Conflict is not the enemy of harmony.', 'Choose yourself first today.'],
  },
  scorpio: {
    overview: ['Your intensity is your power. Don\u2019t dilute it.', 'What you\u2019re avoiding is what you need to face.', 'Your depth is your gift. Dive.'],
    love: ['Your loyalty is fierce. Share it wisely.', 'Vulnerability is your strength, not weakness.', 'Don\u2019t test \u2014 trust.'],
    career: ['Your strategic mind sees what others miss.', 'Your focus is your edge. Use it.', 'Don\u2019t hold grudges \u2014 move forward.'],
    growth: ['Let go of one thing you\u2019re controlling.', 'Your feelings are not a threat.', 'Trust is a risk worth taking.'],
  },
  sagittarius: {
    overview: ['Your optimism is your compass. Follow it.', 'Freedom is calling. Answer.', 'Your honesty is refreshing \u2014 use it kindly.'],
    love: ['Adventure is your love language. Share it.', 'Don\u2019t flee from depth \u2014 stay.', 'Your enthusiasm is contagious.'],
    career: ['Your vision sees the big picture. Share it.', 'Follow through on your promises.', 'A new opportunity is worth exploring.'],
    growth: ['Commitment is not a cage.', 'Stay with one thing today.', 'Your bluntness can wound. Temper it.'],
  },
  capricorn: {
    overview: ['Your discipline builds something lasting today.', 'Don\u2019t forget to rest on the climb.', 'Your ambition is valid. Keep going.'],
    love: ['Show your devotion through presence.', 'Don\u2019t let work replace connection.', 'Your steadiness is your love language.'],
    career: ['Your strategy pays off. Trust the plan.', 'Don\u2019t carry it all alone \u2014 delegate.', 'Your patience is your advantage.'],
    growth: ['Rest is not laziness.', 'Let someone help you.', 'Your feelings deserve attention too.'],
  },
  aquarius: {
    overview: ['Your vision is ahead of its time. Share it.', 'Don\u2019t confuse detachment with independence.', 'Your individuality is your gift.'],
    love: ['Friendship is the foundation of your love.', 'Don\u2019t disappear into your mind.', 'Your uniqueness is attractive.'],
    career: ['Your innovation solves a problem. Speak up.', 'Collaborate \u2014 you don\u2019t have to do it alone.', 'Your idealism is an asset, not naivety.'],
    growth: ['Your feelings are not a distraction.', 'Connection is not conformity.', 'Stay present with one person today.'],
  },
  pisces: {
    overview: ['Your intuition is your guide. Trust it.', 'Your compassion heals. Don\u2019t forget yourself.', 'Your imagination is asking for expression.'],
    love: ['Your empathy is your love language.', 'Don\u2019t lose yourself in someone else.', 'Your gentleness is your strength.'],
    career: ['Your creativity solves a problem. Offer it.', 'Don\u2019t let overwhelm stop you.', 'Your sensitivity is your radar.'],
    growth: ['Boundaries protect your softness.', 'Ground yourself before helping others.', 'Your feelings are valid, not a burden.'],
  },
}

const AFFIRMATIONS: string[] = [
  'I trust what I know.', 'I am allowed to take up space.', 'My feelings are valid.',
  'I choose honesty over comfort.', 'I am enough as I am.', 'I trust the timing of my life.',
  'I release what I cannot control.',
]

export function generateDailyHoroscope(natal: NatalChart, date = new Date()): DailyHoroscope {
  const sunSign = natal.sun.sign
  const content = HOROSCOPE_CONTENT[sunSign]
  const dayOfYear = getDayOfYear(date)

  return {
    date: date.toISOString().split('T')[0],
    categories: {
      overview: content.overview[dayOfYear % content.overview.length],
      love: content.love[dayOfYear % content.love.length],
      career: content.career[dayOfYear % content.career.length],
      growth: content.growth[dayOfYear % content.growth.length],
    },
    moonPhase: getMoonPhase(date),
    luckyHour: dayOfYear % 24,
    affirmation: AFFIRMATIONS[dayOfYear % AFFIRMATIONS.length],
  }
}
