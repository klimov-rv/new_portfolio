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
  --ui-radius: 50px;
  --ui-bg-elevated: rgba(255, 255, 255, 0.1);
  a:hover span {
    color: white;
  }
  a,
  span {
    color: rgb(211 210 210 / 90%);
    filter: invert(1) contrast(10);
  }
  li {
    padding-top: 0;
    padding-bottom: 0;
  }

  .iconify {
    height: 14px;
    width: 14px;
  }
  .iconify + span > .iconify {
    display: none;
  }
  @media (max-width: 640px) {
    .iconify + span {
      display: none;
    }
  }
}
</style>
