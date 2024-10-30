<template>
    <Section title="承办情况">
        <Chart class="h-full" :option="config"></Chart>
    </Section>
</template>
<script>
import Chart from '../chart.vue'
import * as echarts from 'echarts'
import Section from '../section/index.vue'
export default {
    components: {
        Section,
        Chart
    },
    data() {
        return {
            config: {
                tooltip: {
                    trigger: 'axis',
                    // axisPointer: {
                    //     type: 'cross',
                    //     crossStyle: {
                    //         color: '#999'
                    //     }
                    // }
                },
                legend: {
                    data: ['任务数', '办结数', '反馈数'],
                    top: '3%',
                    textStyle: {
                        color: '#ffffff',
                        fontSize: 14
                    }
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['秘书一处', '秘书二处', '秘书三处', '发改委', '工信厅', '财政厅', '教育厅'],
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#AFE8FF',
                                fontSize: 14
                            }
                        },
                        axisTick: {
                            length: 0
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: 0,
                        axisLine: {
                            show: true
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: '任务数',
                        type: 'bar',
                        tooltip: {
                            valueFormatter: function (value) {
                            return value + ' 个';
                            }
                        },
                        barWidth: '20',
                        itemStyle: {
                            normal: {
                                borBorderRadius: [5,5,0,0],
                                color: new echarts.graphic.LinearGradient(0,1,0,0, [
                                    {
                                        offset: 0,
                                        color: "#016E65"
                                    },
                                    {
                                        offset: 1,
                                        color: "#03FFC6"
                                    }
                                ])
                            }
                        },
                        data: [20, 5, 4, 25, 24, 60, 135.6]
                    },
                    {
                        name: '办结数',
                        type: 'bar',
                        barWidth: '20',
                        tooltip: {
                            valueFormatter: function (value) {
                            return value + ' 个';
                            }
                        },
                        itemStyle: {
                            normal: {
                                borBorderRadius: [5,5,0,0],
                                color: new echarts.graphic.LinearGradient(0,1,0,0, [
                                    {
                                        offset: 0,
                                        color: "#454F37"
                                    },
                                    {
                                        offset: 1,
                                        color: "#F7B500"
                                    }
                                ])
                            }
                        },
                        data: [
                            2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6
                        ]
                    },
                    {
                        name: '反馈数',
                        type: 'line',
                        itemStyle: {
                            color: '#32C5FF'
                        },
                        tooltip: {
                            valueFormatter: function (value) {
                            return value + ' 个';
                            }
                        },
                        // yAxisIndex: 1,
                        // tooltip: {
                        //     valueFormatter: function (value) {
                        //     return value + ' °C';
                        //     }
                        // },
                        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6]
                    }
                ]
            }
        }
    }
}
</script>
<style lang="scss" scoped></style>
