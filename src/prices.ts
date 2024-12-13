import dayjs from "dayjs";

// Forbrugstariffer https://energinet.dk/el/elmarkedet/tariffer/aktuelle-tariffer/
const net = 7.4 / 100; // DKK
const system = 5.1 / 100; // DKK
export const forbrugstariffer = net + system;

// Elafgift https://skm.dk/tal-og-metode/satser/satser-og-beloebsgraenser-i-lovgivningen/elafgiftsloven
export const elafgift: number = 76.1 / 100; // DKK

const flat_fee = elafgift + forbrugstariffer;

// Nettarif https://n1.dk/priser-og-vilkaar
const prices = {
	sommer: {
		lav: 4.46 / 100,
		hoej: 6.70 / 100,
		spids: 17.41 / 100,
	},
	vinter: {
		lav: 4.46 / 100,
		hoej: 13.39 / 100,
		spids: 40.18 / 100,
	},
};
const price = [
	...Array(3).fill([...Array(6).fill(prices.vinter.lav), ...Array(11).fill(prices.vinter.hoej), ...Array(4).fill(prices.vinter.spids), ...Array(3).fill(prices.vinter.hoej)]),
	...Array(6).fill([...Array(6).fill(prices.sommer.lav), ...Array(11).fill(prices.sommer.hoej), ...Array(4).fill(prices.sommer.spids), ...Array(3).fill(prices.sommer.hoej)]),
	...Array(3).fill([...Array(6).fill(prices.vinter.lav), ...Array(11).fill(prices.vinter.hoej), ...Array(4).fill(prices.vinter.spids), ...Array(3).fill(prices.vinter.hoej)]),
];
// const netabn = (224.04 + 14.4) / 12 / 400; // DKK/mdr/kwh
export const afgiftFromDate = (date: Date): number => {
	return price[dayjs(date).month()][dayjs(date).hour()] + flat_fee;
};
