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
- **@nuxt/content** — CV content collection
- **@nuxt/image** — Project image optimization
- **Vitest** — Unit tests
- **Playwright** — E2E tests

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
│   ├── useProjects.ts         # Данные всех проектов
│   ├── useCanvas.ts           # Canvas-рендеринг курсорного хвоста
│   ├── useLines.ts            # Физика линий курсорного хвоста
│   ├── useMouseVelocity.ts    # Скорость движения мыши
│   └── ...                    # Остальные composables эффектов
├── types/
│   ├── project.ts             # Контракты проектов и ссылок
│   └── shader.ts              # Контракты shader API
├── utils/
│   └── webgl.ts               # Проверка поддержки WebGL
├── layouts/
│   └── default.vue            # Layout с меню
├── pages/
│   ├── index.vue              # Главная — лента проектов
│   └── project/[id].vue       # Страница деталей проекта
└── assets/css/main.css        # Tailwind + page transitions
```

## Скрипты

| Команда | Назначение |
| --- | --- |
| `npm run dev` | Локальный dev-сервер |
| `npm run lint` | ESLint-проверка |
| `npm run lint:fix` | Автоисправление ESLint |
| `npm run typecheck` | Строгая проверка Nuxt/TypeScript |
| `npm run test` | Unit-тесты Vitest |
| `npm run test:e2e` | E2E-тесты Playwright |
| `npm run build` | Production-сборка Nuxt |
| `npm run generate` | Статическая генерация |
| `npm run deploy` | Генерация и деплой в GitHub Pages |

## Маршруты и рендеринг

| Маршрут | Рендеринг | Данные | SEO |
| --- | --- | --- | --- |
| `/` | Prerender / SSG | `useProjects()` | Общие meta из `headers.js` |
| `/cv` | Prerender / SSG | `queryCollection('pages')` | Content meta с fallback |
| `/project/[id]` | Prerender / SSG | `useProjects()` + `useRoute()` | Динамический title |

Список project routes задан в `nuxt.config.ts`, потому что каталог проектов является статическим. Подробности описаны в [docs/rendering.md](docs/rendering.md).

## Production setup

Сборки воспроизводимы через `package-lock.json`, `.nvmrc` и `.npmrc`. Для локальной установки используйте:

```bash
npm ci
```

CI запускается для `main`, `develop` и pull request в `main`. Production deploy запускается после push в `main` и публикует `.output/public` в GitHub Pages. Подробности: [docs/deployment.md](docs/deployment.md).

Рабочий процесс веток и Conventional Commits описан в [CONTRIBUTING.md](CONTRIBUTING.md).

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
