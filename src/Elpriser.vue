<template>
    <div class=" text-[10px] p-2 font-mono">
        <template v-for="item in prices?.slice(prices.length-36)">
            <div class=" w-full flex "
                :class="{'bg-gray-500/30': dayjs().startOf('hour').isSame(dayjs(item.datetime).startOf('hour'))}">
                <div class="w-8 flex items-center justify-center">
                    <div class="">{{dayjs(item.datetime).format("HH")}}</div>
                </div>
                <div class="w-full">
                    <div class=" rounded-full pl-2 my-[1px]"
                        :class="{'animate-pulse': dayjs().startOf('hour').isSame(dayjs(item.datetime).startOf('hour'))}"
                        :style="`background-color: hsl(${120 - (afgifter  + item.price) / maxPrice * 120} 60% 40%); ` + `width: ${(afgifter  + item.price)/maxPrice*100}%`">
                        {{(afgifter  + item.price).toLocaleString("da-dk",
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
</script>