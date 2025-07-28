<template>
  <div class="separator-container">
    <QSeparator spaced="auto" />
    <slot></slot>
    <QSeparator spaced="auto" />
  </div>
</template>

<style scoped lang="scss">
.separator-container {
  display: grid;
  grid-template-columns: 1fr max-content 1fr;
  gap: 1rem;
  padding-inline: 1rem;
}
</style>
