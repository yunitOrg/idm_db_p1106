<template>
    <Section title="督办总览">
        <div class="h-full flex flex-col justify-center dash-wrap">
            <div class="flex justify-between stat-wrap">
                <div
                    v-for="stat in stats"
                    :key="stat.key"
                    @click="
                        navigateHandle({
                            taskStatusType: stat.key
                        })
                    "
                    class="flex flex-col justify-around pointer stat-item"
                >
                    <div class="stat-item-value">{{ stat.value }}</div>
                    <div class="stat-item-title">{{ stat.title }}</div>
                </div>
            </div>
            <div class="flex-1 h-0 flex items-stretch" @click="chartNavigateHandle($event)">
                <Chart class="flex-1 w-0" :option="config"></Chart>
            </div>
        </div>
    </Section>
</template>
<script>
import Chart from '../chart.vue'
import Section from '../section/index.vue'
export default {
    props: {
        year: {
            type: String,
            required: true
        }
    },
    components: {
        Section,
        Chart
    },
    data() {
        return {
            data: {
                taskFinishPercentage: '0%',
                taskFeedbackPercentage: '0%'
            }
        }
    },
    computed: {
        stats() {
            return [
                {
                    key: 'taskTotal',
                    title: '立项数',
                    value: this.data.taskTotal
                },
                {
                    key: 'taskNotFinishTotal',
                    title: '在办数',
                    value: this.data.taskNotFinishTotal
                },
                {
                    key: 'taskFinishTotal',
                    title: '办结数',
                    value: this.data.taskFinishTotal
                },
                {
                    key: 'taskYesFeedbackTotal',
                    title: '反馈数',
                    value: this.data.taskYesFeedbackTotal
                }
            ]
        },
        config() {
            return {
                series: [
                    this.chartConfig({
                        center: ['25%', '70%'],
                        detail: {
                            backgroundColor: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: 'rgba(6,65,173,0)'
                                    },
                                    {
                                        offset: 0.9,
                                        color: 'rgba(14,118,214,0.23)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(0,145,255,0.23)'
                                    }
                                ]
                            },
                            width: '200%',
                            lineHeight: 36,
                            height: 36,
                            offsetCenter: [0, '30%'],
                            valueAnimation: true,
                            formatter: function (value) {
                                return '{label|办结率}{value|' + value.toFixed(0) + '%}'
                            },
                            rich: {
                                value: {
                                    fontSize: 28,
                                    fontWeight: 'bold',
                                    color: '#fff'
                                },
                                label: {
                                    fontSize: 14,
                                    color: '#DCF0FF',
                                    padding: [0, 5, 0, 0]
                                }
                            }
                        },
                        data: [
                            {
                                value: parseFloat(this.data.taskFinishPercentage.replace('%', ''))
                            }
                        ]
                    }),
                    this.chartConfig({
                        center: ['75%', '70%'],
                        detail: {
                            backgroundColor: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: 'rgba(6,65,173,0)'
                                    },
                                    {
                                        offset: 0.9,
                                        color: 'rgba(14,118,214,0.23)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(0,145,255,0.23)'
                                    }
                                ]
                            },
                            width: '200%',
                            lineHeight: 36,
                            height: 36,
                            offsetCenter: [0, '30%'],
                            valueAnimation: true,
                            formatter: function (value) {
                                return '{label|反馈率}{value|' + value.toFixed(0) + '%}'
                            },
                            rich: {
                                value: {
                                    fontSize: 29,
                                    fontWeight: 'bold',
                                    color: '#fff'
                                },
                                label: {
                                    fontSize: 14,
                                    color: '#DCF0FF',
                                    padding: [0, 5, 0, 0]
                                }
                            }
                        },
                        data: [
                            {
                                value: parseFloat(this.data.taskFeedbackPercentage.replace('%', ''))
                            }
                        ]
                    })
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
                    'ctrl/dbWorkbench/largeSizeTaskStatistics',
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
        chartConfig(option) {
            return Object.assign(
                {},
                {
                    type: 'gauge',
                    startAngle: 180,
                    endAngle: 0,
                    min: 0,
                    max: 100,
                    splitNumber: 20,
                    center: ['25%', '70%'],
                    radius: '100%',
                    itemStyle: {
                        color: '#0068FF',
                        shadowColor: 'rgba(0,138,255,0.45)',
                        shadowBlur: 10,
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    },
                    progress: {
                        show: true,
                        roundCap: false,
                        width: 15
                    },
                    pointer: {
                        icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                        length: '50%',
                        width: 8,
                        offsetCenter: [0, '5%']
                    },
                    axisLine: {
                        roundCap: false,
                        lineStyle: {
                            width: 5,
                            color: [[1, '#0873C4']],
                            shadowColor: '#006FFF',
                            shadowBlur: 20
                        }
                    },
                    splitLine: {
                        length: 20,
                        distance: 30,
                        lineStyle: {
                            width: 2,
                            color: '#0873C4'
                        }
                    },
                    axisTick: {
                        splitNumber: 50,
                        distance: 45,
                        length: 2,
                        lineStyle: {
                            width: 4,
                            color: '#0873C4'
                        }
                    },
                    axisLabel: false,
                    title: {
                        show: false
                    },
                    detail: {
                        backgroundColor: {
                            type: 'linear',
                            x: 0,
                            y: 1,
                            x2: 1,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: 'rgba(6,65,173,0)'
                                },
                                {
                                    offset: 0.9,
                                    color: 'rgba(14,118,214,0.23)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(0,145,255,0.23)'
                                }
                            ]
                        },
                        width: '200%',
                        lineHeight: 36,
                        height: 36,
                        offsetCenter: [0, '30%'],
                        valueAnimation: true,
                        formatter: function (value) {
                            return '{label|办结率}{value|' + value.toFixed(0) + '%}'
                        },
                        rich: {
                            value: {
                                fontSize: 28,
                                fontWeight: 'bold',
                                color: '#fff'
                            },
                            label: {
                                fontSize: 14,
                                color: '#DCF0FF',
                                padding: [0, 5, 0, 0]
                            }
                        }
                    },
                    data: []
                },
                option
            )
        },
        navigateHandle(item) {
            this.$emit('navigate', item)
        },
        chartNavigateHandle(event){
            if (event.offsetX < event.currentTarget.offsetWidth / 2){
                this.navigateHandle({taskStatusType:"taskFinishTotal"})
            }else{
                this.navigateHandle({taskStatusType:"taskYesFeedbackTotal"})
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.dash {
    &-wrap {
        padding: 30px 20px 20px;
    }
}
.stat {
    &-wrap {
    }
    &-item {
        background: url('./images/stat_item_bg.png') no-repeat;
        width: 140px;
        height: 117px;
        color: white;
        text-align: center;
        &-value {
            font-size: 22px;
            padding-top: 20px;
        }
        &-title {
            font-size: 14px;
            padding: 8px 0;
            background-image: linear-gradient(270deg, rgba(0, 102, 255, 0) 0%, rgba(0, 104, 255, 0.8) 50%, rgba(0, 102, 255, 0) 100%);
        }
    }
}
</style>
