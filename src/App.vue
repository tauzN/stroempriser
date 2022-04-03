<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import colors from 'tailwindcss/colors'
import Chart from 'chart.js/auto';
import 'chartjs-adapter-dayjs-3';
import annotationPlugin from 'chartjs-plugin-annotation';
import { record } from './types'
import { getData, get30DayAvg } from './util'
import dayjs from 'dayjs';
import 'dayjs/locale/da'
Chart.register(annotationPlugin);
dayjs.locale('da')
// https://n1.dk/priser-og-vilkaar
const lavlast: number = 20.38
const spidslast: number = 62.66
const records = ref<record[] | null | undefined>(undefined)
const avg30days = ref<number>()
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
            tooltipFormat: "DD/M HH:mm",
            displayFormats: {
              hour: "HH"
            }
          }
        },
        y: {
          stacked: true,
          suggestedMax: 200
        }
      },
      plugins: {
        legend: {
          display: false
        },
        annotation: {
          annotations: {
            currentTime: {
              type: 'line',
              borderColor: colors.neutral[400],
              borderDash: [6, 6],
              borderWidth: 1,
              xScaleID: 'x',
              xMin: dayjs().startOf("hour").valueOf(),
              xMax: dayjs().startOf("hour").valueOf(),
              yMin: 0,
              yMax: 1000,
              yScaleID: 'y'
            },
            avgPrice: {
              type: 'line',
              borderColor: colors.blue[500],
              borderDash: [6, 6],
              borderWidth: 1,
              scaleID: 'y',
              value: avg30days.value
            }
          }
        }
      }
    },
    data: {
      labels: records.value.map(item => item.HourDK.toDate()),
      datasets: [
        {
          type: "bar",
          label: "N1 A/S Afgift",
          data: afgifter.value,
          backgroundColor: records.value.map(item => {
            if (prisMedAfgift(item) == Math.min(...priserMedAfgift.value.slice(2))) return colors.green[600]
            else if (prisMedAfgift(item) == Math.max(...priserMedAfgift.value.slice(2))) return colors.orange[800]
            else if (prisUdenAfgift(item) < avg30days.value * 0.5) return colors.green[700]
            else if (prisUdenAfgift(item) > avg30days.value * 1.2) return colors.orange[900]
            else return colors.neutral[700]
          })
        },
        {
          type: "bar",
          label: "Strømpris",
          borderRadius: 10,
          // borderWidth: records.value.map(item => {
          //   if (item.HourDK.isSame(dayjs(), "hour")) return 1
          // }),
          data: priserUdenAfgift.value,
          backgroundColor: records.value.map(item => {
            if (prisMedAfgift(item) == Math.min(...priserMedAfgift.value.slice(2))) return colors.green[500]
            else if (prisMedAfgift(item) == Math.max(...priserMedAfgift.value.slice(2))) return colors.orange[700]
            else if (prisUdenAfgift(item) < avg30days.value * 0.5) return colors.green[700]
            else if (prisUdenAfgift(item) > avg30days.value * 1.2) return colors.orange[900]
            else return colors.neutral[600]
          })
        }
      ]
    }
  })
}
onMounted(async () => {
  // if (dayjs().isAfter(lo))
  records.value = await getData();
  avg30days.value = await get30DayAvg();
  console.log(avg30days.value);
  
  drawChart();
})
</script>
<template>
  <div v-if="!records" class="h-screen flex items-center justify-center text-lg">
    <div v-if="records === undefined" class="animate-pulse">Henter data...</div>
    <div v-if="records === null">Fejl.</div>
  </div>
  <canvas class ref="chartRef"></canvas>
  <div class="p-4 text-sm flex gap-x-8 gap-y-2 items-center justify-center flex-wrap">
    <div class="flex items-center gap-x-2">
      <div class="bg-green-500 w-4 h-4"></div>
      <div>Billigst</div>
    </div>
    <div class="flex items-center gap-x-2">
      <div class="bg-green-600 w-4 h-4"></div>
      <div>50% under gns.</div>
    </div>
    <div class="flex items-center gap-x-2">
      <div class="bg-orange-700 w-4 h-4"></div>
      <div>20% over gns.</div>
    </div>
    <div class="flex items-center gap-x-2">
      <div class="bg-orange-600 w-4 h-4"></div>
      <div>Dyrest</div>
    </div>
    <div class="flex items-center gap-x-2">
      <div class="bg-blue-800 w-4 h-4"></div>
      <div>30 dages gns.</div>
    </div>
  </div>
</template>
