import { useGame } from '../../context/GameContext';
import { Avatar } from '../common/Avatar';
import type { Role } from '../../types/game';

function Tile({ role }: { role: Role }) {
  const { players, game } = useGame();
  return (
    <div className={`cartoon-box-sm ${role === 'boy' ? 'bg-sky-300' : 'bg-pink-300'} rounded-2xl p-2.5 flex flex-col items-center`}>
      <div className="w-12 h-12 rounded-full border-3 border-ink overflow-hidden bg-white mb-1"><Avatar role={role} /></div>
      <span className="font-display font-bold text-sm truncate max-w-full">{players[role].name}</span>
      <span className="font-cartoon text-2xl text-white cartoon-title-stroke">{game.scores[role]}</span>
      <span className="text-[10px] font-black bg-white/80 px-2 py-0.5 rounded-full mt-0.5">⭐ Total: {players[role].lifetimeScore}</span>
    </div>
  );
}

export function TimesUpScreen() {
  const { players, game, openMum } = useGame();
  const { boy, girl } = players;
  const b = game.scores.boy; const g = game.scores.girl;
  const lead = (n: string) => <>Your play timer finished! 🏆 <span className="font-black text-amber-300">{n}</span> was in the lead!</>;

  return (
    <section className="flex-1 flex flex-col items-center justify-center text-center py-4">
      <div className="cartoon-box bg-gradient-to-b from-indigo-950 via-indigo-900 to-purple-900 text-white rounded-3xl p-6 w-full max-w-md flex flex-col items-center">
        <div className="text-5xl mb-2 animate-float-slow">⏰🌙</div>
        <h2 className="font-cartoon text-3xl text-amber-300 cartoon-title-stroke">TIME'S UP!</h2>
        <p className="text-indigo-100 font-bold text-sm sm:text-base mt-1 leading-relaxed">
          {b > g ? lead(boy.name) : g > b ? lead(girl.name) : b > 0 ? <>Your play timer finished! 🤝 It's a super tie!</> : (
            <>Play time is all done for now, <span className="font-black text-sky-300">{boy.name}</span> &amp; <span className="font-black text-pink-300">{girl.name}</span>!</>
          )}
        </p>
        <div className="grid grid-cols-2 gap-3 w-full my-4 text-ink"><Tile role="boy" /><Tile role="girl" /></div>
        <div className="bg-amber-300 text-ink border-3 border-ink shadow-[0_4px_0_#1e1b4b] rounded-2xl p-3.5 w-full">
          <p className="text-base sm:text-lg font-display font-bold">📱 Please hand the phone back to Mum!</p>
        </div>
        <button type="button" onClick={() => openMum('settings')} className="mt-4 text-xs text-indigo-300/90 hover:text-white underline font-black py-2 px-4">
          🔒 Mum's Unlock
        </button>
      </div>
    </section>
  );
}
