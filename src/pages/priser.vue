<template>
    
    <div class="flex flex-col items-center gap-2 m-2">
        <Chart v-if="records" :maxPrice="maxPrice" :records="records.slice(0, 24)"></Chart>
        <Chart v-if="records" :maxPrice="maxPrice" :records="records.slice(24, 48)"></Chart>
    </div>
    <div class="flex justify-center pt-4">
        <div v-show="records === undefined">Loading ...</div>

        <button class="px-3 py-2 border border-gray-700 rounded-lg" :onClick="reloadPrices">Relaod</button>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { getPrices } from '@/api/energidataservice'
import { Record } from '@/types';
import Chart from '@/components/Chart.vue';
import { afgiftFromDate } from '@/prices';

const records = ref<Record[]>()

//const maxPrice = () => Math.max(records.value?.map<number>(_ => {return 0}))

const maxPrice = computed(() => {
    if (records.value !== undefined) {
        return Math.max(...records.value.map(record => (afgiftFromDate(record.datetime) + record.price))) + 0.5
    }
})

onMounted(async () => {
    records.value = (await getPrices()).reverse()
})

const reloadPrices = async () => {
    records.value = undefined;
    localStorage.removeItem("prices")
    records.value = (await getPrices()).reverse()
}
</script>