<template>
    <div class="h-full flex flex-col cube-wrap" style="gap: 2.5rem">
        <div class="flex items-center justify-between">
            <div class="caption">办理效能分析</div>
            <div class="seg-warp">
                <div class="seg-item">省政府各部门</div>
            </div>
        </div>
        <div class="flex-1 h-0 flex items-stretch" style="gap: 6rem">
            <div class="flex flex-col">
                <div class="flex-1 h-0 flex flex-col justify-center items-center cate-list">
                    <div
                        v-for="item in cate.data"
                        :key="item.value"
                        @click="cate.current = item.value"
                        class="cate-item"
                        :class="{
                            active: item.value == cate.current
                        }"
                    >
                        <div>{{ item.text }}</div>
                    </div>
                </div>
                <div class="indicator">
                    <div class="flex items-center label max">高</div>
                    <div class="flex items-center label min">低</div>
                </div>
            </div>
            <div class="flex-1 w-0 flex flex-col justify-around bar-wrap">
                <div v-for="item in dept.data" :key="item.value" class="bar-item">
                    <div class="flex items-center">
                        <div class="flex-1 w-0 turncate name">{{ item.label }}</div>
                        <div class="value">100%</div>
                    </div>
                    <div class="progressBar"></div>
                </div>
            </div>
            <div class="flex flex-col pannel">
                <div class="flex items-center justify-center pointer dropdown">
                    <div class="flex items-center name">{{ dept.current?.label }}</div>
                </div>
                <div class="flex-1 h-0 data-wrap">
                    <div v-for="(group, groupIndex) in dataGroup" :key="groupIndex" class="data-list">
                        <div v-for="(item, itemIndex) in group" :key="itemIndex" class="data-item" :data-suffix="item.suffix != null">
                            <div class="name">{{ item.label }}</div>
                            <div class="value-wrap">
                                <div class="flex items-center values">
                                    <div v-for="(char, charIndex) in item.value.toString()" :key="charIndex" class="value">{{ char }}</div>
                                    <div v-if="item.suffix" class="suffix">{{ item.suffix }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            cate: {
                data: [
                    {
                        value: 1,
                        text: '按时签收率'
                    },
                    {
                        value: 2,
                        text: '按时反馈率'
                    },
                    {
                        value: 3,
                        text: '退回率'
                    }
                ],
                current: 1
            },
            dept: {
                data: [
                    {
                        label: '省发改委',
                        value: 1
                    },
                    {
                        label: '省财政厅',
                        value: 2
                    },
                    {
                        label: '省应急管理厅',
                        value: 3
                    },
                    {
                        label: '省地方金融管理厅',
                        value: 4
                    },
                    {
                        label: '省统计局',
                        value: 5
                    },
                    {
                        label: '省国动办',
                        value: 6
                    },
                    {
                        label: '省管理局',
                        value: 7
                    }
                ],
                current: {
                    label: '省发改委',
                    value: 1
                }
            },
            dataGroup: [
                [
                    {
                        label: '事项数',
                        value: 100
                    },
                    {
                        label: '事项数',
                        value: 100
                    },
                    {
                        label: '事项数',
                        value: 100
                    },
                    {
                        label: '事项数',
                        value: 100,
                        suffix: '%'
                    }
                ],
                [
                    {
                        label: '事项数',
                        value: 100
                    },
                    {
                        label: '事项数',
                        value: 100
                    },
                    {
                        label: '事项数',
                        value: 100
                    },
                    {
                        label: '事项数',
                        value: 100,
                        suffix: '%'
                    }
                ]
            ]
        }
    }
}
</script>
<style lang="scss" scoped>
.cube-wrap {
    background: url('./images/底部bg.png') white no-repeat bottom;
    background-size: 100% auto;
    padding: 1.5rem 3.75rem 5rem;
    border-radius: 1.25rem;
}
.caption {
    font-size: 3rem;
    color: #333;
}
.seg-warp {
    background: #f4f4f4;
    border-radius: 0.9rem;
    padding: 0.72rem 1.02rem;
    .seg-item {
        background: #ffffff;
        border-radius: 0.75rem;
        color: #096efe;
        font-size: 2.13rem;
        padding: 0.3rem 0.75rem;
    }
}
.pannel {
    background: #ffffff;
    border: 0.06rem solid rgba(225, 225, 225, 1);
    box-shadow: 0rem 0.13rem 0.75rem 0rem rgba(0, 0, 0, 0.1);
    border-radius: 1.25rem;
}
.cate-list {
    gap: 4.56rem;
    .cate-item {
        background: url('./images/默认bg.png') no-repeat bottom;
        background-size: 100%;
        width: 17.27rem;
        text-align: center;
        color: #333;
        font-size: 2.38rem;
        padding-bottom: 1.94rem;
        &.active {
            background-image: url('./images/选中bg.png');
        }
    }
}
.indicator {
    position: relative;
    align-self: flex-end;
    background-image: linear-gradient(180deg, #c0e4fe 0%, #002b72 100%);
    width: 2.63rem;
    height: 10.75rem;
    .label {
        position: absolute;
        left: -0.2rem;
        font-size: 1.75rem;
        color: #666;
        gap: 0.25rem;
        &:after {
            content: '';
            display: block;
            width: 0;
            height: 0;
            border: 0.63rem solid transparent;
        }
        &.max {
            top: 0;
            transform: translate(-100%, -50%);
            &:after {
                border-color: transparent transparent transparent #c0e4fe;
            }
        }
        &.min {
            bottom: 0;
            transform: translate(-100%, 50%);
            &:after {
                border-color: transparent transparent transparent #002b72;
            }
        }
    }
}
.dropdown {
    position: relative;
    width: 30.5rem;
    height: 5.38rem;
    align-self: center;
    &:after {
        position: absolute;
        content: '';
        display: block;
        inset: 0;
        background: #e2f0fe;
        box-shadow: inset 0rem 0rem 1.38rem 0rem rgba(161, 202, 255, 0.21);
        border-radius: 0 0 0.63rem 0.63rem;
        transform: perspective(20px) rotateX(-2deg);
    }
    .name {
        position: relative;
        z-index: 1;
        color: #096efe;
        font-size: 2.38rem;
        gap: 0.31rem;
        &:after {
            content: '';
            display: block;
            width: 1.5rem;
            height: 0.95rem;
            background: url('./images/三角形2.png') no-repeat;
            background-size: 100% 100%;
        }
    }
}
.data-wrap {
    overflow-y: auto;
    padding: 0 1.5rem 2.8rem;
}
.data-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr;
    justify-content: space-between;
    grid-column-gap: 2.25rem;
    border-bottom: 1px dashed #979797;
    padding: 1.86rem 0;
    &:last-child {
        border-bottom: none;
    }
    .data-item {
        background: url('./images/元素bg1.png') repeat-x;
        background-size: auto 100%;
        background-position: left 2.9rem;
        padding-top: 1rem;
        --accent-color: #096efe;
        .name {
            font-size: 2.38rem;
            color: var(--accent-color);
            text-align: center;
        }
        .value-wrap {
            padding: 2rem;
            .values {
                position: relative;
                .value {
                    background: url('./images/数字bg.png') repeat-x;
                    background-size: 100% 100%;
                    font-size: 2.75rem;
                    color: var(--accent-color);
                    text-align: center;
                    padding: 0.44rem 0.97rem;
                    font-weight: bold;
                }
                .suffix {
                    position: absolute;
                    color: var(--accent-color);
                    font-size: 2.38rem;
                    bottom: 0;
                    right: 0;
                    transform: translateX(100%);
                }
            }
        }
        &[data-suffix] {
            background-image: url('./images/编组 21.png');
            --accent-color: #27a661;
        }
    }
}
.bar-wrap {
    .bar-item {
        .name {
            font-size: 2.38rem;
            color: #333;
        }
        .value {
            font-size: 2.5rem;
            color: black;
        }
        .progressBar {
            height: 1.88rem;
            background: #e5f4ff;
            border-radius: 0rem 6.25rem 6.25rem 0rem;
        }
    }
}
</style>
