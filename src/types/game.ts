export type Role = 'boy' | 'girl';
export type Team = 'blue' | 'pink';
export type Mode = '2p' | Role;
export type Difficulty = 'easy' | 'medium' | 'hard' | 'super';
export type DeckFilter = 'mixed' | Role;
export type StickerId = 'none' | 'dino' | 'crown' | 'bunny' | 'cowboy';
export type View = 'setup' | 'game' | 'victory' | 'timesup';

export interface Player {
  name: string;
  avatar: string | null;
  sticker: StickerId;
  lifetimeScore: number;
}

export interface Settings {
  mode: Mode;
  difficulty: Difficulty;
  deckFilter: DeckFilter;
  soundEnabled: boolean;
  mumPin: string;
  firstPlayUnlocked: boolean;
  /** Epoch ms when the countdown ends (null when not running). */
  timerEndTimestamp: number | null;
  /** Seconds stored while the countdown is configured but not running. */
  timerRemainingSec: number;
}

export interface CardTemplate {
  id: string;
  name: string;
  team: Team;
  src: string;
}

export interface Card extends CardTemplate {
  uid: string;
  matched: boolean;
}

export interface Popup {
  id: number;
  text: string;
  className: string;
  x: number;
  y: number;
}

export interface Toast {
  id: number;
  text: string;
  className: string;
}
