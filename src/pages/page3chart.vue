<template>
            <div class="bg-gray-800 px-2 py-4 rounded-xl">
            <div class=" flex justify-evenly font-semibold">
                <div>Gns. {{_avg}}</div>
                <div class="text-center font-semibold uppercase tracking-widest">
                    {{dayjs(records[0].datetime).format("dddd")}}
                </div>
                <div>Min. {{Math.min(...records.map(item => item.totalPrice)).toLocaleString("da-dk", {minimumFractionDigits:2, maximumFractionDigits:2})}}</div>
            </div>
            <div class="flex justify-evenly h-40 mt-4">
                <template v-for="item in records">
                    <div class="h-full w-[2%] flex flex-col">
                        <div class="text-vertical text-[.5rem] mb-1 font-mono flex items-center" :class="{'font-bold': isSameHourAsNow(item.datetime)}">
                            {{(item.totalPrice).toLocaleString("da-dk", {minimumFractionDigits:2, maximumFractionDigits:2})}}</div>
                        <div class="h-full rounded-full flex flex-col justify-end overflow-hidden"
                            :class="[{'bg-blue-500/40 animate-pulse':isSameHourAsNow(item.datetime)}, barColor(item.totalPrice)]">
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
import { computed } from 'vue';
import { record } from '../types';
import {avg} from '../util'
import dayjs from "dayjs";
import da from "dayjs/locale/da";
dayjs.locale(da)

const props = defineProps<{
    records: record[]
}>()
const _avg = avg(props.records.map(item => item.totalPrice)).toLocaleString("da-dk", {minimumFractionDigits:2, maximumFractionDigits:2})
const maxPrice = computed(() => {
    let max = 0;
    if (props.records) {
        max = Math.max(...props.records.map(item => item.totalPrice))
    }
    if (max < 8) return 8
    else return max
})
const isSameHourAsNow = (datetime: Date): boolean => dayjs().isSame(dayjs(datetime), "hour")
const barColorHue = (price: number): number => (170 - price / maxPrice.value * 200)
const barHeight = (price: number): number => price / maxPrice.value * 100
const barColor = (price) => {
    if (price < Math.min(...props.records.map(item => item.totalPrice))*1.01) return "bg-green-500/20"
    if (price > Math.max(...props.records.map(item => item.totalPrice))*.99) return "bg-red-500/20"
    else return "bg-gray-700"
}
</script>

<style scoped>
.text-vertical {
    writing-mode: vertical-lr;
    text-orientation: mixed;
}
</style>