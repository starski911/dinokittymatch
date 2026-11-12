import { memo } from 'react';
import type { Card } from '../../types/game';

interface Props {
  card: Card;
  index: number;
  flipped: boolean;
  aspect: string;
  onTap: (index: number) => void;
}

function GameCardBase({ card, index, flipped, aspect, onTap }: Props) {
  const faceUp = flipped || card.matched;
  return (
    <button
      id={`card-${index}`}
      type="button"
      onClick={() => onTap(index)}
      aria-label={faceUp ? card.name : `Memory Card ${index + 1}`}
      className={`perspective-1000 ${aspect} w-full relative focus:outline-none group ${faceUp ? 'card-flipped' : ''} ${card.matched ? 'card-matched' : ''}`}
    >
      <div className="card-inner">
        <div className="card-face card-back">
          <span className="font-cartoon text-3xl sm:text-4xl text-amber-300 cartoon-title-stroke drop-shadow">?</span>
        </div>
        <div className={`card-face card-front ${card.team === 'blue' ? 'card-theme-blue' : 'card-theme-pink'} p-1.5`}>
          <div className="flex-1 flex items-center justify-center w-full min-h-0">
            <img src={card.src} alt="" draggable={false} className="w-14 h-14 sm:w-16 sm:h-16" />
          </div>
          <span className="text-[10px] sm:text-xs font-black tracking-tight text-ink bg-white/85 px-2 py-0.5 rounded-full border border-ink/40 truncate max-w-[92%]">
            {card.team === 'blue' ? '🔵' : '🩷'} {card.name}
          </span>
        </div>
      </div>
    </button>
  );
}

export const GameCard = memo(GameCardBase);
