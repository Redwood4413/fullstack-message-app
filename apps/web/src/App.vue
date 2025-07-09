<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
@import './assets/main.css';

a {
  text-decoration: none;
}

.gradient-primary {
  background: linear-gradient(120deg, $primary, $accent);
}
.gradient-primary-reversed {
  background: linear-gradient(-120deg, $primary, $accent);
}

.gradient-secondary {
  background: linear-gradient(120deg, $primary, $secondary);
}

.text-bg-clip {
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.font-mono {
  font-family: monospace;
}
body {
  &.body--dark {
    a {
      color: #fff;
    }
  }
  &.body--light {
    a {
      color: var(--text-color);
    }
  }
}
</style>
