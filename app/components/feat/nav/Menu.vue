<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const items = ref<NavigationMenuItem[]>([
  {
    label: 'Portfolio',
    icon: 'i-lucide-briefcase',
    to: '/',
  },
  {
    label: 'CV',
    icon: 'i-lucide-book-open',
    to: '/cv',
  },
  {
    label: 'Связаться',
    icon: 'i-lucide:message-circle-more',
    to: 'https://klimov.mssg.me/',
    target: '_blank',
  },
]);
</script>

<template>
  <UNavigationMenu class="main-nav-menu" :items="items" />
</template>
<style lang="scss">
.main-nav-menu {
  --ui-bg-elevated: rgba(0, 0, 0, 0.1);
  a,
  span {
    color: rgba(255, 255, 255, 0.5);
  }
  li {
    padding-top: 0;
    padding-bottom: 0;
  }

  @media (max-width: 651px) {
    .iconify + span {
      display: none;
    }
  }
}
</style>
