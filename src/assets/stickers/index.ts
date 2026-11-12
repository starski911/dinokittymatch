import type { StickerId } from '../../types/game';

/** Sticker catalogue. Drawn as emoji glyphs so they composite crisply onto the avatar canvas. */
export const STICKERS: { id: StickerId; emoji: string; label: string }[] = [
  { id: 'none', emoji: '🚫', label: 'None' },
  { id: 'dino', emoji: '🦖', label: 'Dino' },
  { id: 'crown', emoji: '👑', label: 'Crown' },
  { id: 'bunny', emoji: '🐰', label: 'Bunny' },
  { id: 'cowboy', emoji: '🤠', label: 'Cowboy' },
];

export const stickerEmoji = (id: StickerId): string =>
  STICKERS.find((s) => s.id === id && id !== 'none')?.emoji ?? '';
