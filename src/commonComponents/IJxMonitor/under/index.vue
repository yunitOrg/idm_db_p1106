<template>
    <Section title="承办情况">
        <Chart class="h-full" :option="config"></Chart>
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
            config: {
                series: [
                    {
                        type: 'gauge',
                        startAngle: 180,
                        endAngle: 0,
                        min: 0,
                        max: 100,
                        splitNumber: 10,
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
                            roundCap: true,
                            width: 15
                        },
                        pointer: {
                            icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                            length: '75%',
                            width: 16,
                            offsetCenter: [0, '5%']
                        },
                        axisLine: {
                            roundCap: true,
                            lineStyle: {
                                width: 15
                            }
                        },
                        axisTick: {
                            splitNumber: 2,
                            lineStyle: {
                                width: 2,
                                color: '#0873C4'
                            }
                        },
                        splitLine: {
                            length: 12,
                            lineStyle: {
                                width: 3,
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
                        data: [
                            {
                                value: 70
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        startAngle: 180,
                        endAngle: 0,
                        min: 0,
                        max: 100,
                        splitNumber: 10,
                        center: ['75%', '70%'],
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
                            roundCap: true,
                            width: 15
                        },
                        pointer: {
                            icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                            length: '75%',
                            width: 16,
                            offsetCenter: [0, '5%']
                        },
                        axisLine: {
                            roundCap: true,
                            lineStyle: {
                                width: 15
                            }
                        },
                        axisTick: {
                            splitNumber: 2,
                            lineStyle: {
                                width: 2,
                                color: '#0873C4'
                            }
                        },
                        splitLine: {
                            length: 12,
                            lineStyle: {
                                width: 3,
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
                                value: 70
                            }
                        ]
                    }
                ]
            }
        }
    }
}
</script>
<style lang="scss" scoped></style>
