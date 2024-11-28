<template>
    <Section title="办理质效">
        <div class="flex flex-col h-full">
            <div class="flex items-center tab-wrap">
                <div
                    v-for="tab in queryTab.data"
                    :key="tab.value"
                    @click="queryTab.current = tab.value"
                    class="pointer tab-item"
                    :class="{
                        active: tab.value == queryTab.current
                    }"
                >
                    {{ tab.label }}
                </div>
            </div>
            <Chart :option="config" @click="navigateHandle" class="flex-1 h-0" />
        </div>

        <template #extra>
            <Tabs
                v-model="activeTab"
                :tabs="[
                    {
                        value: 1,
                        label: '省设区市'
                    },
                    {
                        value: 2,
                        label: '省直单位'
                    },
                    {
                        value: 3,
                        label: '省办公厅'
                    }
                ]"
            />
        </template>
    </Section>
</template>
<script>
import Chart from '../chart.vue'
import Section from '../section/index.vue'
import Tabs from '../tabs.vue'
export default {
    props: {
        year: {
            type: String,
            required: true
        }
    },
    components: {
        Section,
        Tabs,
        Chart
    },
    data() {
        return {
            data: [],
            activeTab: 1,
            queryTab: {
                data: [
                    {
                        label: '按时签收率',
                        value: 1
                    },
                    {
                        label: '按时反馈率',
                        value: 2
                    },
                    {
                        label: '退回率',
                        value: 3
                    }
                ],
                current: 1
            }
        }
    },
    computed: {
        filter() {
            return {
                year: this.year,
                statisticsType: this.queryTab.current,
                queryType: this.activeTab,
                asc: 'asc'
            }
        },
        config() {
            return {
                grid: {
                    top: 0,
                    bottom: 20,
                    left: 20,
                    right: 60,
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    axisLabel: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'category',
                    data: this.data.map((n) => n.deptName),
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        fontSize: '20px',
                        color: 'white',
                        overflow: 'break',
                        lineHeight: 30,
                        width: 100
                    },
                    inverse: true,
                    max: 4
                },
                series: [
                    {
                        data: this.data.map((n) => Math.floor(n.percentageNum * 10) / 10),
                        type: 'bar',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(0,0,0,0.4)'
                        },
                        color: {
                            type: 'linear',
                            colorStops: [
                                {
                                    offset: 0,
                                    color: '#32C5FF'
                                },
                                {
                                    offset: 1,
                                    color: '#44D7B6'
                                }
                            ]
                        },
                        itemStyle: {
                            borderRadius: [0, 30, 30, 0]
                        },
                        barWidth: 30,
                        legendHoverLink: false,
                        label: {
                            show: true,
                            position: 'right',
                            fontSize: 20,
                            color: 'white',
                            formatter: '{c} %'
                        }
                    }
                ]
            }
        }
    },
    watch: {
        filter: {
            handler() {
                this.fetchData()
            },
            immediate: true
        }
    },
    methods: {
        fetchData() {
            window.IDM.http
                .post('ctrl/dbWorkbench/largeSizePercentageStatistics', this.filter, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((res) => {
                    this.data = res.data.data
                })
        },
        navigateHandle(params) {
            if (params.type == 'click' && params.componentType == 'series' && params.componentSubType == 'bar') {
                this.$emit('navigate', this.data[params.dataIndex])
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.tab {
    &-wrap {
        padding: 10px 20px;
        gap: 20px;
        font-size: 20px;
    }
    &-item {
        color: #3effff;
        &.active {
            color: #e4d077;
            font-size: 1.1em;
        }
    }
}
</style>
