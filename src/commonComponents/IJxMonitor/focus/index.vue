<template>
    <Section title="重难点事项">
        <div class="h-full flex flex-col justify-center stat-wrap">
            <div class="flex justify-between stat-list-wrap">
                <div v-for="stat in stats" :key="stat.key" class="flex-1 w-0 flex flex-col stat-item" :class="[`stat-item-type-${stat.type}`]">
                    <div class="flex-1 h-0 stat-item-value">
                        <template v-if="stat.type == 1 || stat.type == 2">
                            {{ stat.value }}
                        </template>
                    </div>
                    <div class="stat-item-title">{{ stat.title }}</div>
                </div>
            </div>
            <div class="flex-1 h-0 flex items-stretch stat-table-wrap">
                <dv-scroll-board :config="urgeConfig" class="flex-1 w-0" />
                <dv-scroll-board :config="timeoutConfig" class="flex-1 w-0" />
            </div>
        </div>
    </Section>
</template>
<script>
import Section from '../section/index.vue'
export default {
    props: {
        year: {
            type: String,
            required: true
        }
    },
    components: {
        Section
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
                    key: '1',
                    title: '催办数',
                    value: this.data.noticeTimesUrgeTotal,
                    type: 1
                },
                {
                    key: '2',
                    title: '催办率',
                    value: this.data.noticeUrgePercentage,
                    type: 3
                },
                {
                    key: '3',
                    title: '超期数',
                    value: this.data.noticeTimeoutTotal,
                    type: 2
                },
                {
                    key: '4',
                    title: '超期率',
                    value: this.data.noticeTimeoutPercentage,
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
                data: this.data.urgeData?.map((n) => [n.unitName, n.noticeTotal, n.noticeTimesUrge]) || []
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
                data: this.data.timeoutData?.map((n) => [n.unitName, n.noticeTotal, n.noticeTimeoutPercentage]) || []
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
                .get('dbWorkbench/largeSizeNoticeStatistics', {
                    year: this.year
                })
                .then((res) => {
                    this.data = res.data
                })
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
            background: url('./images/type1.png') no-repeat center -10px/ 100% auto;
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
</style>
