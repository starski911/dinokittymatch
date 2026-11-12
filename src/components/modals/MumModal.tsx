import { useGame } from '../../context/GameContext';
import { MumPinModal } from './MumPinModal';
import { MumSettingsModal } from './MumSettingsModal';

export function MumModal() {
  const { mumModal, mumStep } = useGame();
  if (!mumModal) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-indigo-950/80 backdrop-blur-sm flex items-center justify-center p-3" role="dialog" aria-modal="true">
      <div className="cartoon-box bg-white rounded-3xl w-full max-w-sm p-5 max-h-[95dvh] overflow-y-auto">
        {mumStep === 'pin' ? <MumPinModal /> : <MumSettingsModal />}
      </div>
    </div>
  );
}
