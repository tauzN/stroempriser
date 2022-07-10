<script setup lang="ts">
import { computed, ref } from 'vue';

const batterySize = ref<number>(32)
const power = ref<number>(2300)
const currentBattery = ref<number>(50.0)
const wantedBattery = ref<number>(80.0)
const hoursToCharge = computed<number>(() => {
    return ((wantedBattery.value - currentBattery.value) * (batterySize.value / 100) / (power.value / 1000))
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
                <select v-model.number="currentBattery" class="bg-black">
                    <template v-for="num in 100">
                        <option :value="num">{{num}}</option>
                    </template>
                </select>
                %
            </label>
        </section>
        <section class="flex flex-col">
            <h2>Strøm</h2>
            <div class="flex">
                <div class="w-1/2 flex items-center justify-center">
                    <label>
                        <input type="number" v-model="power" class="bg-black w-24">
                    </label>
                </div>
                <div class="w-1/2 flex flex-wrap">
                    <label class=" w-1/2">
                        <input type="radio" name="power" :value="5*230" v-model.number="power" />
                        <span class="w-16">5A</span>
                    </label>
                    <label class=" w-1/2">
                        <input type="radio" name="power" :value="10*230" v-model.number="power" />
                        <span class="w-16">10A</span>
                    </label>
                    <label class=" w-1/2">
                        <input type="radio" name="power" :value="7000" v-model.number="power" />
                        <span class="w-16">7kW</span>
                    </label>
                    <label class=" w-1/2">
                        <input type="radio" name="power" :value="40000" v-model.number="power" />
                        <span class="w-16">40kW</span>
                    </label>
                </div>
            </div>
        </section>
        <section class="flex flex-col">
            <h2>Opladning</h2>
            <div class=" flex">
                <div class="w-1/3 flex flex-col justify-around">
                    <label>
                        <select class="bg-black" v-model.number="wantedBattery">
                        <template v-for="num in 100">
                        <option :value="num">{{num}}</option>
                        </template>
                        </select>
                    </label>
                    <div>{{Math.round(batterySize*wantedBattery/100*7)}} km</div>
                    <div>({{Math.round(1000/7)}} Wh/km)</div>
                </div>
                <div class="w-2/3">
                    <label name="wantedbattery">
                        <input type="radio" :value="50" v-model.number="wantedBattery">
                        <span class="w-12">50</span>
                    </label>
                    <label name="wantedbattery">
                        <input type="radio" :value="60" v-model.number="wantedBattery">
                        <span class="w-12">60</span>
                    </label>
                    <label name="wantedbattery">
                        <input type="radio" :value="70" v-model.number="wantedBattery">
                        <span class="w-12">70</span>
                    </label>
                    <label name="wantedbattery">
                        <input type="radio" :value="80" v-model.number="wantedBattery">
                        <span class="w-12">80</span>
                    </label>
                    <label name="wantedbattery">
                        <input type="radio" :value="90" v-model.number="wantedBattery">
                        <span class="w-12">90</span>
                    </label>
                    <label name="wantedbattery">
                        <input type="radio" :value="100" v-model.number="wantedBattery">
                        <span class="w-12">100</span>
                    </label>
                </div>
            </div>
        </section>
        <section>

            <div class="font-semibold text-xl">
                {{ Math.round(hoursToCharge) }} timer {{ Math.round(hoursToCharge * 60 % 60) }} minutter
        </div>
            </section>
    </div>
</template>
<style scoped>
section {
    @apply bg-gray-800 rounded py-4 m-2 w-80
}

section h2 {
    @apply text-lg mb-2
}

input, select {
    @apply rounded border border-gray-700
}

input[type="radio"] {
    @apply hidden
}

input[type="radio"]~span {
    @apply inline-block p-2 border border-gray-600 mt-2 mx-2 bg-gray-800;
}

input[type="radio"]:checked~span {
    @apply text-white bg-gray-600;
}
</style>