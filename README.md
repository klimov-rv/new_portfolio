# klimovproject\_ — Portfolio

Портфолио сайт на **Nuxt 4** с компонентами из [inspira-ui](https://inspira-ui.com/).

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## Стек

- **Nuxt 4** (compatibility version 4)
- **Vue 3** + TypeScript
- **Tailwind CSS** v4 via `@nuxt/ui`
- **motion-v** — Spring animations
- **@vueuse/core** — Composables

## Эффекты inspira-ui (5 штук)

| #   | Компонент                      | Применение                                                        |
| --- | ------------------------------ | ----------------------------------------------------------------- |
| 1   | `SilkBackground` + `ShaderToy` | Анимированный WebGL фон на обеих страницах (бесконечная анимация) |
| 2   | `TextGlitch`                   | Логотип `klimovproject_` — glitch-эффект при наведении            |
| 3   | `LiquidGlass`                  | Прозрачное меню с эффектом жидкого стекла                         |
| 4   | `DirectionAwareHover`          | Карточки проектов — overlay появляется со стороны курсора         |
| 5   | `SmoothCursor`                 | Плавный кастомный курсор с физикой (spring + rotation)            |

## Анимация переходов

Page transitions настроены в `nuxt.config.ts` (`pageTransition`) и `main.css` — плавный fade+scale при переходе между главной и страницей проекта.

## Структура

```
app/
├── components/
│   ├── ui/                    # Компоненты inspira-ui (скопированы напрямую)
│   │   ├── TextGlitch.vue
│   │   ├── SilkBackground.vue
│   │   ├── ShaderToy.vue
│   │   ├── InspiraShaderToy.ts
│   │   ├── LiquidGlass.vue
│   │   ├── DirectionAwareHover.vue
│   │   └── SmoothCursor.vue
│   ├── ProjectCard.vue        # Карточка проекта
│   └── ProjectNav.vue         # Навигация между проектами
├── composables/
│   └── useProjects.ts         # Данные всех проектов
├── layouts/
│   └── default.vue            # Layout с меню
├── pages/
│   ├── index.vue              # Главная — лента проектов
│   └── project/[id].vue       # Страница деталей проекта
└── assets/css/main.css        # Tailwind + page transitions
```

## Описание работ

Добавлено взаимодействие, при нажатии курсор деформирует WebGL-текстуру.
При быстрых движениях мышью - ускоряется анимация текстуры.
Композаблы:

- `useCursorTail` отвечает за анимированный хвост из SVG-линий
- `useCursorAnimation` управляет масштабированием курсора при наведении
- `useMouseVelocity` рассчитывает скорость движения для динамического ускорения фона,
- `useTargetObserver` автоматически отслеживает появление новых интерактивных элементов в DOM.

### TODO

- [ ] Интегрировать сетку проектов на Isotope (https://github.com/David-Desmaisons/Vue.Isotope)
- [ ] Оптимизация первой загрузки
- [ ] Оптимизация бандла
