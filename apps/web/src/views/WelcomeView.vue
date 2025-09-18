<script setup lang="ts">
import { MotionComponent as Motion } from '@vueuse/motion';
</script>

<template>
  <main class="fullscreen">
    <div class="container q-pa-xl">
      <RouterView v-slot="{ Component, route }">
        <!-- <Motion
          :initial="{
            opacity: 0,
            y: 100,
          }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              type: 'spring',
              stiffness: '100',
            },
          }"
          :leave="{
            opacity: 0,
            y: -100,
            transition: {
              delay: 200,
            },
          }"
          :variants="{ custom: { scale: 2 } }"
          :delay="200"
          :duration="600"
        > -->
        <KeepAlive>
          <Component :is="Component" />
        </KeepAlive>
        <!-- </Motion> -->
      </RouterView>
    </div>
    <div class="decor"></div>
  </main>
</template>

<style scoped lang="scss">
main {
  .container {
    background: var(--background-100);
    max-width: $breakpoint-xs;
    height: 100%;
  }

  @media screen and (width < $breakpoint-xs) {
    .decor {
      display: none;
    }
  }
}
</style>
