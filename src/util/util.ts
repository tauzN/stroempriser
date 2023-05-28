import { rawRecord, record } from "../types";
import dayjs from "dayjs";
import { afgiftFromDate } from "./prices";

export const isCurrentHour = (datetime: Date): boolean => dayjs().isSame(dayjs(datetime), "hour")

export const avg = (array: number[]): number =>
  array.reduce(
    (previousValue, currentValue) =>
      previousValue + currentValue / array.length,
    0
  );

/**
 * Converts DKK/MWh to DKK/Kwh
 * @param DKKMWh - Price in DKK/MWh
 * @returns price in DKK/KWh
 */
const DKKMWh_to_DKKkWh = (DKK: number) => DKK / 1_000;

/**
 * @param days number of days to get data for
 * @returns record array
 */
export const getLastHours = async (hours: number): Promise<record[]> =>
  new Promise(async (resolve, reject) => {
    const filter = {
      PriceArea: "DK1",
    };
    const params = new URLSearchParams({
      filter: JSON.stringify(filter),
      limit: (hours).toString(),
    });
    try {
      const raw = await fetch(
        "https://api.energidataservice.dk/dataset/Elspotprices?" + params)
      const json = await raw.json() as { records: rawRecord[] }
      //console.log(json);
      const prices: record[] = json.records.map((item) => {
        // SpotPriceDKK er null i weekenden og omregnes derfor fra SpotPriceEUR
        const spotPrice = DKKMWh_to_DKKkWh(item.SpotPriceDKK || item.SpotPriceEUR * 7.44)
        const afgift = afgiftFromDate(dayjs(item.HourDK).toDate())
        return {
          spotPrice: spotPrice * 1.25,
          datetime: dayjs(item.HourDK).toDate(),
          afgift: (spotPrice > 0) ? afgift : afgift + spotPrice * 1.25,
          totalPrice: (spotPrice + afgift) * 1.25
        };
      });
      resolve(prices.reverse());
    } catch (error) {
      console.log(error);
      reject(error)
    }
  });
