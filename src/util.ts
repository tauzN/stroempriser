import dayjs from "dayjs";

export const avg = (array: number[]): number =>
    array.reduce(
        (previousValue, currentValue) =>
            previousValue + currentValue / array.length,
        0
    );
export const isCurrentHour = (datetime: Date): boolean => dayjs().isSame(dayjs(datetime), "hour")

export const DKKMWh_to_DKKkWh = (DKK: number) => DKK / 1_000;
