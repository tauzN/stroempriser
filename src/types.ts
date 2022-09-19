export type record = {
  /**
   * 
   */
  datetime: Date;
  /**
   * Floating point in DKK/kWh
   */
  price: number;
};

export type rawRecord = {
  HourUTC: string;
  HourDK: string;
  PriceArea: string;
  SpotPriceDKK: number;
  SpotPriceEUR: number;
};
