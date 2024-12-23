<template>
    <div class="h-full flex flex-col cube-wrap" style="gap: 2.5rem">
        <div class="flex items-center justify-between">
            <div class="caption">办理效能分析</div>
            <div class="seg-warp hidden">
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
                        class="pointer cate-item"
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
                <div
                    v-for="item in rankData"
                    :key="item.value"
                    @click="dept.current = item.deptId"
                    class="pointer bar-item"
                    :class="{
                        active: dept.current == item.deptId
                    }"
                >
                    <div class="flex items-center info">
                        <div class="flex-1 w-0 turncate name">{{ item.deptName }}</div>
                        <div class="value">{{ item._value }}%</div>
                    </div>
                    <div
                        class="progressBar"
                        :style="{
                            '--percent': `${item._value}%`
                        }"
                    ></div>
                </div>
            </div>
            <div class="flex flex-col pannel">
                <div class="flex items-center justify-center pointer dropdown">
                    <div class="flex items-center name">{{ dept.data.find((n) => n.unitId == dept.current)?.unitName }}</div>
                    <select v-model="dept.current">
                        <option v-for="item in dept.data" :key="item.unitId" :value="item.unitId">{{ item.unitName }}</option>
                    </select>
                </div>
                <div class="flex-1 h-0 data-wrap">
                    <div v-for="(group, groupIndex) in dataGroup" :key="groupIndex" class="data-list">
                        <div v-for="(item, itemIndex) in group" :key="itemIndex" class="data-item" :data-suffix="item.suffix != null">
                            <div class="name">{{ item.label }}</div>
                            <div class="flex justify-center value-wrap">
                                <div class="flex items-center values">
                                    <div v-for="(char, charIndex) in item.value?.toString()" :key="charIndex" class="value">{{ char }}</div>
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
    props: {
        params: {
            type: Object
        }
    },
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
                data: [],
                current: null
            },
            data: []
        }
    },
    computed: {
        dataGroup() {
            const data = this.data.find((n) => n.deptId == this.dept.current)
            return [
                [
                    {
                        label: '事项数',
                        value: data?.total || 0
                    },
                    {
                        label: '已签收',
                        value: data?.signedTotal || 0
                    },
                    {
                        label: '已反馈',
                        value: data?.feedback || 0
                    },
                    {
                        label: '已办结',
                        value: data?.finish || 0
                    },
                    {
                        label: '退回数',
                        value: data?.sendBack || 0
                    },
                    {
                        label: '超期数',
                        value: data?.overdue || 0
                    }
                ],
                [
                    {
                        label: '签收率',
                        value: data?.signedRate || 0,
                        suffix: '%'
                    },
                    {
                        label: '反馈率',
                        value: data?.feedbackRate || 0,
                        suffix: '%'
                    },
                    {
                        label: '办结率',
                        value: data?.finishRate || 0,
                        suffix: '%'
                    },
                    {
                        label: '退回率',
                        value: data?.sendBackRate || 0,
                        suffix: '%'
                    }
                ]
            ]
        },
        rankData() {
            return this.data
                .map((n) => {
                    if (this.cate.current == 2) {
                        return {
                            ...n,
                            _value: n.onTimeFeedbackRate
                        }
                    }
                    if (this.cate.current == 3) {
                        return {
                            ...n,
                            _value: n.sendBackRate
                        }
                    }
                    return {
                        ...n,
                        _value: n.onTimeSignedRate
                    }
                })
                .sort((prev, current) => {
                    if (prev._value > current._value) {
                        return -1
                    }
                    if (prev._value < current._value) {
                        return 1
                    }
                    return 0
                })
        }
    },
    watch: {
        params: {
            handler() {
                this.fetchData()
            },
            immediate: true
        }
    },
    methods: {
        fetchData() {
            window.IDM.http
                .post(
                    'ctrl/dbWorkbench/getPadLeaderUnit',
                    {
                        ...this.params
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(({ data }) => {
                    this.dept = {
                        data: data.data,
                        current: data.data[0]?.unitId
                    }
                })
            window.IDM.http
                .post(
                    'ctrl/dbWorkbench/padLeaderPercentageStatistics',
                    {
                        ...this.params
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(({ data }) => {
                    this.data = data.data
                })
        }
    }
}
</script>
<style lang="scss" scoped>
.cube-wrap {
    background: url('./images/cube_bg.png') white no-repeat bottom;
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
        background: url('./images/cate_item.png') no-repeat bottom;
        background-size: 100%;
        width: 17.27rem;
        text-align: center;
        color: #333;
        font-size: 2.38rem;
        padding-bottom: 1.94rem;
        &.active {
            background-image: url('./images/cate_item_active.png');
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
    background: url('./images/cube_dorpdown.png') no-repeat;
    background-size: 100% 100%;
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
            background: url('./images/icon_arrow_down.png') no-repeat;
            background-size: 100% 100%;
        }
    }
    > select {
        position: absolute;
        inset: 0;
        opacity: 0;
        z-index: 1;
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
    padding: 1rem 0;
    &:last-child {
        border-bottom: none;
    }
    .data-item {
        background: url('./images/cube_data_item.png') repeat-x;
        background-size: auto 100%;
        background-position: left 2rem;
        padding-top: 1rem;
        --accent-color: #096efe;
        .name {
            font-size: 2.38rem;
            color: var(--accent-color);
            text-align: center;
            padding: 0 1rem;
        }
        .value-wrap {
            padding: 2rem;
            .values {
                position: relative;
                .value {
                    background: url('./images/number_bg.png') repeat-x;
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
            background-image: url('./images/cube_data_item2.png');
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
        .info {
            position: relative;
        }
        .value {
            font-size: 2.5rem;
            color: black;
        }
        .progressBar {
            position: relative;
            height: 1.88rem;
            background: #e5f4ff;
            border-radius: 0rem 6.25rem 6.25rem 0rem;
            &:after {
                position: absolute;
                display: block;
                content: '';
                width: var(--percent);
                top: 0;
                bottom: 0;
                left: 0;
                border-radius: 0rem 6.25rem 6.25rem 0rem;
                background: linear-gradient(180deg, #c0e4fe, #002b72) fixed;
            }
        }
        &.active {
            .name {
                color: #096efe;
            }
            .info {
                &:before {
                    position: absolute;
                    left: -1rem;
                    top: 50%;
                    display: block;
                    content: '';
                    width: 1.31rem;
                    height: 2rem;
                    background: url('./images/icon_arrow_right.png') no-repeat;
                    background-size: 100% 100%;
                    transform: translate(-100%, -50%);
                }
            }
        }
    }
}

@media only screen and (max-width: 1000px) {
    .data-list {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
