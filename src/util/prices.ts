import dayjs from "dayjs";
// Nettarif https://n1.dk/priser-og-vilkaar
const lavlast: number = (.4077 - .0202); // DKK
const spidslast: number = (1.10159 - .0425); // DKK
// Elafgift https://www.skm.dk/skattetal/satser/satser-og-beloebsgraenser-i-lovgivningen/elafgiftsloven/
const elafgift: number = .723; // DKK
// Forbrugstariffer https://energinet.dk/El/Elmarkedet/Tariffer/Aktuelle-tariffer
const transmissionsnettarif = .049
const systemtarif = .061
const balancetarif = .00229
const forbrugstariffer = transmissionsnettarif + systemtarif + balancetarif
// årsforbrug i kWh
const aarsforbrug = 1_500; // kWh
// Netabonnement (net) 290 kr. pr. år
const netabonnement: number = 290 / aarsforbrug; // DDK * øre/DKK /
const flat_fee = elafgift + forbrugstariffer + netabonnement

const maanederMedSpidslast = [0, 1, 2, 9, 10, 11]
const timerMedSpidslast = [17, 18, 19]
export const afgift = (date: Date): number => {
  if (maanederMedSpidslast.includes(dayjs(date).month()) && timerMedSpidslast.includes(dayjs(date).hour()))
    return ((flat_fee + spidslast) * 1.25)
  else
    return ((flat_fee + lavlast) * 1.25)
}
export const afgifter_lavlast = () => (flat_fee + lavlast) * 1.25
export const afgifter_spidslast = () => (flat_fee + spidslast) * 1.25