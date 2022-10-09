import { rawRecord, record } from "./types";
import dayjs from "dayjs";
import { afgift } from "./prices";

export const isCurrentHour = (datetime: Date): boolean => dayjs().isSame(dayjs(datetime), "hour")


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
export const getLastHours = async (hours: number): Promise<record[]> =>
  new Promise((resolve, reject) => {
    const filter = {
      PriceArea: "DK1",
    };
    const params = new URLSearchParams({
      filter: JSON.stringify(filter),
      limit: (hours).toString(),
    });
    fetch("https://api.energidataservice.dk/dataset/Elspotprices?" + params)
      .then((raw) => raw.json())
      .then((json) => json.records as rawRecord[])
      .then((data) => {
        let prices: record[] = data.map((item) => {
          let s = DKKMWh_to_DKKkWh(item.SpotPriceDKK || item.SpotPriceEUR * 7.44) * 1.25
          let a = afgift(dayjs(item.HourDK).toDate())
          return {
            // SpotPriceDKK er null i weekenden og omregnes derfor fra SpotPriceEUR
            spotPrice: s,
            datetime: dayjs(item.HourDK).toDate(),
            afgift: a,
            totalPrice: s+a
          };
        });
        resolve(prices.reverse());
      })
      .catch((e) => {
        alert(e);
        reject(e);
      });
  });
