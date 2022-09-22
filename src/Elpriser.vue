<template>
    <div class=" text-xs p-2 font-mono">
        <div v-show="!prices?.length" class=" animate-pulse">Henter data...</div>
        <template v-for="item in last36Hours">
            <div class="w-full flex items-center justify-center">
                <div class="w-8 flex items-center justify-center z-40">
                    <div class="">{{dayjs(item.datetime).format("HH")}}</div>
                </div>
                <div class="w-full z-30">
                    <div class=" rounded-r-full border-r-2 pl-2 flex  justify-between"
                        :style="`border-color: hsl(${barColorHue(item.price)} 60% 40%);
                        width: ${barLength(item.price)}%;
                        background-color: hsla(${barColorHue(item.price)}, 60%, 40%, .3);
                        
                        `">
                        <span>
                            {{(afgifter + item.price).toLocaleString("da-dk",
                            {minimumFractionDigits:2, maximumFractionDigits:2})}}
                        </span>
                        <span v-if="isSameHour(item.datetime)" class="pr-2">Nu</span>
                    </div>
                </div>
                <div class="absolute h-4 w-full bg-blue-400/30 z-20 animate-pulse"
                    v-if="isSameHour(item.datetime)"></div>
                <div class="absolute h-4 w-full z-20 opacity-20" :style="`background-color: hsl(${barColorHue(item.price)} 60% 40%)`"
                    v-if="item.price === min(last36Hours.map(item => item.price))"></div>
                <div class="absolute h-4 w-full z-20 opacity-20" :style="`background-color: hsl(${barColorHue(item.price)} 60% 40%)`"
                    v-if="item.price === max(last36Hours.map(item => item.price))">
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
const last36Hours = computed(() => {
    if (!prices.value) return []
    return prices.value?.slice(prices.value.length - 36)
})
const prices = ref<record[]>()
onMounted(async () => {
    prices.value = await getLastDays(30)
    setInterval(() => {

    }, 1000)
})
const min = (prices: number[]): number => Math.min(...prices)
const max = (prices: number[]): number => Math.max(...prices)
const isSameHour = (datetime: Date): boolean => dayjs().startOf('hour').isSame(dayjs(datetime).startOf('hour'))
const barColorHue = (price: number): number => (120 - (afgifter + price) / maxPrice.value * 120)
const barLength = (price: number): number => (afgifter + price) / maxPrice.value * 90
</script>