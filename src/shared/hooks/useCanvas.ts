import { useEffect, useRef } from 'react';

type Draw = (ctx: CanvasRenderingContext2D, time: number, dt: number) => void;

/**
 * Controla um canvas 2D com requestAnimationFrame.
 * - Pausa quando a aba fica oculta
 * - Ajusta o tamanho ao devicePixelRatio
 * - Limpa o loop e os listeners no unmount
 */
export function useCanvas(draw: Draw, deps: unknown[] = []) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let last = performance.now();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      draw(ctx, now, dt);
      frame = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
      } else {
        last = performance.now();
        frame = requestAnimationFrame(loop);
      }
    };

    resize();
    frame = requestAnimationFrame(loop);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return canvasRef;
}
