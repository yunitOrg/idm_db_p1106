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
        <Stat
            v-model="statIndex"
            :data="[
                {
                    id: 1,
                    name: '发改委'
                },
                {
                    id: 2,
                    name: 'aaa'
                }
            ]"
            :stats="[
                {
                    id: 1,
                    value: 12,
                    label: '督办事项'
                },
                {
                    id: 2,
                    value: 12,
                    label: '督办事项'
                },
                {
                    id: 3,
                    value: 12,
                    label: '督办事项'
                }
            ]"
        />
        <div class="flex-1 h-0 data-wrap">
            <div class="data-caption">省级单位</div>
            <div>
                <div v-for="item in data" :key="item.id" class="data-item">
                    <div class="data-item-value">
                        <div class="text">在办：{{ item.current }} / 已办结：{{ item.finish }}</div>
                    </div>
                    <div class="data-item-title">
                        {{ item.title }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Chart from '../chart.vue'
import Stat from './stat.vue'
export default {
    components: {
        Stat
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
            stats: [
                {
                    id: 1,
                    value: 12,
                    label: '督办事项'
                },
                {
                    id: 2,
                    value: 12,
                    label: '督办事项'
                },
                {
                    id: 3,
                    value: 12,
                    label: '督办事项'
                }
            ],
            data: [
                {
                    key: '1',
                    title: '重要批示',
                    current: 51,
                    finish: 28
                },
                {
                    key: '2',
                    title: '重要文件',
                    current: 51,
                    finish: 28
                },
                {
                    key: '3',
                    title: '重点任务',
                    current: 51,
                    finish: 28
                },
                {
                    key: '4',
                    title: '交办事项',
                    current: 51,
                    finish: 28
                },
                {
                    key: '5',
                    title: '调查核实',
                    current: 51,
                    finish: 28
                },
                {
                    key: '6',
                    title: '建议提案',
                    current: 51,
                    finish: 28
                }
            ],
            config: {},
            activeTab: 1
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

.data-wrap {
    position: relative;
    background: url('./images/data_bg.png') no-repeat center center;
    color: white;
    .data-caption {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -400%);
        font-size: 30px;
    }
    .data-item {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 300px;
        &-title {
            font-size: 25px;
            color: white;
        }
        &-value {
            padding: 16px 0;
            background: url('./images/data_value_bg.png') no-repeat center bottom;
            .text {
                font-size: 20px;
                @extend .blue-text;
            }
        }
        &:nth-child(1) {
            left: 13%;
            top: 12%;
        }
        &:nth-child(2) {
            left: 9.5%;
            top: 32%;
        }
        &:nth-child(3) {
            left: 13%;
            top: 52%;
        }
        &:nth-child(4) {
            right: 13%;
            top: 12%;
        }
        &:nth-child(5) {
            right: 9.5%;
            top: 32%;
        }
        &:nth-child(6) {
            right: 13%;
            top: 52%;
        }
    }
}
</style>
