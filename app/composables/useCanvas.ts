import type { CursorLine } from './useLines';

export interface UseCanvasReturn {
  ctx: CanvasRenderingContext2D | undefined;
  resizeCanvas: () => void;
  start: (event: MouseEvent | TouchEvent) => void;
  init: () => void;
  cleanup: () => void;
}

export const useCanvas = (
  canvasRef: Ref<HTMLCanvasElement | null>,
  lines: ReturnType<typeof useLines>,
  wave: ReturnType<typeof useWave>,
): UseCanvasReturn => {
  let ctx: CanvasRenderingContext2D | undefined;
  let isRunning = false;
  let animationFrame: number;

  const resizeCanvas = () => {
    if (ctx?.canvas) {
      ctx.canvas.width = window.innerWidth - 20;
      ctx.canvas.height = window.innerHeight;
    }
  };

  const render = () => {
    if (!ctx || !isRunning) return;
    const renderingContext = ctx;

    renderingContext.globalCompositeOperation = 'source-over';
    renderingContext.clearRect(
      0,
      0,
      renderingContext.canvas.width,
      renderingContext.canvas.height,
    );
    renderingContext.globalCompositeOperation = 'lighter';
    renderingContext.strokeStyle = `hsla(${Math.round(wave.update())},50%,50%,0.2)`;
    renderingContext.lineWidth = 1;

    lines.lines.value.forEach((line: CursorLine) => {
      lines.updateLine(line);
      lines.drawLine(renderingContext, line.nodes);
    });

    animationFrame = requestAnimationFrame(render);
  };

  const init = () => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    ctx = context;
    isRunning = true;
    resizeCanvas();
    render();
  };

  const start = (e: MouseEvent | TouchEvent) => {
    lines.initLines(e);
    const activeContext = ctx;
    if (!activeContext || !isRunning) {
      if (!activeContext) return;
      isRunning = true;
      render();
    }
  };

  const cleanup = () => {
    isRunning = false;
    if (animationFrame) cancelAnimationFrame(animationFrame);
  };

  return {
    ctx,
    resizeCanvas,
    start,
    init,
    cleanup,
  };
};
