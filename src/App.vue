<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import colors from 'tailwindcss/colors'
import Chart from 'chart.js/auto';
import 'chartjs-adapter-dayjs-3';
import annotationPlugin from 'chartjs-plugin-annotation';
import { record } from './types'
import { getLastDays, avg } from './util'
import dayjs from 'dayjs';
import 'dayjs/locale/da'
import { afgifter} from './prices'
Chart.register(annotationPlugin);
dayjs.locale('da')
const records = ref<record[] | null | undefined>(undefined)
const chartRef = ref<HTMLCanvasElement>()
const chart = ref<Chart>()
const avgPrice = computed(() => {
  if (!records.value) return 0
  return Math.round(avg(records.value.map(item => item.price + afgifter)) * 100) / 100
})
const last36Hours = () => records.value ? records.value.slice(-36) : []
const drawChart = () => {
   chart.value = new Chart(chartRef.value as HTMLCanvasElement, {
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
          suggestedMax: 3 + Math.max(...last36Hours().map(item => item.price))
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
              borderColor: colors.green[500] + "CC",
              // borderDash: [6, 6],
              borderWidth: 1,
              xScaleID: 'x',
              xMin: dayjs().subtract(30, "minutes").valueOf(),
              xMax: dayjs().subtract(30, "minutes").valueOf(),
              yMin: 0,
              // yMax: Math.max(...last36Hours()().map(item => item.price)) + 30,
              yMax: 1000,
              yScaleID: 'y',
              label: {
                enabled: true,
                content: (last36Hours().find(item => dayjs().isSame(item.datetime, "hour")).price + afgifter).toLocaleString("da-dk") + " kr.",
                backgroundColor: colors.green[700] + "CC",
                color: colors.neutral[100],
                position: "end",
                yAdjust: 15
              }
            },
            avgPrice: {
              type: 'line',
              borderColor: colors.blue[500],
              borderDash: [8, 8],
              borderWidth: 1,
              scaleID: 'y',
              value: avgPrice.value,
            },
            afgifter: {
              type: 'line',
              borderColor: colors.gray[500],
              // borderDash: [8, 8],
              borderWidth: 1,
              scaleID: 'y',
              value: afgifter,
            },
            today: {
              type: 'box',
              backgroundColor: colors.neutral[200] + "05",
              borderWidth: 1,
              borderColor: colors.neutral[200] + "55",
              xMax: dayjs(last36Hours()[12].datetime).subtract(30, "minutes").valueOf(),
              label: {
                color: colors.neutral[100],

                drawTime: 'beforeDraw',
                enabled: true,
                content: dayjs(last36Hours()[0].datetime).format("dddd"),
                position: {
                  x: 'center',
                  y: 'start'
                }
              }
            },
            tomorrow: {
              type: 'box',
              backgroundColor: colors.neutral[200] + "05",
              borderWidth: 1,
              borderColor: colors.neutral[200] + "55",
              xMin: dayjs(last36Hours()[12].datetime).subtract(30, "minutes").valueOf(),
              label: {
                color: colors.neutral[100],
                drawTime: 'beforeDraw',
                enabled: true,
                content: dayjs(last36Hours()[last36Hours().length - 1].datetime).format("dddd"),
                position: {
                  x: 'center',
                  y: 'start'
                }
              }
            }
          }
        }
      }
    },
    data: {
      labels: last36Hours().map(item => item.datetime),
      datasets: [
        {
          type: "bar",
          label: "",
          borderRadius: 5,
          data: last36Hours().map(item => (item.price + afgifter )),
          backgroundColor: last36Hours().map(item => {
            if (dayjs().isSame(item.datetime, "hour")) return colors.neutral[400]
            else if (item.price < 0) return colors.green[500]
            else if (item.price < avg(records.value.map(item => item.price)) * 0.4) return colors.green[700]
            else if (item.price > avg(records.value.map(item => item.price)) * 1.2) return colors.orange[900]
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
  <div class="p-4">
    <div class=" text-center text-xs">
      Viser elpriser med afgifter ved årsforbrug på 3.000 kWh hos N1 A/S
    </div>
    <div v-if="!records" class="h-screen flex items-center justify-center text-lg">
      <div v-if="records === undefined" class="animate-pulse">Henter data...</div>
      <div v-if="records === null">Fejl.</div>
    </div>
    <canvas class ref="chartRef"></canvas>
    <div class="p-4 text-xs flex gap-x-8 gap-y-2 items-center justify-center flex-wrap">
      <div class="flex items-center gap-x-2">
        <div class="bg-green-600 w-2 h-4"></div>
        <div>60% under gns.</div>
      </div>
      <div class="flex items-center gap-x-2">
        <div class="bg-green-400 w-2 h-4"></div>
        <div>elpris under 0 øre</div>
      </div>
      <div class="flex items-center gap-x-2">
        <div class="bg-orange-900 w-2 h-4"></div>
        <div>20% over gns.</div>
      </div>
      <div class="flex items-center gap-x-2">
        <div class="bg-gray-500 w-3 h-1"></div>
        <div>Afgifter ({{afgifter.toLocaleString("da-dk")}} kr.)</div>
      </div>
      <div class="flex items-center gap-x-2">
        <div class="bg-blue-600 w-4 h-1"></div>
        <div>30 dages gns. ({{ avgPrice.toLocaleString("da-dk") }} kr.)
          </div>
      </div>
    </div>
  </div>
</template>
