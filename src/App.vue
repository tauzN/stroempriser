<script setup lang="ts">
import Chart from 'chart.js/auto';
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs';
import 'dayjs/locale/da'
import { ITERATE_KEY } from '@vue/reactivity';
dayjs.locale('da')
type record = {
  HourDK: dayjs.Dayjs
  SpotPriceDKK: number
  SpotPriceEUR: number
}
// https://n1.dk/priser-og-vilkaar
const lavlast = 20.38
const spidslast = 62.66
const records = ref<record[] | null | undefined>(undefined)
// SpotPriceDKK er i DKK/MWh og SpotPriceDKK er null i weekenden og omregnes derfor fra SpotPriceEUR
// Der omregnet her til øre/KWh
const prisUdenAfgift = (record: record): number => record.SpotPriceDKK / 1_000 * 100 || record.SpotPriceEUR * 7.44 / 1_000 * 100
// Spidslast: Alle dage i perioden oktober-marts kl. 17-20.
// Lavlast: Alle dage i perioden april-september og alle dage i perioden oktober-marts kl. 00-17 og kl. 20-24.
const prisMedAfgift = (record: record): number => (record.HourDK.month() >= 9 || record.HourDK.month() <= 2) && (record.HourDK.hour() >= 17 && record.HourDK.hour() < 20)
  ? prisUdenAfgift(record) + spidslast
  : prisUdenAfgift(record) + lavlast
const priserUdenAfgift = computed(() => records.value.map(item => prisUdenAfgift(item)))
const priserMedAfgift = computed(() => records.value.map(item => prisMedAfgift(item)))
const afgifter = computed(() =>  records.value.map(item => prisMedAfgift(item) - prisUdenAfgift(item)))
const getData = async (): Promise<record[]> => new Promise((resolve, reject) => {
  const data = { "query": `query Dataset {elspotprices(where: {HourDK: {_gte: \"${dayjs().subtract(3, "hours").format("YYYY-MM-DDTHH:mm")}\"}PriceArea: {_eq: \"DK1\"}} order_by: {HourDK: asc} limit: 100){HourDK SpotPriceDKK SpotPriceEUR}}` }
  fetch(
    `https://data-api.energidataservice.dk/v1/graphql`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }
  ).then(raw => raw.json()).then(json => json.data.elspotprices as record[]).then(data => {
    resolve(data.map(item => {
      return {
        HourDK: dayjs(item.HourDK),
        SpotPriceDKK: item.SpotPriceDKK,
        SpotPriceEUR: item.SpotPriceEUR,
      }
    }))
  }).catch((e) => {
    records.value = null;
    reject(e)
  })
})
const chartRef = ref(null)
const drawChart = () => {
  new Chart(chartRef.value, {
    type: "bar",
    options: {
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true
        }
      }
    },
    data: {
      labels: records.value.map(item => dayjs(item.HourDK).format("HH:mm")),
      datasets: [
        {
          type: "line",
          pointRadius: 0,
          borderWidth: 2,
          label: "Maks.",
          data: records.value.map(() => Math.max(...priserMedAfgift.value)),
          fill: false,
          borderColor: "#eb4d4b",
          stack: "0"
        },
        {
          type: "line",
          pointRadius: 0,
          borderWidth: 2,
          label: "Min.",
          data: records.value.map(() => Math.min(...priserMedAfgift.value)),
          fill: false,
          borderColor: "#6ab04c",
          stack: "1"
        },
        {
          type: "bar",
          label: "Afgift",
          data: afgifter.value,
          backgroundColor: records.value.map(item => item.HourDK.isSame(dayjs(), "hour") ? "#eb4d4b" : "#ccc")
        },
        {
          type: "bar",
          label: 'Strømpris',
          data: priserUdenAfgift.value,
          backgroundColor: records.value.map(item => item.HourDK.isSame(dayjs(), "hour") ? "#2980b9" : "#ddd")
        },
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
  <div v-if="records === undefined">Henter data...</div>
  <div v-if="records === null">Fejl.</div>
  <canvas ref="chartRef"></canvas>
  <!-- <table border="1">
    <template v-for="item in records">
      <tr>
        <td>{{ item.HourDK.format('D/M HH:mm') }}</td>
        <td>{{ item.SpotPriceEUR }}</td>
      </tr>
    </template>
  </table>-->
</template>
