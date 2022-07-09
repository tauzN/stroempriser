<script setup lang="ts">
import Chart from 'chart.js/auto';
import 'chartjs-adapter-dayjs-3';
import annotationPlugin from 'chartjs-plugin-annotation';
import dayjs from 'dayjs';
import colors from 'tailwindcss/colors'
import { ref, onMounted } from 'vue';
import { record } from './types';
import {avg} from './util'
Chart.register(annotationPlugin);
const props = defineProps<{
    records: record[]
    afgifter:number
    avgPrice: number
}>()
const chartRef = ref<HTMLCanvasElement>()
const chart = ref<Chart>()
const drawChart = () => {
    chart.value = new Chart(chartRef.value as HTMLCanvasElement, {
        type: "bar",
        options: {
            locale: "da-dk",
            scales: {
                x: {
                    stacked: true,
                    type: "time",
                    time: {
                        unit: "hour",
                        tooltipFormat: "dddd [kl.] HH:mm",
                        displayFormats: {
                            hour: "HH"
                        }
                    }
                },
                y: {
                    stacked: true,
                    suggestedMax: 3 + Math.max(...props.records.map(item => item.price))
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                annotation: {
                    annotations: {
                        currentTime: {
                            type: 'line',
                            borderColor: colors.green[500] + "CC",
                            // borderDash: [6, 6],
                            borderWidth: 1,
                            xScaleID: 'x',
                            xMin: dayjs().subtract(30, "minutes").valueOf(),
                            xMax: dayjs().subtract(30, "minutes").valueOf(),
                            yMin: 0,
                            // yMax: Math.max(...props.records().map(item => item.price)) + 30,
                            yMax: 1000,
                            yScaleID: 'y',
                            label: {
                                enabled: true,
                                content: (props.records.find(item => dayjs().isSame(item.datetime, "hour")).price + props.afgifter).toLocaleString("da-dk") + " kr.",
                                backgroundColor: colors.green[700] + "CC",
                                color: colors.neutral[100],
                                position: "end",
                                yAdjust: 15
                            }
                        },
                        avgPrice: {
                            type: 'line',
                            borderColor: colors.blue[500],
                            borderDash: [8, 8],
                            borderWidth: 1,
                            scaleID: 'y',
                            value: props.avgPrice,
                        },
                        afgifter: {
                            type: 'line',
                            borderColor: colors.gray[500],
                            // borderDash: [8, 8],
                            borderWidth: 1,
                            scaleID: 'y',
                            value: props.afgifter,
                        },
                        today: {
                            type: 'box',
                            backgroundColor: colors.neutral[200] + "05",
                            borderWidth: 1,
                            borderColor: colors.neutral[200] + "55",
                            xMax: dayjs(props.records[12].datetime).subtract(30, "minutes").valueOf(),
                            label: {
                                color: colors.neutral[100],

                                drawTime: 'beforeDraw',
                                enabled: true,
                                content: dayjs(props.records[0].datetime).format("dddd"),
                                position: {
                                    x: 'center',
                                    y: 'start'
                                }
                            }
                        },
                        tomorrow: {
                            type: 'box',
                            backgroundColor: colors.neutral[200] + "05",
                            borderWidth: 1,
                            borderColor: colors.neutral[200] + "55",
                            xMin: dayjs(props.records[12].datetime).subtract(30, "minutes").valueOf(),
                            label: {
                                color: colors.neutral[100],
                                drawTime: 'beforeDraw',
                                enabled: true,
                                content: dayjs(props.records[props.records.length - 1].datetime).format("dddd"),
                                position: {
                                    x: 'center',
                                    y: 'start'
                                }
                            }
                        }
                    }
                }
            }
        },
        data: {
            labels: props.records.map(item => item.datetime),
            datasets: [
                {
                    type: "bar",
                    label: "",
                    borderRadius: 5,
                    data: props.records.map(item => (item.price + props.afgifter)),
                    backgroundColor: props.records.map(item => {
                        if (dayjs().isSame(item.datetime, "hour")) return colors.neutral[400]
                        else if (item.price < 0) return colors.green[500]
                        else if (item.price < avg(props.records.map(item => item.price)) * 0.4) return colors.green[700]
                        else if (item.price > avg(props.records.map(item => item.price)) * 1.2) return colors.orange[900]
                        else return colors.neutral[600]
                    })
                }
            ]
        }
    })
}
onMounted(() => {
    drawChart()
})
</script>
<template>
    <canvas class ref="chartRef"></canvas>
</template>
