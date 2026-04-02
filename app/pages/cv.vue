<script setup lang="ts">
const cvContent = await queryCollection('pages').path(`/klimovrv_ru`).first();

useSeoMeta({
  title: cvContent.value?.title,
  description: cvContent.value?.description,
});
</script>

<template>
  <div class="min-h-screen">
    <div class="relative z-10 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12 space-y-2">
        <p class="font-mono text-xs uppercase tracking-[0.4em] font-semibold">
          Климов Роман • Frontend Developer
        </p>
        <p class="font-mono text-white/70 text-xs uppercase tracking-[0.6em]">
          Curriculum vitae
        </p>
      </div>

      <!-- Main content -->
      <div class="max-w-7xl mx-auto">
        <div class="bg-white/5 backdrop-blur-sm p-8 md:p-10">
          <FeatDownloadButton />
          <ContentRenderer
            v-if="cvContent"
            :value="cvContent"
            class="cv-content"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.cv-content {
  // Color variables
  --accent: #21b3a9;
  --border-light: rgba(255, 255, 255, 0.1);
  --bg-glass: rgba(255, 255, 255, 0.03);

  // Typography
  line-height: 1.6;
  font-family: 'Fira Code', monospace;

  // Headers
  h1 {
    display: none;
    font-size: 32px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      'Liberation Mono', 'Courier New', monospace;
    line-height: 2em;
    font-weight: 300;
    text-align: center;
    color: white;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    background: linear-gradient(135deg, #fff 0%, #b8fffa 100%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    border-bottom: 1px solid var(--border-light);
    letter-spacing: -0.02em;

    @media (min-width: 768px) {
      font-size: 48px;
    }
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 2.5rem;
    margin-bottom: 1.25rem;
    padding-bottom: 0.5rem;
    color: var(--accent);
    position: relative;
    display: inline-block;
    letter-spacing: -0.01em;

    a {
      color: inherit;
      text-decoration: none;
      transition: all 0.2s ease;

      &:hover {
        text-decoration: underline;
      }
    }
    @media (min-width: 768px) {
      font-size: 1.5rem;
    }
  }

  // First h2 should have less top margin
  h2:first-of-type {
    margin-top: 0;
  }

  // Paragraphs
  p {
    margin-bottom: 1rem;
    line-height: 1.625;
    color: rgba(255, 255, 255, 0.85);

    // Company name links
    > a {
      font-size: 1.25rem;
      font-weight: 600;
      color: white;
      text-decoration: none;
      display: inline-block;
      transition: all 0.2s ease;

      &:hover {
        color: var(--accent);
      }

      @media (min-width: 768px) {
        font-size: 1.5rem;
      }
    }

    // Job title (strong inside p)
    strong:only-child {
      display: block;
      font-size: 1.1rem;
      font-weight: 600;
      margin-top: 0.5rem;
      margin-bottom: 0.25rem;
      color: white;
    }

    // Period text (the p after p with strong)
    &:has(~ p strong) + p {
      font-size: 0.875rem;
      margin-top: -0.5rem;
      margin-bottom: 0.75rem;
      color: rgba(255, 255, 255, 0.4);
    }
  }

  // Links
  a {
    color: var(--accent);
    text-decoration: none;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
      color: var(--accent);
      text-decoration: underline;
    }

    // External link indicator
    &[href^='http']::after {
      content: '↗';
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      display: inline-block;
      margin-left: 4px;
      font-size: 0.8em;
      opacity: 0;
      transform: translateX(-4px);
      transition: all 0.2s ease;
    }

    &[href^='http']:hover::after {
      opacity: 1;
      transform: translateX(0);
    }
  }

  // Lists
  ul {
    margin-bottom: 1.5rem;
    margin-left: 0;
    padding-left: 0;
    list-style: none;

    li {
      position: relative;
      padding-left: 1.25rem;
      color: rgba(255, 255, 255, 0.75);
      line-height: 1.5;
      margin-bottom: 0.5rem;

      // Custom marker
      &::before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--accent);
        font-size: 0.85rem;
        transition: transform 0.2s ease;
      }

      // Hover effect on list items
      &:hover::before {
        color: var(--accent);
      }

      // Nested lists
      ul {
        margin-top: 0.5rem;
        margin-left: 1rem;
        margin-bottom: 0;

        li::before {
          content: '◦';
          color: rgba(255, 255, 255, 0.4);
        }
      }
    }
  }

  // Text formatting
  strong {
    font-weight: 600;
    color: white;

    // Skills categories
    h2 + ul & {
      color: var(--accent);
      display: inline-block;
      min-width: 180px;

      @media (max-width: 640px) {
        display: block;
        margin-bottom: 4px;
      }
    }
  }

  em {
    font-weight: 500;
    padding: 0 2px;
  }

  // Horizontal rules (separators between jobs)
  hr {
    margin: 2rem 0;
    border: none;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--border-light),
      transparent
    );

    // Add spacing after hr
    & + p {
      margin-top: 1.5rem;
    }
  }

  // Special styling for skills sections
  h2#ключевые-навыки,
  h2#дополнительные-навыки {
    margin-top: 2rem;

    & + ul {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.5rem 1.5rem;

      @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }

      li {
        word-break: break-word;

        &::before {
          content: '●';
          font-size: 0.35rem;
          top: 1.35em;
        }
      }
    }
  }

  // Job entry card effect
  hr + p a {
    position: relative;
    text-decoration: none;
    &::before {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--accent);
      transition: width 0.3s ease;
    }
    &:hover {
      text-decoration: none;
    }
    &:hover::before {
      width: 100%;
    }
  }

  // Code inline
  code {
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    background: rgba(16, 185, 129, 0.1);
    color: var(--accent);
    font-family: 'Fira Code', 'Courier New', monospace;
  }

  // Blockquotes (if any)
  blockquote {
    padding-left: 1rem;
    margin: 1rem 0;
    font-style: italic;
    border-left: 3px solid var(--accent);
    color: rgba(255, 255, 255, 0.6);

    p {
      margin-bottom: 0;
    }
  }

  // Images (if any)
  img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 1rem 0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  // Tables (if any)
  table {
    width: 100%;
    margin: 1rem 0;
    border-collapse: collapse;

    th,
    td {
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.5rem 1rem;
      text-align: left;
    }

    th {
      background: rgba(255, 255, 255, 0.05);
      font-weight: 600;
    }
  }
}

// Dark mode support
@media (prefers-color-scheme: dark) {
  .cv-content {
    --border-light: rgba(255, 255, 255, 0.08);
  }
}

// Mobile optimizations
@media (max-width: 768px) {
  .cv-content {
    h1 {
      font-size: 1.5rem;
    }

    h2 {
      width: 100%;
      text-align: center;
      font-size: 1.125rem;
    }

    p > a {
      font-size: 1.125rem;
    }

    ul li {
      font-size: 0.875rem;
    }

    strong {
      h2 + ul & {
        display: block;
        margin-bottom: 6px;
      }
    }
  }
}

// Print styles
@media print {
  .cv-content {
    color: black;

    --accent: #0b5e42;
    --accent: #0b5e42;
    --border-light: rgba(0, 0, 0, 0);

    h1 {
      color: black;
      background: none;
      -webkit-background-clip: unset;
      background-clip: unset;
    }

    a {
      color: black;
      text-decoration: underline;

      &::after {
        content: ' (' attr(href) ')';
        font-size: 0.8em;
      }
    }

    em {
      color: #333;
      background: none;
    }

    ul li::before {
      color: #666;
    }

    hr {
      background: #ddd;
    }
  }
}
</style>
