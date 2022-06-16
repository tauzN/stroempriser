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
    const data = {
      query: `query Dataset {elspotprices(where: {HourDK: {_gte: \"${dayjs()
        .subtract(days, "days")
        .format(
          "YYYY-MM-DDThh:mm"
        )}\"}PriceArea: {_eq: \"DK1\"}} order_by: {HourDK: asc} limit: 1000){HourDK SpotPriceDKK SpotPriceEUR}}`,
    };
    fetch(`https://data-api.energidataservice.dk/v1/graphql`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((raw) => raw.json())
      .then((json) => json.data.elspotprices)
      .then((data: rawRecord[]) => {
        resolve(
          data.map((item) => {
            return {
              // SpotPriceDKK er null i weekenden og omregnes derfor fra SpotPriceEUR
              price: Math.round(DKKMWh_to_DKKkWh(item.SpotPriceDKK || item.SpotPriceEUR * 7.44) * 1.25 *100)/100,
              datetime: dayjs(item.HourDK).toDate(),
            };
          })
        );
      })
      .catch((e) => {
        reject(e);
      });
  });
