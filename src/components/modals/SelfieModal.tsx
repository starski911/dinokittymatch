import { useGame } from '../../context/GameContext';
import { useCamera } from '../../hooks/useCamera';
import { STICKERS } from '../../assets/stickers';
import { stickerEmoji } from '../../assets/stickers';
import { sound } from '../../services/sound';
import type { Role } from '../../types/game';

function SelfieBooth({ role }: { role: Role }) {
  const { players, closeCamera, saveAvatar, showToast } = useGame();
  const player = players[role];
  const cam = useCamera(role, player.avatar, player.sticker);

  const startLive = async () => {
    const err = await cam.start();
    if (err) showToast(err, 'bg-amber-600');
  };
  const close = () => { cam.stop(); closeCamera(); };
  const emoji = stickerEmoji(cam.sticker);

  return (
    <div className="fixed inset-0 z-40 bg-indigo-950/75 backdrop-blur-sm flex items-center justify-center p-3" role="dialog" aria-modal="true" aria-label="Selfie booth">
      <div className="cartoon-box bg-amber-50 rounded-3xl w-full max-w-sm p-4 flex flex-col items-center max-h-[95dvh] overflow-y-auto">
        <div className="w-full flex items-center justify-between mb-2">
          <h3 className="font-display font-bold text-xl text-ink">{player.name}'s Photo</h3>
          <button type="button" onClick={close} aria-label="Close" className="cartoon-pill w-8 h-8 rounded-full bg-rose-400 text-ink font-black flex items-center justify-center">✕</button>
        </div>

        <div className="relative w-52 h-52 rounded-full overflow-hidden bg-slate-900 border-4 border-ink shadow-lg flex items-center justify-center my-2">
          <video ref={cam.videoRef} autoPlay playsInline muted className={`w-full h-full object-cover scale-x-[-1] ${cam.live ? '' : 'hidden'}`} />
          <canvas ref={cam.canvasRef} width={300} height={300} className={`w-full h-full object-cover ${cam.live ? 'hidden' : ''}`} />
          {cam.live && emoji && (
            <div className="absolute inset-0 pointer-events-none flex items-start justify-center">
              <span className="text-5xl mt-2 drop-shadow-md">{emoji}</span>
            </div>
          )}
        </div>

        <div className="w-full my-2">
          <p className="text-xs font-black text-center text-ink uppercase mb-1.5">🎩 Pick a Fun Hat / Ears!</p>
          <div className="grid grid-cols-5 gap-1.5">
            {STICKERS.map((s) => (
              <button key={s.id} type="button" aria-label={s.label} aria-pressed={cam.sticker === s.id}
                onClick={() => { sound.flip(); cam.setSticker(s.id); }}
                className={`p-2 rounded-xl border-2 border-ink text-lg transition ${cam.sticker === s.id ? 'bg-amber-300 shadow-[0_3px_0_#1e1b4b] -translate-y-0.5' : 'bg-white'}`}>
                {s.emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full mt-2">
          <div className="grid grid-cols-2 gap-2">
            {cam.live ? (
              <button type="button" onClick={() => { if (cam.capture()) sound.exactMatch(); }}
                className="btn-chunky py-2.5 px-3 rounded-2xl bg-lime-400 text-ink font-display font-bold text-sm flex items-center justify-center gap-1">
                <span>📸</span> Snap Pic!
              </button>
            ) : (
              <button type="button" onClick={startLive}
                className="btn-chunky py-2.5 px-3 rounded-2xl bg-sky-400 text-ink font-display font-bold text-sm flex items-center justify-center gap-1">
                <span>🎥</span> Live Camera
              </button>
            )}
            <label className="btn-chunky py-2.5 px-3 rounded-2xl bg-amber-300 text-ink font-display font-bold text-sm flex items-center justify-center gap-1 cursor-pointer text-center">
              <span>🖼️</span> Upload Pic
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) cam.upload(f); e.target.value = ''; }} />
            </label>
          </div>

          <button type="button" onClick={() => { sound.flip(); cam.stop(); cam.setImage(null); cam.setSticker('none'); }}
            className="w-full py-2 rounded-xl bg-white border-2 border-ink hover:bg-amber-100 text-ink font-black text-xs">
            Use Cute Cartoon Avatar Instead
          </button>

          <button type="button" onClick={() => { cam.stop(); saveAvatar(role, cam.exportAvatar(), cam.sticker); }}
            className="btn-chunky w-full py-3 rounded-2xl bg-gradient-to-r from-sky-400 via-purple-400 to-pink-400 text-ink font-cartoon text-lg tracking-wide mt-1">
            SAVE PHOTO! ✨
          </button>
        </div>
      </div>
    </div>
  );
}

export function SelfieModal() {
  const { cameraRole } = useGame();
  return cameraRole ? <SelfieBooth key={cameraRole} role={cameraRole} /> : null;
}
