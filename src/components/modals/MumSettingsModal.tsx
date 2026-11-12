import { useState } from 'react';
import { formatTime, useGame } from '../../context/GameContext';

const PRESETS: [number, string, string][] = [
  [0, 'Lock', 'bg-rose-400'], [5, '5m', 'bg-white'], [10, '10m', 'bg-white'], [15, '15m', 'bg-white'], [30, '30m', 'bg-lime-400'],
];

export function MumSettingsModal() {
  const { remaining, settings, closeMum, setTimerMinutes, adjustTimerMinutes, toggleSound, resetStars, changePin } = useGame();
  const [newPin, setNewPin] = useState('');
  const chip = 'py-1.5 rounded-xl border-2 border-ink text-ink font-black text-xs';

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between border-b-2 border-ink pb-2">
        <h3 className="font-display font-bold text-xl text-ink">⚙️ Parent Controls</h3>
        <button type="button" onClick={closeMum} aria-label="Close" className="cartoon-pill w-8 h-8 rounded-full bg-rose-400 text-ink font-black">✕</button>
      </div>

      <div className="cartoon-box-sm bg-amber-100 rounded-2xl p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase text-ink">⏱️ Play Timer</span>
          <span className="font-display font-bold text-lg text-indigo-800">{remaining > 0 ? formatTime(remaining) : '00:00 (Locked)'}</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5 mb-2">
          {PRESETS.map(([m, label, bg]) => (
            <button key={m} type="button" onClick={() => setTimerMinutes(m)} className={`${chip} ${bg}`}>{label}</button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-2 mt-2">
          <button type="button" onClick={() => adjustTimerMinutes(-1)} className={`flex-1 ${chip} bg-white`}>-1 Min</button>
          <button type="button" onClick={() => adjustTimerMinutes(2)} className={`flex-1 ${chip} bg-white`}>+2 Mins</button>
        </div>
        <p className="text-[10px] font-bold text-slate-700 mt-1.5 text-center">Warns at 1m, 30s &amp; 10s, then shows results &amp; locks!</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={toggleSound} className="cartoon-pill py-2.5 px-3 rounded-2xl bg-amber-200 font-black text-xs text-ink flex items-center justify-center gap-1.5">
          <span>{settings.soundEnabled ? '🔊' : '🔇'}</span> Sound: {settings.soundEnabled ? 'ON' : 'OFF'}
        </button>
        <button type="button" onClick={resetStars} className="cartoon-pill py-2.5 px-3 rounded-2xl bg-pink-200 font-black text-xs text-ink flex items-center justify-center gap-1.5">
          <span>🧹</span> Reset Stars
        </button>
      </div>

      <div className="bg-slate-100 rounded-2xl p-2.5 border-2 border-ink flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <input type="text" autoCapitalize="none" autoComplete="off" maxLength={20} placeholder="New alphanumeric passcode"
            value={newPin} onChange={(e) => setNewPin(e.target.value)}
            className="w-full bg-white px-2.5 py-1.5 rounded-xl border-2 border-ink text-xs font-black outline-none" />
          <button type="button" onClick={() => { if (changePin(newPin)) setNewPin(''); }}
            className="shrink-0 bg-indigo-600 text-white border-2 border-ink text-xs font-black px-3 py-1.5 rounded-xl">Save</button>
        </div>
        <p className="text-[10px] font-bold text-slate-500">Letters &amp; numbers allowed (case-insensitive).</p>
      </div>

      <button type="button" onClick={closeMum} className="btn-chunky w-full py-3 rounded-2xl bg-lime-400 text-ink font-cartoon text-lg">DONE!</button>
    </div>
  );
}
