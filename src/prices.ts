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
		lav: 11.01 / 100,
		hoej: 16.52 / 100,
		spids: 42.95 / 100,
	},
	vinter: {
		lav: 11.01 / 100,
		hoej: 33.03 / 100,
		spids: 99.1 / 100,
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
