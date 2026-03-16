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
  tags: string[];
}

export const useProjects = () => {
  const projects: Project[] = [
    {
      id: 'mukomolny',
      year: 2021,
      title: 'Мукомольный комбинат Володарский',
      subtitle: 'Сайт «под ключ»',
      type: 'Вёрстка и интеграция',
      description:
        'Вёрстка «под ключ» на WordPress. 10 страниц уникального дизайна, адаптив, Pixel-perfect и Motion Design, продвинутая анимация.',
      details:
        'Полная вёрстка корпоративного сайта на WordPress. Реализованы страницы: Главная, О компании, Продукция (каталог), Закупка зерна, Вакансии, Статьи, Контакты, Корзина, Оформление заказа. Уникальный дизайн с продвинутой анимацией и Motion Design. Pixel-perfect вёрстка по макету Figma.',
      preview: '/projects_thumb/1.2e4c3754.jpg',
      video: '/video/pl2.mp4',
      tags: ['WordPress', 'Motion Design', 'Pixel-perfect', 'Адаптив'],
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
      tags: ['Bitrix', 'E-commerce', 'PHP', 'Разработка'],
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
    },
  ];

  const getProject = (id: string) => projects.find((p) => p.id === id);

  return { projects, getProject };
};
