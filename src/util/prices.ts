import dayjs from "dayjs";

// Elafgift https://www.skm.dk/skattetal/satser/satser-og-beloebsgraenser-i-lovgivningen/elafgiftsloven/
const elafgift: number = .008; // DKK
// Forbrugstariffer https://energinet.dk/El/Elmarkedet/Tariffer/Aktuelle-tariffer
const transmissionsnettarif = .058
const systemtarif = .054
const balancetarif = 0
const forbrugstariffer = transmissionsnettarif + systemtarif + balancetarif
const flat_fee = elafgift + forbrugstariffer

// Nettarif https://n1.dk/priser-og-vilkaar
const lavlast: number = 0.3268 // DKK
const spidslast: number = .08409 // DKK
const netabn = 283/12/300 // DKK/år/kwh
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