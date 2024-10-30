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
                            <div class="text">3</div>
                            <div class="up">1</div>
                        </div>
                    </div>
                </div>
                <div class="flex stat-item">
                    <img src="./images/反馈.png" />
                    <div class="">
                        <div class="title">反馈</div>
                        <div class="flex justify-center items-center value">
                            <div class="text">13</div>
                            <div class="up">5</div>
                        </div>
                    </div>
                </div>
                <div class="flex stat-item">
                    <img src="./images/办结.png" />
                    <div class="">
                        <div class="title">办结</div>
                        <div class="flex justify-center items-center value">
                            <div class="text">2</div>
                            <div class="up">1</div>
                        </div>
                    </div>
                </div>
                <div class="flex stat-item">
                    <img src="./images/超期.png" />
                    <div class="flex-1 w-0">
                        <div class="title">超期</div>
                        <div class="flex justify-center items-center value">
                            <div class="text">0</div>
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
    components: {
        Section,
        Tabs
    },
    data() {
        return {
            config: {
                data: [
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
            },
            activeTab: 1
        }
    }
}
</script>
<style lang="scss" scoped>
.stat-wrap {
    padding:40px 0;
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
