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
    components: {
        Section,
        Tabs,
        Chart
    },
    data() {
        const data = [
            {
                name: '南阳',
                value: 167
            },
            {
                name: '周口',
                value: 67
            },
            {
                name: '漯河',
                value: 123
            },
            {
                name: '郑州',
                value: 55
            },
            {
                name: '西峡',
                value: 98
            }
        ]
        return {
            config: {
                grid: {
                    top: 20,
                    bottom: 20,
                    left: 80,
                    right: 40
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
                    data: data.map((n) => n.name),
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
                        data: data.map((n) => n.value),
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
            },
            activeTab: 1
        }
    }
}
</script>
