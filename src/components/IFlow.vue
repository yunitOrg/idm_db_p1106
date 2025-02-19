<template>
    <div ref="container" idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" :class="['db-iflow', className.wrap]">
        <div v-for="(line, lineIndex) in data" :key="lineIndex" class="flex items-stretch line-item">
            <div class="flex justify-center items-center caption">
                <div
                    @click="clickHandle(line)"
                    class="flex justify-center items-center text-white bg-default caption-text"
                    :class="{
                        'bg-info': line.status == 2,
                        progress: line.status == 3,
                        'bg-success': line.status == 4
                    }"
                >
                    {{ line.name }}
                </div>
            </div>
            <div class="self-center flex-1">
                <div v-for="(group, groupIndex) in line.childNodes" :key="groupIndex" class="flex items-center group-item">
                    <div
                        @click="clickHandle(group)"
                        class="rounded-pill text-white text-center bg-default group-title"
                        :class="{
                            'bg-info': group.status == 2,
                            progress: group.status == 3,
                            'bg-success': group.status == 4
                        }"
                    >
                        {{ group.name }}
                    </div>
                    <div
                        v-for="(item, itemIndex) in group.childNodes"
                        :key="itemIndex"
                        @click="clickHandle(item)"
                        class="rounded-pill text-white text-center bg-default item"
                        :class="{
                            'bg-info': item.status == 2,
                            progress: item.status == 3,
                            'bg-success': item.status == 4
                        }"
                    >
                        <a-popover :title="item.name">
                            <template #content>
                                <div v-if="item.content" class="popover-content item-content" v-html="item.content"></div>
                            </template>
                            <div class="item-text">
                                <div>{{ item.name }}</div>
                            </div>
                        </a-popover>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { bindStyle, bindProp } from '../mixins'
export default {
    mixins: [bindProp({}), bindStyle()],
    data() {
        return {
            data: [],
            filter: {}
        }
    },
    watch: {
        filter: {
            handler() {
                this.fetchData()
            }
        }
    },
    methods: {
        receiveBroadcastMessage(event) {
            switch (event.type) {
                case 'linkageDemand':
                    this.filter = {
                        taskId: event.message.current[0]
                    }
                    break
            }
        },
        fetchData() {
            if (window.IDM.env_develop_mode) {
                this.data = [
                    {
                        name: '立项',
                        type: 0,
                        status: 2,
                        content: null,
                        childNodes: [
                            {
                                name: '开始',
                                type: 1,
                                status: 2,
                                content: null,
                                childNodes: [
                                    {
                                        name: '审批',
                                        type: 1,
                                        status: 2,
                                        content: null,
                                        childNodes: null
                                    },
                                    {
                                        name: '交办',
                                        type: 1,
                                        status: 3,
                                        content: null,
                                        childNodes: null
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: '通知',
                        type: 0,
                        status: 2,
                        content: null,
                        childNodes: [
                            {
                                name: '市政府办公厅',
                                type: 1,
                                status: 2,
                                content: null,
                                childNodes: [
                                    {
                                        name: '待签收',
                                        type: 1,
                                        status: 1,
                                        content: null,
                                        childNodes: null
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: '反馈',
                        type: 0,
                        status: 1,
                        content: null,
                        childNodes: [
                            {
                                name: '市政府办公厅',
                                type: 1,
                                status: 1,
                                content: null,
                                childNodes: null
                            }
                        ]
                    },
                    {
                        name: '办结',
                        type: 0,
                        status: 1,
                        content: null,
                        childNodes: [
                            {
                                name: '发起办结',
                                type: 1,
                                status: 1,
                                content: null,
                                childNodes: null
                            },
                            {
                                name: '审批',
                                type: 1,
                                status: 1,
                                content: null,
                                childNodes: null
                            },
                            {
                                name: '办结',
                                type: 1,
                                status: 1,
                                content: null,
                                childNodes: null
                            }
                        ]
                    }
                ]
            }
            window.IDM.http.get('ctrl/dbTask/getProgress', this.filter).then((res) => {
                this.data = res.data.data
            })
        },
        clickHandle(record) {
            if (this.propData.clickFunctions?.length > 0) {
                window.IDM.invokeCustomFunctions.call(this, this.propData.clickFunctions, {
                    record
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.flex {
    display: flex;
}
.flex-1 {
    flex: 1;
}
.justify-center {
    justify-content: center;
}
.items-center {
    align-items: center;
}
.items-stretch {
    align-items: stretch;
}
.self-center {
    align-self: center;
}
.bg-default {
    background-color: #dadada;
}
.bg-info {
    background-color: var(--primary);
}
.bg-success {
    background-color: #47ca6a;
}
.text-white {
    color: white;
}
.text-center {
    text-align: center;
}
.rounded-pill {
    border-radius: 50em;
}
.db-iflow {
    --primary: #0091ff;
    --line-color: #979797;
    .line-item {
        .caption {
            padding: 60px;
            position: relative;
            &-text {
                width: 120px;
                height: 120px;
                border-radius: 50em;
                font-size: 30px;
            }
            &:before,
            &:after {
                position: absolute;
                content: '';
                display: block;
                width: 100%;
                height: calc(50% - 70px);
                left: 0;
            }
            &:before {
                top: 0;
                background: url('../assets/flow/line_arrow.png') no-repeat bottom center,
                    linear-gradient(to bottom, var(--primary) 50%, transparent 50%) repeat-y bottom center/3px 10px;
            }
            &:after {
                bottom: 0;
                background: url('../assets/flow/line_dot.png') no-repeat top center, linear-gradient(to bottom, var(--primary) 50%, transparent 50%) repeat-y top center/3px 10px;
            }
        }
        &:first-child {
            .caption {
                &::before {
                    display: none;
                }
            }
        }
        &:last-child {
            .caption {
                &::after {
                    display: none;
                }
            }
        }
    }
    .group {
        &-item {
            padding: 10px 60px;
            gap: 120px;
            position: relative;
            &:before {
                position: absolute;
                content: '';
                display: block;
                background: linear-gradient(to bottom, transparent 50%, var(--line-color) 50%) repeat-y left / 2px 10px,
                    linear-gradient(to right, transparent 50%, var(--line-color) 50%) repeat-x left center / 10px 2px;
                width: 38px;
                left: 0;
                top: 0;
                bottom: 0;
            }
            &:first-child {
                &:before {
                    top: calc(50% - 1px);
                    background: linear-gradient(to bottom, transparent 50%, var(--line-color) 50%) repeat-y left / 2px 10px,
                        linear-gradient(to right, transparent 50%, var(--line-color) 50%) repeat-x left top / 10px 2px;
                }
            }
            &:last-child {
                &:before {
                    bottom: calc(50% - 1px);
                    background: linear-gradient(to bottom, transparent 50%, var(--line-color) 50%) repeat-y left / 2px 10px,
                        linear-gradient(to right, transparent 50%, var(--line-color) 50%) repeat-x left bottom / 10px 2px;
                }
            }
            &:only-child {
                &:before {
                    left: -30px;
                    width: 70px;
                    background: linear-gradient(to right, transparent 50%, var(--line-color) 50%) repeat-x left bottom / 10px 2px;
                }
            }
        }
        &-title {
            width: 260px;
            padding: 17px;
            font-size: 24px;
        }
    }
    .item {
        position: relative;
        width: 260px;
        padding: 17px;
        font-size: 24px;
        line-height: 150%;
        &:before {
            position: absolute;
            content: '';
            display: block;
            width: 58px;
            height: 52px;
            left: 0;
            top: 50%;
            transform: translate(-150%, -50%);
            background: url('../assets/flow/next_active.png') no-repeat center/ 100% 100%;
        }
        &:has(.item-content) {
            .item-content {
                display: none;
            }
            &:hover {
                font-size: 18px;
                .item-content {
                    display: block;
                }
            }
        }
    }
    .progress {
        border: 3px solid var(--primary);
        background: none;
        color: black;
    }
}
.popover-content {
    font-size: 16px;
    width: 300px;
    padding: 10px;
}
</style>
