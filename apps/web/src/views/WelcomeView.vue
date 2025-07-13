<script setup lang="ts"></script>

<template>
  <main class="fullscreen">
    <div class="container q-pa-xl">
      <h1 class="text-weight-thin text-h2">
        Sign in to begin
        <span class="text-bg-clip gradient-primary text-weight-bolder"> chatting. </span>
      </h1>
      <RouterView></RouterView>
    </div>
    <div class="decor"></div>
  </main>
</template>

<style scoped lang="scss">
main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  .container {
    background: var(--background-100);
    max-width: $breakpoint-xs;
  }
  h1 {
    text-wrap: balance;
  }

  @media screen and (width < $breakpoint-xs) {
    grid-template-columns: 1fr;
  }
}
</style>
