import { useGame } from '../../context/GameContext';
import { Avatar } from '../common/Avatar';
import { GameCard } from '../cards/GameCard';
import type { Role } from '../../types/game';

function ScoreCard({ role }: { role: Role }) {
  const { players, game, settings } = useGame();
  const boy = role === 'boy';
  const active = game.turn === role;
  const dim = settings.mode !== '2p' && settings.mode !== role;
  return (
    <div className={`cartoon-box-sm ${boy ? 'bg-gradient-to-r from-sky-300 to-blue-400' : 'bg-gradient-to-r from-pink-300 to-rose-400'} rounded-2xl p-2 flex items-center gap-2.5 transition-all duration-300 ${dim ? 'opacity-45' : ''} ${active ? 'active-boy-glow' : ''}`}>
      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border-3 border-ink overflow-hidden shrink-0 flex items-center justify-center ${active ? 'active-avatar-bounce' : ''}`}>
        <Avatar role={role} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <span className="font-display font-bold text-sm sm:text-base text-ink truncate">{players[role].name}</span>
          {active && <span className="text-[10px] font-black bg-amber-300 text-ink border-2 border-ink px-2 py-0.5 rounded-full animate-bounce">GO!</span>}
        </div>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="font-cartoon text-2xl text-white cartoon-title-stroke leading-none">{game.scores[role]}</span>
          <span className="text-[11px] font-black text-ink">pts</span>
        </div>
      </div>
    </div>
  );
}

export function GameBoardScreen() {
  const { players, game, startGame, tapCard } = useGame();
  const count = game.cards.length;
  const boyTurn = game.turn === 'boy';
  const name = players[game.turn].name;

  const gridClass =
    count === 8 ? 'grid-cols-4 gap-2.5 sm:gap-3.5 max-w-md'
    : count === 12 ? 'grid-cols-4 gap-2 sm:gap-3 max-w-md'
    : count === 16 ? 'grid-cols-4 gap-2 sm:gap-2.5 max-w-md'
    : 'grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2.5 max-w-lg';
  const aspect = count >= 16 ? 'aspect-[4/4.3]' : 'aspect-[4/4.6]';

  const [own, other, ownIcon, otherIcon] = boyTurn ? ['text-blue-700', 'text-pink-600', '🔵', '🩷'] : ['text-pink-600', 'text-blue-700', '🩷', '🔵'];
  const [ownC, otherC] = boyTurn ? ['text-blue-600', 'text-pink-500'] : ['text-pink-500', 'text-blue-600'];

  return (
    <section className="flex-1 flex flex-col justify-between gap-2 py-1">
      <div className="grid grid-cols-2 gap-2.5">
        <ScoreCard role="boy" />
        <ScoreCard role="girl" />
      </div>

      <div className={`cartoon-pill text-center py-1.5 px-4 rounded-full mx-auto ${boyTurn ? 'bg-sky-300' : 'bg-pink-300'}`}>
        <span className="font-display font-bold text-xs sm:text-sm text-ink">
          {boyTurn ? `🔵 ${name}'s Turn! (Blue +4/+2 • Pink +3/+1)` : `🩷 ${name}'s Turn! (Pink +4/+2 • Blue +3/+1)`}
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center my-auto w-full">
        <div className={`grid ${gridClass} w-full mx-auto`}>
          {game.cards.map((card, i) => (
            <GameCard key={card.uid} card={card} index={i} aspect={aspect} onTap={tapCard}
              flipped={game.flipped.includes(i)} />
          ))}
        </div>
      </div>

      <div className="cartoon-pill flex items-center justify-between gap-2 text-[10px] sm:text-[11px] font-black text-ink bg-white px-3.5 py-2 rounded-2xl">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 leading-tight">
          <span className={own}>{ownIcon} Pair +4</span><span>•</span>
          <span className={other}>{otherIcon} Pair +3</span><span>•</span>
          <span className={ownC}>{ownIcon} Color +2</span><span>•</span>
          <span className={otherC}>{otherIcon} Color +1</span>
        </div>
        <button type="button" onClick={startGame} className="shrink-0 bg-amber-300 hover:bg-amber-200 px-2.5 py-1 rounded-xl border-2 border-ink text-ink font-black">
          🔄 New
        </button>
      </div>
    </section>
  );
}
