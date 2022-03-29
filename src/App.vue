<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import colors from 'tailwindcss/colors'
import Chart from 'chart.js/auto';
import 'chartjs-adapter-dayjs-3';
import { record } from './types'
import { getData } from './util'
import dayjs from 'dayjs';
import 'dayjs/locale/da'
dayjs.locale('da')
// https://n1.dk/priser-og-vilkaar
const lavlast: number = 20.38
const spidslast: number = 62.66
const records = ref<record[] | null | undefined>(undefined)
// SpotPriceDKK er i DKK/MWh og SpotPriceDKK er null i weekenden og omregnes derfor fra SpotPriceEUR
// Der omregnet her til øre/KWh
const prisUdenAfgift = (record: record): number => record.SpotPriceDKK / 1_000 * 100 || record.SpotPriceEUR * 7.44 / 1_000 * 100
// Spidslast: Alle dage i perioden oktober-marts kl. 17-20.
// Lavlast: Alle dage i perioden april-september og alle dage i perioden oktober-marts kl. 00-17 og kl. 20-24.
const prisMedAfgift = (record: record): number => (record.HourDK.month() >= 10 - 1 || record.HourDK.month() <= 3 - 1) && (record.HourDK.hour() >= 17 && record.HourDK.hour() < 20)
  ? prisUdenAfgift(record) + spidslast
  : prisUdenAfgift(record) + lavlast
const priserUdenAfgift = computed<number[]>(() => records.value.map(item => prisUdenAfgift(item)))
const priserMedAfgift = computed<number[]>(() => records.value.map(item => prisMedAfgift(item)))
const afgifter = computed<number[]>(() => records.value.map(item => prisMedAfgift(item) - prisUdenAfgift(item)))
const avg = (array: number[]): number => array.reduce((previousValue, currentValue) => (previousValue + currentValue / array.length), 0);
const chartRef = ref(null)
const drawChart = () => {
  new Chart(chartRef.value, {
    type: "bar",
    options: {
      locale: "da-dk",
      scales: {
        x: {
          stacked: true,
          type: "time",
          time: {
            unit: "hour",
            tooltipFormat: "HH",
            displayFormats: {
              hour: "HH"
            }
          }
        },
        y: {
          stacked: true,
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    },
    data: {
      labels: records.value.map(item => item.HourDK.toDate()),
      datasets: [
        {
          type: "line",
          pointRadius: 0,
          borderWidth: 2,
          label: "Gennemsnit",
          data: [undefined, undefined, ...records.value.map(() => avg(priserMedAfgift.value))],
          fill: false,
          borderColor: colors.blue[800],
          stack: "1"
        },
        {
          type: "bar",
          label: "Afgift",
          stack: "bar",
          data: afgifter.value,
          backgroundColor: records.value.map(item => {
            if (prisMedAfgift(item) < Math.min(...priserMedAfgift.value.slice(2)) * 1.2) return colors.green[700]
            else if (prisMedAfgift(item) > Math.max(...priserMedAfgift.value.slice(2)) * 0.8) return colors.orange[900]
            else return colors.neutral[700]
          })
        },
        {
          type: "bar",
          label: "Strømpris",
          stack: "bar",
          borderRadius: 10,
          borderWidth: records.value.map(item => {
            if (item.HourDK.isSame(dayjs(), "hour")) return 1
          }),
          data: priserUdenAfgift.value,
          backgroundColor: records.value.map(item => {
            if (item.HourDK.isSame(dayjs(), "hour")) return colors.neutral[400]
            else if (prisMedAfgift(item) < Math.min(...priserMedAfgift.value.slice(2)) * 1.2) return colors.green[600]
            else if (prisMedAfgift(item) > Math.max(...priserMedAfgift.value.slice(2)) * 0.8) return colors.orange[800]
            else return colors.neutral[600]
          })
        }
      ]
    }
  })
}
onMounted(async () => {
  records.value = await getData()
  drawChart()
})
</script>
<template>
  <div v-if="!records" class="h-screen flex items-center justify-center text-lg">
    <div v-if="records === undefined" class="animate-pulse">Henter data...</div>
    <div v-if="records === null">Fejl.</div>
  </div>
  <canvas ref="chartRef"></canvas>
  <div class=" flex items-center  space-x-6"><div class="bg-green-600 w-6 h-6"></div><div>Nedre 20%</div></div>
  <div class=" flex items-center  space-x-6"><div class="bg-orange-700 w-6 h-6"></div><div>Øvre 20%</div></div>
  <div class=" flex items-center  space-x-6"><div class="bg-blue-800 w-6 h-6"></div><div>Gennemsnit</div></div>
</template>
