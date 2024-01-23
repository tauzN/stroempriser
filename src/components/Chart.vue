<template>
    <div class="flex flex-col p-4 border border-gray-700 rounded-lg ">
        <div class="flex justify-between ">
            <div
                class="pb-2 font-semibold tracking-wider text-gray-300 uppercase text-md">
                {{
                    dayjs(props.records[0].datetime).format("dddd") }}</div>
            <div>{{ Math.min(...records.map(r => r.price)) }}</div>
            <div>{{ Math.min(...records.map(r => r.price)) }}</div>
            <div>{{ Math.max(...records.map(r => r.price)) }}</div>
        </div>
        <div class="flex gap-0.5">
            <div class="flex flex-col items-center justify-end "
                v-for="record in records">
                <div class="pb-2 font-mono text-[0.5rem] text-gray-300 text-vertical "
                    :class="{ 'font-bold': dayjs(record.datetime).isSame(dayjs(), 'hour') }">
                    {{ ((afgiftFromDate(record.datetime) + record.price) *
                        1.25).toFixed(2) }}
                </div>
                <div class="flex flex-col justify-end w-2 overflow-hidden bg-gray-900 rounded-full h-36"
                    :class="{ 'bg-blue-800 animate-pulse': dayjs(record.datetime).isSame(dayjs(), 'hour') }">
                    <div class="rounded-t-full"
                        :style="`height: ${height(record)}%; background-color: hsl(${barColorHue(record)}, 100%, 30%)`">
                    </div>
                </div>
                <div class="pt-2 font-mono text-gray-300 text-[0.5rem] text-center "
                    :class="{ 'font-bold': dayjs(record.datetime).isSame(dayjs(), 'hour') }">
                    {{ dayjs(record.datetime).format("HH") }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { afgiftFromDate } from '@/prices';
import { Record } from '@/types';
import dayjs from 'dayjs';

const props = defineProps<{
    records: Record[],
    maxPrice: number
}>()

const height = (record: Record): number => (afgiftFromDate(record.datetime) + record.price) / props.maxPrice * 100


const barColorHue = (record: Record): number => {
    if ((afgiftFromDate(record.datetime) + record.price) > props.maxPrice) {
        return 0
    }
    else {
        return 170 - ((afgiftFromDate(record.datetime) + record.price) / props.maxPrice * 150)
    }
}


</script>

<style scoped>
.text-vertical {
    writing-mode: vertical-lr;
    text-orientation: mixed;
}
</style>