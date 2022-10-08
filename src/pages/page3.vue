<template>
    <div class="bg-gray-900 min-h-screen text-gray-100 text-xs flex flex-col space-y-2 p-2">
        <Page3chart v-if="records" :records="records.slice(0,24)"></Page3chart>
        <Page3chart v-if="records" :records="records.slice(25)"></Page3chart>
    </div>
</template>
<script setup lang="ts">
import { onBeforeMount, ref } from "vue"
import { record } from "../types";
import { getLastHours } from "../util";
import Page3chart from "./page3chart.vue";
const records = ref<record[]>()
onBeforeMount(async () => {
    records.value = await getLastHours(48)
})
</script>

