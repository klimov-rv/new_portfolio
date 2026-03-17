export const useLines = (config: ReturnType<typeof useTrailConfig>) => {
  const lines = ref<any[]>([]);
  const pos = reactive({ x: 0, y: 0 });

  const random = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const createLines = (startX: number, startY: number) => {
    return Array.from({ length: config.value.trails }, (_, i) => {
      const spring = 0.4 + (i / config.value.trails) * 0.025;
      const nodes = Array.from({ length: config.value.size }, () => ({
        x: startX,
        y: startY,
        vx: 0,
        vy: 0,
      }));

      return {
        spring,
        nodes,
        friction: config.value.friction + random(-0.002, 0.01),
      };
    });
  };

  const updateLine = (line: any) => {
    const { nodes, spring } = line;
    let currentSpring = spring;

    nodes[0].vx += (pos.x - nodes[0].x) * currentSpring;
    nodes[0].vy += (pos.y - nodes[0].y) * currentSpring;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if (i > 0) {
        const prev = nodes[i - 1];
        node.vx += (prev.x - node.x) * currentSpring;
        node.vy += (prev.y - node.y) * currentSpring;
        node.vx += prev.vx * config.value.dampening;
        node.vy += prev.vy * config.value.dampening;
      }

      node.vx *= line.friction;
      node.vy *= line.friction;
      node.x += node.vx;
      node.y += node.vy;
      currentSpring *= config.value.tension;
    }
  };

  const drawLine = (ctx: CanvasRenderingContext2D, nodes: any[]) => {
    if (nodes.length < 3) return;

    ctx.beginPath();
    ctx.moveTo(nodes[0].x, nodes[0].y);

    for (let i = 1; i < nodes.length - 2; i++) {
      const xc = (nodes[i].x + nodes[i + 1].x) / 2;
      const yc = (nodes[i].y + nodes[i + 1].y) / 2;
      ctx.quadraticCurveTo(nodes[i].x, nodes[i].y, xc, yc);
    }

    const last = nodes.length - 2;
    ctx.quadraticCurveTo(
      nodes[last].x,
      nodes[last].y,
      nodes[last + 1].x,
      nodes[last + 1].y,
    );

    ctx.stroke();
  };

  // fixme: sideeffect updateVelocity
  const { update: updateVelocity } = useMouseVelocity();

  const updatePosition = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    // sideeffect updateVelocity
    updateVelocity(e);
    if ('touches' in e && e.touches.length) {
      pos.x = e.touches[0].pageX;
      pos.y = e.touches[0].pageY;
    } else if ('clientX' in e) {
      pos.x = e.clientX;
      pos.y = e.clientY;
    }
  };

  const initLines = (e: MouseEvent | TouchEvent) => {
    updatePosition(e);
    lines.value = createLines(pos.x, pos.y);
  };

  return {
    pos,
    lines,
    updateLine,
    drawLine,
    updatePosition,
    initLines,
  };
};
