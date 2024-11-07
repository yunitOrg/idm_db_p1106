<template>
    <Section title="承办情况">
        <Chart class="h-full" :option="config" @click="clickHandle"></Chart>
    </Section>
</template>
<script>
import Chart from '../chart.vue'
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
                    data: [
                        {
                            name: '任务数',
                            itemStyle: {
                                color: 'rgba(3,255,198,1)'
                            }
                        },
                        {
                            name: '办结数',
                            itemStyle: {
                                color: 'rgba(247,181,0,1)'
                            }
                        },
                        '反馈数'
                    ],
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
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(86,216,255,0.37)'
                        }
                    },
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLabel: {
                        textStyle: {
                            color: 'rgba(175,232,255,1)',
                            fontSize: 14
                        },
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
                        show: true,
                        lineStyle: {
                            color: 'rgba(86,216,255,0.37)'
                        }
                    },
                    axisTick: {
                        show: true
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        color: '#AFE8FF',
                        fontSize: 14
                    },
                    name: '单位（个）',
                    nameTextStyle: {
                        color: 'rgba(175,232,255,1)',
                        fontSize: 14
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
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        {
                                            offset: 0,
                                            color: 'rgba(3,255,198,1)'
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(3,255,198,0)'
                                        }
                                    ]
                                }
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
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        {
                                            offset: 0,
                                            color: 'rgba(247,181,0,1)'
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(247,181,0,0)'
                                        }
                                    ]
                                }
                            }
                        },
                        data: this.data.map((n) => n.noticeFinishTotal)
                    },
                    {
                        name: '反馈数',
                        type: 'line',
                        symbolSize: 12,
                        itemStyle: {
                            borderColor: '#fff',
                            color: 'rgba(50,197,255,1)',
                            borderWidth: 2
                        },
                        lineStyle: {
                            color: 'rgba(50,197,255,1)',
                            width: 4
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
                        endValue: 8,
                        height: 0,
                        showDetail: false
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
        },
        clickHandle(params) {
            if (params.type == 'click' && params.componentType == 'series' && params.componentSubType == 'bar') {
                this.$emit('navigate', this.data[params.dataIndex])
            }
        }
    }
}
</script>
<style lang="scss" scoped></style>
