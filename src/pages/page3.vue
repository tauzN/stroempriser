<template>
    <div class="text-gray-100 text-xs flex p-2 gap-2 justify-center flex-wrap md:flex-nowrap">
        <Page3chart v-if="records && dayjs(records[0].datetime).isSame(dayjs(), 'day')" :records="records.slice(0,24)"></Page3chart>
        <Page3chart v-if="records" :records="records.slice(24)"></Page3chart>
    </div>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import { onBeforeMount, ref } from "vue"
import { record } from "../types";
import { getLastHours } from "../util";
import Page3chart from "./page3chart.vue";
const records = ref<record[]>()
onBeforeMount(async () => {
    records.value = await getLastHours(48)
})
</script>

