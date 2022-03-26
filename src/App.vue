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

// https://n1.dk/priser-og-vilkaar
const lavlast = 20.38
const spidslast = 62.66

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
            // SpotPriceDKK er i DKK/MWh og SpotPriceDKK er null i weekenden og omregnes derfor fra SpotPriceEUR
            // Der omregnet her til øre/KWh
            const price = item.SpotPriceDKK / 1_000 * 100 || item.SpotPriceEUR * 7.44 / 1_000 * 100
            // Spidslast: Alle dage i perioden oktober-marts kl. 17-20.
            // Lavlast: Alle dage i perioden april-september og alle dage i perioden oktober-marts kl. 00-17 og kl. 20-24.
            if ((item.HourDK.month() >= 9 || item.HourDK.month() <= 2) && (item.HourDK.hour() >= 17 && item.HourDK.hour() < 20))
              return price + spidslast
            else
              return price + lavlast
          }),
          backgroundColor: records.value.map(item => {
            console.log((item.HourDK.month() >= 9 || item.HourDK.month() <= 2));
            console.log((item.HourDK.hour() >= 17 && item.HourDK.hour() <= 20));

            return ((item.HourDK.month() >= 9 || item.HourDK.month() <= 2) && (item.HourDK.hour() >= 17 && item.HourDK.hour() < 20) ? "#eb4d4b" : "#6ab04c")
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
  </table>-->
</template>
