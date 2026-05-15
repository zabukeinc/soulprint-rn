import { TarotCard, getCardsForArchetype, TAROT_CARDS } from './tarot';

interface DrawResult {
  card: TarotCard;
  reversed: boolean;
}

/**
 * Hybrid draw: filter by archetype, then random from pool.
 * If reversed is enabled, 20% chance of reversal.
 */
export function drawCard(archetype: string, allowReversed: boolean = true): DrawResult {
  const pool = getCardsForArchetype(archetype);
  const index = Math.floor(Math.random() * pool.length);
  const card = pool[index];
  const reversed = allowReversed ? Math.random() < 0.2 : false;
  return { card, reversed };
}

/**
 * Draw a 3-card spread: Past, Present, Future
 * Past + Present from archetype pool, Future from full deck for variety
 */
export function drawSpread(archetype: string, allowReversed: boolean = true): {
  past: DrawResult;
  present: DrawResult;
  future: DrawResult;
} {
  const pool = getCardsForArchetype(archetype);
  const fullPool = TAROT_CARDS;

  // Helper to pick unique card
  const usedIds = new Set<string>();
  const pickUnique = (from: TarotCard[]): DrawResult => {
    const available = from.filter((c) => !usedIds.has(c.id));
    const source = available.length > 0 ? available : from;
    const idx = Math.floor(Math.random() * source.length);
    const card = source[idx];
    usedIds.add(card.id);
    const reversed = allowReversed ? Math.random() < 0.2 : false;
    return { card, reversed };
  };

  return {
    past: pickUnique(pool),
    present: pickUnique(pool),
    future: pickUnique(fullPool),
  };
}

/**
 * Draw a single card with a random position.
 * Used for free tier: 1 card = 1 random position (past/present/future).
 */
export function drawSingleCard(
  archetype: string,
  allowReversed: boolean = true
): DrawResult & { position: 'past' | 'present' | 'future' } {
  const result = drawCard(archetype, allowReversed);
  const positions: ('past' | 'present' | 'future')[] = ['past', 'present', 'future'];
  const position = positions[Math.floor(Math.random() * positions.length)];
  return { ...result, position };
}

export function getPositionMeaning(position: 'past' | 'present' | 'future'): string {
  switch (position) {
    case 'past':
      return 'What brought you here';
    case 'present':
      return 'Where you stand now';
    case 'future':
      return 'Where this energy leads';
  }
}
