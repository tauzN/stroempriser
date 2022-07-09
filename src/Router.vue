<template>
  <router-view v-slot="{ Component }">
    <transition>
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
  <div class=" fixed bottom-0 bg-gray-800 w-full h-10 flex items-center justify-evenly">
    <router-link to="/">Priser</router-link>
    <router-link to="/elbil">Opladning</router-link>
  </div>
</template>
<style scoped>
a {
  @apply h-full flex items-center w-full justify-center
}

.router-link-active {
  @apply bg-gray-700 font-semibold
}
</style>