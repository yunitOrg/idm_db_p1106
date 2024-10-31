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
            data: []
        }
    },
    computed: {
        config() {
            return {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['任务数', '办结数', '反馈数'],
                    top: '3%',
                    textStyle: {
                        color: '#ffffff',
                        fontSize: 14
                    }
                },
                grid: {
                    left: 80,
                    right: 80,
                    bottom: 100
                },
                xAxis: {
                    type: 'category',
                    data: this.data.map((n) => n.deptName),
                    boundaryGap: [10, 10],
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#AFE8FF',
                            fontSize: 14
                        },
                        hideOverlap: false,
                        width: 100,
                        overflow: 'break',
                        interval: 0
                    },
                    axisTick: {
                        show: false
                    }
                },
                yAxis: {
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
                },
                series: [
                    {
                        name: '任务数',
                        type: 'bar',
                        tooltip: {
                            valueFormatter: function (value) {
                                return value + ' 个'
                            }
                        },
                        barWidth: '20',
                        itemStyle: {
                            normal: {
                                borBorderRadius: [5, 5, 0, 0],
                                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                    {
                                        offset: 0,
                                        color: '#016E65'
                                    },
                                    {
                                        offset: 1,
                                        color: '#03FFC6'
                                    }
                                ])
                            }
                        },
                        data: this.data.map((n) => n.noticeTotal)
                    },
                    {
                        name: '办结数',
                        type: 'bar',
                        barWidth: '20',
                        tooltip: {
                            valueFormatter: function (value) {
                                return value + ' 个'
                            }
                        },
                        itemStyle: {
                            normal: {
                                borBorderRadius: [5, 5, 0, 0],
                                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                    {
                                        offset: 0,
                                        color: '#454F37'
                                    },
                                    {
                                        offset: 1,
                                        color: '#F7B500'
                                    }
                                ])
                            }
                        },
                        data: this.data.map((n) => n.noticeFinishTotal)
                    },
                    {
                        name: '反馈数',
                        type: 'line',
                        itemStyle: {
                            color: '#32C5FF'
                        },
                        tooltip: {
                            valueFormatter: function (value) {
                                return value + ' 个'
                            }
                        },
                        data: this.data.map((n) => n.feedbackCount)
                    }
                ],
                dataZoom: [
                    {
                        type: 'slider',
                        xAxisIndex: 0,
                        startValue: 0,
                        endValue: 8
                    }
                ]
            }
        }
    },
    watch: {
        year: {
            handler() {
                this.fetchData()
            },
            immediate: true
        }
    },
    methods: {
        fetchData() {
            window.IDM.http
                .post(
                    'ctrl/dbWorkbench/largeSizeDeptNoticeStatistics',
                    {
                        year: this.year
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then((res) => {
                    this.data = res.data.data
                })
        }
    }
}
</script>
<style lang="scss" scoped></style>
