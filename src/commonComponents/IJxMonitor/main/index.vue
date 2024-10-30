<template>
    <div class="flex flex-col map-wrap">
        <div class="flex justify-center tabs-wrap">
            <div
                v-for="tab in tabs"
                :key="tab.value"
                @click="activeTab = tab.value"
                class="tabs-item"
                :class="{
                    active: tab.value == activeTab
                }"
            >
                <div class="text">{{ tab.label }}</div>
            </div>
        </div>
        <Stat v-model="statIndex" :data="options" :stats="stats" />
        <Map v-if="activeTab == 1" :data="data" class="flex-1 h-0"> </Map>
        <Cube v-else class="flex-1 h-0" :title="tabs[activeTab-1].label" :data="data" />
    </div>
</template>
<script>
import Stat from './stat.vue'
import Map from './map.vue'
import Cube from './cube.vue'
export default {
    props: {
        year: {
            type: String,
            required: true
        },
        queryType: {
            type: String,
            required: true
        }
    },
    components: {
        Stat,
        Map,
        Cube
    },
    data() {
        return {
            tabs: [
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
            ],
            statIndex: 0,
            data: [
                {
                    orgId: '240605111547UkW9ZVY3Xn9xROiRyGv',
                    orgName: '督查处',
                    total: 0,
                    process: 0,
                    finish: 0,
                    overdue: 0,
                    feedback: 0,
                    finishRate: '0%',
                    feedbackRate: '0%'
                },
                {
                    orgId: '240605112157ipkqr1oMCVpufqqUn0z',
                    orgName: '省领导',
                    total: 0,
                    process: 0,
                    finish: 0,
                    overdue: 0,
                    feedback: 0,
                    finishRate: '0%',
                    feedbackRate: '0%'
                },
                {
                    orgId: '240923160329OEmDpKRtsrAPje5r1Mx',
                    orgName: '秘书处',
                    total: 0,
                    process: 0,
                    finish: 0,
                    overdue: 0,
                    feedback: 0,
                    finishRate: '0%',
                    feedbackRate: '0%'
                },
                {
                    orgId: '240923160350cl6TI0d9Vt7kcx6LVu1',
                    orgName: '秘书一处',
                    total: 0,
                    process: 0,
                    finish: 0,
                    overdue: 0,
                    feedback: 0,
                    finishRate: '0%',
                    feedbackRate: '0%'
                },
                {
                    orgId: '240923160423JR4Y2ysDJUGbhpWm5vS',
                    orgName: '秘书二处',
                    total: 0,
                    process: 0,
                    finish: 0,
                    overdue: 0,
                    feedback: 0,
                    finishRate: '0%',
                    feedbackRate: '0%'
                },
                {
                    orgId: '240924102309dfv8qIxGScsWeW5yR6T',
                    orgName: '会议处',
                    total: 0,
                    process: 0,
                    finish: 0,
                    overdue: 0,
                    feedback: 0,
                    finishRate: '0%',
                    feedbackRate: '0%'
                },
                {
                    orgId: '240924102327A818IIQ1bSIyuuVSocw',
                    orgName: '综合处',
                    total: 0,
                    process: 0,
                    finish: 0,
                    overdue: 0,
                    feedback: 0,
                    finishRate: '0%',
                    feedbackRate: '0%'
                },
                {
                    orgId: '240924102345oApZJR4GF4DkBIGD9t1',
                    orgName: '调研处',
                    total: 0,
                    process: 0,
                    finish: 0,
                    overdue: 0,
                    feedback: 0,
                    finishRate: '0%',
                    feedbackRate: '0%'
                },
                {
                    orgId: '240924102417wOe0P1iGSO9vaqvfQm9',
                    orgName: '政策法规处',
                    total: 0,
                    process: 0,
                    finish: 0,
                    overdue: 0,
                    feedback: 0,
                    finishRate: '0%',
                    feedbackRate: '0%'
                },
                {
                    orgId: '240924102819ObYECedJflmmmGDaMU1',
                    orgName: '秘书三处',
                    total: 0,
                    process: 0,
                    finish: 0,
                    overdue: 0,
                    feedback: 0,
                    finishRate: '0%',
                    feedbackRate: '0%'
                },
                {
                    orgId: '240924102838Ih9Urn11DAt9SJMmCuz',
                    orgName: '秘书四处',
                    total: 0,
                    process: 0,
                    finish: 0,
                    overdue: 0,
                    feedback: 0,
                    finishRate: '0%',
                    feedbackRate: '0%'
                },
                {
                    orgId: '240924102850hhAB58VBZDZZPvgM4EV',
                    orgName: '秘书五处',
                    total: 0,
                    process: 0,
                    finish: 0,
                    overdue: 0,
                    feedback: 0,
                    finishRate: '0%',
                    feedbackRate: '0%'
                },
                {
                    orgId: '240924102907wsW4JxwwrhOakTtwkCc',
                    orgName: '秘书六处',
                    total: 0,
                    process: 0,
                    finish: 0,
                    overdue: 0,
                    feedback: 0,
                    finishRate: '0%',
                    feedbackRate: '0%'
                },
                {
                    orgId: '240929173802IsFVREpjcIL04Zlgb8l',
                    orgName: '厅领导',
                    total: 0,
                    process: 0,
                    finish: 0,
                    overdue: 0,
                    feedback: 0,
                    finishRate: '0%',
                    feedbackRate: '0%'
                },
                {
                    orgId: '240929174023rt1yxKFHOq58FCEXhBm',
                    orgName: '派驻纪检监察组',
                    total: 0,
                    process: 0,
                    finish: 0,
                    overdue: 0,
                    feedback: 0,
                    finishRate: '0%',
                    feedbackRate: '0%'
                }
            ],
            config: {},
            activeTab: 1
        }
    },
    computed: {
        filter() {
            return {
                year: this.year,
                queryType: this.activeTab
            }
        },

        options() {
            return this.data.map((n) => ({
                id: n.orgId,
                name: n.orgName
            }))
        },
        stats() {
            if (this.data.length == 0) return []
            return [
                {
                    id: 'total',
                    value: this.data[this.statIndex].total,
                    label: '督办事项'
                },
                {
                    id: 'process',
                    value: this.data[this.statIndex].process,
                    label: '办理中'
                },
                {
                    id: 'finish',
                    value: this.data[this.statIndex].finish,
                    label: '已办结'
                },
                {
                    id: 'overdue',
                    value: this.data[this.statIndex].overdue,
                    label: '超期'
                },
                {
                    id: 'finishRate',
                    value: this.data[this.statIndex].finishRate,
                    label: '办结率'
                },
                {
                    id: 'feedback',
                    value: this.data[this.statIndex].feedback,
                    label: '已反馈'
                },
                {
                    id: 'feedbackRate',
                    value: this.data[this.statIndex].feedbackRate,
                    label: '反馈率'
                }
            ]
        },
        mapData() {
            return this.data.map((n) => ({
                name: n.orgName,
                value: n.total,
                ...n
            }))
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
            window.IDM.http.get('ctrl/dbLargeScreen/map', this.filter).then((res) => {
                this.data = res.data.data
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.blue-text {
    background: linear-gradient(to bottom, #ffffff, #09a2e3);
    color: transparent;
    background-clip: text;
}
.map-wrap {
    gap: 30px;
}
.tabs-wrap {
    gap: 10px;
    .tabs-item {
        cursor: pointer;
        padding: 6px 23px;
        position: relative;
        .text {
            @extend .blue-text;
            position: relative;
            font-size: 30px;
            z-index: 1;
        }
        &:after {
            position: absolute;
            z-index: 0;
            content: '';
            display: block;
            left: 0;
            right: 0;
            bottom: 0;
            height: 31px;
            background-image: linear-gradient(90deg, rgba(3, 63, 200, 0) 4%, rgba(3, 74, 200, 0.5) 51%, rgba(3, 54, 200, 0) 100%);
        }
        &.active {
            .text {
                background-image: linear-gradient(to bottom, #ffffff, #e3b909);
            }
            &:after {
                background-image: linear-gradient(90deg, rgba(200, 174, 3, 0) 0%, rgba(200, 174, 3, 0.23) 50%, rgba(200, 174, 3, 0) 100%);
            }
        }
    }
}
</style>
