<script setup lang="ts">
import Chart from 'chart.js/auto';
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs';
import 'dayjs/locale/da'
dayjs.locale('da')

type record = {
  HourDK: dayjs.Dayjs
  SpotPriceDKK: number
  SpotPriceEUR: number
}

const records = ref<record[] | null | undefined>(undefined)

const getData = async () => {
  const data = { "query": "query Dataset {elspotprices(where: {HourDK: {_gte: \"now\"}PriceArea: {_eq: \"DK1\"}} order_by: {HourDK: asc} limit: 100){HourDK SpotPriceDKK SpotPriceEUR}}" }
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
    records.value = data.map(item => {
      return {
        HourDK: dayjs(item.HourDK),
        SpotPriceDKK: item.SpotPriceDKK,
        SpotPriceEUR: item.SpotPriceEUR
      }
    })
    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: records.value.map(item => {
          return dayjs(item.HourDK).format("HH:mm")
        }),
        datasets: [{
          label: 'Øre',
          data: records.value.map(item => {
            return (Math.round(item.SpotPriceDKK / 1_000 * 100) || Math.round(item.SpotPriceEUR * 7.45 / 1_000 * 100)) + (item.HourDK.hour() >= 17 && item.HourDK.hour() < 21 ? 20 : 0)
          }),
          backgroundColor: records.value.map(item => {
            return (item.HourDK.hour() >= 17 && item.HourDK.hour() < 21 ? "#eb4d4b" : "#6ab04c")
          })
        }]
      }
    });
  }).catch((e) => {
    records.value = null;
  })
}

onMounted(async () => {
  getData()
})
</script>

<template>
<div v-if="records == undefined">Henter data...</div>
  <canvas id="myChart"></canvas>
  <!-- <table border="1">
    <template v-for="item in records">
      <tr>
        <td>{{ item.HourDK.format('D/M HH:mm') }}</td>
        <td>{{ item.SpotPriceEUR }}</td>
      </tr>
    </template>
  </table> -->
</template>
