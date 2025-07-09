<script setup lang="ts">
import { ref } from 'vue'

const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
</script>

<template>
  <QLayout view="hHh LpR fff">
    <QHeader reveal elevated class="bg-primary text-white">
      <QToolbar>
        <QBtn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <QToolbarTitle>
          <QAvatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </QAvatar>
        </QToolbarTitle>

        <QBtn dense flat round icon="menu" @click="toggleRightDrawer" />
      </QToolbar>
    </QHeader>

    <QDrawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
    </QDrawer>

    <QPageContainer>
      <RouterView></RouterView>
    </QPageContainer>

    <QFooter bordered class="bg-grey-8 text-white">
      <QToolbar>
        <QToolbarTitle> </QToolbarTitle>
      </QToolbar>
    </QFooter>
  </QLayout>
</template>
<style scoped lang="scss">
.test {
  height: 220vh;
}
</style>
