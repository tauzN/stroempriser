<script setup lang="ts">
import Chart from 'chart.js/auto';
import 'chartjs-adapter-dayjs-3';
import annotationPlugin from 'chartjs-plugin-annotation';
import dayjs from 'dayjs';
import colors from 'tailwindcss/colors'
import { ref, onMounted } from 'vue';
import { record } from './types';
Chart.register(annotationPlugin);
const props = defineProps<{
    records: record[],
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
                    suggestedMax: 3 + Math.max(...props.records.map(item => item.totalPrice))
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
                            borderWidth: 1,
                            xScaleID: 'x',
                            xMin: dayjs().subtract(30, "minutes").valueOf(),
                            xMax: dayjs().subtract(30, "minutes").valueOf(),
                            yMin: 0,
                            yScaleID: 'y',
                            label: {
                                enabled: true,
                                content: (props.records.find(item => dayjs().isSame(item.datetime, "hour"))?.totalPrice).toLocaleString("da-dk") + " kr.",
                                backgroundColor: colors.green[700] + "CC",
                                color: colors.neutral[100],
                                position: "end"
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
                    data: props.records.map(item => item.totalPrice),
                    backgroundColor: props.records.map(item => {
                        return `hsl(${120 - item.totalPrice / 6 * 120} 50% 40%)`
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
    <canvas ref="chartRef"></canvas>
</template>
