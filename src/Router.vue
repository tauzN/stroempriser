<template>
  <router-view v-slot="{Component}">
    <KeepAlive>
      <component :is="Component" />
    </KeepAlive>
  </router-view>
  <div class=" fixed bottom-0 left-0 bg-gray-800 w-full h-10 flex items-center justify-evenly">
    <router-link to="/">Priser</router-link>
    <router-link to="/elbil">Opladning</router-link>
  </div>
  <div class="h-10"></div>
</template>
<style scoped>
a {
  @apply h-full flex items-center w-full justify-center
}

.router-link-active {
  @apply bg-gray-700 font-semibold
}
</style>