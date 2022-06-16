// https://n1.dk/priser-og-vilkaar
// Lavlast: Alle dage i perioden april-september og alle dage i perioden oktober-marts kl. 00-17 og kl. 20-24.
// Spidslast: Alle dage i perioden oktober-marts kl. 17-20.
// Nettarif (net) + rabat øre/kWh
export const lavlast: number = (22.35 - 2.02);
// export const spidslast: number = (63.78 - 4.25) * 1.25;

// Elafgift Øre/kWh
export const elafgift: number = 90.3;

//System- og nettarif (Energinet.dk)
export const systemtarif = 11;

// årsforbrug i kWh
export const aarsforbrug = 2_000;
// Netabonnement (net) 290 kr. pr. år
export const Netabonnement: number = (290 * 100) / (aarsforbrug); // DDK * øre/DKK /

export const afgifter =
  Math.round((lavlast + elafgift + systemtarif + Netabonnement) * 1.25) / 100
