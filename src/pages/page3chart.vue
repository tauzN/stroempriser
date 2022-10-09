<template>
    <div class="bg-gray-800 px-2 py-4 rounded-xl flex flex-col w-full max-w-lg ">
        <div class="flex justify-around items-center font-semibold">
            <div class="text-center text-base font-semibold uppercase ">
                {{dayjs(records[0].datetime).format("dddd")}}
            </div>
            <div class="flex gap-1 justify-center items-center leading-tight">
                <ArrowDownIcon class="w-4 text-green-500"></ArrowDownIcon>
                <div class="flex flex-col justify-center">
                    <div class="">
                        {{Math.min(...records.map(item =>
                        item.totalPrice)).toLocaleString("da-dk",{minimumFractionDigits:2, maximumFractionDigits:2})}}
                        kr.
                    </div>
                    <div class="text-[.5rem] text-gray-400">
                        Billigste
                    </div>
                </div>
            </div>
            <div class="flex flex-col justify-center  leading-tight">
                <div>
                    {{_avg}} kr.
                </div>
                <div class="text-[.5rem] text-gray-400">Gennemsnit</div>
            </div>
            <div class="flex gap-1 justify-center items-center leading-tight">
                <ArrowUpIcon class="w-4 text-red-500"></ArrowUpIcon>
                <div class="flex flex-col justify-center">
                    <div class="">
                        {{Math.max(...records.map(item =>
                        item.totalPrice)).toLocaleString("da-dk",{minimumFractionDigits:2, maximumFractionDigits:2})}}
                        kr.
                    </div>
                    <div class="text-[.5rem] text-gray-400">
                        Dyrest
                    </div>
                </div>
            </div>

        </div>
        <div class="flex justify-evenly h-40 mt-4">
            <template v-for="item in records">
                <div class="h-full w-[2%] flex flex-col">
                    <div class="text-vertical text-[.5rem] mb-1 font-mono flex items-center"
                        :class="{'font-bold': isCurrentHour(item.datetime)}">
                        {{(item.totalPrice).toLocaleString("da-dk", {minimumFractionDigits:2,
                        maximumFractionDigits:2})}}</div>
                    <div class="h-full rounded-full flex flex-col justify-end overflow-hidden" :class="barColor(item)">
                        <div class="rounded-t-full" :style="`
                        height: ${barHeight(item.spotPrice)}%;
                        background-color: hsl(${barColorHue(item.totalPrice)}, 60%, 40%)
                        `"></div>
                        <div class="rounded-b-md" :style="`
                        height: ${barHeight(item.afgift)}%;
                        background-color: hsl(${barColorHue(item.totalPrice)}, 60%, 35%)
                        `"></div>
                    </div>
                    <div class="font-mono text-[.5rem] flex justify-center">{{dayjs(item.datetime).format("HH")}}</div>
                </div>
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/vue/20/solid"
import { computed } from 'vue';
import { record } from '../types';
import { avg, isCurrentHour } from '../util'
import dayjs from "dayjs";
import da from "dayjs/locale/da";
dayjs.locale(da)

const props = defineProps<{
    records: record[]
}>()
const _avg = avg(props.records.map(item => item.totalPrice)).toLocaleString("da-dk", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const maxPrice = computed(() => {
    let max = 0;
    if (props.records) {
        max = Math.max(...props.records.map(item => item.totalPrice))
    }
    if (max < 8) return 8
    else return max
})
const barColorHue = (price: number): number => (170 - price / maxPrice.value * 200)
const barHeight = (price: number): number => price / maxPrice.value * 100
const barColor = (record: record) => {
    if (isCurrentHour(record.datetime)) return "bg-blue-500/40 animate-pulse"
    if (record.totalPrice < Math.min(...props.records.map(item => item.totalPrice)) * 1.01) return "bg-green-500/20"
    if (record.totalPrice > Math.max(...props.records.map(item => item.totalPrice)) * .99) return "bg-red-500/20"
    else return "bg-gray-700"
}
</script>

<style scoped>
.text-vertical {
    writing-mode: vertical-lr;
    text-orientation: mixed;
}
</style>