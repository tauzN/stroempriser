import { rawRecord, record } from "./types";
import dayjs from "dayjs";

export const avg = (array: number[]): number =>
  array.reduce(
    (previousValue, currentValue) =>
      previousValue + currentValue / array.length,
    0
  );

/**
 * Rådata priser er i DKK/MWh
 * @param DKKMWh - Price in DKK/MWh
 * @returns price in Øre/KWh
 */
const DKKMWh_to_DKKkWh = (DKK: number) => DKK / 1_000;

/**
 * @param days number of days to get data for
 * @returns record array
 */
export const getLastDays = async (days: number): Promise<record[]> =>
  new Promise((resolve, reject) => {
    const filter = {
      "PriceArea": "DK1"
    }
    const params = new URLSearchParams({
      "filter": JSON.stringify(filter),
      "limit": (24 * days).toString()
    })
    fetch("https://api.energidataservice.dk/dataset/Elspotprices?"+params)
    .then((raw) => raw.json())
    .then((json) => json.records as rawRecord[])
    .then((data) => {      
      let prices = data.map((item) => {
        return {
          // SpotPriceDKK er null i weekenden og omregnes derfor fra SpotPriceEUR
          price:
            Math.round(
              DKKMWh_to_DKKkWh(
                item.SpotPriceDKK || item.SpotPriceEUR * 7.44
              ) *
                1.25 *
                100
            ) / 100,
          datetime: dayjs(item.HourDK).toDate(),
        };
      });
      resolve(prices.reverse());
    })
    .catch((e) => {
      reject(e);
    });
  });
