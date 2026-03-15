import gsap from 'gsap';
import type { Position } from '~/types/shader';

interface TailConfig {
  totalLines?: number;
  ease?: number;
  lineColor?: string;
  lineWidth?: number;
  startOffset?: number;
}

export function useCursorTail(
  svgElement: Ref<SVGElement | null>,
  mousePos: Position,
  config: TailConfig = {},
) {
  const {
    totalLines = 130,
    ease = 0.97,
    lineColor = '#fff',
    lineWidth = 5,
    startOffset = 15,
  } = config;

  const lines: Array<{
    element: SVGLineElement;
    x: number;
    y: number;
  }> = [];

  let animation: gsap.core.Tween | null = null;

  const updateLines = () => {
    if (!lines.length) return;

    const [first] = lines;
    if (first) {
      first.x += (mousePos.x - first.x) * ease;
      first.y += (mousePos.y - first.y) * ease;

      first.element.setAttribute('x1', first.x.toString());
      first.element.setAttribute('y1', first.y.toString());
      first.element.setAttribute('x2', mousePos.x.toString());
      first.element.setAttribute('y2', mousePos.y.toString());
    }

    for (let i = 1; i < lines.length; i++) {
      const prev = lines[i - 1];
      const curr = lines[i];
      if (prev && curr) {
        curr.x += (prev.x - curr.x) * ease;
        curr.y += (prev.y - curr.y) * ease;

        curr.element.setAttribute('x1', curr.x.toString());
        curr.element.setAttribute('y1', curr.y.toString());
        curr.element.setAttribute('x2', prev.x.toString());
        curr.element.setAttribute('y2', prev.y.toString());
      }
    }
  };

  const init = () => {
    if (!svgElement.value) return;

    svgElement.value.innerHTML = '';
    lines.length = 0;

    for (let i = 0; i < totalLines; i++) {
      const line = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'line',
      );
      svgElement.value.appendChild(line);

      const x = -startOffset;
      const y = -startOffset;

      line.setAttribute('x1', x.toString());
      line.setAttribute('y1', y.toString());
      line.setAttribute('x2', mousePos.x.toString());
      line.setAttribute('y2', mousePos.y.toString());

      line.setAttribute('stroke', lineColor);
      line.setAttribute('stroke-width', lineWidth.toString());
      line.setAttribute('stroke-linecap', 'round');

      const opacity = (totalLines - i) / totalLines;
      line.setAttribute('opacity', opacity.toString());

      lines.push({ element: line, x, y });
    }

    animation?.kill();
    animation = gsap.to(
      {},
      {
        duration: 2500,
        repeat: -1,
        ease: 'back.inOut(1.7)',
        onUpdate: updateLines,
      },
    );
  };

  const destroy = () => {
    animation?.kill();
    if (svgElement.value) {
      svgElement.value.innerHTML = '';
    }
  };

  return { init, destroy };
}
