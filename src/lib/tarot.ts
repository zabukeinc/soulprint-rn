// Full 78-card Tarot deck with archetype matching
// Free meaning = one sentence, Premium meaning = full paragraph

export interface TarotCard {
  id: string;
  name: string;
  number: number;
  suit: 'Major' | 'Wands' | 'Cups' | 'Swords' | 'Pentacles';
  emoji: string;
  keywords: { upright: string; reversed: string };
  meaning: { free: string; premium: string };
  archetypes: string[]; // which user archetypes resonate
}

export const TAROT_CARDS: TarotCard[] = [
  // ===== MAJOR ARCANA (22) =====
  {
    id: 'fool', name: 'The Fool', number: 0, suit: 'Major', emoji: '🃏',
    keywords: { upright: 'Beginnings, innocence, spontaneity', reversed: 'Recklessness, risk-taking, naivety' },
    meaning: {
      free: 'A leap of faith is calling you.',
      premium: 'You stand at the edge of something unknown, and your instinct says jump. The Fool is not about being foolish — it is about trusting the part of you that already knows the way, even when the map is blank. This is your permission to begin before you feel ready.',
    },
    archetypes: ['Pattern Reader', 'Quiet Intensity'],
  },
  {
    id: 'magician', name: 'The Magician', number: 1, suit: 'Major', emoji: '🎩',
    keywords: { upright: 'Manifestation, resourcefulness, power', reversed: 'Manipulation, poor planning, untapped talents' },
    meaning: {
      free: 'You have everything you need — now act.',
      premium: 'The tools are already in your hands. The Magician reminds you that manifestation is not about waiting for permission — it is about directing the energy you already possess. What have you been holding back from creating?',
    },
    archetypes: ['Quiet Strategist', 'Pattern Reader'],
  },
  {
    id: 'high-priestess', name: 'The High Priestess', number: 2, suit: 'Major', emoji: '🌙',
    keywords: { upright: 'Intuition, sacred knowledge, divine feminine', reversed: 'Secrets, disconnected from intuition, withdrawal' },
    meaning: {
      free: 'Listen to what you already know.',
      premium: 'Beneath the noise of daily life, your intuition has been whispering. The High Priestess asks you to stop looking outward for answers and trust the knowledge that lives in silence. You already know what you need to do.',
    },
    archetypes: ['Quiet Strategist', 'Emotional Navigator', 'Quiet Intensity'],
  },
  {
    id: 'empress', name: 'The Empress', number: 3, suit: 'Major', emoji: '🌿',
    keywords: { upright: 'Femininity, beauty, nature, abundance', reversed: 'Creative block, dependence on others' },
    meaning: {
      free: 'Nurture what is growing in you.',
      premium: 'Something in your life is asking to be tended, not controlled. The Empress brings the energy of fertile ground — not forcing growth, but creating the conditions where it happens naturally. What needs your gentle attention today?',
    },
    archetypes: ['Emotional Navigator', 'Consistency Seeker'],
  },
  {
    id: 'emperor', name: 'The Emperor', number: 4, suit: 'Major', emoji: '👑',
    keywords: { upright: 'Authority, structure, control, fatherhood', reversed: 'Tyranny, rigidity, coldness' },
    meaning: {
      free: 'Build structure around what matters.',
      premium: 'The Emperor offers the gift of boundaries — not walls, but frameworks. Where has chaos been wearing you down? This card asks you to claim authority over your own time, energy, and direction. Structure is an act of self-respect.',
    },
    archetypes: ['Quiet Strategist', 'Consistency Seeker'],
  },
  {
    id: 'hierophant', name: 'The Hierophant', number: 5, suit: 'Major', emoji: '📿',
    keywords: { upright: 'Spiritual wisdom, tradition, conformity', reversed: 'Rebellion, subversiveness, freedom' },
    meaning: {
      free: 'Question the rules you follow.',
      premium: 'The Hierophant holds both tradition and its shadow. Are you following a path because it is yours, or because someone told you it should be? Today is a day to examine which beliefs are anchors and which are chains.',
    },
    archetypes: ['Pattern Reader', 'Quiet Strategist'],
  },
  {
    id: 'lovers', name: 'The Lovers', number: 6, suit: 'Major', emoji: '💕',
    keywords: { upright: 'Love, harmony, relationships, choices', reversed: 'Self-love, disharmony, imbalance' },
    meaning: {
      free: 'A choice about connection is near.',
      premium: 'The Lovers is rarely about romance alone — it is about the choices we make in the name of connection. What are you aligning with? And more importantly, what are you no longer willing to compromise to keep?',
    },
    archetypes: ['Emotional Navigator', 'Consistency Seeker'],
  },
  {
    id: 'chariot', name: 'The Chariot', number: 7, suit: 'Major', emoji: '🏆',
    keywords: { upright: 'Control, willpower, success, action', reversed: 'Self-discipline, opposition, lack of direction' },
    meaning: {
      free: 'Direct your energy with intention.',
      premium: 'The Chariot arrives when two opposing forces need a single direction. Your will is the reins. Today, victory comes not from forcing outcomes, but from choosing where your energy goes — and refusing to be pulled off course.',
    },
    archetypes: ['Quiet Strategist', 'Pattern Reader'],
  },
  {
    id: 'strength', name: 'Strength', number: 8, suit: 'Major', emoji: '🦁',
    keywords: { upright: 'Strength, courage, persuasion, influence', reversed: 'Inner strength, self-doubt, low energy' },
    meaning: {
      free: 'Your quiet strength is enough.',
      premium: 'Strength is not loud. It is the hand that holds the lion without force. You have been handling more than you let on, and this card arrives to say: your gentleness is not weakness. It is the most courageous thing about you.',
    },
    archetypes: ['Quiet Intensity', 'Emotional Navigator', 'Consistency Seeker'],
  },
  {
    id: 'hermit', name: 'The Hermit', number: 9, suit: 'Major', emoji: '🕯️',
    keywords: { upright: 'Soul-searching, introspection, guidance, solitude', reversed: 'Isolation, loneliness, withdrawal' },
    meaning: {
      free: 'Withdraw to find what you need.',
      premium: 'The Hermit holds the lantern not to light the whole path — only the next step. You do not need to see the entire journey. You need to see what is directly in front of you, and trust that the rest will illuminate as you walk.',
    },
    archetypes: ['Quiet Strategist', 'Quiet Intensity', 'Pattern Reader'],
  },
  {
    id: 'wheel-of-fortune', name: 'Wheel of Fortune', number: 10, suit: 'Major', emoji: '☸️',
    keywords: { upright: 'Good luck, karma, life cycles, destiny', reversed: 'Bad luck, resistance to change, breaking cycles' },
    meaning: {
      free: 'A cycle is turning in your favor.',
      premium: 'The wheel turns whether you cling or release. This card asks a single question: are you fighting a season that is trying to pass, or resisting a season that is trying to arrive? Change is not the enemy. Stagnation is.',
    },
    archetypes: ['Pattern Reader', 'Quiet Intensity'],
  },
  {
    id: 'justice', name: 'Justice', number: 11, suit: 'Major', emoji: '⚖️',
    keywords: { upright: 'Justice, fairness, truth, cause and effect', reversed: 'Unfairness, lack of accountability, dishonesty' },
    meaning: {
      free: 'Truth will balance what is uneven.',
      premium: 'Justice is not about punishment — it is about alignment. What has been out of balance is being corrected, whether you see it yet or not. The truth you have been avoiding saying? It is lighter than the silence you have been carrying.',
    },
    archetypes: ['Quiet Strategist', 'Consistency Seeker'],
  },
  {
    id: 'hanged-man', name: 'The Hanged Man', number: 12, suit: 'Major', emoji: '🙃',
    keywords: { upright: 'Pause, surrender, letting go, new perspectives', reversed: 'Delays, resistance, stalling, indecision' },
    meaning: {
      free: 'A new angle will reveal the answer.',
      premium: 'The Hanged Man asks you to stop struggling. Not because surrender is defeat, but because your current angle is wrong. Flip the view. What looks like a trap from one side is a portal from another. You do not need more effort. You need a different perspective.',
    },
    archetypes: ['Quiet Strategist', 'Pattern Reader', 'Quiet Intensity'],
  },
  {
    id: 'death', name: 'Death', number: 13, suit: 'Major', emoji: '💀',
    keywords: { upright: 'Endings, change, transformation, transition', reversed: 'Resistance to change, unable to move on' },
    meaning: {
      free: 'Let something end so something can begin.',
      premium: 'Death is not loss — it is transition. The thing that is ending has already served its purpose, and you are clinging to the shell. This card does not bring destruction. It brings the space that creation needs. What are you ready to release?',
    },
    archetypes: ['Emotional Navigator', 'Quiet Intensity', 'Pattern Reader'],
  },
  {
    id: 'temperance', name: 'Temperance', number: 14, suit: 'Major', emoji: '🏺',
    keywords: { upright: 'Balance, moderation, patience, purpose', reversed: 'Imbalance, excess, self-healing, re-alignment' },
    meaning: {
      free: 'Balance is found in the middle path.',
      premium: 'Temperance is the art of holding two truths without collapsing into either. You do not have to choose between logic and feeling, between giving and receiving, between moving and resting. Today is about finding the middle that holds both.',
    },
    archetypes: ['Consistency Seeker', 'Emotional Navigator'],
  },
  {
    id: 'devil', name: 'The Devil', number: 15, suit: 'Major', emoji: '⛓️',
    keywords: { upright: 'Shadow self, attachment, addiction, restriction', reversed: 'Releasing limiting beliefs, detachment' },
    meaning: {
      free: 'Examine what has a hold on you.',
      premium: 'The Devil does not hold chains — you do. This card illuminates the attachments you have convinced yourself you need. The pattern, the person, the habit: they are not your prison. Your belief that you cannot live without them is. Today, name one chain.',
    },
    archetypes: ['Quiet Intensity', 'Pattern Reader', 'Emotional Navigator'],
  },
  {
    id: 'tower', name: 'The Tower', number: 16, suit: 'Major', emoji: '⚡',
    keywords: { upright: 'Sudden change, upheaval, chaos, revelation', reversed: 'Personal transformation, fear of change, averting disaster' },
    meaning: {
      free: 'What breaks open will set you free.',
      premium: 'The Tower is not a punishment — it is a correction. What is falling was built on a false foundation, and you have been maintaining it at your own expense. The collapse feels violent, but the ground it reveals is real. You will rebuild on truth this time.',
    },
    archetypes: ['Quiet Intensity', 'Emotional Navigator'],
  },
  {
    id: 'star', name: 'The Star', number: 17, suit: 'Major', emoji: '⭐',
    keywords: { upright: 'Hope, faith, purpose, renewal, spirituality', reversed: 'Despair, discouragement, lack of faith' },
    meaning: {
      free: 'Hope is not naive — it is a direction.',
      premium: 'After the Tower falls, the Star appears. This is the quiet promise that something better is not just possible — it is already forming. You do not have to believe in everything. You only have to believe that the next breath matters.',
    },
    archetypes: ['Emotional Navigator', 'Consistency Seeker', 'Quiet Intensity'],
  },
  {
    id: 'moon', name: 'The Moon', number: 18, suit: 'Major', emoji: '🌙',
    keywords: { upright: 'Illusion, fear, anxiety, subconscious, intuition', reversed: 'Release of fear, repressed emotion, inner confusion' },
    meaning: {
      free: 'What you fear may not be real.',
      premium: 'The Moon casts shadows that look like threats. This card asks you to walk through the uncertainty without demanding clarity first. Your anxiety is trying to protect you, but it is protecting you from something that may not exist. Question the shadow.',
    },
    archetypes: ['Quiet Strategist', 'Quiet Intensity', 'Emotional Navigator', 'Pattern Reader'],
  },
  {
    id: 'sun', name: 'The Sun', number: 19, suit: 'Major', emoji: '☀️',
    keywords: { upright: 'Positivity, fun, warmth, success, vitality', reversed: 'Temporary depression, sadness, lack of energy' },
    meaning: {
      free: 'Clarity is coming. Let it in.',
      premium: 'The Sun is the simplest card in the deck because it asks the simplest thing: allow yourself to feel good without explaining why. You do not need to earn joy. You do not need to justify it. Let warmth reach you, even if you feel like you have not done enough to deserve it.',
    },
    archetypes: ['Consistency Seeker', 'Emotional Navigator'],
  },
  {
    id: 'judgement', name: 'Judgement', number: 20, suit: 'Major', emoji: '🎺',
    keywords: { upright: 'Judgement, rebirth, inner calling, absolution', reversed: 'Self-doubt, refusal of self-examination' },
    meaning: {
      free: 'A past version of you is calling.',
      premium: 'Judgement is not about being judged — it is about finally hearing the voice you have been ignoring. Something from your past wants closure, and only you can give it. The person you were is not a failure. They were doing the best they could with what they knew.',
    },
    archetypes: ['Pattern Reader', 'Quiet Intensity', 'Emotional Navigator'],
  },
  {
    id: 'world', name: 'The World', number: 21, suit: 'Major', emoji: '🌍',
    keywords: { upright: 'Completion, integration, accomplishment, travel', reversed: 'Seeking personal closure, short-cuts, delays' },
    meaning: {
      free: 'A cycle is complete. Honor the finish.',
      premium: 'The World arrives when something is finished — not perfect, not without scar, but complete. You have been so focused on what is next that you have not let yourself feel the weight of what you have already done. Stop. Acknowledge the arc. You made it.',
    },
    archetypes: ['Consistency Seeker', 'Quiet Strategist', 'Pattern Reader'],
  },
  // ===== WANDS (14) =====
  {
    id: 'ace-of-wands', name: 'Ace of Wands', number: 1, suit: 'Wands', emoji: '🔥',
    keywords: { upright: 'Creation, willpower, inspiration, desire', reversed: 'Lack of energy, lack of passion, boredom' },
    meaning: { free: 'A spark of inspiration is alive in you.', premium: 'The Ace of Wands is the match striking. You have been waiting for the right moment, and this card says the moment is now. Not when you are ready — when you are willing. The spark is here. What will you ignite?' },
    archetypes: ['Quiet Strategist', 'Pattern Reader'],
  },
  {
    id: 'two-of-wands', name: 'Two of Wands', number: 2, suit: 'Wands', emoji: '🌍',
    keywords: { upright: 'Future planning, progress, decisions, discovery', reversed: 'Fear of unknown, lack of planning' },
    meaning: { free: 'The world is wider than you think.', premium: 'You hold the globe in your hands, but you are still looking at the door behind you. The Two of Wands asks you to turn around. The future you want is not where you have already been. It is in the direction you have been afraid to face.' },
    archetypes: ['Quiet Strategist', 'Pattern Reader'],
  },
  {
    id: 'three-of-wands', name: 'Three of Wands', number: 3, suit: 'Wands', emoji: '⚓',
    keywords: { upright: 'Progress, expansion, foresight, overseas opportunities', reversed: 'Obstacles, delays, frustration' },
    meaning: { free: 'Your ships are coming in.', premium: 'The Three of Wands is the card of arrival. You sent something out — an idea, a risk, a truth — and it is beginning to return. You do not need to chase it. Stand at the shore and let it come to you.' },
    archetypes: ['Quiet Strategist', 'Consistency Seeker'],
  },
  {
    id: 'four-of-wands', name: 'Four of Wands', number: 4, suit: 'Wands', emoji: '🎉',
    keywords: { upright: 'Celebration, joy, harmony, relaxation', reversed: 'Lack of support, home conflicts, instability' },
    meaning: { free: 'You have earned this moment of peace.', premium: 'The Four of Wands is a threshold. You have crossed something difficult, and the ground beneath you is finally stable enough to celebrate. Do not skip the acknowledgment. You have been through something. Let yourself arrive.' },
    archetypes: ['Consistency Seeker', 'Emotional Navigator'],
  },
  {
    id: 'five-of-wands', name: 'Five of Wands', number: 5, suit: 'Wands', emoji: '⚔️',
    keywords: { upright: 'Conflict, disagreements, competition, tension', reversed: 'Conflict avoidance, ending disputes, avoiding confrontation' },
    meaning: { free: 'A clash of wills is revealing truth.', premium: 'The Five of Wands is not about winning — it is about noticing. The tension around you is not random. It is showing you where boundaries have been unclear and where voices have been competing instead of collaborating. Listen to what the conflict is actually about.' },
    archetypes: ['Pattern Reader', 'Quiet Intensity'],
  },
  {
    id: 'six-of-wands', name: 'Six of Wands', number: 6, suit: 'Wands', emoji: '🏆',
    keywords: { upright: 'Success, public recognition, progress, self-confidence', reversed: 'Egotism, lack of confidence, fall from grace' },
    meaning: { free: 'You are being seen for what you have done.', premium: 'The Six of Wands carries victory, but it asks a harder question: can you let yourself be celebrated? You have been so focused on the next hill that you have not let anyone acknowledge the one you just climbed. Let them see you. It does not make you arrogant. It makes you honest.' },
    archetypes: ['Quiet Intensity', 'Consistency Seeker'],
  },
  {
    id: 'seven-of-wands', name: 'Seven of Wands', number: 7, suit: 'Wands', emoji: '🛡️',
    keywords: { upright: 'Perseverance, defensive stance, maintaining control', reversed: 'Give up, overwhelmed, defensive, exhaustion' },
    meaning: { free: 'Hold your ground. It matters.', premium: 'The Seven of Wands is exhaustion that is earned. You have been defending something worth defending — a boundary, a truth, a version of yourself. This card does not tell you to keep fighting forever. It tells you that today, your position is correct. Stand in it.' },
    archetypes: ['Quiet Strategist', 'Consistency Seeker', 'Quiet Intensity'],
  },
  {
    id: 'eight-of-wands', name: 'Eight of Wands', number: 8, suit: 'Wands', emoji: '⚡',
    keywords: { upright: 'Speed, action, air travel, movement, swift change', reversed: 'Delays, frustration, resisting change, internal alignment' },
    meaning: { free: 'Things are moving fast — catch up.', premium: 'The Eight of Wands is momentum you did not plan for. Something is accelerating, and your instinct is to slow it down. But this card asks: what if the speed is not the problem? What if your resistance to it is? Let something move without your control today.' },
    archetypes: ['Pattern Reader', 'Quiet Strategist'],
  },
  {
    id: 'nine-of-wands', name: 'Nine of Wands', number: 9, suit: 'Wands', emoji: '🤕',
    keywords: { upright: 'Resilience, grit, last stand, persistence', reversed: 'Exhaustion, fatigue, questioning motivations' },
    meaning: { free: 'You have survived more than you admit.', premium: 'The Nine of Wands is the card of the wounded warrior who is still standing. You do not need to be unbroken to be strong. Your scars are not flaws — they are evidence of what you have already endured. One more step is enough for today.' },
    archetypes: ['Quiet Intensity', 'Consistency Seeker', 'Emotional Navigator'],
  },
  {
    id: 'ten-of-wands', name: 'Ten of Wands', number: 10, suit: 'Wands', emoji: '🪵',
    keywords: { upright: 'Burden, responsibility, hard work, completion', reversed: 'Doing it all, carrying the burden, delegation' },
    meaning: { free: 'You are carrying too much.', premium: 'The Ten of Wands is not a badge of honor — it is a warning. The load you are carrying has become invisible to you because you have normalized it. But your body knows. Your sleep knows. Today, ask one honest question: what would happen if I put one of these down?' },
    archetypes: ['Consistency Seeker', 'Emotional Navigator', 'Quiet Intensity'],
  },
  {
    id: 'page-of-wands', name: 'Page of Wands', number: 11, suit: 'Wands', emoji: '📜',
    keywords: { upright: 'Exploration, excitement, freedom, discovery', reversed: 'Lack of direction, procrastination, creating conflict' },
    meaning: { free: 'A new curiosity is worth following.', premium: 'The Page of Wands brings a spark that is not yet a plan. You do not need to know where it leads. You only need to be brave enough to follow it past the first question. Curiosity is not childish. It is how the map expands.' },
    archetypes: ['Pattern Reader', 'Quiet Strategist'],
  },
  {
    id: 'knight-of-wands', name: 'Knight of Wands', number: 12, suit: 'Wands', emoji: '🐎',
    keywords: { upright: 'Action, adventure, fearlessness, haste', reversed: 'Anger, impulsiveness, recklessness, frustration' },
    meaning: { free: 'Move boldly, but know where you are going.', premium: 'The Knight of Wands charges forward with a full heart and a half-plan. His energy is contagious, but his direction is uncertain. Today, borrow his courage but not his impulsiveness. Charge — but look where you are charging first.' },
    archetypes: ['Pattern Reader', 'Quiet Strategist'],
  },
  {
    id: 'queen-of-wands', name: 'Queen of Wands', number: 13, suit: 'Wands', emoji: '👑',
    keywords: { upright: 'Confidence, warmth, determination, vibrance', reversed: 'Selfishness, jealousy, insecurities, introversion' },
    meaning: { free: 'Your presence is your power.', premium: 'The Queen of Wands does not ask for attention — she attracts it by being fully herself. She is warm, but not soft. She is determined, but not harsh. Where in your life have you been shrinking to make others comfortable? Today, expand.' },
    archetypes: ['Emotional Navigator', 'Consistency Seeker', 'Quiet Intensity'],
  },
  {
    id: 'king-of-wands', name: 'King of Wands', number: 14, suit: 'Wands', emoji: '🦁',
    keywords: { upright: 'Leadership, vision, honor, big picture', reversed: 'Impulsiveness, haste, ruthlessness, forceful' },
    meaning: { free: 'Lead from a place of vision, not ego.', premium: 'The King of Wands is the strategist who sees the whole board. He does not act for reaction — he acts for direction. You have been managing the day-to-day so tightly that you have lost sight of the horizon. Today, look up. What is the bigger game you are playing?' },
    archetypes: ['Quiet Strategist', 'Pattern Reader'],
  },
  // ===== CUPS (14) =====
  {
    id: 'ace-of-cups', name: 'Ace of Cups', number: 1, suit: 'Cups', emoji: '💧',
    keywords: { upright: 'New feelings, spirituality, intuition, love', reversed: 'Blocked emotions, emptiness, creative block' },
    meaning: { free: 'A new emotional beginning is here.', premium: 'The Ace of Cups is an overflowing cup. Love, intuition, creative energy — something is pouring into you, and it will spill whether you receive it or not. The question is not whether you deserve it. The question is whether you will let yourself feel it.' },
    archetypes: ['Emotional Navigator', 'Quiet Intensity'],
  },
  {
    id: 'two-of-cups', name: 'Two of Cups', number: 2, suit: 'Cups', emoji: '💕',
    keywords: { upright: 'Unity, partnership, mutual attraction, connection', reversed: 'Imbalance, broken communication, tension' },
    meaning: { free: 'A connection is deepening.', premium: 'The Two of Cups is not just romance — it is any bond where two people meet as equals. It asks you to look at your closest connection and notice: are you meeting each other, or are you performing for each other? Real connection does not require a script.' },
    archetypes: ['Emotional Navigator', 'Consistency Seeker'],
  },
  {
    id: 'three-of-cups', name: 'Three of Cups', number: 3, suit: 'Cups', emoji: '🥂',
    keywords: { upright: 'Friendship, community, celebration, joy', reversed: 'Overindulgence, gossip, isolation' },
    meaning: { free: 'Joy is better shared.', premium: 'The Three of Cups celebrates the people who have seen you through the quiet seasons. Today is about gratitude for the friendships that do not require explanation. Who has held space for you without asking for a reason? Reach for them.' },
    archetypes: ['Emotional Navigator', 'Consistency Seeker'],
  },
  {
    id: 'four-of-cups', name: 'Four of Cups', number: 4, suit: 'Cups', emoji: '😔',
    keywords: { upright: 'Apathy, contemplation, disconnectedness, re-evaluation', reversed: 'Sudden awareness, choosing happiness, acceptance' },
    meaning: { free: 'What you need is closer than you think.', premium: 'The Four of Cups is the card of emotional blindness. You are so focused on what is missing that you cannot see what is being offered. Look down. The cup at your feet has been there the whole time. What have you been refusing because it did not arrive the way you expected?' },
    archetypes: ['Quiet Intensity', 'Emotional Navigator'],
  },
  {
    id: 'five-of-cups', name: 'Five of Cups', number: 5, suit: 'Cups', emoji: '💔',
    keywords: { upright: 'Loss, grief, disappointment, regret', reversed: 'Acceptance, moving on, finding peace' },
    meaning: { free: 'Two cups still stand.', premium: 'The Five of Cups mourns what was spilled. But behind the figure, two cups remain full. Grief is not a failure — it is evidence that something mattered. Today, let yourself look at what is still standing. It does not erase the loss, but it makes the loss bearable.' },
    archetypes: ['Emotional Navigator', 'Quiet Intensity'],
  },
  {
    id: 'six-of-cups', name: 'Six of Cups', number: 6, suit: 'Cups', emoji: '🧸',
    keywords: { upright: 'Nostalgia, innocence, childhood, joy', reversed: 'Stuck in the past, naivety, unrealistic' },
    meaning: { free: 'A memory holds a key.', premium: 'The Six of Cups visits when the past has something to teach the present. Not to trap you in nostalgia, but to show you what you have always known about yourself. What did you love before the world told you what to want?' },
    archetypes: ['Emotional Navigator', 'Pattern Reader'],
  },
  {
    id: 'seven-of-cups', name: 'Seven of Cups', number: 7, suit: 'Cups', emoji: '✨',
    keywords: { upright: 'Choices, fantasy, wishes, illusion', reversed: 'Clarity, reality check, decisive action' },
    meaning: { free: 'Not every option is real.', premium: 'The Seven of Cups floats seven dreams in front of you — but not all of them are solid. Some are illusions dressed as desires. Today, ask yourself: which of my current options is a fantasy I am using to avoid a harder truth?' },
    archetypes: ['Pattern Reader', 'Quiet Strategist', 'Quiet Intensity'],
  },
  {
    id: 'eight-of-cups', name: 'Eight of Cups', number: 8, suit: 'Cups', emoji: '🚶',
    keywords: { upright: 'Walking away, disillusionment, leaving behind', reversed: 'Fear of moving on, indecision, avoidance' },
    meaning: { free: 'Leaving is not failing.', premium: 'The Eight of Cups is the courage to walk away from something that no longer fills you. You have been holding on because leaving feels like failure, but this card says: walking toward emptiness is braver than staying in what has already emptied itself.' },
    archetypes: ['Quiet Intensity', 'Emotional Navigator', 'Pattern Reader'],
  },
  {
    id: 'nine-of-cups', name: 'Nine of Cups', number: 9, suit: 'Cups', emoji: '🍷',
    keywords: { upright: 'Contentment, satisfaction, wish fulfillment, gratitude', reversed: 'Dissatisfaction, greed, materialism, excess' },
    meaning: { free: 'You have more than you realize.', premium: 'The Nine of Cups is the card of satisfaction — not perfection, but enough. You have been chasing the next thing without tasting what is already on your plate. Today, name three things that are enough. That is the spell that makes more arrive.' },
    archetypes: ['Consistency Seeker', 'Emotional Navigator'],
  },
  {
    id: 'ten-of-cups', name: 'Ten of Cups', number: 10, suit: 'Cups', emoji: '🏠',
    keywords: { upright: 'Family, harmony, alignment, happiness', reversed: 'Disconnection, misalignment, broken home, conflict' },
    meaning: { free: 'Emotional alignment is possible.', premium: 'The Ten of Cups is the picture of emotional peace — not the absence of difficulty, but the presence of alignment. Where in your life do your values and your actions finally match? That is where your real home is.' },
    archetypes: ['Consistency Seeker', 'Emotional Navigator'],
  },
  {
    id: 'page-of-cups', name: 'Page of Cups', number: 11, suit: 'Cups', emoji: '🐟',
    keywords: { upright: 'Creative opportunities, intuition, curiosity', reversed: 'Emotional immaturity, insecurity, escapism' },
    meaning: { free: 'A message from your intuition is arriving.', premium: 'The Page of Cups brings a gentle message from the part of you that does not speak in words. A dream, a feeling, a sudden knowing — something is trying to reach you. Do not dismiss it because it does not make logical sense. Logic is not the only truth.' },
    archetypes: ['Emotional Navigator', 'Quiet Intensity'],
  },
  {
    id: 'knight-of-cups', name: 'Knight of Cups', number: 12, suit: 'Cups', emoji: '🌊',
    keywords: { upright: 'Romance, charm, idealism, pursuit', reversed: 'Disappointment, moodiness, unrealistic standards' },
    meaning: { free: 'Follow the feeling, not the plan.', premium: 'The Knight of Cups is the romantic who follows his heart even when the map disagrees. He asks you: where have you been choosing the sensible path over the one that actually excites you? Not every decision needs a spreadsheet. Some need a compass.' },
    archetypes: ['Emotional Navigator', 'Quiet Intensity'],
  },
  {
    id: 'queen-of-cups', name: 'Queen of Cups', number: 13, suit: 'Cups', emoji: '🐚',
    keywords: { upright: 'Compassion, calm, comfort, intuition', reversed: 'Emotional overwhelm, dependency, martyrdom' },
    meaning: { free: 'Your depth is your gift.', premium: 'The Queen of Cups holds emotional intelligence like water — she does not force it, she contains it. You have been told your sensitivity is too much. This card says: it is not too much. It is exactly the amount the world needs. Hold it with pride.' },
    archetypes: ['Emotional Navigator', 'Quiet Intensity', 'Consistency Seeker'],
  },
  {
    id: 'king-of-cups', name: 'King of Cups', number: 14, suit: 'Cups', emoji: '👑',
    keywords: { upright: 'Emotional balance, control, generosity, diplomacy', reversed: 'Manipulation, moodiness, volatility' },
    meaning: { free: 'Master your emotions without suppressing them.', premium: 'The King of Cups rules his emotions without denying them. He feels everything — and chooses how to respond. Where have you been either exploding or shutting down? The middle path exists. It is called presence.' },
    archetypes: ['Quiet Strategist', 'Emotional Navigator', 'Consistency Seeker'],
  },
  // ===== SWORDS (14) =====
  {
    id: 'ace-of-swords', name: 'Ace of Swords', number: 1, suit: 'Swords', emoji: '⚔️',
    keywords: { upright: 'Breakthrough, clarity, new idea, communication', reversed: 'Confusion, chaos, lack of clarity, miscommunication' },
    meaning: { free: 'A truth is cutting through the noise.', premium: 'The Ace of Swords is the blade of clarity. It does not arrive gently — it cuts through illusion in a single stroke. You have been circling a truth, dressing it in politeness. Today, let it be sharp. Clarity is a kind of kindness, even when it stings.' },
    archetypes: ['Quiet Strategist', 'Pattern Reader'],
  },
  {
    id: 'two-of-swords', name: 'Two of Swords', number: 2, suit: 'Swords', emoji: '⚔️',
    keywords: { upright: 'Indecision, difficult choices, stalemate, avoidance', reversed: 'Information overload, indecision, confusion' },
    meaning: { free: 'The choice you avoid is the choice that owns you.', premium: 'The Two of Swords is the stalemate you have convinced yourself is peace. You cannot see because you refuse to remove the blindfold. Both options have costs. The only wrong choice is the one you keep pretending you do not have to make.' },
    archetypes: ['Quiet Strategist', 'Pattern Reader', 'Quiet Intensity'],
  },
  {
    id: 'three-of-swords', name: 'Three of Swords', number: 3, suit: 'Swords', emoji: '💔',
    keywords: { upright: 'Heartbreak, grief, sorrow, emotional pain', reversed: 'Recovery, forgiveness, moving on' },
    meaning: { free: 'The heartbreak is real. Let it be.', premium: 'The Three of Swords is not here to fix your pain — it is here to validate it. You have been trying to think your way out of a feeling, and it does not work. Grief is not a problem to solve. It is a weather system to wait out. Be patient with yourself.' },
    archetypes: ['Emotional Navigator', 'Quiet Intensity'],
  },
  {
    id: 'four-of-swords', name: 'Four of Swords', number: 4, suit: 'Swords', emoji: '🛌',
    keywords: { upright: 'Rest, restoration, contemplation, recuperation', reversed: 'Restlessness, burnout, lack of progress, stagnation' },
    meaning: { free: 'Rest is not a reward. It is a requirement.', premium: 'The Four of Swords is the permission slip you have been waiting for. Not to do less because you are weak, but to stop because you are wise. Your mind has been running loops. Today, let the loop end. Nothing breaks when you rest. Only illusions.' },
    archetypes: ['Quiet Strategist', 'Quiet Intensity', 'Pattern Reader'],
  },
  {
    id: 'five-of-swords', name: 'Five of Swords', number: 5, suit: 'Swords', emoji: '🏳️',
    keywords: { upright: 'Conflict, defeat, winning at all costs, betrayal', reversed: 'Reconciliation, making amends, past resentment' },
    meaning: { free: 'Victory at what cost?', premium: 'The Five of Swords shows a battlefield where winning cost more than losing would have. You got what you wanted, but the price was a relationship, your integrity, or your peace. Was it worth it? Some battles are not meant to be won. They are meant to be walked away from.' },
    archetypes: ['Quiet Strategist', 'Pattern Reader'],
  },
  {
    id: 'six-of-swords', name: 'Six of Swords', number: 6, suit: 'Swords', emoji: '🚣',
    keywords: { upright: 'Transition, change, moving on, departure', reversed: 'Resistance to change, unfinished business' },
    meaning: { free: 'The crossing is necessary.', premium: 'The Six of Swords is the boat that carries you from one shore to another. You are in between — not where you were, not yet where you are going. The discomfort is not failure. It is the nature of every transition. Trust the water. It knows the way.' },
    archetypes: ['Emotional Navigator', 'Pattern Reader', 'Quiet Intensity'],
  },
  {
    id: 'seven-of-swords', name: 'Seven of Swords', number: 7, suit: 'Swords', emoji: '🦊',
    keywords: { upright: 'Deception, strategy, sneakiness, theft', reversed: 'Coming clean, rethinking approach, conscience' },
    meaning: { free: 'What are you hiding — even from yourself?', premium: 'The Seven of Swords is not always about someone deceiving you. Often, it is about the lie you are telling yourself. What have you been avoiding admitting? The truth you refuse to name is the one that is costing you the most.' },
    archetypes: ['Pattern Reader', 'Quiet Strategist', 'Quiet Intensity'],
  },
  {
    id: 'eight-of-swords', name: 'Eight of Swords', number: 8, suit: 'Swords', emoji: '🎀',
    keywords: { upright: 'Negative thoughts, self-imposed restriction, imprisonment', reversed: 'Open to new perspectives, release' },
    meaning: { free: 'The bindings are loose. You just have not tested them.', premium: 'The Eight of Swords is the card of self-imposed limitation. The blindfold, the loose ropes — they are not holding you. You are holding them. You have been so convinced you are trapped that you have stopped trying to move. Test the bindings. They are weaker than you think.' },
    archetypes: ['Quiet Intensity', 'Emotional Navigator', 'Pattern Reader'],
  },
  {
    id: 'nine-of-swords', name: 'Nine of Swords', number: 9, suit: 'Swords', emoji: '😰',
    keywords: { upright: 'Anxiety, worry, fear, nightmares', reversed: 'Hope, reaching out, despair, inner turmoil' },
    meaning: { free: 'The worst is in your mind.', premium: 'The Nine of Swords is the 3 AM thought spiral. It feels real, but it is a shadow puppet. Your anxiety is not a prophecy — it is a pattern. And patterns can be interrupted. Today, when the spiral starts, name one thing that is actually true right now. That is your anchor.' },
    archetypes: ['Quiet Intensity', 'Emotional Navigator', 'Pattern Reader'],
  },
  {
    id: 'ten-of-swords', name: 'Ten of Swords', number: 10, suit: 'Swords', emoji: '⚔️',
    keywords: { upright: 'Painful endings, deep wounds, betrayal, loss', reversed: 'Recovery, regeneration, resisting an inevitable end' },
    meaning: { free: 'The ending is done. Now, rebuild.', premium: 'The Ten of Swords is the bottom. But here is what the card never shows: the sky above is already light. You have survived the ending. The part that hurts is not the event — it is the refusal to accept that it is over. Let it be over. The dawn is already here.' },
    archetypes: ['Emotional Navigator', 'Quiet Intensity', 'Pattern Reader'],
  },
  {
    id: 'page-of-swords', name: 'Page of Swords', number: 11, suit: 'Swords', emoji: '🗡️',
    keywords: { upright: 'Curiosity, new ideas, thirst for knowledge, communication', reversed: 'Deception, manipulation, all talk and no action' },
    meaning: { free: 'A new idea wants your attention.', premium: 'The Page of Swords is the question that will not let you sleep. He is sharp, fast, and relentless. You have been dismissing an idea because it feels too big. But ideas do not need you to be ready. They need you to be honest about wanting them.' },
    archetypes: ['Pattern Reader', 'Quiet Strategist'],
  },
  {
    id: 'knight-of-swords', name: 'Knight of Swords', number: 12, suit: 'Swords', emoji: '🏇',
    keywords: { upright: 'Action, impulsiveness, defending beliefs, haste', reversed: 'No direction, disregard for consequences, unprepared' },
    meaning: { free: 'Act fast — but know why.', premium: 'The Knight of Swords charges with certainty that is both his power and his flaw. He asks you: where is your urgency coming from? Is it truth, or is it fear dressed as decisiveness? Speed is not always the friend of clarity.' },
    archetypes: ['Quiet Strategist', 'Pattern Reader'],
  },
  {
    id: 'queen-of-swords', name: 'Queen of Swords', number: 13, suit: 'Swords', emoji: '🗡️',
    keywords: { upright: 'Independence, unbiased judgment, clear boundaries, direct communication', reversed: 'Cold-hearted, cruel, bitterness, overly emotional' },
    meaning: { free: 'Your clarity is a gift. Use it kindly.', premium: 'The Queen of Swords sees through illusion because she has learned not to need comfort more than truth. But she also knows that truth without compassion is just a weapon. Today, speak clearly — but hold the hand of the person hearing it.' },
    archetypes: ['Quiet Strategist', 'Pattern Reader'],
  },
  {
    id: 'king-of-swords', name: 'King of Swords', number: 14, suit: 'Swords', emoji: '👑',
    keywords: { upright: 'Mental clarity, intellectual power, authority, truth', reversed: 'Quiet power, inner truth, misuse of power, manipulation' },
    meaning: { free: 'Truth spoken with authority changes everything.', premium: 'The King of Swords holds the sword of truth and the responsibility of using it well. Where in your life have you been softening your words to avoid conflict? Truth does not have to be brutal. It only has to be real. And real is always enough.' },
    archetypes: ['Quiet Strategist', 'Pattern Reader'],
  },
  // ===== PENTACLES (14) =====
  {
    id: 'ace-of-pentacles', name: 'Ace of Pentacles', number: 1, suit: 'Pentacles', emoji: '💰',
    keywords: { upright: 'New financial opportunity, prosperity, abundance', reversed: 'Lost opportunity, lack of planning, greed' },
    meaning: { free: 'A seed of abundance is being planted.', premium: 'The Ace of Pentacles is not a lottery ticket — it is a seed. It requires soil, water, and patience. You have been offered a foundation. Will you build on it, or will you keep looking for the finished house? Start with the seed. The rest follows.' },
    archetypes: ['Quiet Strategist', 'Consistency Seeker'],
  },
  {
    id: 'two-of-pentacles', name: 'Two of Pentacles', number: 2, suit: 'Pentacles', emoji: '⚖️',
    keywords: { upright: 'Balance, adaptability, time management, prioritization', reversed: 'Overwhelm, disorganization, reprioritization' },
    meaning: { free: 'Juggle with grace.', premium: 'The Two of Pentacles is the art of holding multiple truths without dropping either. You have been told to simplify, but your life is complex by nature. The goal is not fewer balls. The goal is learning to dance while you juggle. Find the rhythm.' },
    archetypes: ['Quiet Strategist', 'Consistency Seeker'],
  },
  {
    id: 'three-of-pentacles', name: 'Three of Pentacles', number: 3, suit: 'Pentacles', emoji: '🏗️',
    keywords: { upright: 'Teamwork, collaboration, learning, implementation', reversed: 'Lack of teamwork, disregard for skills, poor quality' },
    meaning: { free: 'Your skill is being recognized.', premium: 'The Three of Pentacles shows the moment your work meets the world. You have been preparing in private, and now someone is noticing. The recognition is not the goal — it is the confirmation that your private discipline was never wasted.' },
    archetypes: ['Consistency Seeker', 'Quiet Strategist'],
  },
  {
    id: 'four-of-pentacles', name: 'Four of Pentacles', number: 4, suit: 'Pentacles', emoji: '🤲',
    keywords: { upright: 'Security, conservation, frugality, control', reversed: 'Greed, materialism, self-protection, possessiveness' },
    meaning: { free: 'Holding too tightly costs more than it saves.', premium: 'The Four of Pentacles clutches what he has because he fears loss. But the grip is exhausting. What are you holding so tightly that your hands are too full to receive? Security is not about having more. It is about trusting that enough is enough.' },
    archetypes: ['Consistency Seeker', 'Quiet Intensity'],
  },
  {
    id: 'five-of-pentacles', name: 'Five of Pentacles', number: 5, suit: 'Pentacles', emoji: '❄️',
    keywords: { upright: 'Financial loss, poverty, lack mindset, isolation', reversed: 'Recovery from loss, spiritual poverty, finding help' },
    meaning: { free: 'You are not as alone as you feel.', premium: 'The Five of Pentacles is the winter of the soul. But notice: the church window is lit behind the figures. Help is closer than you think. Pride is the only thing keeping you outside. Ask for warmth. It is not weakness — it is survival.' },
    archetypes: ['Emotional Navigator', 'Quiet Intensity'],
  },
  {
    id: 'six-of-pentacles', name: 'Six of Pentacles', number: 6, suit: 'Pentacles', emoji: '🤝',
    keywords: { upright: 'Generosity, charity, giving, prosperity, sharing wealth', reversed: 'Debt, selfishness, one-sided charity, strings attached' },
    meaning: { free: 'Give what you can. Receive what you need.', premium: 'The Six of Pentacles is the balance of giving and receiving. You have been on one side for too long — either always the giver who never asks, or the receiver who feels guilty. Neither is sustainable. Today, cross to the other side. It completes the circle.' },
    archetypes: ['Consistency Seeker', 'Emotional Navigator'],
  },
  {
    id: 'seven-of-pentacles', name: 'Seven of Pentacles', number: 7, suit: 'Pentacles', emoji: '🌱',
    keywords: { upright: 'Long-term view, sustainable results, perseverance, investment', reversed: 'Lack of long-term vision, limited success, impatience' },
    meaning: { free: 'Patience is not passive. It is powerful.', premium: 'The Seven of Pentacles is the card of the gardener who pauses to look at what has grown. You have been so busy planting that you have not noticed the fruit. Step back. Something you started months ago is ready. You do not need to plant more. You need to harvest.' },
    archetypes: ['Consistency Seeker', 'Quiet Strategist'],
  },
  {
    id: 'eight-of-pentacles', name: 'Eight of Pentacles', number: 8, suit: 'Pentacles', emoji: '🔨',
    keywords: { upright: 'Apprenticeship, repetitive tasks, mastery, skill development', reversed: 'Self-development, perfectionism, misdirected activity' },
    meaning: { free: 'The craft is in the repetition.', premium: 'The Eight of Pentacles is the quiet mastery of showing up. Not for recognition. Not for the finished piece. Just for the practice. You have been looking for the shortcut, but there is none. The only way through is through. And that is not a punishment — it is a promise.' },
    archetypes: ['Consistency Seeker', 'Quiet Strategist'],
  },
  {
    id: 'nine-of-pentacles', name: 'Nine of Pentacles', number: 9, suit: 'Pentacles', emoji: '🦚',
    keywords: { upright: 'Abundance, luxury, self-sufficiency, financial independence', reversed: 'Living beyond means, superficiality, self-worth issues' },
    meaning: { free: 'You have built this. Own it.', premium: 'The Nine of Pentacles is the garden you planted, tended, and now walk through alone. The independence is not loneliness — it is the reward of self-sufficiency. You do not need anyone to validate what you have built. The garden is proof enough.' },
    archetypes: ['Consistency Seeker', 'Quiet Strategist', 'Quiet Intensity'],
  },
  {
    id: 'ten-of-pentacles', name: 'Ten of Pentacles', number: 10, suit: 'Pentacles', emoji: '👨‍👩‍👧‍👦',
    keywords: { upright: 'Wealth, financial security, family, long-term success', reversed: 'Financial failure, loneliness, loss, family issues' },
    meaning: { free: 'Legacy is built in small choices.', premium: 'The Ten of Pentacles is not just money — it is the accumulated result of every small choice you have made. The legacy you are building is not only for the future. It is the life you are living right now. What are you choosing today that your future self will thank you for?' },
    archetypes: ['Consistency Seeker', 'Quiet Strategist'],
  },
  {
    id: 'page-of-pentacles', name: 'Page of Pentacles', number: 11, suit: 'Pentacles', emoji: '📚',
    keywords: { upright: 'Manifestation, financial opportunity, skill development', reversed: 'Lack of progress, procrastination, learn from failure' },
    meaning: { free: 'A new opportunity is taking root.', premium: 'The Page of Pentacles brings a practical dream — not a fantasy, but a plan with soil. You have been thinking about something for too long. Today is the day to take the first physical step. Not the whole staircase. Just the first one.' },
    archetypes: ['Quiet Strategist', 'Consistency Seeker'],
  },
  {
    id: 'knight-of-pentacles', name: 'Knight of Pentacles', number: 12, suit: 'Pentacles', emoji: '🐢',
    keywords: { upright: 'Hard work, productivity, routine, conservatism', reversed: 'Self-discipline, boredom, feeling stuck, practicality' },
    meaning: { free: 'Slow is not stagnant.', premium: 'The Knight of Pentacles moves slowly because he is thorough, not because he is lost. You have been comparing your pace to everyone else\'s. But your process is different. Trust the turtle. He always arrives, and he arrives with everything intact.' },
    archetypes: ['Consistency Seeker', 'Quiet Strategist'],
  },
  {
    id: 'queen-of-pentacles', name: 'Queen of Pentacles', number: 13, suit: 'Pentacles', emoji: '👑',
    keywords: { upright: 'Nurturing, practical, providing financially, working parent', reversed: 'Financial independence, self-care, work-home conflict' },
    meaning: { free: 'Nurture what is real and growing.', premium: 'The Queen of Pentacles holds abundance and warmth in the same hand. She does not choose between success and care — she creates the conditions for both. Where have you been sacrificing your wellbeing for output? Today, tend to the ground you are standing on.' },
    archetypes: ['Consistency Seeker', 'Emotional Navigator'],
  },
  {
    id: 'king-of-pentacles', name: 'King of Pentacles', number: 14, suit: 'Pentacles', emoji: '👑',
    keywords: { upright: 'Wealth, business, leadership, security, discipline', reversed: 'Financially inept, obsessed with wealth, stubborn' },
    meaning: { free: 'Leadership is stewardship.', premium: 'The King of Pentacles is the master of resources — not because he hoards, but because he understands flow. He knows that abundance is not about having more. It is about trusting that what comes in can also go out, and the cycle continues. What are you afraid to release?' },
    archetypes: ['Quiet Strategist', 'Consistency Seeker'],
  },
];

export const ARCHEYPES = [
  'Quiet Strategist',
  'Emotional Navigator',
  'Consistency Seeker',
  'Pattern Reader',
  'Quiet Intensity',
];

export function getCardsForArchetype(archetype: string): TarotCard[] {
  const pool = TAROT_CARDS.filter((c) => c.archetypes.includes(archetype));
  // Fallback: if no match, return all Major Arcana
  if (pool.length === 0) {
    return TAROT_CARDS.filter((c) => c.suit === 'Major');
  }
  return pool;
}
