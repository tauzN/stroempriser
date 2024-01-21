import type { RawRecord, Record } from "@/types"
import { DKKMWh_to_DKKkWh } from "@/util"
import dayjs from "dayjs"
export const getPrices = async (): Promise<Record[]> => {
    try {
        let rawRecord: RawRecord[]
        if (localStorage.getItem("prices") === null) {
            const baseurl = "https://api.energidataservice.dk"
            const url = new URL("/dataset/Elspotprices", baseurl)
            url.searchParams.set("filter", JSON.stringify({ PriceArea: "DK1" }))
            url.searchParams.set("limit", (48).toString())
            const res = await fetch(url.toString())
            if (!res.ok) throw new Error("Response not ok: " + res.statusText)
            rawRecord = (await res.json()).records as RawRecord[]
            localStorage.setItem("prices", JSON.stringify(rawRecord))
        }
        else {
            rawRecord = JSON.parse(localStorage.getItem("prices") as string)
        }

        return rawRecord.map(record => {
            return {
                datetime: dayjs(record.HourDK).toDate(),
                price: Number(DKKMWh_to_DKKkWh(record.SpotPriceDKK || record.SpotPriceEUR * 7.45).toPrecision(2)),
            }
        })
    } catch (error) {
        throw new Error("Failed to get data from energidataservice: " + error)
    }
}