<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col ">
    <div class="absolute top-0 w-screen overflow-y-scroll bottom-10">
      <RouterView></RouterView>
    </div>
    <nav class="fixed bottom-0 left-0 flex justify-around w-screen h-10 bg-gray-900">
      <RouterLink to="/">Elpriser</RouterLink>
      <RouterLink to="/elbil">Opladning</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
nav a {
  @apply px-4 w-full text-center flex items-center justify-center
}
.router-link-active {
  @apply bg-gray-700
}
</style>
