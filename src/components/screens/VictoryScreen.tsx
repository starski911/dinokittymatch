import { useGame } from '../../context/GameContext';
import { Avatar } from '../common/Avatar';
import type { Role } from '../../types/game';

function Result({ role }: { role: Role }) {
  const { players, game } = useGame();
  return (
    <div className={`cartoon-box-sm ${role === 'boy' ? 'bg-sky-300' : 'bg-pink-300'} rounded-2xl p-3 flex flex-col items-center`}>
      <div className="w-16 h-16 rounded-full border-3 border-ink overflow-hidden bg-white mb-1"><Avatar role={role} /></div>
      <span className="font-display font-bold text-ink">{players[role].name}</span>
      <span className="font-cartoon text-3xl text-white cartoon-title-stroke">{game.scores[role]}</span>
      <span className="text-[11px] font-black text-ink">POINTS</span>
    </div>
  );
}

export function VictoryScreen() {
  const { players, game, settings, startGame, goHome } = useGame();
  const { boy, girl } = players;
  const s = game.scores;
  let headline: string; let sub: string;
  if (settings.mode !== '2p') {
    const solo = settings.mode === 'boy' ? boy.name : girl.name;
    headline = `WAY TO GO, ${solo.toUpperCase()}!`;
    sub = `You scored ${settings.mode === 'boy' ? s.boy : s.girl} awesome points!`;
  } else if (s.boy > s.girl) { headline = `${boy.name.toUpperCase()} WINS!`; sub = `Super match victory! Great game ${girl.name}!`; }
  else if (s.girl > s.boy) { headline = `${girl.name.toUpperCase()} WINS!`; sub = `Super match victory! Great game ${boy.name}!`; }
  else { headline = "IT'S A SUPER TIE!"; sub = `${boy.name} & ${girl.name} are both champions!`; }

  return (
    <section className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-4">
      <div className="cartoon-box bg-gradient-to-b from-amber-200 via-yellow-100 to-white rounded-3xl p-6 w-full max-w-md flex flex-col items-center relative overflow-hidden">
        <div className="text-6xl mb-1 animate-bounce drop-shadow">🏆</div>
        <h2 className="font-cartoon text-3xl sm:text-4xl text-amber-400 cartoon-title-stroke">{headline}</h2>
        <p className="text-sm font-black text-indigo-900 mt-1">{sub}</p>
        <div className="grid grid-cols-2 gap-3 w-full my-5"><Result role="boy" /><Result role="girl" /></div>
        <div className="flex flex-col gap-2.5 w-full">
          <button type="button" onClick={startGame} className="btn-chunky w-full py-3.5 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-400 text-ink font-cartoon text-2xl tracking-wide">PLAY AGAIN! 🔄</button>
          <button type="button" onClick={goHome} className="cartoon-pill w-full py-2.5 rounded-2xl bg-white hover:bg-amber-100 text-ink font-display font-bold text-base">Change Players / Size</button>
        </div>
      </div>
    </section>
  );
}
