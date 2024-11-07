<template>
    <Section title="办理用时">
        <Chart :option="config" @click="navigateHandle" class="h-full" />
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
            activeTab: 1
        }
    },
    computed: {
        filter() {
            return {
                year: this.year,
                searchType: this.activeTab,
                asc: 'asc'
            }
        },
        config() {
            return {
                grid: {
                    top: 20,
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
                        data: this.data.map((n) => Math.floor(n.processTime * 10) / 10),
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
                            formatter: '{c} 天'
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
            window.IDM.http.get('ctrl/dbStatistics/processTimeStatistics', this.filter).then((res) => {
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
