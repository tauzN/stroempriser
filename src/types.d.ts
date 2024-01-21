export type RawRecord = {
    HourUTC: string;
    HourDK: string;
    PriceArea: string;
    SpotPriceDKK: number;
    SpotPriceEUR: number;
  }

  export type Record = {
    datetime: Date;
    price: number;
  }