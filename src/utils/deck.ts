import { CARD_CATALOG } from '../assets/cards';
import type { Card, CardTemplate, DeckFilter, Difficulty } from '../types/game';

export const CARD_COUNTS: Record<Difficulty, number> = { easy: 8, medium: 12, hard: 16, super: 20 };

export function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Builds a guaranteed-clearable deck: every template appears as exactly one exact pair,
 * and for "mixed" the pairs are split evenly between Blue and Pink so both kids have
 * the same number of own-colour cards.
 */
export function buildDeck(pairCount: number, filter: DeckFilter): Card[] {
  let templates: CardTemplate[];
  if (filter === 'mixed') {
    const blue = shuffle(CARD_CATALOG.filter((c) => c.team === 'blue'));
    const pink = shuffle(CARD_CATALOG.filter((c) => c.team === 'pink'));
    templates = [];
    for (let i = 0; i < pairCount; i++) {
      const pool = i % 2 === 0 ? blue : pink;
      templates.push(pool[Math.floor(i / 2) % pool.length]);
    }
  } else {
    const pool = shuffle(CARD_CATALOG.filter((c) => c.team === (filter === 'boy' ? 'blue' : 'pink')));
    templates = Array.from({ length: pairCount }, (_, i) => pool[i % pool.length]);
  }

  const cards: Card[] = [];
  templates.forEach((t, idx) => {
    cards.push({ ...t, uid: `${t.id}_${idx}_a`, matched: false });
    cards.push({ ...t, uid: `${t.id}_${idx}_b`, matched: false });
  });
  return shuffle(cards);
}
