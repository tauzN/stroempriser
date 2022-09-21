<template>
    <div class=" text-[10px] p-2 font-mono">
        <div v-show="!prices?.length" class=" animate-pulse">Henter data...</div>
        <template v-for="item in last36Hours">
            <div class="w-full flex items-center justify-center">
                <div class="w-8 flex items-center justify-center z-40">
                    <div class="">{{dayjs(item.datetime).format("HH")}}</div>
                </div>
                <div class="w-full py-[1px] z-30">
                    <div class=" rounded-r-full pl-2 flex  justify-between"
                        :style="`background-color: ${barColor(item.price)}; ` + `width: ${barLength(item.price)}%`">
                        <span>
                            {{(afgifter + item.price).toLocaleString("da-dk",
                            {minimumFractionDigits:2, maximumFractionDigits:2})}}
                        </span>
                        <span v-if="item.price === min(last36Hours.map(item => item.price))"
                            class="pr-2">Billigst</span>
                        <span v-if="item.price === max(last36Hours.map(item => item.price))" class="pr-2">Dyrest</span>
                    </div>
                </div>
                <div class="absolute border-t w-full border-blue-400/50 z-20 animate-pulse"
                    v-if="isSameHour(item.datetime)"></div>
                <div class="absolute h-4 w-full z-20 opacity-30" :style="'background-color: ' + barColor(item.price)"
                    v-if="item.price === min(last36Hours.map(item => item.price))"></div>
                <div class="absolute h-4 w-full z-20 opacity-30" :style="'background-color: ' + barColor(item.price)"
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
const barColor = (price: number): string => `hsl(${120 - (afgifter + price) / maxPrice.value * 120} 60% 40%)`
const barLength = (price: number): number => (afgifter + price) / maxPrice.value * 90
</script>