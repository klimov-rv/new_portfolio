<script lang="ts" setup>
import gsap from 'gsap';
import { useEventListener } from '@vueuse/core';
import { useSpeedController } from '~/composables/useSpeedController';
import type { Position } from '~/types/shader';

interface Props {
  enlargeTargetSelector?: string; // селектор элементов, увеличивающих курсор
  fullCursorSize?: number;
  observerRoot?: HTMLElement | string; // корневой элемент для наблюдения (по умолчанию document.body)
}

const props = withDefaults(defineProps<Props>(), {
  enlargeTargetSelector: '.card-3d',
  fullCursorSize: 28,
  observerRoot: 'body', // можно передать конкретный контейнер, например '#main-content'
});

const lineProps = {
  totalLines: 130,
  ease: 0.97,
  lineColor: '#fff',
  lineWidth: 5,
  startOffset: 15,
};

// Фильтр под курсором включён
const showFilter = ref(true);

// Refs для элементов курсора
const cursorWrapper = ref<HTMLElement | null>(null);
const innerCursor = ref<HTMLElement | null>(null);
const outerCursor = ref<HTMLElement | null>(null);

// Координаты мыши
const clientX = ref(0);
const clientY = ref(0);

// Храним активные слушатели для возможности удаления
const activeElements = new Set<HTMLElement>();

// Tween'ы GSAP
let enlargeCursorTween: gsap.core.Tween | null = null;
let bumpCursorTween: gsap.core.Tween | null = null;

// Данные одной линии
interface LineData {
  element: SVGLineElement; // DOM-элемент <line>
  x: number; // текущая координата начала линии (x1)
  y: number; // текущая координата начала линии (y1)
}

const easing = gsap.parseEase('back.inOut(1.7)'); // можем использовать?
const {
  totalLines = 100,
  ease = 0.75,
  lineColor = '#3f51b5',
  lineWidth = 2,
  startOffset = 15,
} = lineProps;

// Один общий объект мыши (реактивный, но не заменяемый)
const mousePos = reactive<Position>({ x: 0, y: 0 });

// SVG-элемент, куда будем рисовать
const cursorTail = ref<SVGElement | null>(null);
const svgNS = 'http://www.w3.org/2000/svg';

// Массив всех линий
const lines: LineData[] = [];

// Одна анимация, которая будет тикать и вызывать updateLines
let animation: gsap.core.Tween | null = null;

/**
 * Обновление позиций всех линий – вызывается каждый кадр анимации
 */
function updateLines() {
  // Если линий нет, ничего не делаем
  if (lines.length === 0) return;

  // Первая линия (индекс 0) следует за мышью
  const first = lines[0];
  if (first) {
    first.x += (mousePos.x - first.x) * ease;
    first.y += (mousePos.y - first.y) * ease;

    first.element.setAttribute('x1', first.x.toString());
    first.element.setAttribute('y1', first.y.toString());
    first.element.setAttribute('x2', mousePos.x.toString());
    first.element.setAttribute('y2', mousePos.y.toString());
  }

  // Остальные линии следуют за предыдущей
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
}

/**
 * Создание всех линий и запуск анимации
 */
function initTail() {
  if (!cursorTail.value) return;

  // Очистка предыдущих линий
  cursorTail.value.innerHTML = '';
  lines.length = 0;

  // Создаём линии в цикле
  for (let i = 0; i < totalLines; i++) {
    const line = document.createElementNS(svgNS, 'line');
    cursorTail.value.appendChild(line);

    // Начальное смещение
    const x = -startOffset;
    const y = -startOffset;

    // Начальные атрибуты
    line.setAttribute('x1', x.toString());
    line.setAttribute('y1', y.toString());
    line.setAttribute('x2', mousePos.x.toString());
    line.setAttribute('y2', mousePos.y.toString());

    // Стилизация
    line.setAttribute('stroke', lineColor);
    line.setAttribute('stroke-width', lineWidth.toString());
    line.setAttribute('stroke-linecap', 'round');

    // Прозрачность зависит от индекса (первые ярче, последние прозрачнее)
    const opacity = (totalLines - i) / totalLines;
    line.setAttribute('opacity', opacity.toString());

    // Сохраняем данные линии
    lines.push({ element: line, x, y });
  }

  // Запускаем анимацию (пустой объект, только onUpdate)
  if (animation) animation.kill();
  animation = gsap.to(
    {},
    {
      duration: 2500,
      repeat: -1,
      ease: easing,
      onUpdate: updateLines,
    },
  );
}

const liquidGlassSize = ref(0);

// Наблюдатель за DOM
let observer: MutationObserver | null = null;

// --- Вспомогательные функции для управления слушателями ---
function addListenersToElement(el: HTMLElement) {
  if (activeElements.has(el)) return;
  useEventListener(el, 'mouseenter', handleMouseEnterEnlarge);
  useEventListener(el, 'mouseleave', handleMouseLeaveEnlarge);
  activeElements.add(el);
}

function removeListenersFromElement(el: HTMLElement) {
  if (!activeElements.has(el)) return;
  useEventListener(el, 'mouseenter', handleMouseEnterEnlarge);
  useEventListener(el, 'mouseleave', handleMouseLeaveEnlarge);
  activeElements.delete(el);
}

// Обновить все элементы по селектору (полезно при полной смене страницы)
function refreshAllTargets() {
  // Сначала удаляем слушатели со всех старых элементов
  activeElements.forEach((el) => removeListenersFromElement(el));
  // Ищем новые элементы
  const root =
    typeof props.observerRoot === 'string'
      ? document.querySelector(props.observerRoot)
      : props.observerRoot || document.body;
  if (!root) return;
  const elements = root.querySelectorAll<HTMLElement>(
    props.enlargeTargetSelector,
  );
  elements.forEach((el) => addListenersToElement(el));
}
// При наведении на цель enlarge
const handleMouseEnterEnlarge = () => {
  enlargeCursorTween?.play();
  bumpCursorTween?.play();
};
const handleMouseLeaveEnlarge = () => {
  enlargeCursorTween?.reverse();
  bumpCursorTween?.reverse();
};

const shaderState = useShaderState();
const { currentSpeed, setTargetSpeed } = useSpeedController(1);
const isMouseDown = ref(false);
const localSpeed = ref(0);
const lastMousePos = ref<Position>({ x: 0, y: 0 });
const velocity = ref<Position>({ x: 0, y: 0 });
const lastUpdateTime = ref(Date.now());

function updateVelocity(pos: Position) {
  const now = Date.now();
  const dt = now - lastUpdateTime.value;
  if (dt > 0) {
    velocity.value = {
      x: (pos.x - lastMousePos.value.x) / dt,
      y: (pos.y - lastMousePos.value.y) / dt,
    };
  }
  lastUpdateTime.value = now;
  lastMousePos.value = pos;
}

const onMouseMove = (e: MouseEvent) => {
  const pos: Position = { x: e.clientX, y: e.clientY };

  mousePos.x = e.clientX;
  mousePos.y = e.clientY;

  updateVelocity(pos);
  // Обновляем шейдер с текущим состоянием клика
  if (isMouseDown.value) {
    shaderState?.updateShaderMouse(pos);
  }
  clientX.value = e.clientX;
  clientY.value = e.clientY;

  // Ускорение анимации фона при движении
  const speed = Math.sqrt(velocity.value.x ** 2 + velocity.value.y ** 2);
  if (speed > 0.1) {
    setTargetSpeed(speed);
  }
};

const updateCursorPosition = () => {
  if (cursorWrapper.value) {
    gsap.set(cursorWrapper.value, { x: clientX.value, y: clientY.value });
  }
  requestAnimationFrame(updateCursorPosition);
};

function onMouseDown(e: MouseEvent) {
  isMouseDown.value = true;
  startDeformation(isMouseDown.value);
  shaderState?.updateShaderMouse({ x: e.clientX, y: e.clientY });
}

function onMouseUp(e: MouseEvent) {
  isMouseDown.value = false;
  startDeformation(isMouseDown.value);
  shaderState?.updateShaderMouse({ x: e.clientX, y: e.clientY });
}

function startDeformation(isAcrive: boolean) {
  shaderState?.setMouseDown(isAcrive);
}

const bumpCursor = () => bumpCursorTween?.play();

defineExpose({ bumpCursor });

// Инициализация
onMounted(() => {
  const wrapperEl = cursorWrapper.value;
  const innerEl = innerCursor.value;
  const outerEl = outerCursor.value;
  localSpeed.value = shaderState.speed.value;

  if (!wrapperEl || !innerEl || !outerEl || !cursorTail) return;

  // Ставим мышь в центр для красивого старта
  mousePos.x = window.innerWidth / 2;
  mousePos.y = window.innerHeight / 2;

  initTail();

  // Создание анимаций
  enlargeCursorTween = gsap.to(outerEl, {
    duration: 0.5,
    width: props.fullCursorSize,
    height: props.fullCursorSize,
    ease: easing,
    paused: true,
    onUpdate() {
      if (!outerEl) return;
      const currentWidth = parseFloat(outerEl.style.width);

      liquidGlassSize.value = currentWidth;
    },
  });

  bumpCursorTween = gsap.to(innerEl, {
    duration: 0.3,
    scale: 0.7,
    paused: true,
    onComplete: () => {
      gsap.to(outerEl, {
        duration: 0.2,
        scale: 1,
        ease: easing,
      });
    },
  });

  // Слушатели мыши
  useEventListener(window, 'mousemove', onMouseMove);
  useEventListener(window, 'mousedown', onMouseDown);
  useEventListener(window, 'mouseup', onMouseUp);

  // Получаем корневой элемент для наблюдения
  const rootElement =
    typeof props.observerRoot === 'string'
      ? document.querySelector(props.observerRoot)
      : props.observerRoot || document.body;
  if (!rootElement) return;

  // Первоначальная регистрация существующих элементов
  refreshAllTargets();

  // Запуск цикла позиционирования
  requestAnimationFrame(updateCursorPosition);

  // Настройка MutationObserver для отслеживания добавления новых элементов с нужным селектором
  observer = new MutationObserver((mutations) => {
    // let needsRefresh = false;
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        // Добавленные узлы
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // element node
            const el = node as HTMLElement;
            if (el.matches?.(props.enlargeTargetSelector)) {
              addListenersToElement(el);
            }
            // Также проверяем потомков добавленного узла
            if (el.querySelectorAll) {
              el.querySelectorAll<HTMLElement>(
                props.enlargeTargetSelector,
              ).forEach((child) => addListenersToElement(child));
            }
          }
        });
        // Удалённые узлы — можно не обрабатывать, но если хотим очищать память:
        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const el = node as HTMLElement;
            if (el.matches?.(props.enlargeTargetSelector)) {
              removeListenersFromElement(el);
            }
            if (el.querySelectorAll) {
              el.querySelectorAll<HTMLElement>(
                props.enlargeTargetSelector,
              ).forEach((child) => removeListenersFromElement(child));
            }
          }
        });
      } else if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        // Если класс изменился и элемент мог стать/перестать быть целевым — проще перепроверить все
        // Но для оптимизации можно проверить конкретный элемент
        const target = mutation.target as HTMLElement;
        if (target.matches?.(props.enlargeTargetSelector)) {
          if (!activeElements.has(target)) addListenersToElement(target);
        } else {
          if (activeElements.has(target)) removeListenersFromElement(target);
        }
      }
    }
  });

  // Запускаем наблюдение за корневым элементом и всей его поддеревом
  observer.observe(rootElement, {
    childList: true,
    subtree: true,
    attributes: true, // следим за изменением классов (на случай динамического добавления/удаления класса)
    attributeFilter: ['class'], // только class
  });
});

watch(currentSpeed, (val) => (localSpeed.value = val));
watch(localSpeed, (val) => shaderState.setSpeed(val));

onUnmounted(() => {
  // Останавливаем observer
  observer?.disconnect();

  // Останавливаем анимации
  enlargeCursorTween?.kill();
  bumpCursorTween?.kill();

  // Останавливаем все анимации
  if (animation) animation.kill();

  // Очищаем SVG
  if (cursorTail.value) {
    cursorTail.value.innerHTML = '';
  }
});

// Дополнительно: если нужно при смене роута (например, когда Nuxt полностью перерисовывает страницу без мутаций),
// можно подстраховаться, подписавшись на окончание навигации
const route = useRoute();
watch(
  () => route.fullPath,
  async () => {
    handleMouseLeaveEnlarge();
    // Даём время отрисоваться новому контенту
    await nextTick();
    // Принудительно обновляем все цели (можно и через observer, но иногда observer не успевает)
    refreshAllTargets();
  },
);
</script>
<template>
  <div ref="cursorWrapper" class="cursor-wrapper">
    <div ref="innerCursor" class="custom-cursor custom-cursor__inner"></div>
    <div ref="outerCursor" class="custom-cursor custom-cursor__outer"></div>
    <UiCursorLiquidGlass v-if="showFilter" :size="liquidGlassSize" />
  </div>
  <div class="default-cursor-tooltip">
    VIEW
  </div>
  <svg ref="cursorTail" class="cursor-tail"></svg>
</template>

<style lang="scss">
@media (any-pointer: fine) {
  .cursor-tail {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 9999;
  }
  .cursor-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 9999;
    transform: translate(0, 0);
    will-change: transform;
  }

  .custom-cursor {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
    pointer-events: none;
    will-change: transform, width, height, background-color, opacity;
  }

  .custom-cursor__inner {
    width: 6px;
    height: 6px;
    background-color: #fff;
    transform: translate(-50%, -50%);
    z-index: 2;
  }

  .custom-cursor__outer {
    width: 1px;
    height: 1px;
    border: 2px solid white;
    background-color: transparent;
    transform: translate(-50%, -50%);
    transition: background-color 0.3s, opacity 0.3s, transform 0.2s;
    z-index: 1;
  }

  .cursor-wrapper.has-blend-mode {
    mix-blend-mode: difference;
  }

  .cursor-wrapper.is-outside {
    opacity: 0;
  }

  .default-cursor-tooltip {
    display: none;
  }
}
</style>
