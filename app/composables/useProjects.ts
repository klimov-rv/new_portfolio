export interface Project {
  id: string;
  year: number;
  title: string;
  subtitle: string;
  type: string;
  description: string;
  details: string;
  preview: string;
  video_preview?: string;
  video?: string;
  links?: { label: string; url: string }[];
  demo_links?: { label: string; url: string }[];
  tags: string[];
}

export const useProjects = () => {
  const projects: Project[] = [
    {
      id: 'ege-kritsky',
      year: 2026,
      title: 'ЕГЭ / Крицкий',
      subtitle: 'Платформа для подготовки к ЕГЭ',
      type: 'Фронтенд-разработка',
      description:
        'Платформа для генерации уникальных вариантов ЕГЭ по литературе с конструктором, личным кабинетом и системой подписок.',
      details:
        'Разработка фронтенда на Nuxt 4 с интеграцией конструктора вариантов ЕГЭ. Реализация личного кабинета с управлением подписками, историей платежей и сохранёнными вариантами. Оптимизация работы с большими объёмами данных (база знаний ~9.5МБ) через серверное кеширование (Nitro). <a href="/fsdf/dfdsf.pdf">link</a> Адаптивная вёрстка, интерактивные элементы и интеграция с системой оплаты. Создание демо-страницы с предопределённым вариантом ("Вариант недели") для ознакомления пользователей с функционалом платформы.',
      preview: '/projects_thumb/ege-kritsky.webp',
      video_preview: '/projects_thumb/ege-kritsky-main.webp',
      video: '/video/ege-kritsky-vid.webm',
      tags: [
        'Nuxt 4',
        'SSR/SSG',
        'Vue 3',
        'TypeScript',
        'Pinia',
        'Tailwind CSS',
        'Nitro',
        'Кеширование',
        'Docker',
        'Redis',
        'PDF Generation',
      ],
      // links: [
      //   {
      //     label: 'Демо-сайт',
      //     url: 'https://kritsky-demo.vercel.app/',
      //   },
      //   {
      //     label: 'Конструктор',
      //     url: 'https://kritsky-demo.vercel.app/create-variant',
      //   },
      //   {
      //     label: 'Авторский вариант',
      //     url: 'https://kritsky-demo.vercel.app/author-variant',
      //   },
      // ],
      demo_links: [
        {
          label: 'Демо-вариант',
          url: 'https://kritsky-demo.vercel.app/',
        },
        {
          label: 'Конструктор',
          url: 'https://kritsky-demo.vercel.app/create-variant',
        },
        {
          label: 'Авторский вариант',
          url: 'https://kritsky-demo.vercel.app/author-variant',
        },
      ],
    },
    {
      id: 'kefirium',
      year: 2024,
      title: 'Kefirium',
      subtitle: 'Web3-экосистема: NFT-цеха, дропы и геймификация',
      type: 'Фронтенд-разработка, Team Lead',
      description:
        'Разработка и лидирование фронтенда Web3-проекта с NFT-маркетплейсом, реальными активами и геймификацией. Внедрение передовых технологий для оптимизации производительности и UX.',
      details:
        'Масштабная миграция с Nuxt 2 на Nuxt 3 с внедрением TypeScript и FSD. Разработка функционала NFT-цехов, дропов и стейкинга. Интеграция WebSockets для real-time обновления статусов. Реализация сложных анимаций открытия NFT-боксов и бочек с использованием GSAP. Оптимизация производительности и UX при высоких нагрузках во время дропов.   Организовал многоконтурную среду (dev/test/stage/prod), что снизило количество ошибок в продакшене. Согласовывал форматы данных с Backend и Blockchain командами, исключив разработку на моках и двойную работу. Внедрил обязательный прогон позитивных сценариев перед передачей в QA и проводил регулярные код-ревью.',

      preview: '/projects_thumb/kefirium_thumb.webp',
      video_preview: '/projects_thumb/kefirium-main.webp',
      video: '/video/kefirium-vid.webm',
      tags: [
        'Nuxt.js',
        'Vue.js',
        'TypeScript',
        'Web3',
        'NFT',
        'WebSockets',
        'GSAP',
        'FSD',
        'Docker',
        'Pinia',
      ],
      links: [
        {
          label: 'Реальный сайт',
          url: 'https://kefirium.ru/',
        },
        {
          label: 'Страница Кефирные Цеха',
          url: 'https://kefirium.ru/factories',
        },
        {
          label: 'Дроп NFT кефирного цеха',
          url: 'https://kefirium.ru/drop/factory',
        },
        {
          label: 'Дроп NFT боксов (1ый тираж)',
          url: 'https://kefirium.ru/drop/kefiriumbox1',
        },
        {
          label: 'Дроп NFT боксов (Новогодний тираж)',
          url: 'https://kefirium.ru/drop/kefiriumbox2025',
        },
        {
          label: 'Коллекции на TON',
          url: 'https://kefirium.ru/categories/ton-only',
        },
      ],
      demo_links: [
        {
          label: 'Figma - функционал кифирного цеха',
          url:
            'https://www.figma.com/proto/hoDw2xOEuzjJVs0cg75JSW?node-id=0-1&t=xVWnfTiMoGU1I2LW-6',
        },
        {
          label: 'UI Kit + Юзкейсы импорта, минта токенов TON/Metamask кошельков',
          url: 'https://www.figma.com/design/L2iiVvywDrSqkeS8FRYtUh/%D0%AE%D0%B7%D0%B5%D1%80%D0%BA%D0%B5%D0%B9%D1%81%D1%8B-%D0%BF%D0%BE-%D1%81%D0%B5%D1%82%D1%8F%D0%BC--%D0%BA%D0%BE%D0%BC%D0%B8%D1%81%D1%81%D0%B8%D1%8F%D0%BC--Copy---Copy---Copy-?node-id=579-2549',
        }, 
      ],
    },
    {
      id: 'guestcard-barnaul',
      year: 2023,
      title: 'Guestcard города Барнаул',
      subtitle: 'Туристический портал «под ключ»',
      type: 'Фронтенд-разработка',
      description:
        'Туристический портал города Барнаул с интерактивной картой, аудио-экскурсиями и календарём событий.',
      details:
        'Полная разработка фронтенда туристического портала. Главная страница с собственными отметками достопримечательностей на Яндекс.Картах. Страница "Историческая линия" с SVG-анимацией маршрута по городу и аудио-записями для аудио-экскурсий. Календарь событий с фильтрацией по категориям. Адаптивная вёрстка, высокая производительность.',
      preview: '/projects_thumb/guestcard-barnaul.webp',
      video: '/video/barnaul06042026173309.mp4',
      tags: [
        'Bitrix',
        'Аудио-экскурсии',
        'Адаптив',
        'JavaScript',
        'Яндекс.Карты',
      ],
      links: [
        {
          label: 'Реальный проект',
          url: 'https://guestcard.barnaul.org/',
        },
        {
          label: 'Историческая линия',
          url:
            'https://guestcard.barnaul.org/objects/where_visit/istoricheskaya-liniya/',
        },
        {
          label: 'Календарь событий',
          url: 'https://guestcard.barnaul.org/about-barnaul/events_calendar/',
        },
      ],
      demo_links: [
        {
          label: 'Историческая линия',
          url:
            'https://klimovproject.online/barnaul.layout/historical_line.html',
        },
        {
          label: 'Исторический объект',
          url:
            'https://klimovproject.online/barnaul.layout/historical_object.html',
        },
        {
          label: 'Календарь событий',
          url: 'https://klimovproject.online/barnaul.layout/calendar.html',
        },
        {
          label: 'Страница тематического раздела',
          url: 'https://klimovproject.online/barnaul.layout/where_eat.html',
        },
        {
          label: 'Аудиоэкскурсии',
          url: 'https://klimovproject.online/barnaul.layout/audio_tours.html',
        },
        {
          label: 'Главное событие',
          url: 'https://klimovproject.online/barnaul.layout/main_event.html',
        },
      ],
    },
    {
      id: 'mukomolny',
      year: 2021,
      title: 'Мукомольный комбинат Володарский',
      subtitle: 'Сайт «под ключ»',
      type: 'Вёрстка и интеграция',
      description:
        'Вёрстка «под ключ» на WordPress. 10 страниц уникального дизайна, адаптив, Pixel-perfect и Motion Design, продвинутая анимация.',
      details:
        'Полная вёрстка корпоративного сайта на WordPress. 10 страниц уникального дизайна: "Главная", "О компании", "Продукция (каталог)", "Закупка зерна", "Вакансии", "Статьи", "Контакты", "Корзина", "Оформление заказа". Интерактивный дизайн с продвинутой анимацией. Pixel-perfect вёрстка по макету Figma.',
      preview: '/projects_thumb/1.2e4c3754.jpg',
      video: '/video/pl2.mp4',
      tags: ['WordPress', 'Motion Design', 'Pixel-perfect', 'Адаптив'],
      links: [
        {
          label: 'Исходник figma',
          url:
            'https://www.figma.com/file/q4JMNnji6aFgADekHYVbmj/Muka?node-id=1%3A2&t=cjaNj5UYLpgh8CaI-0',
        },
      ],
      demo_links: [
        {
          label: 'Главная',
          url: 'https://klimov-rv.github.io/muka.layout/',
        },
        {
          label: 'О компании',
          url: 'https://klimov-rv.github.io/muka.layout/aboutus.html',
        },
        {
          label: 'Продукция (каталог)',
          url: 'https://klimov-rv.github.io/muka.layout/production.html',
        },
        {
          label: 'Закупка зерна',
          url: 'https://klimov-rv.github.io/muka.layout/zakupka.html',
        },
        {
          label: 'Вакансии',
          url: 'https://klimov-rv.github.io/muka.layout/vakansii.html',
        },
        {
          label: 'Статьи',
          url: 'https://klimov-rv.github.io/muka.layout/news.html',
        },
        {
          label: 'Контакты',
          url: 'https://klimov-rv.github.io/muka.layout/contact.html',
        },
        {
          label: 'Корзина',
          url: 'https://klimov-rv.github.io/muka.layout/cart.html',
        },
        {
          label: 'Оформление заказа',
          url: 'https://klimov-rv.github.io/muka.layout/cart-checkout.html',
        },
      ],
    },
    {
      id: 'private-women-club',
      year: 2021,
      title: 'Private Women Club',
      subtitle: 'Лендинг',
      type: 'Вёрстка лендинга',
      description:
        'Вёрстка тематического лендинга. 2 страницы (Главная, 404) + Модальные окна. Уникальный дизайн с нестандартной анимацией.',
      details:
        'Вёрстка лендинга женского клуба. Главная страница состоит из 9 секций. Уникальный дизайн с нестандартной анимацией. Адаптив, Pixel-perfect и Motion Design. Реализованы модальные окна и страница 404.',
      preview: '/projects_thumb/2.fb1cfb60.jpg',
      video_preview: '/projects_thumb/2_big.dda0bf93.jpg',
      video: '/video/wish-card.9fde285d.mp4',
      tags: ['HTML/CSS', 'JavaScript', 'Motion Design', 'Адаптив'],
      links: [
        {
          label: 'Исходник figma',
          url:
            'https://www.figma.com/file/0VMX7rZt3wAuUhvvjWEuBJ/%D0%9A%D0%B0%D1%80%D1%82%D0%B0-%D0%B6%D0%B5%D0%BB%D0%B0%D0%BD%D0%B8%D0%B9?node-id=194%3A2307&t=NdUXUyUVWUywVwSt-0',
        },
      ],
      demo_links: [
        {
          label: 'Главная',
          url: 'https://klimov-rv.github.io/wish-card.layout/',
        },
        {
          label: 'Демо',
          url: 'https://klimov-rv.github.io/wish-card.layout/demo.html',
        },
      ],
    },
    {
      id: 'perco',
      year: 2021,
      title: 'Промо-сайты PERCo',
      subtitle: 'Промо-сайт',
      type: 'Разработка сайта',
      description:
        'Полный цикл разработки. Участие в проектировании блоков дизайна, UX/UI и анимации. Работа с видео, асинхронная подгрузка.',
      details:
        'Мультиязычные промо-сайты для международного продвижения. Участие в проектировании блоков дизайна, UX/UI и анимации. Работа с видео, асинхронная подгрузка. Презентация партнёрам и консультации по продвижению. Реализованы русская, английская и французская версии.',
      preview: '/projects_thumb/3.47331ce2.jpg',
      video_preview: '/projects_thumb/3_big.4ade9218.jpg',
      video: '/video/perco.6d666d6a.mp4',
      tags: ['Мультиязычность', 'UX/UI', 'Видео', 'Анимация'],
      links: [
        {
          label: 'Исходник figma',
          url:
            'https://www.figma.com/file/GKliJSXY44v2GQFlnpxoeM/%D0%9B%D0%B5%D0%BD%D0%B4%D0%B8%D0%BD%D0%B3-%D0%A1%D0%BA%D0%BE%D1%80%D0%BE%D1%81%D1%82%D0%BD%D1%8B%D0%B5',
        },
      ],
      demo_links: [
        {
          label: 'Мультиязычная версия',
          url: 'https://klimov-rv.github.io/perco.case/',
        },
        {
          label: 'Русская версия',
          url: 'https://speedgate.perco.ru/',
        },
        {
          label: 'Английская версия',
          url: 'https://speedgate.perco.com/',
        },
        {
          label: 'Французская версия',
          url: 'https://fr.speedgate.perco.com/',
        },
      ],
    },
    {
      id: 'segment',
      year: 2021,
      title: 'Сегмент — Канцтовары',
      subtitle: 'Восстановление сайта',
      type: 'Поддержка и доработка функционала',
      description:
        'Выполнена адаптивная вёрстка из десктоп-версии. Переработка структуры меню и страниц, внедрение визуального редактора статей.',
      details:
        'Восстановление и доработка корпоративного сайта канцтоваров. Выполнена адаптивная вёрстка из десктоп-версии. Переработка структуры меню и страниц, внедрение удобного визуального редактора статей в партнёрский раздел и другие доработки.',
      preview: '/projects_thumb/5.cb89a434.jpg',
      video_preview: '/projects_thumb/5_big.2498e385.jpg',
      video: '/video/5.eddfbc63.mp4',
      tags: ['Адаптив', 'CMS', 'Редактор', 'Доработка'],
      links: [
        {
          label: 'Реальный проект',
          url: 'https://segment.ru/',
        },
      ],
    },
    {
      id: 'di-valore',
      year: 2020,
      title: 'Di Valore',
      subtitle: 'Стильный магазин одежды',
      type: 'Frontend разработка',
      description:
        'Интернет-магазин стильных пиджаков и аксессуаров. Уникальный и современный дизайн, интегрирован на платформе InSales.',
      details:
        'Интернет-магазин стильных пиджаков и аксессуаров Di Valore. Реализован уникальный и современный дизайн. Интеграция на платформе InSales. Реализованы страницы: Главная, Карточка товара, Каталог, Каталог аксессуаров.',
      preview: '/projects_thumb/4.3d0ce318.jpg',
      video_preview: '/projects_thumb/4_big.3a4c998b.jpg',
      video: '/video/4.f6bf01dc.mp4',
      tags: ['InSales', 'E-commerce', 'Дизайн', 'Frontend'],
      links: [
        {
          label: 'Реальный проект',
          url: 'https://devalore.ru/',
        },
      ],
      demo_links: [
        {
          label: 'Главная',
          url: 'https://klimov-rv.github.io/divalore.case/',
        },
        {
          label: 'Карточка товара',
          url: 'https://klimov-rv.github.io/divalore.case/card.html',
        },
        {
          label: 'Каталог',
          url: 'https://klimov-rv.github.io/divalore.case/catalog.html',
        },
        {
          label: 'Каталог аксессуаров',
          url: 'https://klimov-rv.github.io/divalore.case/catalog-acess.html',
        },
      ],
    },
    {
      id: 'kawasaki',
      year: 2019,
      title: 'Kawasaki Tools',
      subtitle: 'Сайт на Bitrix',
      type: 'Разработка «под ключ»',
      description:
        'Классический интернет-магазин на платформе Bitrix. Полная разработка «под ключ».',
      details:
        'Классический интернет-магазин инструментов Kawasaki на платформе 1С-Битрикс. Полная разработка «под ключ» — от проектирования до запуска. Реализован полный функционал интернет-магазина с каталогом, корзиной и оформлением заказа.',
      preview: '/projects_thumb/6.dffe976f.jpg',
      video_preview: '/projects_thumb/6_big.657e9032.jpg',
      video: '/video/6.f0bаа1dc.mp4',
      tags: ['Bitrix', 'E-commerce', 'PHP', 'Разработка'],
      links: [
        {
          label: 'Реальный проект',
          url: 'https://kawasaki-shop.ru/',
        },
      ],
      demo_links: [
        {
          label: 'Страница "О компании"',
          url: 'https://kawasaki-shop.ru/about/',
        },
      ],
    },
    {
      id: 'static-services',
      year: 2015,
      title: 'Статичный сайт услуг',
      subtitle: 'Сайт услуг',
      type: 'Разработка «под ключ»',
      description:
        'Для экономии на хостинге выбран SSG Joomla, статика размещена на GitHub. Уникальный дизайн с блоками призыва к действию.',
      details:
        'Статичный сайт услуг с мобильной версией. Для экономии на хостинге выбран SSG Joomla, статика размещена напрямую на GitHub с привязанным доменом. Адаптивная вёрстка. Уникальный дизайн с расставленными блоками «призыва к действию» на стандартные всплывающие окна обратной связи для максимальной конверсии и генерации лидов.',
      preview: '/projects_thumb/7.6d92090d.jpg',
      video_preview: '/projects_thumb/7_big.d26094fb.jpg',
      video: '/video/7.befc007b.mp4',
      tags: ['Joomla', 'SSG', 'GitHub Pages', 'Адаптив'],
      links: [
        {
          label: 'Реальный проект',
          url: 'https://mair-site.github.io/',
        },
      ],
      demo_links: [
        {
          label: 'Услуга - сборка мебели',
          url: 'https://mair-site.github.io/sborka-mebeli/',
        },
        {
          label: 'Услуга - муж на час',
          url: 'https://mair-site.github.io/muzh-na-chas/',
        },
        {
          label: 'Услуга - квартирный переезд',
          url: 'https://mair-site.github.io/kvartirnyiy-pereezd/',
        },
        {
          label: 'Услуга - строительство',
          url: 'https://mair-site.github.io/stroitelstvo-remont/',
        },
        {
          label: 'Примеры работ',
          url: 'https://mair-site.github.io/clients/raborka-mebeli/',
        },
        {
          label: 'Сотрудничество',
          url: 'https://mair-site.github.io/partnership/',
        },
      ],
    },
  ];

  const getProject = (id: string) => projects.find((p) => p.id === id);

  return { projects, getProject };
};
