<template>
    <Section title="督办趋势">
        <div class="h-full flex flex-col">
            <div class="flex-1 h-0 flex justify-center items-center">
                <Tabs
                    v-model="activeTab"
                    :tabs="[
                        {
                            value: 1,
                            label: '本周'
                        },
                        {
                            value: 2,
                            label: '本月'
                        },
                        {
                            value: 3,
                            label: '本季度'
                        }
                    ]"
                />
            </div>
            <div class="flex flex-wrap trend-wrap">
                <div class="trend-item">
                    <div class="trend-item-title">立项</div>
                    <div class="flex justify-center items-center trend-item-value">
                        <div class="text">{{ data.taskTotal }}</div>
                        <div v-if="data.incrTaskTotal" class="up">{{ data.incrTaskTotal }}</div>
                    </div>
                </div>
                <div class="trend-item">
                    <div class="trend-item-title">反馈</div>
                    <div class="flex justify-center items-center trend-item-value">
                        <div class="text">{{ data.taskProcessDoneTotal }}</div>
                        <div v-if="data.incrTaskProcessDoneTotal" class="up">{{ data.incrTaskProcessDoneTotal }}</div>
                    </div>
                </div>
                <div class="trend-item">
                    <div class="trend-item-title">办结</div>
                    <div class="flex justify-center items-center trend-item-value">
                        <div class="text">{{ data.taskFinishTotal }}</div>
                        <div v-if="data.incrTaskFinishTotal" class="up">{{ data.incrTaskFinishTotal }}</div>
                    </div>
                </div>
                <div class="trend-item">
                    <div class="trend-item-title">超期</div>
                    <div class="flex justify-center items-center trend-item-value">
                        <div class="text">{{ data.taskTimeoutTotal }}</div>
                    </div>
                </div>
            </div>
        </div>
    </Section>
</template>
<script>
import Section from '../section/index.vue'
import Tabs from '../tabs.vue'
const lx = require('./images/lx.png')
const fk = require('./images/fk.png')
const bj = require('./images/bj.png')
const cq = require('./images/cq.png')
export default {
    props: {
        year: {
            type: String,
            required: true
        }
    },
    components: {
        Section,
        Tabs
    },
    data() {
        return {
            data: {},
            activeTab: 1
        }
    },
    computed: {
        filter() {
            return {
                dateType: this.activeTab,
                year: this.year
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
                .post('ctrl/dbWorkbench/largeSizeTaskTrend', this.filter, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((res) => {
                    this.data = res.data.data
                })
        }
    }
}
</script>
<style lang="scss" scoped>
.trend-wrap {
    padding: 40px 0;
    .trend-item {
        width: 50%;
        height:106px;
        padding-left: 148px;
        background: url('./images/lx.png') no-repeat left center;
        &-title {
            font-size: 22px;
            background: linear-gradient(to bottom, #ffffff, #09a2e3);
            color: transparent;
            background-clip: text;
        }
        &-value {
            background: url('./images/dock.png') no-repeat bottom center;
            width: 134px;
            gap: 20px;
            .text {
                font-size: 40px;
                background: linear-gradient(to bottom, #fdffff, #ffc507);
                color: transparent;
                background-clip: text;
            }
            .up {
                font-size: 20px;
                color: white;
                padding: 10px 0 0 20px;
                background: url('./images/up.png') no-repeat left 17px;
            }
        }
        &:nth-child(1) {
            background-image: url('./images/lx.png');
        }
        &:nth-child(2) {
            background-image: url('./images/fk.png');
        }
        &:nth-child(3) {
            background-image: url('./images/bj.png');
        }
        &:nth-child(4) {
            background-image: url('./images/cq.png');
        }
    }
}
</style>
