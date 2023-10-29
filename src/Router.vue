<template>
  <router-view v-slot="{Component}">
    <KeepAlive>
      <component :is="Component" />
    </KeepAlive>
  </router-view>
  <nav class="fixed bottom-0 left-0 z-50 flex items-center w-full h-10 text-xs bg-gray-800 justify-evenly">
    <router-link to="/">Elpriser</router-link>
    <router-link to="/elbil">Opladning</router-link>
  </nav>
  <div class="h-10"></div>
</template>
<style scoped>

</style>