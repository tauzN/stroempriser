<template>
    <div class="text-gray-100 text-xs flex p-2 gap-2 justify-center flex-wrap lg:flex-nowrap mx-auto">
        <Page3chart v-if="records && dayjs(records[0].datetime).isSame(dayjs(), 'day')" :records="records.slice(0,24)">
        </Page3chart>
        <Page3chart v-if="records" :records="records.slice(24)"></Page3chart>
    </div>
    <div class=" max-w-sm text-gray-400 text-xs mx-auto text-center">Spidslast mellem kl. 17-20. Priser er baseret på et årsforbrug på 1.500 kWh for
        kunder vest for storebælt i N1 A/S netområder. Priser er inkl. elafgift, transmissionsnettarif, systemtarif, balancetarif, nettarif og netabonnement. Priser er ekskl. abbonement  til elselskab og spottillæg.</div>
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

