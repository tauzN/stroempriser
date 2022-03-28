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
    // resolve(sampledata.elspotprices.map(item => {
    //   return {
    //     HourDK: dayjs(item.HourDK),
    //     SpotPriceDKK: item.SpotPriceDKK,
    //     SpotPriceEUR: item.SpotPriceEUR,
    //   }
    // }))
  })