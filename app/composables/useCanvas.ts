export const useCanvas = (
  canvasRef: Ref<HTMLCanvasElement | null>,
  lines: ReturnType<typeof useLines>,
  wave: ReturnType<typeof useWave>,
) => {
  let ctx: CanvasRenderingContext2D & { running?: boolean; frame?: number };
  let animationFrame: number;

  const resizeCanvas = () => {
    if (ctx?.canvas) {
      ctx.canvas.width = window.innerWidth - 20;
      ctx.canvas.height = window.innerHeight;
    }
  };

  const render = () => {
    if (!ctx?.running) return;

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = `hsla(${Math.round(wave.update())},50%,50%,0.2)`;
    ctx.lineWidth = 1;

    lines.lines.value.forEach((line: any) => {
      lines.updateLine(line);
      lines.drawLine(ctx, line.nodes);
    });

    animationFrame = requestAnimationFrame(render);
  };

  const init = () => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    ctx = canvas.getContext('2d') as any;
    ctx.running = true;
    resizeCanvas();
    render();
  };

  const start = (e: MouseEvent | TouchEvent) => {
    lines.initLines(e);
    if (!ctx?.running) {
      ctx.running = true;
      render();
    }
  };

  const cleanup = () => {
    if (ctx) ctx.running = false;
    if (animationFrame) cancelAnimationFrame(animationFrame);
  };

  return {
    resizeCanvas,
    start,
    init,
    cleanup,
  };
};
