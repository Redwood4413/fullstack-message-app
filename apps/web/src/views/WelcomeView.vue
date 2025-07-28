<script setup lang="ts"></script>

<template>
  <main class="fullscreen">
    <div class="container q-pa-xl">
      <RouterView></RouterView>
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
