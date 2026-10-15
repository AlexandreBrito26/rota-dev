import { useCanvas } from '@/shared/hooks/useCanvas';
import { useThemeStore } from '@/features/theme/themeStore';
import { readToken } from '@/shared/utils/cssVars';

type Point = { x: number; y: number; phase: number };

const POINT_COUNT = 7;
const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Rota desenhada entre pontos, com um marcador que percorre o trajeto. */
export function RouteCanvas() {
  const theme = useThemeStore((s) => s.resolved);

  const canvasRef = useCanvas(
    (ctx, time) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const route = readToken('--color-route');
      const muted = readToken('--color-muted');

      const points: Point[] = Array.from({ length: POINT_COUNT }, (_, i) => ({
        x: ((i + 0.5) / POINT_COUNT) * w,
        y: h * (0.3 + 0.4 * Math.sin(i * 1.3 + (reduceMotion ? 0 : time / 4000))),
        phase: i,
      }));

      ctx.globalAlpha = 0.25;
      ctx.strokeStyle = muted;
      ctx.lineWidth = 1;
      ctx.beginPath();
      points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();

      ctx.globalAlpha = 0.8;
      ctx.fillStyle = route;
      points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!reduceMotion) {
        const t = (time / 6000) % 1;
        const idx = Math.floor(t * (POINT_COUNT - 1));
        const local = t * (POINT_COUNT - 1) - idx;
        const a = points[idx];
        const b = points[idx + 1];
        if (a && b) {
          const x = a.x + (b.x - a.x) * local;
          const y = a.y + (b.y - a.y) * local;
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    },
    [theme],
  );

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
