<template>
    <div class="flex flex-col w-full max-w-xl px-2 pt-4 pb-3 bg-gray-900 border border-gray-700 rounded-xl">
        <div class="flex items-center justify-between px-3 font-semibold">
            <div class="text-base font-semibold text-center uppercase ">
                {{ dayjs(records[0].datetime).format("dddd") }}
            </div>
            <div class="flex items-center justify-center gap-1 leading-tight">
                <ArrowDownIcon class="w-4 text-green-500"></ArrowDownIcon>
                <div class="flex flex-col justify-center">
                    <div class="">
                        {{ Math.min(...records.map(item =>
                            item.totalPrice)).toLocaleString("da-dk", {
                                minimumFractionDigits: 2, maximumFractionDigits: 2
                            })
                        }}
                        kr.
                    </div>
                    <div class="text-[.5rem] text-gray-400">
                        Billigst
                    </div>
                </div>
            </div>
            <div class="flex flex-col justify-center leading-tight">
                <div>
                    {{ _avg }} kr.
                </div>
                <div class="text-[.5rem] text-gray-400">Gennemsnit</div>
            </div>
            <div class="flex items-center justify-center gap-1 leading-tight">
                <ArrowUpIcon class="w-4 text-red-500"></ArrowUpIcon>
                <div class="flex flex-col justify-center">
                    <div class="">
                        {{ Math.max(...records.map(item =>
                            item.totalPrice)).toLocaleString("da-dk", {
                                minimumFractionDigits: 2, maximumFractionDigits: 2
                            })
                        }}
                        kr.
                    </div>
                    <div class="text-[.5rem] text-gray-400">
                        Dyrest
                    </div>
                </div>
            </div>

        </div>
        <div class="flex h-40 mt-4 justify-evenly">
            <template v-for="(item, index) in records">
                <div class="h-full w-[2%] flex flex-col">
                    <div class="text-vertical text-[.5rem] mb-2 font-mono flex items-center"
                        :class="{ 'font-bold': isCurrentHour(item.datetime) }">
                        {{ (item.totalPrice).toLocaleString("da-dk", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })
                        }}</div>
                    <div class="flex flex-col justify-end h-full overflow-hidden bg-gray-700 rounded-full"
                        :class="{ 'border border-blue-600': isCurrentHour(item.datetime) }">
                        <div class="rounded-t-full" :style="`
                        height: ${barHeight(item.spotPrice)}%;
                                                background-color: hsl(${barColorHue(item.totalPrice)}, 70%, 40%)
                        `"></div>
                        <div class="rounded-b-md" :style="`
                        height: ${barHeight(item.afgift)}%;
                                                background-color: hsl(${barColorHue(item.totalPrice)}, 70%, 30%)
                        `"></div>
                    </div>
                    <div class="mt-2 font-mono text-[.5rem] flex justify-center">
                        {{ dayjs(item.datetime).format("HH") }}</div>
                </div>
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/vue/20/solid"
import { record } from '../../types';
import { avg, isCurrentHour } from '../../util/util'
import dayjs from "dayjs";
import da from "dayjs/locale/da";
dayjs.locale(da)

const props = defineProps<{
    records: record[],
    maxPrice: number
}>()
const _avg = avg(props.records.map(item => item.totalPrice)).toLocaleString("da-dk", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const barColorHue = (price: number): number => price > props.maxPrice ? 0 : 170 - (price / props.maxPrice * 120)

const barHeight = (price: number): number => price / props.maxPrice * 100
</script>

<style scoped>
.text-vertical {
    writing-mode: vertical-lr;
    text-orientation: mixed;
}
</style>