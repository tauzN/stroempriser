export type record = {
  datetime: Date;
  spotPrice: number;
  afgift: number;
  totalPrice: number;
};

export type rawRecord = {
  HourUTC: string;
  HourDK: string;
  PriceArea: string;
  SpotPriceDKK: number;
  SpotPriceEUR: number;
};
