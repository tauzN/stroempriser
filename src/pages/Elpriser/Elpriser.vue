<template>
    <div class="text-gray-100 text-xs flex p-2 gap-2 justify-center flex-wrap lg:flex-nowrap mx-auto">
        <div class="animate-pulse text-lg" v-show="records === undefined">
            Henter priser...
        </div>
        <Page3chart v-if="records && dayjs(records[0].datetime).isSame(dayjs(), 'day')" :records="records.slice(0, 24)"
            :maxPrice="maxPrice">
        </Page3chart>
        <Page3chart v-if="records" :records="records.slice(24)" :maxPrice="maxPrice"></Page3chart>
    </div>
    <div class=" max-w-xs text-gray-400 text-xs mx-auto text-center">
        Priser er ekskl. abbonement til elselskab og spottillæg. Der er ingen nettarif eller netabonnement hos N1 i
        december <a target="_blank" class=" text-blue-500 hover:underline"
            href="https://via.ritzau.dk/pressemeddelelse/750000-jyske-elkunder-slipper-for-nettarif-i-december?publisherId=13559703&releaseId=13663280&lang=da">læs
            mere</a>

    </div>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import { computed, onMounted, ref } from "vue"
import { record } from "../../types";
import { getLastHours } from "../../util/util";
import Page3chart from "./Chart.vue";
const records = ref<record[] | null>()
onMounted(async () => {
    try {
        records.value = await getLastHours(48)
    } catch (error) {
        records.value = null
        console.log(error);
    }
})
const maxPrice = computed(() => {
    let max = 0;
    if (records && records.value) {
        max = Math.max(...records.value.map(item => item.totalPrice))
    }
    return (max < 3) ? 3.5 : max+.5
})
</script>

