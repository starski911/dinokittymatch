interface Particle {
  x: number; y: number; vx: number; vy: number; size: number;
  color: string; rotation: number; vRot: number; life: number;
}

const COLORS = ['#38bdf8', '#f472b6', '#facc15', '#4ade80', '#a855f7', '#fb923c'];

let canvas: HTMLCanvasElement | null = null;
let particles: Particle[] = [];
let running = false;

export function attachConfettiCanvas(el: HTMLCanvasElement | null): () => void {
  canvas = el;
  if (!el) return () => {};
  const resize = () => {
    el.width = window.innerWidth;
    el.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);
  return () => {
    window.removeEventListener('resize', resize);
    if (canvas === el) canvas = null;
    particles = [];
    running = false;
  };
}

function spawn(amount: number) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  for (let i = 0; i < amount; i++) {
    particles.push({
      x: w * 0.5 + (Math.random() - 0.5) * (w * 0.6),
      y: h * 0.45,
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 11 - 4,
      size: Math.random() * 8 + 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 14,
      life: 1,
    });
  }
  if (!running) {
    running = true;
    requestAnimationFrame(frame);
  }
}

function frame() {
  if (!canvas) { running = false; return; }
  const ctx = canvas.getContext('2d');
  if (!ctx) { running = false; return; }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy; p.vy += 0.35; p.rotation += p.vRot; p.life -= 0.014;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
    ctx.restore();
  }
  particles = particles.filter((p) => p.life > 0 && p.y < canvas!.height + 30);
  if (particles.length > 0) requestAnimationFrame(frame);
  else { running = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
}

export const fireMiniConfetti = () => spawn(28);
export const fireBigConfetti = () => spawn(110);
