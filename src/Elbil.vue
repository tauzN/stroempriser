<script setup lang="ts">
import { computed, ref } from 'vue';

const batterySize = ref<number>(32)
const power = ref<number>(2300)
const currentBattery = ref<number>(50.0)
const wantedBattery = ref<number>(80.0)
const hoursToCharge = computed<number>(() => {
    return ((wantedBattery.value - currentBattery.value) * (batterySize.value/100) / (power.value/1000))
})
</script>
<template>
    <div class="text-center">
        <div>
            <label>
                <div>
                    Batteri
                </div>
                <input type="number" v-model="batterySize" class="bg-black w-24"> kW
            </label>
        </div>
        <div>
            <label>
                <div>
                    Strøm
                </div>
                <input type="number" v-model="power" class="bg-black w-24"> W
            </label>
        </div>
        <div>
            <label>
                <div>
                    Nuværende batteri
                </div>
                <input type="number" v-model="currentBattery" class="bg-black w-24"> %
            </label>
        </div>
        <div>
            <label>
                <div>Ønsket batteri</div>
                <input type="number" v-model="wantedBattery" class="bg-black w-24"> %
            </label>
        </div>
        <div class="font-semibold">
            {{ Math.round(hoursToCharge) }} timer {{ Math.round(hoursToCharge * 60 % 60) }} minutter
        </div>
    </div>
</template>
<style scoped>
</style>