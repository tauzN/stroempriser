<template>
    <div class=" text-[10px] p-2 font-mono">
        <div v-show="!prices?.length" class=" animate-pulse">Henter data...</div>
        <template v-for="item in prices?.slice(prices.length-36)">
            <div class="w-full flex items-center justify-center"
                :class="{'bg-green-700/30': isSameHour(item.datetime)}">
                <div class="w-8 flex items-center justify-center">
                    <div class="">{{dayjs(item.datetime).format("HH")}}</div>
                </div>
                <div class="w-full py-[1px]">
                    <div class=" rounded-r-full pl-2" :class="{'animate-pulse': isSameHour(item.datetime)}"
                        :style="`background-color: ${barColor(item.price)}; ` + `width: ${barLength(item.price)}%`">
                        {{(afgifter + item.price).toLocaleString("da-dk",
                        {minimumFractionDigits:2, maximumFractionDigits:2})}}
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import { computed, onMounted, ref } from 'vue';
import { afgifter } from './prices';
import { record } from './types';
import { getLastDays } from './util';
const maxPrice = computed(() => {
    if (!prices.value) return 10
    else return Math.max(...prices.value.slice(prices.value.length - 36).map(item => item.price + afgifter))
})
const prices = ref<record[]>()
onMounted(async () => {
    prices.value = await getLastDays(30)
})
const isSameHour = (datetime: Date): boolean => dayjs().startOf('hour').isSame(dayjs(datetime).startOf('hour'))
const barColor = (price: number): string => `hsl(${120 - (afgifter + price) / maxPrice.value * 120} 60% 40%)`
const barLength = (price: number): number => (afgifter + price) / maxPrice.value * 100
</script>