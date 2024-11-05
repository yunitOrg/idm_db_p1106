<template>
    <Section title="重难点事项">
        <div class="h-full flex flex-col justify-center stat-wrap">
            <div class="flex justify-between stat-list-wrap">
                <div
                    v-for="stat in stats"
                    :key="stat.key"
                    @click="
                        navigateHandle({
                            type: stat.key
                        })
                    "
                    class="flex-1 w-0 flex flex-col stat-item"
                    :class="[`stat-item-type-${stat.type}`]"
                >
                    <div class="flex-1 h-0 stat-item-value">
                        <template v-if="stat.type == 1 || stat.type == 2">
                            {{ stat.value }}
                        </template>
                        <Chart v-else-if="stat.type == 3" :option="chartConfig(stat)" class="h-full" />
                    </div>
                    <div class="stat-item-title">{{ stat.title }}</div>
                </div>
            </div>
            <div class="flex-1 h-0 flex items-stretch stat-table-wrap">
                <dv-scroll-board
                    :config="urgeConfig"
                    @click="
                        (e) =>
                            navigateHandle({
                                type: 'urge',
                                ...e,
                                data: data.urgeData[e.rowIndex]
                            })
                    "
                    class="flex-1 w-0 stat-table"
                />
                <dv-scroll-board
                    :config="timeoutConfig"
                    @click="
                        (e) =>
                            navigateHandle({
                                type: 'timeout',
                                ...e,
                                data: data.timeoutData[e.rowIndex]
                            })
                    "
                    class="flex-1 w-0 stat-table"
                />
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
            data: {}
        }
    },
    computed: {
        stats() {
            return [
                {
                    key: 'noticeTimesUrgeTotal',
                    title: '催办数',
                    value: this.data.noticeTimesUrgeTotal || 0,
                    type: 1
                },
                {
                    key: 'noticeUrgePercentage',
                    title: '催办率',
                    value: this.data.noticeUrgePercentage || '0%',
                    type: 3
                },
                {
                    key: 'noticeTimeoutTotal',
                    title: '超期数',
                    value: this.data.noticeTimeoutTotal || 0,
                    type: 2
                },
                {
                    key: 'noticeTimeoutPercentage',
                    title: '超期率',
                    value: this.data.noticeTimeoutPercentage || '0%',
                    type: 3
                }
            ]
        },
        urgeConfig() {
            return {
                header: ['部门', '催办数', '催办率'],
                headerBGC: 'rgba(6,65,173,0.36)',
                oddRowBGC: 'transparent',
                evenRowBGC: 'rgba(6,65,173,0.12)',
                headerHeight: 48,
                rowNum: 4,
                align: ['left', 'center', 'center'],
                data: this.data.urgeData?.map((n) => [n.unitName, n.noticeTimesUrge, n.noticeUrgePercentage]) || []
            }
        },
        timeoutConfig() {
            return {
                header: ['部门', '超期数', '超期率'],
                headerBGC: 'rgba(6,65,173,0.36)',
                oddRowBGC: 'transparent',
                evenRowBGC: 'rgba(6,65,173,0.12)',
                headerHeight: 48,
                rowNum: 4,
                align: ['left', 'center', 'center'],
                data: this.data.timeoutData?.map((n) => [n.unitName, n.noticeTimeout, n.noticeTimeoutPercentage]) || []
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
                    'ctrl/dbWorkbench/largeSizeNoticeStatistics',
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
        chartConfig(stat) {
            return {
                series: [
                    {
                        type: 'gauge',
                        startAngle: 90,
                        endAngle: -270,
                        axisLine: {
                            show: false,
                            lineStyle: {
                                width: 5,
                                color: [
                                    [0.3, '#58bdf9'],
                                    [0.7, '#6f88cb'],
                                    [1, '#dc8176']
                                ]
                            }
                        },
                        pointer: {
                            show: false
                        },
                        progress: {
                            show: true,
                            itemStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        {
                                            offset: 0,
                                            color: '#58bdf9' // 0% 处的颜色
                                        },
                                        {
                                            offset: 0.5,
                                            color: '#6f88cb' // 0% 处的颜色
                                        },
                                        {
                                            offset: 1,
                                            color: '#dc8176' // 100% 处的颜色
                                        }
                                    ],
                                    global: false // 缺省为 false
                                }
                            }
                        },
                        axisTick: {
                            distance: -10,
                            length: 10,
                            lineStyle: {
                                color: 'rgba(0,99,184,0.14)',
                                width: 2
                            }
                        },
                        splitLine: {
                            distance: -10,
                            length: 30,
                            lineStyle: {
                                color: 'transparent',
                                width: 4
                            }
                        },
                        axisLabel: {
                            show: false
                        },
                        detail: {
                            valueAnimation: true,
                            formatter: '{value}%',
                            color: 'white',
                            fontSize: '18px',
                            offsetCenter: [0, 0]
                        },
                        data: [
                            {
                                value: parseFloat(stat.value.replace('%', ''))
                            }
                        ]
                    }
                ]
            }
        },
        navigateHandle(item) {
            this.$emit('navigate', item)
        }
    }
}
</script>
<style lang="scss" scoped>
.stat {
    &-wrap {
        padding: 20px;
        gap: 16px;
    }
    &-table-wrap {
        gap: 26px;
    }
    &-list-wrap {
        gap: 12px;
    }
    &-item {
        background: rgba(0, 99, 184, 0.14);
        height: 176px;
        color: white;
        text-align: center;
        border-radius: 8px;
        padding: 0 6px;
        &-title {
            font-size: 18px;
            padding: 14px 0;
            border-top: 1px solid transparent;
        }
        &-type-1,
        &-type-2 {
            background: url('./images/type1.png') no-repeat center -10px;
            .stat-item-value {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 38px;
            }
        }
        &-type-2 {
            background-image: url('./images/type2.png');
        }
        &-type-3 {
            .stat-item-title {
                border-top: 1px solid rgba(74, 123, 255, 0.4);
            }
        }
    }
}
.stat-table {
    :deep(.rows) {
        .row-item {
            overflow: hidden;
        }
        .ceil {
            overflow: visible;
            text-overflow: unset;
        }
    }
}
</style>
