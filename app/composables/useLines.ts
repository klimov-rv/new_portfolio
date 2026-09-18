import type { UseTrailConfigReturn } from './useTrailConfig';

export interface CursorNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface CursorLine {
  spring: number;
  nodes: CursorNode[];
  friction: number;
}

export interface UseLinesReturn {
  pos: { x: number; y: number };
  lines: Ref<CursorLine[]>;
  updateLine: (line: CursorLine) => void;
  drawLine: (ctx: CanvasRenderingContext2D, nodes: CursorNode[]) => void;
  updatePosition: (event: MouseEvent | TouchEvent) => void;
  initLines: (event: MouseEvent | TouchEvent) => void;
}

export const useLines = (
  configState: UseTrailConfigReturn,
): UseLinesReturn => {
  const lines = ref<CursorLine[]>([]);
  const pos = reactive({ x: 0, y: 0 });

  const random = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const createLines = (startX: number, startY: number) => {
    return Array.from({ length: configState.config.value.trails }, (_, i) => {
      const spring = 0.4 + (i / configState.config.value.trails) * 0.025;
      const nodes = Array.from({ length: configState.config.value.size }, () => ({
        x: startX,
        y: startY,
        vx: 0,
        vy: 0,
      }));

      return {
        spring,
        nodes,
        friction: configState.config.value.friction + random(-0.002, 0.01),
      };
    });
  };

  const updateLine = (line: CursorLine): void => {
    const { nodes, spring } = line;
    let currentSpring = spring;

    const firstNode = nodes[0];
    if (!firstNode) return;

    firstNode.vx += (pos.x - firstNode.x) * currentSpring;
    firstNode.vy += (pos.y - firstNode.y) * currentSpring;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (!node) continue;

      if (i > 0) {
        const prev = nodes[i - 1];
        if (!prev) continue;
        node.vx += (prev.x - node.x) * currentSpring;
        node.vy += (prev.y - node.y) * currentSpring;
        node.vx += prev.vx * configState.config.value.dampening;
        node.vy += prev.vy * configState.config.value.dampening;
      }

      node.vx *= line.friction;
      node.vy *= line.friction;
      node.x += node.vx;
      node.y += node.vy;
      currentSpring *= configState.config.value.tension;
    }
  };

  const drawLine = (
    ctx: CanvasRenderingContext2D,
    nodes: CursorNode[],
  ): void => {
    if (nodes.length < 3) return;

    ctx.beginPath();
    const firstNode = nodes[0];
    if (!firstNode) return;

    ctx.moveTo(firstNode.x, firstNode.y);

    for (let i = 1; i < nodes.length - 2; i++) {
      const node = nodes[i];
      const nextNode = nodes[i + 1];
      if (!node || !nextNode) continue;

      const xc = (node.x + nextNode.x) / 2;
      const yc = (node.y + nextNode.y) / 2;
      ctx.quadraticCurveTo(node.x, node.y, xc, yc);
    }

    const last = nodes.length - 2;
    const lastNode = nodes[last];
    const endNode = nodes[last + 1];
    if (!lastNode || !endNode) return;

    ctx.quadraticCurveTo(
      lastNode.x,
      lastNode.y,
      endNode.x,
      endNode.y,
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
      const touch = e.touches[0];
      if (!touch) return;

      pos.x = touch.pageX;
      pos.y = touch.pageY;
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
