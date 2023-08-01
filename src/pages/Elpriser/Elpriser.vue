<template>
    <div class="flex flex-wrap justify-center gap-2 p-2 mx-auto text-xs text-gray-100 lg:flex-nowrap">
        <div class="text-lg animate-pulse" v-show="records === undefined">
            Henter priser...
        </div>
        <Page3chart v-if="records && dayjs(records[0].datetime).isSame(dayjs(), 'day')" :records="records.slice(0, 24)"
            :maxPrice="maxPrice">
        </Page3chart>
        <Page3chart v-if="records" :records="records.slice(24)" :maxPrice="maxPrice"></Page3chart>
    </div>
    <div class="max-w-xs mx-auto text-xs text-center text-gray-400 ">
        Priser er inklusive
        <a target="_blank" class="text-blue-500 hover:underline" href="https://n1.dk/priser-og-vilkaar">nettariffer og
            netabonnement</a> (N1
        A/S, 3.600 kWh/år),
        <a target="_blank" class="text-blue-500 hover:underline"
            href="https://energinet.dk/El/Elmarkedet/Tariffer/Aktuelle-tariffer/">forbrugstariffer</a> (Energinet, {{
                (forbrugstariffer * 100).toLocaleString() }} øre),
        <a target="_blank" class="text-blue-500 hover:underline"
            href="https://www.skm.dk/skattetal/satser/satser-og-beloebsgraenser-i-lovgivningen/elafgiftsloven/">elafgift</a>
        ({{ (elafgift * 100).toLocaleString() }} øre)
        og 25% moms. Afgifter er samlet {{ (((elafgift + forbrugstariffer) * 1.25)).toLocaleString("da-dk", {
            minimumFractionDigits: 2, maximumFractionDigits: 2
        }) }} kr. inkl. moms.
    </div>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import { computed, onMounted, ref } from "vue"
import { record } from "../../types";
import { getLastHours } from "../../util/util";
import Page3chart from "./Chart.vue";
import { elafgift, forbrugstariffer } from "../../util/prices";
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
    return max + 0.5
})
</script>

