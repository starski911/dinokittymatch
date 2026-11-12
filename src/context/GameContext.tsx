import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode,
} from 'react';
import type {
  Card, Difficulty, DeckFilter, Mode, Player, Popup, Role, Settings, Toast, View,
} from '../types/game';
import { buildDeck, CARD_COUNTS } from '../utils/deck';
import { fireBigConfetti, fireMiniConfetti } from '../utils/confetti';
import { sound } from '../services/sound';
import { useAudio } from '../hooks/useAudio';
import { formatTime, getRemainingSeconds, useGameTimer } from '../hooks/useGameTimer';

const STORAGE_KEY = 'super_match_kids_v3';
const MASTER_PIN = 'ruie';

const DEFAULT_PLAYERS: Record<Role, Player> = {
  boy: { name: 'Joey', avatar: null, sticker: 'dino', lifetimeScore: 0 },
  girl: { name: 'Alina', avatar: null, sticker: 'crown', lifetimeScore: 0 },
};

const DEFAULT_SETTINGS: Settings = {
  mode: '2p',
  difficulty: 'easy',
  deckFilter: 'mixed',
  soundEnabled: true,
  mumPin: '1234',
  firstPlayUnlocked: false,
  timerEndTimestamp: null,
  timerRemainingSec: 600,
};

interface GameState {
  cards: Card[];
  flipped: number[];
  matchedCount: number;
  busy: boolean;
  turn: Role;
  scores: Record<Role, number>;
  claimedColorPairs: string[];
}

const EMPTY_GAME: GameState = {
  cards: [], flipped: [], matchedCount: 0, busy: false, turn: 'boy',
  scores: { boy: 0, girl: 0 }, claimedColorPairs: [],
};

function load(): { players: Record<Role, Player>; settings: Settings } {
  const players = { boy: { ...DEFAULT_PLAYERS.boy }, girl: { ...DEFAULT_PLAYERS.girl } };
  let settings = { ...DEFAULT_SETTINGS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.players) {
        Object.assign(players.boy, parsed.players.boy);
        Object.assign(players.girl, parsed.players.girl);
      }
      if (parsed.settings) settings = { ...settings, ...parsed.settings };
    }
  } catch (e) {
    console.warn('Could not load saved state:', e);
  }
  return { players, settings };
}

export type MumPurpose = 'settings' | 'first_play';

interface Ctx {
  players: Record<Role, Player>;
  settings: Settings;
  game: GameState;
  view: View;
  remaining: number;
  toasts: Toast[];
  popups: Popup[];
  mumModal: MumPurpose | null;
  mumStep: 'pin' | 'settings';
  cameraRole: Role | null;
  // lobby
  setName(role: Role, name: string): void;
  setMode(m: Mode): void;
  setDifficulty(d: Difficulty): void;
  setDeckFilter(d: DeckFilter): void;
  // game
  startGame(): void;
  goHome(): void;
  tapCard(index: number): void;
  // camera
  openCamera(role: Role): void;
  closeCamera(): void;
  saveAvatar(role: Role, avatar: string | null, sticker: Player['sticker']): void;
  // mum
  openMum(purpose?: MumPurpose): void;
  closeMum(): void;
  verifyPin(pin: string): boolean;
  setTimerMinutes(mins: number): void;
  adjustTimerMinutes(delta: number): void;
  toggleSound(): void;
  resetStars(): void;
  changePin(pin: string): boolean;
  // ui
  showToast(text: string, className?: string): void;
}

const GameCtx = createContext<Ctx | null>(null);

export function useGame(): Ctx {
  const c = useContext(GameCtx);
  if (!c) throw new Error('useGame must be used inside GameProvider');
  return c;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const initial = useRef(load()).current;
  const [players, setPlayers] = useState(initial.players);
  const [settings, setSettings] = useState(initial.settings);
  const [game, setGame] = useState<GameState>(EMPTY_GAME);
  const [view, setView] = useState<View>('setup');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [mumModal, setMumModal] = useState<MumPurpose | null>(null);
  const [mumStep, setMumStep] = useState<'pin' | 'settings'>('pin');
  const [cameraRole, setCameraRole] = useState<Role | null>(null);

  // Mutable mirrors so timers and the countdown always read the latest values.
  const playersRef = useRef(players);
  const settingsRef = useRef(settings);
  const gameRef = useRef(game);
  const viewRef = useRef(view);
  const mumStepRef = useRef(mumStep);
  const mumOpenRef = useRef<MumPurpose | null>(null);
  const timers = useRef<number[]>([]);
  const uid = useRef(0);
  mumStepRef.current = mumStep;
  mumOpenRef.current = mumModal;
  viewRef.current = view;

  useAudio(settings.soundEnabled);

  const patchSettings = useCallback((p: Partial<Settings>) => {
    settingsRef.current = { ...settingsRef.current, ...p };
    setSettings(settingsRef.current);
  }, []);
  const patchPlayers = useCallback((fn: (p: Record<Role, Player>) => Record<Role, Player>) => {
    playersRef.current = fn(playersRef.current);
    setPlayers(playersRef.current);
  }, []);
  const patchGame = useCallback((fn: (g: GameState) => GameState) => {
    gameRef.current = fn(gameRef.current);
    setGame(gameRef.current);
  }, []);
  const getSettings = useCallback(() => settingsRef.current, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ players, settings }));
    } catch (e) {
      console.warn('Could not save state:', e);
    }
  }, [players, settings]);

  // ---- toasts / popups --------------------------------------------------------
  const showToast = useCallback((text: string, className = 'bg-slate-800') => {
    const id = ++uid.current;
    setToasts((t) => [...t, { id, text, className }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2400);
  }, []);

  const spawnPopup = useCallback((index: number, text: string, className: string) => {
    const el = document.getElementById(`card-${index}`);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const id = ++uid.current;
    setPopups((p) => [...p, { id, text, className, x: r.left + r.width / 2, y: r.top + r.height * 0.35 }]);
    window.setTimeout(() => setPopups((p) => p.filter((x) => x.id !== id)), 1350);
  }, []);

  // ---- session lock -----------------------------------------------------------
  const isLocked = useCallback(() => getRemainingSeconds(settingsRef.current) <= 0, []);

  const clearCardTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  /** setTimeout that is cancelled on lock-out and never fires after the session ends. */
  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(() => {
      timers.current = timers.current.filter((t) => t !== id);
      if (getRemainingSeconds(settingsRef.current) <= 0) return;
      fn();
    }, delay);
    timers.current.push(id);
  }, []);

  const showTimesUp = useCallback(() => {
    clearCardTimers();
    patchGame((g) => ({ ...g, busy: true, flipped: [] }));
    setCameraRole(null);
    if (viewRef.current !== 'timesup') sound.victory();
    viewRef.current = 'timesup';
    setView('timesup');
  }, [clearCardTimers, patchGame]);

  const timer = useGameTimer({
    getSettings,
    patchSettings,
    onWarn: showToast,
    onExpire: () => {
      if (mumOpenRef.current && mumStepRef.current === 'settings') {
        // Mum is in the settings panel: lock the board but let her finish.
        clearCardTimers();
        patchGame((g) => ({ ...g, busy: true }));
      } else {
        showTimesUp();
      }
    },
  });

  // Enforce lock immediately on load if timer already expired.
  useEffect(() => {
    if (getRemainingSeconds(settingsRef.current) <= 0) {
      viewRef.current = 'timesup';
      setView('timesup');
    }
    return clearCardTimers;
  }, [clearCardTimers]);

  // ---- lobby ------------------------------------------------------------------
  const setName = useCallback((role: Role, raw: string) => {
    const name = raw.slice(0, 14) || (role === 'boy' ? 'Joey' : 'Alina');
    patchPlayers((p) => ({ ...p, [role]: { ...p[role], name } }));
  }, [patchPlayers]);
  const setMode = useCallback((mode: Mode) => { sound.flip(); patchSettings({ mode }); }, [patchSettings]);
  const setDifficulty = useCallback((difficulty: Difficulty) => { sound.flip(); patchSettings({ difficulty }); }, [patchSettings]);
  const setDeckFilter = useCallback((deckFilter: DeckFilter) => { sound.flip(); patchSettings({ deckFilter }); }, [patchSettings]);

  const goHome = useCallback(() => {
    clearCardTimers();
    if (isLocked()) { showTimesUp(); return; }
    setView('setup');
  }, [clearCardTimers, isLocked, showTimesUp]);

  // ---- mum --------------------------------------------------------------------
  const openMum = useCallback((purpose: MumPurpose = 'settings') => {
    setMumStep('pin');
    mumStepRef.current = 'pin';
    setMumModal(purpose);
  }, []);

  const closeMum = useCallback(() => {
    setMumModal(null);
    setMumStep('pin');
    mumStepRef.current = 'pin';
    if (isLocked()) showTimesUp();
    else if (viewRef.current === 'timesup') { viewRef.current = 'setup'; setView('setup'); }
  }, [isLocked, showTimesUp]);

  // ---- game -------------------------------------------------------------------
  const startGame = useCallback(() => {
    sound.init();
    if (!settingsRef.current.firstPlayUnlocked) { openMum('first_play'); return; }
    if (isLocked()) { showTimesUp(); return; }
    clearCardTimers();

    const s = settingsRef.current;
    if (!s.timerEndTimestamp && s.timerRemainingSec > 0) {
      patchSettings({ timerEndTimestamp: Date.now() + s.timerRemainingSec * 1000 });
      timer.resetAlerts();
    }
    timer.refresh();

    const pairs = CARD_COUNTS[s.difficulty] / 2;
    patchGame(() => ({
      ...EMPTY_GAME,
      cards: buildDeck(pairs, s.deckFilter),
      turn: s.mode === 'girl' ? 'girl' : 'boy',
    }));
    viewRef.current = 'game';
    setView('game');
    sound.flip();
  }, [openMum, isLocked, showTimesUp, clearCardTimers, patchSettings, patchGame, timer]);

  const advanceTurn = useCallback(() => {
    if (settingsRef.current.mode === '2p') {
      patchGame((g) => ({ ...g, turn: g.turn === 'boy' ? 'girl' : 'boy' }));
    }
  }, [patchGame]);

  const finishGame = useCallback(() => {
    sound.victory();
    fireBigConfetti();
    const { scores } = gameRef.current;
    patchPlayers((p) => ({
      boy: { ...p.boy, lifetimeScore: p.boy.lifetimeScore + scores.boy },
      girl: { ...p.girl, lifetimeScore: p.girl.lifetimeScore + scores.girl },
    }));
    if (isLocked()) showTimesUp();
    else { viewRef.current = 'victory'; setView('victory'); }
  }, [patchPlayers, isLocked, showTimesUp]);

  const evaluatePair = useCallback(() => {
    const g = gameRef.current;
    const [i1, i2] = g.flipped;
    const c1 = g.cards[i1];
    const c2 = g.cards[i2];
    const active = g.turn;
    const ownTeam = active === 'boy' ? 'blue' : 'pink';
    const own = c1.team === ownTeam;
    const teamLabel = c1.team === 'blue' ? 'Blue' : 'Pink';

    if (c1.id === c2.id) {
      const pts = own ? 4 : 3;
      schedule(() => {
        sound.exactMatch();
        patchGame((s) => ({
          ...s,
          cards: s.cards.map((c, i) => (i === i1 || i === i2 ? { ...c, matched: true } : c)),
          matchedCount: s.matchedCount + 2,
          scores: { ...s.scores, [active]: s.scores[active] + pts },
          flipped: [],
          busy: false,
        }));
        spawnPopup(i2, `${pts === 4 ? 'POW!' : 'SUPER!'} +${pts} ${teamLabel}! ⭐`,
          pts === 4 ? 'bg-amber-300 text-ink' : 'bg-lime-300 text-ink');
        fireMiniConfetti();
        if (gameRef.current.matchedCount >= gameRef.current.cards.length) {
          schedule(finishGame, 650);
        } else if (settingsRef.current.mode === '2p') {
          showToast(`🎉 ${playersRef.current[active].name} gets a BONUS TURN!`, 'bg-emerald-600');
        }
      }, 420);
    } else if (c1.team === c2.team) {
      const pts = own ? 2 : 1;
      const key = [c1.uid, c2.uid].sort().join('::');
      const claimed = g.claimedColorPairs.includes(key);
      schedule(() => {
        if (!claimed) {
          patchGame((s) => ({
            ...s,
            claimedColorPairs: [...s.claimedColorPairs, key],
            scores: { ...s.scores, [active]: s.scores[active] + pts },
          }));
          sound.colorMatch();
          spawnPopup(i2, `${pts === 2 ? 'NICE!' : 'COOL!'} +${pts} ${teamLabel}!`,
            pts === 2 ? 'bg-sky-300 text-ink' : 'bg-pink-300 text-ink');
        } else {
          sound.mismatch();
          spawnPopup(i2, 'Already claimed!', 'bg-slate-200 text-ink');
        }
        schedule(() => {
          patchGame((s) => ({ ...s, flipped: [], busy: false }));
          advanceTurn();
        }, 650);
      }, 450);
    } else {
      schedule(() => {
        sound.mismatch();
        patchGame((s) => ({ ...s, flipped: [], busy: false }));
        advanceTurn();
      }, 900);
    }
  }, [schedule, patchGame, spawnPopup, finishGame, showToast, advanceTurn]);

  const tapCard = useCallback((index: number) => {
    if (isLocked()) { showTimesUp(); return; }
    const g = gameRef.current;
    const card = g.cards[index];
    if (g.busy || !card || card.matched || g.flipped.includes(index)) return;
    sound.flip();
    const flipped = [...g.flipped, index];
    patchGame((s) => ({ ...s, flipped, busy: flipped.length === 2 }));
    if (flipped.length === 2) evaluatePair();
  }, [isLocked, showTimesUp, patchGame, evaluatePair]);

  // ---- camera -----------------------------------------------------------------
  const openCamera = useCallback((role: Role) => { sound.flip(); setCameraRole(role); }, []);
  const closeCamera = useCallback(() => setCameraRole(null), []);
  const saveAvatar = useCallback((role: Role, avatar: string | null, sticker: Player['sticker']) => {
    sound.exactMatch();
    patchPlayers((p) => ({ ...p, [role]: { ...p[role], avatar, sticker } }));
    setCameraRole(null);
    showToast(`📸 ${playersRef.current[role].name}'s photo saved!`, 'bg-emerald-600');
  }, [patchPlayers, showToast]);

  // ---- mum actions ------------------------------------------------------------
  const verifyPin = useCallback((raw: string): boolean => {
    const entered = raw.trim().toLowerCase();
    const saved = (settingsRef.current.mumPin || '1234').trim().toLowerCase();
    if (entered.length > 0 && (entered === MASTER_PIN || entered === saved)) {
      sound.exactMatch();
      if (mumOpenRef.current === 'first_play') {
        patchSettings({ firstPlayUnlocked: true });
        setMumModal(null);
        // startGame reads settingsRef, which is already updated.
        window.setTimeout(() => startGame(), 0);
      } else {
        setMumStep('settings');
        mumStepRef.current = 'settings';
      }
      return true;
    }
    sound.mismatch();
    showToast('❌ Wrong Passcode!', 'bg-rose-600');
    return false;
  }, [patchSettings, showToast, startGame]);

  const applySeconds = useCallback((secs: number) => {
    patchSettings({ timerRemainingSec: secs, timerEndTimestamp: secs > 0 ? Date.now() + secs * 1000 : null });
    timer.resetAlerts();
    timer.refresh();
  }, [patchSettings, timer]);

  const setTimerMinutes = useCallback((mins: number) => {
    sound.flip();
    applySeconds(Math.max(0, Math.round(mins * 60)));
  }, [applySeconds]);

  const adjustTimerMinutes = useCallback((delta: number) => {
    sound.flip();
    applySeconds(Math.max(0, getRemainingSeconds(settingsRef.current) + delta * 60));
  }, [applySeconds]);

  const toggleSound = useCallback(() => {
    const enabled = !settingsRef.current.soundEnabled;
    sound.enabled = enabled;
    if (enabled) sound.flip();
    patchSettings({ soundEnabled: enabled });
  }, [patchSettings]);

  const resetStars = useCallback(() => {
    sound.flip();
    patchPlayers((p) => ({ boy: { ...p.boy, lifetimeScore: 0 }, girl: { ...p.girl, lifetimeScore: 0 } }));
    showToast('⭐ Lifetime stars cleared!', 'bg-indigo-600');
  }, [patchPlayers, showToast]);

  const changePin = useCallback((raw: string): boolean => {
    const val = raw.trim();
    if (!/^[a-zA-Z0-9]{2,20}$/.test(val)) { showToast('Use 2–20 letters or numbers', 'bg-rose-600'); return false; }
    patchSettings({ mumPin: val });
    sound.exactMatch();
    showToast('✅ Passcode updated!', 'bg-emerald-600');
    return true;
  }, [patchSettings, showToast]);

  const value = useMemo<Ctx>(() => ({
    players, settings, game, view, remaining: timer.remaining, toasts, popups, mumModal, mumStep, cameraRole,
    setName, setMode, setDifficulty, setDeckFilter, startGame, goHome, tapCard,
    openCamera, closeCamera, saveAvatar, openMum, closeMum, verifyPin,
    setTimerMinutes, adjustTimerMinutes, toggleSound, resetStars, changePin, showToast,
  }), [players, settings, game, view, timer.remaining, toasts, popups, mumModal, mumStep, cameraRole,
    setName, setMode, setDifficulty, setDeckFilter, startGame, goHome, tapCard, openCamera, closeCamera,
    saveAvatar, openMum, closeMum, verifyPin, setTimerMinutes, adjustTimerMinutes, toggleSound, resetStars,
    changePin, showToast]);

  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>;
}

export { formatTime };
