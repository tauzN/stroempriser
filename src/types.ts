export type record = {
  datetime: Date;
  price: number;
};

export type rawRecord = {
  HourUTC: string;
  HourDK: string;
  PriceArea: string;
  SpotPriceDKK: number;
  SpotPriceEUR: number;
};
