import dayjs from "dayjs";

// Forbrugstariffer https://energinet.dk/El/Elmarkedet/Tariffer/Aktuelle-tariffer
const transmissionsnettarif = 5.8 / 100 // DKK
const systemtarif =  5.4 / 100 // DKK
const balancetarif = 0 / 100 // DKK
export const forbrugstariffer = transmissionsnettarif + systemtarif + balancetarif

// Elafgift https://www.skm.dk/skattetal/satser/satser-og-beloebsgraenser-i-lovgivningen/elafgiftsloven/
export const elafgift: number =  68.7 / 100; // DKK

const flat_fee = elafgift + forbrugstariffer

// Nettarif https://n1.dk/priser-og-vilkaar
const lavlast: number = 0 // DKK
const spidslast: number = 0 // DKK
const netabn = 283/12/400 // DKK/mdr/kwh/mdr
const maanederMedSpidslast = [0, 1, 2, 9, 10, 11]
const timerMedSpidslast = [17, 18, 19]
export const afgiftFromDate = (date: Date): number => {  
  if (maanederMedSpidslast.includes(dayjs(date).month()) && timerMedSpidslast.includes(dayjs(date).hour()))
    return flat_fee + spidslast + netabn
  else
    return flat_fee + lavlast + netabn
}
export const afgifter_lavlast = flat_fee + lavlast + netabn
export const afgifter_spidslast = flat_fee + spidslast + netabn