import { useEffect, useRef, useState } from 'react';
import { useGame } from '../../context/GameContext';

export function MumPinModal() {
  const { mumModal, verifyPin, closeMum } = useGame();
  const [pin, setPin] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const firstPlay = mumModal === 'first_play';

  useEffect(() => { const t = window.setTimeout(() => ref.current?.focus(), 100); return () => window.clearTimeout(t); }, []);

  const submit = () => {
    if (!verifyPin(pin)) { setPin(''); ref.current?.focus(); }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className="cartoon-pill w-12 h-12 rounded-2xl bg-amber-300 text-ink flex items-center justify-center text-2xl mb-2">🔒</div>
      <h3 className="font-display font-bold text-xl text-ink">{firstPlay ? "Mum's Permission" : "Mum's Secret Zone"}</h3>
      <p className="text-xs text-slate-600 font-bold mt-0.5">{firstPlay ? "Enter Mum's Passcode to unlock Play!" : "Enter Mum's Passcode"}</p>
      <input ref={ref} type="password" autoCapitalize="none" autoComplete="off" autoCorrect="off" spellCheck={false} maxLength={20}
        placeholder="Passcode" value={pin} onChange={(e) => setPin(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
        className="cartoon-pill mt-4 w-52 text-center text-xl tracking-wider font-black py-2.5 px-3 rounded-2xl outline-none bg-amber-50" />
      <div className="grid grid-cols-2 gap-2.5 w-full mt-5">
        <button type="button" onClick={closeMum} className="cartoon-pill py-2.5 rounded-2xl bg-slate-100 font-black text-ink text-sm">Cancel</button>
        <button type="button" onClick={submit} className="btn-chunky py-2.5 rounded-2xl bg-indigo-500 text-white font-display font-bold text-sm">Unlock</button>
      </div>
    </div>
  );
}
