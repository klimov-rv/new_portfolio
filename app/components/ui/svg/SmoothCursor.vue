<script setup lang="ts"></script>

<template>
  <svg
    class="cursor__line cursor__line--horizontal"
    viewBox="0 0 200 20"
    preserveAspectRatio="none"
  >
    <defs>
      <filter
        id="filter-noise-x"
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
        filterUnits="objectBoundingBox"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0"
          numOctaves="1"
          result="warp"
        />
        <feOffset dx="-30" result="warpOffset" />
        <feDisplacementMap
          xChannelSelector="R"
          yChannelSelector="G"
          scale="30"
          in="SourceGraphic"
          in2="warpOffset"
        />
      </filter>
    </defs>
    <line
      class="cursor__line-element"
      x1="0"
      y1="10"
      x2="200"
      y2="10"
      shape-rendering="crispEdges"
      vector-effect="non-scaling-stroke"
    />
  </svg>
  <svg
    class="cursor__line cursor__line--vertical"
    viewBox="0 0 20 200"
    preserveAspectRatio="none"
  >
    <defs>
      <filter
        id="filter-noise-y"
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
        filterUnits="objectBoundingBox"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0"
          numOctaves="1"
          result="warp"
        />
        <feOffset dy="-30" result="warpOffset" />
        <feDisplacementMap
          xChannelSelector="R"
          yChannelSelector="G"
          scale="30"
          in="SourceGraphic"
          in2="warpOffset"
        />
      </filter>
    </defs>
    <line
      class="cursor__line-element"
      x1="10"
      y1="0"
      x2="10"
      y2="200"
      shape-rendering="crispEdges"
      vector-effect="non-scaling-stroke"
    />
  </svg>
</template>
