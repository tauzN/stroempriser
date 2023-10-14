
<template>
    <div class="flex flex-col items-stretch max-w-xs gap-4 mx-auto mt-10 text-center">
        <section>
            <label class="flex flex-col gap-2">
                <div>{{ batterySize }} kWh</div>
                <div class="flex w-full gap-x-2 ">
                    <button class="w-8 h-8 border border-gray-700 rounded-lg" @click="batterySize--">-</button>
                    <input class="w-full " type="range" max="100" v-model.number="batterySize">
                    <button class="w-8 h-8 border border-gray-700 rounded-lg " @click="batterySize++">+</button>
                </div>

                <div class="text-xs ">Capacity</div>
            </label>
        </section>

        <section>
            <label class="flex flex-col gap-2 ">
                <div>{{ stateOfCharge }} %</div>
                <div class="flex w-full gap-x-2 ">
                    <button class="w-8 h-8 border border-gray-700 rounded-lg" @click="stateOfCharge--">-</button>
                    <input class="w-full " type="range" name="" id="" max="100" v-model.number="stateOfCharge">
                    <button class="w-8 h-8 border border-gray-700 rounded-lg " @click="stateOfCharge++">+</button>
                </div>
                <div class="text-xs ">State of Charge</div>
            </label>
        </section>

        <section class="flex flex-col gap-4">
            <label>
                <div><input type="number" v-model.number="power" class="w-24 text-center bg-gray-900"> kW</div>
            </label>

            <div class="flex items-center justify-center gap-4">
                <template v-for="num in [
                    { text: '8 A', val: 8 *3* 230*0.9 },
                    { text: '16 A', val:  16*3*230*0.9},
                    { text: '95 kW', val: 95000 }
                ]">
                    <label class="w-1/4">
                        <input type="radio" name="power" class="hidden" :value="num.val" v-model.number="power" />
                        <div class="p-2 bg-gray-800 whitespace-nowrap">{{ num.text }}</div>
                    </label>
                </template>
            </div>
            <div class="text-xs ">Power</div>
        </section>

        <section>
            <label class="flex flex-col gap-2">
                <div>{{ wantedBattery }} %</div>
                <div class="flex w-full gap-x-2 ">
                    <button class="w-8 h-8 border border-gray-700 rounded-lg" @click="wantedBattery--">-</button>

                    <input class="w-full " type="range" v-model="wantedBattery" max="100">
                    <button class="w-8 h-8 border border-gray-700 rounded-lg " @click="wantedBattery++">+</button>
                </div>
                <div class="text-xs ">Limit</div>
            </label>
        </section>

        <div class="text-4xl font-medium">
            {{ Math.trunc(hoursToCharge) }}
            <span class="text-xs ">h</span>
            {{ Math.ceil((hoursToCharge * 60) % 60) }}
            <span class="text-xs ">m</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';
const batterySize = ref<number>(58)
const power = ref<number>(16*3*230*0.9)
const stateOfCharge = ref<number>(50)
const wantedBattery = ref<number>(100)
const hoursToCharge = computed<number>(() => {
    return ((wantedBattery.value - stateOfCharge.value) * (batterySize.value / 100) / (power.value / 1000))
})
watch(batterySize, value => {
    // console.log(value);
    localStorage.setItem("batterySize", value.toString())
})
watch(power, value => {
    // console.log(value);
    localStorage.setItem("power", value.toString())
})
watch(stateOfCharge, value => {
    // console.log(value);
    localStorage.setItem("stateOfCharge", value.toString())
})
watch(wantedBattery, value => {
    // console.log(value);
    localStorage.setItem("wantedBattery", value.toString())
})
onBeforeMount(() => {
    batterySize.value = Number(localStorage.getItem("batterySize")) || batterySize.value
    power.value = Number(localStorage.getItem("power")) || power.value
    stateOfCharge.value = Number(localStorage.getItem("stateOfCharge")) || stateOfCharge.value
    wantedBattery.value = Number(localStorage.getItem("wantedBattery")) || wantedBattery.value
})
</script>


<style scoped>
input,
select {
    @apply rounded border border-gray-700;
}

input[type="radio"]:checked~div {
    @apply bg-gray-900 border border-gray-700 rounded
}

section {
    @apply bg-gray-800 p-4 rounded
}
</style>