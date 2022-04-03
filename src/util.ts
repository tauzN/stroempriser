import {record} from './types'
import dayjs from 'dayjs';
export const getData = async (): Promise<record[]> => new Promise((resolve, reject) => {
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
        reject(e)
      })
  })

  export const avg = (array: number[]): number => array.reduce((previousValue, currentValue) => (previousValue + currentValue / array.length), 0);

  export const get30DayAvg = async (): Promise<number> => new Promise((resolve, reject) => {
    const data = { "query": `query Dataset {elspotprices(where: {HourDK: {_gte: \"${dayjs().subtract(30, "days").format("YYYY-MM-DDTHH:mm")}\"}PriceArea: {_eq: \"DK1\"}} order_by: {HourDK: asc} limit: 1000){HourDK SpotPriceDKK SpotPriceEUR}}` }
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
        resolve(avg(data.map(item => item.SpotPriceEUR)) * 7.44 / 1000 * 100)
      })
      .catch((e) => {
        reject(e)
      })
  })