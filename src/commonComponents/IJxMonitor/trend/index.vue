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
            <div class="flex flex-wrap stat-wrap">
                <div class="flex stat-item">
                    <img src="./images/立项.png" />
                    <div class="flex-1 w-0">
                        <div class="title">立项</div>
                        <div class="flex justify-center items-center value">
                            <div class="text">{{ data.taskTotal }}</div>
                            <div v-if="data.incrTaskTotal" class="up">{{ data.incrTaskTotal }}</div>
                        </div>
                    </div>
                </div>
                <div class="flex stat-item">
                    <img src="./images/反馈.png" />
                    <div class="">
                        <div class="title">反馈</div>
                        <div class="flex justify-center items-center value">
                            <div class="text">{{ data.taskProcessDoneTotal }}</div>
                            <div v-if="data.incrTaskProcessDoneTotal" class="up">{{ data.incrTaskProcessDoneTotal }}</div>
                        </div>
                    </div>
                </div>
                <div class="flex stat-item">
                    <img src="./images/办结.png" />
                    <div class="">
                        <div class="title">办结</div>
                        <div class="flex justify-center items-center value">
                            <div class="text">{{ data.taskFinishTotal }}</div>
                            <div v-if="data.incrTaskFinishTotal" class="up">{{ data.incrTaskFinishTotal }}</div>
                        </div>
                    </div>
                </div>
                <div class="flex stat-item">
                    <img src="./images/超期.png" />
                    <div class="flex-1 w-0">
                        <div class="title">超期</div>
                        <div class="flex justify-center items-center value">
                            <div class="text">{{ data.taskTimeoutTotal }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Section>
</template>
<script>
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
        Tabs
    },
    data() {
        return {
            data: {},
            activeTab: 1
        }
    },
    watch: {
        activeTab: {
            handler() {
                this.fetchData()
            },
            immediate: true
        }
    },
    methods: {
        fetchData() {
            window.IDM.http
                .get('dbWorkbench/largeSizeTaskTrend', {
                    dateType: this.activeTab,
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
.stat-wrap {
    padding: 40px 0;
    .stat-item {
        width: 50%;
        .title {
            font-size: 22px;
            background: linear-gradient(to bottom, #ffffff, #09a2e3);
            color: transparent;
            background-clip: text;
        }
        .value {
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
    }
}
</style>
