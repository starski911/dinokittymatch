import { GameProvider, useGame } from './context/GameContext';
import { Background } from './components/background/Background';
import { Header } from './components/header/Header';
import { LobbyScreen } from './components/screens/LobbyScreen';
import { GameBoardScreen } from './components/screens/GameBoardScreen';
import { VictoryScreen } from './components/screens/VictoryScreen';
import { TimesUpScreen } from './components/screens/TimesUpScreen';
import { SelfieModal } from './components/modals/SelfieModal';
import { MumModal } from './components/modals/MumModal';
import { ConfettiCanvas, PopupHost, ToastHost } from './components/common/Overlays';

function Screens() {
  const { view } = useGame();
  return (
    <main className="flex-1 w-full max-w-2xl mx-auto px-3 pb-6 flex flex-col justify-between relative z-10">
      {view === 'setup' && <LobbyScreen />}
      {view === 'game' && <GameBoardScreen />}
      {view === 'victory' && <VictoryScreen />}
      {view === 'timesup' && <TimesUpScreen />}
    </main>
  );
}

export default function App() {
  return (
    <GameProvider>
      <Background />
      <ConfettiCanvas />
      <ToastHost />
      <PopupHost />
      <Header />
      <Screens />
      <SelfieModal />
      <MumModal />
    </GameProvider>
  );
}
