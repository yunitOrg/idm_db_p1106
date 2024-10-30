<template>
    <Section title="办理用时">
        <Chart :option="config" class="h-full" />
        <template #extra>
            <Tabs
                v-model="activeTab"
                :tabs="[
                    {
                        value: 1,
                        label: '省设市区'
                    },
                    {
                        value: 2,
                        label: '省级单位'
                    },
                    {
                        value: 3,
                        label: '办公厅'
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
            data: [
                {
                    deptId: '240605124740hM7LLCDwoNgbNTUjT1B',
                    deptName: '九江市人民政府办公室',
                    total: 0,
                    finishTotal: 0,
                    processTime: 24,
                    inProcessTotal: 0,
                    stopTotal: 0,
                    remindTotal: 0,
                    feedbackPercentage: '0%',
                    starLevel: 0
                },
                {
                    deptId: '240929163217aniDBqmffNDix7HaIgw',
                    deptName: '赣州市政府',
                    total: 0,
                    finishTotal: 0,
                    processTime: 3,
                    inProcessTotal: 0,
                    stopTotal: 0,
                    remindTotal: 0,
                    feedbackPercentage: '0%',
                    starLevel: 0
                }
            ],
            activeTab: 1
        }
    },
    computed: {
        filter() {
            return {
                year: this.year,
                searchType: this.activeTab,
                asc: 'desc'
            }
        },
        config() {
            return {
                grid: {
                    top: 20,
                    bottom: 20,
                    left: 20,
                    right: 20,
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
                        color: 'white'
                    }
                },
                series: [
                    {
                        data: this.data.map((n) => n.processTime),
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
                        barWidth: 30
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
        }
    }
}
</script>
