import { useCallback, useEffect, useRef, useState } from 'react';
import type { Role, StickerId } from '../types/game';
import { stickerEmoji } from '../assets/stickers';

const SIZE = 300;

/** Camera stream + selfie canvas compositor for the avatar booth. */
export function useCamera(role: Role, initialImage: string | null, initialSticker: StickerId) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [live, setLive] = useState(false);
  const [image, setImage] = useState<string | null>(initialImage);
  const [sticker, setSticker] = useState<StickerId>(initialSticker);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setLive(false);
  }, []);

  useEffect(() => stop, [stop]);

  const start = useCallback(async (): Promise<string | null> => {
    if (!navigator.mediaDevices?.getUserMedia) return 'Camera not supported here — try Upload Pic!';
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 400 }, height: { ideal: 400 } },
        audio: false,
      });
      streamRef.current = stream;
      setLive(true);
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
      return null;
    } catch (e) {
      console.warn('Camera access error:', e);
      return 'Could not open camera — use Upload Pic!';
    }
  }, []);

  const crop = (source: CanvasImageSource, w: number, h: number, mirror: boolean) => {
    const off = document.createElement('canvas');
    off.width = SIZE; off.height = SIZE;
    const ctx = off.getContext('2d')!;
    const size = Math.min(w, h);
    ctx.save();
    if (mirror) { ctx.translate(SIZE, 0); ctx.scale(-1, 1); }
    ctx.drawImage(source, (w - size) / 2, (h - size) / 2, size, size, 0, 0, SIZE, SIZE);
    ctx.restore();
    return off.toDataURL('image/jpeg', 0.85);
  };

  const capture = useCallback((): boolean => {
    const v = videoRef.current;
    if (!v || v.readyState < 2) return false;
    setImage(crop(v, v.videoWidth, v.videoHeight, true));
    stop();
    return true;
  }, [stop]);

  const upload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => { setImage(crop(img, img.width, img.height, false)); stop(); };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, [stop]);

  // Re-draw preview canvas whenever base image / sticker / role changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let cancelled = false;
    const overlay = () => {
      const emoji = stickerEmoji(sticker);
      if (!emoji) return;
      ctx.font = '74px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(emoji, 150, 8);
    };
    ctx.clearRect(0, 0, SIZE, SIZE);
    if (image) {
      const img = new Image();
      img.onload = () => { if (!cancelled) { ctx.drawImage(img, 0, 0, SIZE, SIZE); overlay(); } };
      img.src = image;
    } else {
      ctx.fillStyle = role === 'boy' ? '#bae6fd' : '#fbcfe8';
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.font = '115px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(role === 'boy' ? '👦' : '👧', 150, 165);
      overlay();
    }
    return () => { cancelled = true; };
  }, [image, sticker, role, live]);

  /** Final avatar data URL, or null to fall back to the cartoon default. */
  const exportAvatar = () =>
    image || sticker !== 'none' ? canvasRef.current?.toDataURL('image/png') ?? null : null;

  return { videoRef, canvasRef, live, image, setImage, sticker, setSticker, start, stop, capture, upload, exportAvatar };
}
