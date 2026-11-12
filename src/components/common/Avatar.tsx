import type { Role } from '../../types/game';
import { useGame } from '../../context/GameContext';
import { DEFAULT_AVATAR } from '../../assets/ui';

export function Avatar({ role, className = '' }: { role: Role; className?: string }) {
  const { players } = useGame();
  const p = players[role];
  return (
    <img src={p.avatar ?? DEFAULT_AVATAR[role]} alt={p.name} draggable={false}
      className={`w-full h-full object-cover ${className}`} />
  );
}
