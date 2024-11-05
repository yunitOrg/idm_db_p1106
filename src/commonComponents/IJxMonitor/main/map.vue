<template>
    <Chart :option="config" @click="clickHandle" />
</template>
<script>
import * as echarts from 'echarts'
import Chart from '../chart.vue'
import jiangxi from './360000_full.json'
echarts.registerMap('jiangxi', jiangxi)
export default {
    props: {
        data: []
    },
    components: {
        Chart
    },
    computed: {
        config() {
            const mapName = 'jiangxi'
            return {
                backgroundColor: '',
                visualMap: {
                    show: true,
                    bottom: 0,
                    right: '5%',
                    type: 'piecewise',
                    align: 'left',
                    orient: 'vertical',
                    inverse: true,
                    textStyle: {
                        color: '#95cfee',
                        fontSize: 12
                    },
                    itemGap: 10,
                    pieces: [
                        {
                            gt: -1000,
                            lte: 10,
                            color: echarts.graphic.RadialGradient(0.5, 0.5, 1.4, [
                                {
                                    offset: 0,
                                    color: 'rgba(35,227,202,0.7)'
                                }
                            ]),
                            label: '0-10',
                            symbol: 'circle'
                        },
                        {
                            gt: 10,
                            lt: 20,
                            // color: "rgba(82,127,239,0.5)",
                            color: new echarts.graphic.RadialGradient(0.5, 0.5, 1.4, [
                                {
                                    offset: 0,
                                    color: 'rgba(82,127,239,0.7)'
                                }
                            ]),
                            label: '10-20',
                            symbol: 'circle'
                        },
                        {
                            gt: 20,
                            lte: 30,
                            // color: "rgba(249,198,44,0.5)",
                            color: new echarts.graphic.RadialGradient(0.5, 0.5, 1.4, [
                                {
                                    offset: 0,
                                    color: 'rgba(249,198,44,0.7)'
                                }
                            ]),
                            label: '20-30',
                            symbol: 'circle'
                        },
                        {
                            gt: 30,
                            colorAlpha: 1,
                            opacity: 1,
                            // color: "rgba(240,77,77,0.5)",
                            color: new echarts.graphic.RadialGradient(0.5, 0.5, 1.4, [
                                {
                                    offset: 0,
                                    color: 'rgba(240,77,77,0.7)'
                                }
                            ]),
                            label: '>30',
                            symbol: 'circle'
                        }
                    ]
                },
                tooltip: {
                    show: true,
                    trigger: 'item',
                    formatter: function (params) {
                        const fields = [params.name]
                        fields.push(`督办事项：${params.value || 0}`)
                        fields.push(`办理中：${params.data?.process || 0}`)
                        fields.push(`已办结：${params.data?.finish || 0}`)
                        fields.push(`超期：${params.data?.overdue || 0}`)
                        fields.push(`办结率：${params.data?.finishRate || 0}`)
                        fields.push(`已反馈：${params.data?.feedback || 0}`)
                        fields.push(`反馈率：${params.data?.feedbackRate || 0}`)
                        return fields.join('<br/>')
                    }
                },
                geo: [
                    {
                        map: mapName,
                        aspectScale: 0.8,
                        // zoom: this.propData.zoom,
                        top: '20%',
                        type: 'map',
                        z: 2,
                        layoutCenter: ['50%', '50%'],
                        layoutSize: '100%',
                        show: true,
                        roam: false,
                        label: {
                            emphasis: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                areaColor: {
                                    type: 'linear',
                                    x: 60,
                                    y: 10,
                                    x2: 20,
                                    y2: 110,
                                    colorStops: [
                                        {
                                            offset: 0,
                                            color: 'rgba(38,58,207,0.8)' // 0% 处的颜色
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(74,133,225,0.8)' // 50% 处的颜色
                                        }
                                    ],
                                    global: true // 缺省为 false
                                },
                                borderColor: '#fff',
                                borderWidth: 0.2
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: mapName,
                        type: 'map',
                        mapType: mapName,
                        selectedMode: 'false', //是否允许选中多个区域
                        showLegendSymbol: true,
                        roam: false,
                        top: '0%',
                        aspectScale: 0.8,
                        layoutSize: '100%',
                        layoutCenter: ['50%', '50%'],
                        // zoom: this.propData.zoom, //当前视角的缩放比例
                        itemStyle: {
                            normal: {
                                areaColor: 'transparent',
                                borderColor: '#80AAE1',
                                borderWidth: 2
                            },
                            //选中样式
                            emphasis: {
                                disabled: true,
                                borderWidth: 2,
                                label: {
                                    textStyle: {
                                        fontSize: 12,
                                        fontWeight: 'bolder',
                                        color: '#9CCDDC',
                                        shadowColor: 'rgba(39,76,193,0.4)',
                                        shadowBlur: 2,
                                        shadowOffsetX: 1,
                                        shadowOffsetY: 1
                                    }
                                },
                                borderColor: '#80AAE1',
                                areaColor: 'transparent'
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: 12,
                                    fontWeight: 'bolder',
                                    color: '#9CCDDC',
                                    shadowColor: 'rgba(39,76,193,0.4)',
                                    shadowBlur: 2,
                                    shadowOffsetX: 1,
                                    shadowOffsetY: 1
                                }
                            }
                        },
                        data: this.data
                    }
                ]
            }
        }
    },
    methods: {
        clickHandle(params) {
            if (params.type == 'click' && params.componentType == 'series' && params.componentSubType == 'map') {
                this.$emit('navigate', this.data[params.dataIndex])
            }
        }
    }
}
</script>
