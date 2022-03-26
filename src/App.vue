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
const medAfgift = ref<boolean>(true)
const prisUdenAfgift = (record: record): number => {
  // SpotPriceDKK er i DKK/MWh og SpotPriceDKK er null i weekenden og omregnes derfor fra SpotPriceEUR
  // Der omregnet her til øre/KWh
  return record.SpotPriceDKK / 1_000 * 100 || record.SpotPriceEUR * 7.44 / 1_000 * 100
}
const prisMedAfgift = (record: record): number => {
  // Spidslast: Alle dage i perioden oktober-marts kl. 17-20.
  // Lavlast: Alle dage i perioden april-september og alle dage i perioden oktober-marts kl. 00-17 og kl. 20-24.
  return (record.HourDK.month() >= 9 || record.HourDK.month() <= 2) && (record.HourDK.hour() >= 17 && record.HourDK.hour() < 20)
    ? prisUdenAfgift(record) + spidslast
    : prisUdenAfgift(record) + lavlast

}// 

const getData = async () => {
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
    records.value = data.map(item => {
      return {
        HourDK: dayjs(item.HourDK),
        SpotPriceDKK: item.SpotPriceDKK,
        SpotPriceEUR: item.SpotPriceEUR,

      }
    })
    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
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
        labels: records.value.map(item => {
          return dayjs(item.HourDK).format("HH:mm")
        }),
        datasets: [
            {
            type: "line",
            label: "Maks.",
            data: records.value.map(item => Math.max(...records.value.map(item => prisMedAfgift(item)))),
            fill: false,
            borderColor: "#eb4d4b",
            stack: "0"
          },
          {
            type: "line",
            label: "Min.",
            data: records.value.map(item => Math.min(...records.value.map(item => {
              console.log(prisMedAfgift(item));
              return prisMedAfgift(item)
            }))),
            fill: false,
            borderColor: "#6ab04c",
            stack: "1"
          },
           {
            type:"bar",
            label:"Afgift",
            data: records.value.map(item =>prisMedAfgift(item)-prisUdenAfgift(item)),
            backgroundColor: "#eb4d4b"
          },
          {
            type: "bar",
            label: 'Strømpris',
            data: records.value.map(item => prisUdenAfgift(item)),
            backgroundColor: records.value.map(item => {
              if (item.HourDK.isSame(dayjs(), "hour")) return "#2980b9"
              else return "#6ab04c"
            })
          },
         ]
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
  <!-- <label>
    Vis inkl. afgift
    <input type="checkbox" v-model="medAfgift" />
  </label> -->
  <div v-if="records === undefined">Henter data...</div>
  <div v-if="records === null">Fejl.</div>
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
