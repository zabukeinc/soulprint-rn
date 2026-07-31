// 14 daily signals (2 weeks worth)
export const dailySignals = [
  { title: "Your mind wants clarity, but your heart needs emotional evidence.", sub: "A calm day for naming what you usually keep private." },
  { title: "The thing you're avoiding mentioning is the thing that needs saying.", sub: "Directness serves you better than politeness today." },
  { title: "You've been holding space for others. Today, hold some for yourself.", sub: "Your energy is a resource — check if you're running low." },
  { title: "A small decision today carries more weight than you think.", sub: "Pay attention to the quiet pull, not the loud push." },
  { title: "Your pattern of over-giving looks like kindness, but it's self-erasure.", sub: "Notice where you say yes when you mean maybe." },
  { title: "Today rewards stillness more than action.", sub: "You don't have to respond to everything immediately." },
  { title: "Someone's reaction to you isn't about you. It's about their pattern.", sub: "A good day to observe without absorbing." },
  { title: "The emotion you're dismissing is the one that needs your attention most.", sub: "Numbness is still a signal." },
  { title: "You're not behind. You're gathering data at your own pace.", sub: "Comparison is a thief, especially with yourself." },
  { title: "What feels like resistance might actually be protection.", sub: "Your body knows before your mind admits it." },
  { title: "A boundary you set gently is still a boundary.", sub: "You don't need to justify your limits." },
  { title: "The pattern repeats until it's understood, not until it's perfect.", sub: "Forgiveness is information, not permission." },
  { title: "You're allowed to want something without knowing how to get it yet.", sub: "Desire is direction." },
  { title: "Rest is not the absence of work. It's the presence of care.", sub: "You don't earn rest by exhaustion." },
];

export const dailyInsights = [
  '"The pattern you keep avoiding addressing is the one running your decisions."',
  '"You don\'t need more information. You need more honesty with yourself."',
  '"Your comfort zone isn\'t safe — it\'s just familiar."',
  '"The way you process silence says more about you than the way you process noise."',
  '"What you\'re afraid to say is what someone needs to hear."',
  '"Rest is not the opposite of productivity. It\'s the foundation."',
  '"You keep waiting for permission that only you can give."',
];

export const dailyMoves = [
  'Say the thing before it becomes resentment.',
  'Ask for what you need without apologizing.',
  'Let one expectation go that isn\'t yours.',
  'Name the feeling instead of analyzing it.',
  'Choose one boundary and hold it gently.',
  'Respond, don\'t react. The pause is the power.',
  'Write down the thing you keep replaying.',
];

export const weeklyReadings = [
  {
    title: "This week, your emotions moved faster than your words.",
    body: "You felt things before you could name them. That's not a delay — that's depth. The people who matter will wait for your real response, not your fast one.",
  },
  {
    title: "You kept showing up for others while quietly losing ground yourself.",
    body: "This week, your generosity was visible. Your exhaustion was not. Next week, try matching your output to your actual reserves, not your imagined ones.",
  },
  {
    title: "A pattern you thought you'd outgrown made a brief return.",
    body: "You didn't fail. You got data. Old patterns don't mean you're back at square one — they mean you're human, and the work is ongoing.",
  },
  {
    title: "You held more uncertainty than you gave yourself credit for.",
    body: "This week, you navigated ambiguity without needing an immediate answer. That's a skill, not a flaw. Not everything needs resolution to be valid.",
  },
];

export const moodAlerts: Record<string, string> = {
  Steady: "Three steady days. That consistency is worth trusting.",
  Tender: "Three tender days. Something is asking to be understood.",
  Restless: "Restlessness three times this week. The chase may be a distraction.",
  Quiet: "Three quiet days. Your body is asking for something different.",
};

export function getDailyIndex() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function getTodaySignal() {
  return dailySignals[getDailyIndex() % dailySignals.length];
}

export function getTodayInsight() {
  return dailyInsights[getDailyIndex() % dailyInsights.length];
}

export function getTodayMove() {
  return dailyMoves[getDailyIndex() % dailyMoves.length];
}

export function getWeeklyReadingIndex() {
  return Math.floor(getDailyIndex() / 7) % weeklyReadings.length;
}

export function getWeeklyReading() {
  return weeklyReadings[getWeeklyReadingIndex()];
}
