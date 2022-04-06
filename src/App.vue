<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import colors from 'tailwindcss/colors'
import Chart from 'chart.js/auto';
import 'chartjs-adapter-dayjs-3';
import annotationPlugin from 'chartjs-plugin-annotation';
import { record } from './types'
import { getLastDays, AvgRecordPrice } from './util'
import dayjs from 'dayjs';
import 'dayjs/locale/da'
Chart.register(annotationPlugin);
dayjs.locale('da')
const records = ref<record[] | null | undefined>(undefined)
// https://n1.dk/priser-og-vilkaar
// Lavlast: Alle dage i perioden april-september og alle dage i perioden oktober-marts kl. 00-17 og kl. 20-24.
// Spidslast: Alle dage i perioden oktober-marts kl. 17-20.
const lavlast: number = 20.38
const spidslast: number = 62.66
const afgift = (record: record): number => (dayjs(record.datetime).month() >= 10 - 1 || dayjs
  (record.datetime).month() <= 3 - 1) && (dayjs(record.datetime).hour() >= 17 && dayjs(record.datetime).hour() < 20)
  ? spidslast
  : lavlast
const chartRef = ref(null)
const avg = computed(() => {
  if (records.value != undefined) return AvgRecordPrice(records.value)
  else return ""
  })
const last48Hours = () => records.value.slice(-36)
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
            tooltipFormat: "dddd [kl.] HH:mm",
            displayFormats: {
              hour: "HH"
            }
          }
        },
        y: {
          stacked: true,
          suggestedMax: 50 + Math.max(...last48Hours().map(item => item.price))
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
              borderColor: colors.neutral[200] + "CC",
              // borderDash: [6, 6],
              borderWidth: 2,
              xScaleID: 'x',
              xMin: dayjs().add(30, "minutes").valueOf(),
              xMax: dayjs().add(30, "minutes").valueOf(),
              yMin: 0,
              yMax: Math.max(...last48Hours().map(item => item.price))+30,
              yScaleID: 'y',
              label: {
                enabled: true,
                content: dayjs().format("HH:mm"),
                backgroundColor: colors.neutral[200] + "CC",
                color: colors.neutral[800],
                position: "end",
              }
            },
            avgPrice: {
              type: 'line',
              borderColor: colors.blue[500],
              borderDash: [8, 8],
              borderWidth: 1,
              scaleID: 'y',
              value: AvgRecordPrice(records.value),
            }
          }
        }
      }
    },
    data: {
      labels: last48Hours().map(item => item.datetime),
      datasets: [
        {
          type: "bar",
          label: "N1 A/S Afgift",
          data: last48Hours().map(item => afgift(item)),
          backgroundColor: last48Hours().map(item => {
            if (item.price < AvgRecordPrice(records.value) * 0.5) return colors.green[800]
            else if (item.price > AvgRecordPrice(records.value) * 1.2) return colors.orange[900]
            else return colors.neutral[700]
          })
        },
        {
          type: "bar",
          label: "Strømpris",
          borderRadius: 5,
          data: last48Hours().map(item => item.price),
          backgroundColor: last48Hours().map(item => {
            if (item.price < AvgRecordPrice(records.value) * 0.5) return colors.green[700]
            else if (item.price > AvgRecordPrice(records.value) * 1.2) return colors.orange[800]
            else return colors.neutral[600]
          })
        }
      ]
    }
  })
}
onMounted(async () => {
  records.value = await getLastDays(30);
  drawChart();
})
</script>
<template>
<div class="text-center text-sm mt-4 pb-4" v-if="records">Viser priser fra <b>{{dayjs(last48Hours()[0].datetime).format("dddd [kl.] HH:mm")}}</b> til <b>{{dayjs(last48Hours()[last48Hours().length-1].datetime).add(1, "hour").format("dddd [kl.] HH:mm")}}</b></div>
  <div v-if="!records" class="h-screen flex items-center justify-center text-lg">
    <div v-if="records === undefined" class="animate-pulse">Henter data...</div>
    <div v-if="records === null">Fejl.</div>
  </div>
  <canvas class ref="chartRef"></canvas>
  <div class="p-4 text-sm flex gap-x-8 gap-y-2 items-center justify-center flex-wrap">
    <!-- <div class="flex items-center gap-x-2">
      <div class="bg-green-500 w-4 h-4"></div>
      <div>Billigst</div>
    </div>-->
    <div class="flex items-center gap-x-2">
      <div class="bg-green-600 w-4 h-4"></div>
      <div>50% under gns.</div>
    </div>
    <div class="flex items-center gap-x-2">
      <div class="bg-orange-700 w-4 h-4"></div>
      <div>20% over gns.</div>
    </div>
    <!-- <div class="flex items-center gap-x-2">
      <div class="bg-orange-600 w-4 h-4"></div>
      <div>Dyrest</div>
    </div>-->
    <div class="flex items-center gap-x-2">
      <div class="bg-blue-800 w-4 h-4"></div>
      <div>30 dages gns. ({{Math.round(avg)}} øre)</div>
    </div>
  </div>
</template>
