<template>
    <div v-show="!records?.length" class="animate-pulse">Henter data...</div>
    <div v-if="records?.length" class="text-xs text-gray-300 font-mono">
        <template v-for="(item, index) in records">
            <div>
                <div class="absolute w-full h-4" :class="{'bg-gray-900/20': index%2!=0}"></div>
                <div v-if="isSameHourAsNow(item.datetime)"
                    class="absolute w-full bg-blue-500/80 h-px mt-2 animate-pulse">
                </div>
                <div class="flex pl-1 uppercase tracking-wide text-[.6rem]" v-if="index === 0">
                    <div>tid</div>
                    <div class="ml-4">pris</div>
                    <div class="ml-3" :style="`width: ${barLength(item.afgift)}%`">afgifter</div>
                    <div class="">spotpris</div>
                </div>
                <div v-else-if="dayjs(item.datetime).hour() === 0"
                    class="pl-1 text-center text-[.6rem] font-semibold uppercase tracking-widest mt-1 border-gray-700">
                    {{dayjs(item.datetime).format("dddd")}}
                </div>
                <div class="w-full flex" :class="{
                    'bg-green-500/20': item.totalPrice < min(records.map(item => item.totalPrice)) * 1.1,
                    'bg-red-500/20': item.totalPrice > max(records.map(item => item.totalPrice)) * 0.90
                }">
                    <div class="w-full z-30 flex items-center">
                        <div class="pl-1">{{dayjs(item.datetime).format("HH")}}</div>
                        <div class="pl-4">
                            {{(item.totalPrice).toLocaleString("da-dk",
                            {minimumFractionDigits:2, maximumFractionDigits:2})}}
                        </div>
                        <div class="ml-2 h-3 rounded-l-md" :style="`
                        background-color: hsl(${barColorHue(item.totalPrice)}, 60%, 35%);
                        width: ${barLength(item.afgift)}%;
                        `">
                        </div>
                        <div class="h-3 rounded-r-md" :style="`
                        width: ${barLength(item.spotPrice)}%;
                        background-color: hsl(${barColorHue(item.totalPrice)}, 60%, 40%);
                        `">
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import * as da from "dayjs/locale/da";
import { computed, onBeforeMount, ref } from 'vue';
import { record } from './types';
import { getLastHours } from './util';
dayjs.locale(da)
const maxPrice = computed(() => {
    if (records.value) {
        let temp = max(records.value?.map(item => item.totalPrice))
        if (temp > 8) return temp+1
        return 8
    }
    return 1
})
const records = ref<record[]>()
onBeforeMount(async () => {
    records.value = await getLastHours(36)
})
const min = (prices: number[]): number => Math.min(...prices)
const max = (prices: number[]): number => Math.max(...prices)
const isSameHourAsNow = (datetime: Date): boolean => dayjs().isSame(dayjs(datetime), "hour")
const barColorHue = (price: number): number => (170 - price / maxPrice.value * 200)
const barLength = (price: number): number => (price) / maxPrice.value * 100
</script>