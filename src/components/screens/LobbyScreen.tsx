import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Avatar } from '../common/Avatar';
import { InstallBanner } from '../common/InstallBanner';
import type { DeckFilter, Difficulty, Mode, Role } from '../../types/game';

const base = 'font-display font-bold transition border-2 border-ink rounded-2xl';
const pick = (active: boolean, on: string, off: string) =>
  `${base} ${active ? `${on} shadow-[0_3px_0_#1e1b4b] -translate-y-0.5` : `${off} shadow-[0_2px_0_#1e1b4b]`}`;

function PlayerCard({ role }: { role: Role }) {
  const { players, setName, openCamera } = useGame();
  const p = players[role];
  const boy = role === 'boy';
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <div className={`cartoon-box bg-gradient-to-b ${boy ? 'from-sky-300 to-blue-400' : 'from-pink-300 to-rose-400'} rounded-3xl p-3 flex flex-col items-center relative`}>
      <span className={`cartoon-pill absolute -top-3.5 ${boy ? 'bg-blue-600' : 'bg-pink-600'} text-white text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider`}>
        {boy ? '🔵 Blue Team' : '🩷 Pink Team'}
      </span>
      <button type="button" onClick={() => openCamera(role)} aria-label={`Change ${p.name}'s photo`} className="mt-2 relative group focus:outline-none">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-4 border-ink shadow-md overflow-hidden flex items-center justify-center">
          <Avatar role={role} />
        </div>
        <span className="cartoon-pill absolute -bottom-1 -right-1 bg-amber-300 text-ink p-1.5 rounded-full text-xs group-hover:scale-110 transition">📷</span>
      </button>
      <input type="text" maxLength={14} value={draft ?? p.name}
        onChange={(e) => { setDraft(e.target.value); setName(role, e.target.value.trim()); }}
        onBlur={() => setDraft(null)} onFocus={(e) => e.target.select()} aria-label={`${boy ? 'Boy' : 'Girl'} Player Name`}
        className="cartoon-pill mt-2.5 w-full text-center font-display font-bold text-lg text-ink bg-white focus:bg-amber-50 rounded-2xl py-1 px-2 outline-none" />
      <div className="mt-1.5 bg-white/90 px-2.5 py-0.5 rounded-full border-2 border-ink text-[11px] font-black text-ink flex items-center gap-1">
        <span>⭐ Stars:</span><span>{p.lifetimeScore}</span>
      </div>
    </div>
  );
}

export function LobbyScreen() {
  const { players, settings, setMode, setDifficulty, setDeckFilter, startGame } = useGame();
  const label = 'block text-xs font-black uppercase tracking-wider text-indigo-900 mb-1.5';

  const modes: [Mode, string][] = [['2p', '👫 Together'], ['boy', `👦 ${players.boy.name} Solo`], ['girl', `👧 ${players.girl.name} Solo`]];
  const diffs: [Difficulty, string][] = [['easy', '🐣 Easy (8)'], ['medium', '🌟 Med (12)'], ['hard', '🚀 Hard (16)'], ['super', '👑 Super (20)']];
  const decks: [DeckFilter, string][] = [['mixed', '🎨 Mixed All'], ['boy', `🦖 ${players.boy.name}'s`], ['girl', `🎀 ${players.girl.name}'s`]];

  return (
    <section className="flex-1 flex flex-col justify-center gap-3.5 py-1">
      <div className="text-center">
        <div className="cartoon-pill inline-flex items-center gap-2 bg-amber-300 px-4 py-1 rounded-full mb-1.5 -rotate-1">
          <span className="text-lg">🦖</span>
          <span className="text-xs font-black tracking-wide text-ink uppercase">Kids Memory Adventure</span>
          <span className="text-lg">🎀</span>
        </div>
        <h1 className="font-cartoon text-4xl sm:text-5xl text-amber-300 cartoon-title-stroke tracking-wide">SUPER MATCH!</h1>
        <div className="cartoon-pill inline-block bg-white/95 px-3 py-1 rounded-full mt-1.5">
          <p className="text-[11px] sm:text-xs font-black text-ink">
            Your Pair = <span className="text-amber-600">+4</span> • Other Pair = <span className="text-emerald-600">+3</span> • Your Color = <span className="text-blue-600">+2</span> • Other = <span className="text-pink-600">+1</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <PlayerCard role="boy" />
        <PlayerCard role="girl" />
      </div>

      <div className="cartoon-box bg-white rounded-3xl p-3.5 flex flex-col gap-3">
        <div>
          <label className={label}>🎮 Who is Playing?</label>
          <div className="grid grid-cols-3 gap-2">
            {modes.map(([id, text]) => (
              <button key={id} type="button" onClick={() => setMode(id)}
                className={`${pick(settings.mode === id, 'bg-indigo-600 text-white', 'bg-sky-200 text-ink hover:bg-sky-300')} py-2 px-2 text-xs sm:text-sm truncate`}>{text}</button>
            ))}
          </div>
        </div>
        <div>
          <label className={label}>🧩 Board Size</label>
          <div className="grid grid-cols-4 gap-1.5">
            {diffs.map(([id, text]) => (
              <button key={id} type="button" onClick={() => setDifficulty(id)}
                className={`${pick(settings.difficulty === id, 'bg-amber-400 text-ink', 'bg-amber-200 text-ink hover:bg-amber-300')} py-2 px-1 text-xs`}>{text}</button>
            ))}
          </div>
        </div>
        <div>
          <label className={label}>🃏 Card Deck</label>
          <div className="grid grid-cols-3 gap-2">
            {decks.map(([id, text]) => (
              <button key={id} type="button" onClick={() => setDeckFilter(id)}
                className={`${pick(settings.deckFilter === id, 'bg-purple-600 text-white', 'bg-purple-200 text-ink hover:bg-purple-300')} py-2 px-2 text-xs sm:text-sm truncate`}>{text}</button>
            ))}
          </div>
        </div>
      </div>

      <button type="button" onClick={startGame}
        className="btn-chunky w-full py-4 rounded-3xl bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 text-ink font-cartoon text-2xl sm:text-3xl tracking-wider flex items-center justify-center gap-3">
        <span>PLAY GAME!</span><span className="text-3xl">🚀</span>
      </button>

      <InstallBanner />
    </section>
  );
}
