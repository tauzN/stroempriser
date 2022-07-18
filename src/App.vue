<script setup lang="ts">
import { ref, onMounted, computed, watch, onBeforeMount } from 'vue'
import { record } from './types'
import { getLastDays, avg } from './util'
import dayjs from 'dayjs';
import 'dayjs/locale/da'
import { afgifter } from './prices'
import Chart from './Chart.vue';
dayjs.locale('da')
const records = ref<record[] | null | undefined>(undefined)
const avgPrice = computed(() => {
  if (!records.value) return 0
  return Math.round(avg(records.value.map(item => item.price + afgifter)) * 100) / 100
})
const last36Hours = () => records.value ? records.value.slice(-36) : []
const visMedAfgifter = ref<boolean>(false)
watch(visMedAfgifter, value =>{
  localStorage.setItem("visMedAfgifter", JSON.stringify(value))
})
onBeforeMount(async()=> {
  visMedAfgifter.value = JSON.parse(localStorage.getItem("visMedAfgifter") as string) || visMedAfgifter.value
  records.value = await getLastDays(30);
})
</script>
<template>
  <div class="p-4">
    <div class="p-4 text-xs flex gap-x-8 gap-y-2 items-center justify-center flex-wrap">
      <div class="flex items-center gap-x-2">
        <div class="bg-green-600 w-2 h-4"></div>
        <div>60% under gns.</div>
      </div>
      <div class="flex items-center gap-x-2">
        <div class="bg-orange-900 w-2 h-4"></div>
        <div>20% over gns.</div>
      </div>
      <div class="flex items-center gap-x-2">
        <div class="bg-gray-500 w-3 h-1"></div>
        <div>Afgifter ({{ afgifter.toLocaleString("da-dk") }} kr.)</div>
      </div>
      <div class="flex items-center gap-x-2">
        <div class="bg-blue-600 w-4 h-1"></div>
        <div>30 dages gns. ({{ avgPrice.toLocaleString("da-dk") }} kr.)
        </div>
      </div>
    </div>
    <div v-if="!records" class="h-screen flex items-center justify-center text-lg">
      <div v-if="records === undefined" class="animate-pulse">Henter data...</div>
      <div v-if="records === null">Fejl.</div>
    </div>
    <div v-if="records">
    <label class="flex items-center justify-center gap-x-2">
      <span>
        Med afgifter
        <input type="checkbox" name="afgifter" v-model="visMedAfgifter">
      </span>
    </label>
    <div v-if="!visMedAfgifter">
      <Chart :records="last36Hours()" :afgifter="0" :avgPrice="avgPrice - afgifter"></Chart>
    </div>
    <div v-if="visMedAfgifter">
      <Chart :records="last36Hours()" :afgifter="afgifter" :avgPrice="avgPrice"></Chart>
    </div>
    </div>
  </div>
</template>
