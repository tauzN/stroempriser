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
        Priser er inklusive
        <a target="_blank" class=" text-blue-500 hover:underline" href="https://n1.dk/priser-og-vilkaar">nettariffer</a> (N1 A/S), 
        <a target="_blank" class=" text-blue-500 hover:underline" href="https://energinet.dk/El/Elmarkedet/Tariffer/Aktuelle-tariffer/">forbrugstariffer</a> (Energinet),
        <a target="_blank" class=" text-blue-500 hover:underline" href="https://www.skm.dk/skattetal/satser/satser-og-beloebsgraenser-i-lovgivningen/elafgiftsloven/">elafgift</a> og 25% moms.
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
    return (max < 3) ? 3.5 : max + .5
})
</script>

