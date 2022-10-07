<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';
const batterySize = ref<number>(32)
const power = ref<number>(2300)
const stateOfCharge = ref<number>(50.0)
const wantedBattery = ref<number>(80.0)
const hoursToCharge = computed<number>(() => {
    return ((wantedBattery.value - stateOfCharge.value) * (batterySize.value / 100) / (power.value / 1000))
})
watch(batterySize, value => {
    console.log(value);
    localStorage.setItem("batterySize", value.toString())
})
watch(power, value => {
    console.log(value);
    localStorage.setItem("power", value.toString())
})
watch(stateOfCharge, value => {
    console.log(value);
    localStorage.setItem("stateOfCharge", value.toString())
})
watch(wantedBattery, value => {
    console.log(value);
    localStorage.setItem("wantedBattery", value.toString())
})
onBeforeMount(() => {
    batterySize.value = Number(localStorage.getItem("batterySize")) || batterySize.value
    power.value = Number(localStorage.getItem("power")) || power.value
    stateOfCharge.value = Number(localStorage.getItem("stateOfCharge")) || stateOfCharge.value
    wantedBattery.value = Number(localStorage.getItem("wantedBattery")) || wantedBattery.value
})
</script>
<template>
    <div class="text-center flex flex-col items-center justify-center">
        <section class=" flex flex-col">
            <h2>Batteri</h2>
            <label>
                Kapacitet
                <input type="number" v-model="batterySize" class="bg-black w-24"> kWh
            </label>
            <label>
                State of Charge
                <select v-model.number="stateOfCharge" class="bg-black">
                    <template v-for="num in 100">
                        <option :value="num">{{ num }}</option>
                    </template>
                </select>
                %
            </label>
        </section>
        <section class="">
            <h2>Strøm</h2>
            <div class="flex">
                <div class="w-1/3 flex items-center justify-center">
                    <label>
                        <input type="number" v-model.number="power" class="bg-black w-24">
                    </label>
                </div>
                <div class="w-2/3 flex flex-wrap">
                    <template v-for="num in [
                        { text: '5 A', val: 5 * 230 },
                        { text: '10 A', val: 10 * 230 },
                        { text: '7 kW', val: 7000 },
                        { text: '40 kW', val: 40000 }
                    ]">
                        <label class=" w-1/2">
                            <input type="radio" name="power" :value="num.val" v-model.number="power" />
                            <span class="w-20">{{ num.text }}</span>
                        </label>
                    </template>
                </div>
            </div>
        </section>
        <section class="">
            <h2>Opladning</h2>
            <div class=" flex">
                <div class="w-1/3 flex flex-col justify-around">
                    <label>
                        <select class="bg-black" v-model.number="wantedBattery">
                            <template v-for="num in 100">
                                <option :value="num">{{ num }}</option>
                            </template>
                        </select>
                    </label>
                    <div class="text-xs">{{ Math.round(batterySize * wantedBattery / 100 * 7) }} km</div>
                    <div class="text-xs">({{ Math.round(1000 / 7) }} Wh/km)</div>
                </div>
                <div class="w-2/3">
                    <template v-for="num in [50, 60, 70, 80, 90, 100]">
                        <label>
                            <input type="radio" name="wantedbattery" :value="num" v-model.number="wantedBattery">
                            <span class="w-12">{{ num }}</span>
                        </label>
                    </template>
                </div>
            </div>
        </section>
        <section>

            <div class="font-semibold text-xl">
                {{ Math.trunc(hoursToCharge) }} {{ Math.trunc(hoursToCharge) === 1 ? 'time' : 'timer' }} {{
                        Math.ceil((hoursToCharge * 60) % 60)
                }} minutter
            </div>
        </section>
    </div>
</template>
<style scoped>
section {
    @apply bg-gray-900 rounded py-4 m-2 w-80;
}

section h2 {
    @apply text-lg mb-2;
}

input,
select {
    @apply rounded border border-gray-700;
}

input[type="radio"] {
    @apply hidden;
}

input[type="radio"]~span {
    @apply inline-block p-1 border border-gray-600 m-2 bg-gray-800;
}

input[type="radio"]:checked~span {
    @apply text-white bg-gray-600;
}
</style>