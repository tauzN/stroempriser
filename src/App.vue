<script setup lang="ts">
import Chart from 'chart.js/auto';
import 'chartjs-adapter-dayjs-3';
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs';
import 'dayjs/locale/da'
import colors from 'tailwindcss/colors'
import sampledata from './sampledata.json'
dayjs.locale('da')
type record = {
  HourDK: dayjs.Dayjs
  SpotPriceDKK: number
  SpotPriceEUR: number
}
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
const getData = async (): Promise<record[]> => new Promise((resolve, reject) => {
  const data = { "query": `query Dataset {elspotprices(where: {HourDK: {_gte: \"${dayjs().subtract(3, "hours").format("YYYY-MM-DDTHH:mm")}\"}PriceArea: {_eq: \"DK1\"}} order_by: {HourDK: asc} limit: 100){HourDK SpotPriceDKK SpotPriceEUR}}` }
  fetch(`https://data-api.energidataservice.dk/v1/graphql`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(raw => raw.json())
    .then(json => json.data.elspotprices as record[])
    .then(data => {
      resolve(data.map(item => {
        return {
          HourDK: dayjs(item.HourDK),
          SpotPriceDKK: item.SpotPriceDKK,
          SpotPriceEUR: item.SpotPriceEUR,
        }
      }))
    })
    .catch((e) => {
      records.value = null;
      reject(e)
    })
  // resolve(sampledata.elspotprices.map(item => {
  //   return {
  //     HourDK: dayjs(item.HourDK),
  //     SpotPriceDKK: item.SpotPriceDKK,
  //     SpotPriceEUR: item.SpotPriceEUR,
  //   }
  // }))
})
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
            tooltipFormat: "H",
            displayFormats: {
              hour: "H"
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
          label: "Maks.",
          data: [undefined, undefined, ...records.value.map(() => Math.max(...priserMedAfgift.value.slice(2)))],
          fill: false,
          borderColor: colors.red[800],
          stack: "0"
        },
        {
          type: "line",
          pointRadius: 0,
          borderWidth: 2,
          label: "Min.",
          data: [undefined, undefined, ...records.value.map(() => Math.min(...priserMedAfgift.value.slice(2)))],
          fill: false,
          borderColor: colors.green[600],
          stack: "1"
        },
        {
          type: "bar",
          label: "Afgift",
          stack: "bar",
          data: afgifter.value,
          backgroundColor: records.value.map(item => {
            // if (item.HourDK.isSame(dayjs(), "hour")) return colors.cyan[900]
            if (prisMedAfgift(item) < Math.max(...priserMedAfgift.value.slice(2)) * 0.3) return colors.green[700]
            else if (prisMedAfgift(item) > Math.max(...priserMedAfgift.value.slice(2)) * 0.9) return colors.orange[900]
            else return colors.neutral[700]
          })
        },
        {
          type: "bar",
          label: "Strømpris",
          stack: "bar",
          borderColor: records.value.map(item => {
            if (item.HourDK.isSame(dayjs(), "hour")) return colors.red[300]
          }),
          borderWidth: records.value.map(item => {
            if (item.HourDK.isSame(dayjs(), "hour")) return 2
          }),
          data: priserUdenAfgift.value,
          backgroundColor: records.value.map(item => {
            // if (item.HourDK.isSame(dayjs(), "hour")) return colors.cyan[800]
            if (prisMedAfgift(item) < Math.max(...priserMedAfgift.value.slice(2)) * 0.3) return colors.green[600]
            else if (prisMedAfgift(item) > Math.max(...priserMedAfgift.value.slice(2)) * 0.9) return colors.orange[800]
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
  <div v-if="records === undefined" class="animate-bounce">Henter data...</div>
  <div v-if="records === null">Fejl.</div>
  <canvas ref="chartRef"></canvas>
</template>
