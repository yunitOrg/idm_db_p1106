<template>
    <div ref="container" idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="idm-db-IFlowTable">
        <div class="flex progress-wrap">
            <div
                v-for="item in progress.data"
                :key="item.tabId"
                @click="progress.current = item.tabId"
                class="flex-1 w-0 flex justify-center items-center pointer progress-item"
                :class="{
                    info: item.tabStatus == 1,
                    success: item.tabStatus == 2,
                    active: item.tabId == progress.current
                }"
            >
                {{ item.tabName }}
            </div>
        </div>
        <div class="flex flex-col progress-content">
            <IFlowTableSection v-for="(item, index) in sections" :key="index" :type="item.type" :data="item" :children="item.infos" />
        </div>
    </div>
</template>
<script>
import { bindStyle, bindProp } from '../mixins'
import IFlowTableSection from '../commonComponents/IFlowTable/section.vue'
export default {
    mixins: [bindProp({}), bindStyle()],
    components: {
        IFlowTableSection
    },
    data() {
        return {
            progress: {
                data: [
                    {
                        tabId: 0,
                        tabName: '立项审核',
                        tabStatus: 2
                    },
                    {
                        tabId: 1,
                        tabName: '督查通知',
                        tabStatus: 2
                    },
                    {
                        tabId: 2,
                        tabName: '日常反馈',
                        tabStatus: 1
                    },
                    {
                        tabId: 3,
                        tabName: '办结反馈',
                        tabStatus: 0
                    }
                ],
                current: 2
            },
            sections: [
                {
                    type: 'table',
                    columns: [
                        {
                            title: '状态',
                            key: 'status',
                            type: 'status'
                        },
                        {
                            title: '办理环节',
                            key: 'a'
                        }
                    ],
                    data: [
                        {
                            status: 1,
                            a: '办理环节'
                        }
                    ]
                },
                {
                    title: '秘书一处',
                    badge: {
                        value: 2,
                        type: 'info'
                    },
                    status: {
                        text: '未反馈',
                        type: 'info'
                    },
                    tags: [
                        {
                            text: '缺失反馈',
                            type: 'danger'
                        }
                    ],
                    innerPadding: 20,
                    expanded: true,
                    children: [
                        {
                            title: '秘书一处',
                            badge: {
                                value: 2,
                                type: 'info'
                            },
                            expanded: true,
                            children: [
                                {
                                    type: 'table',
                                    columns: [
                                        {
                                            title: '状态',
                                            key: 'status',
                                            type: 'status'
                                        },
                                        {
                                            title: '办理环节',
                                            key: 'a'
                                        }
                                    ],
                                    data: [
                                        {
                                            status: 1,
                                            a: '办理环节'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: '秘书一处',
                            badge: {
                                value: 2,
                                type: 'info'
                            },
                            expanded: true,
                            children: [
                                {
                                    type: 'table',
                                    columns: [
                                        {
                                            title: '状态',
                                            key: 'status',
                                            type: 'status'
                                        },
                                        {
                                            title: '办理环节',
                                            key: 'a'
                                        }
                                    ],
                                    data: [
                                        {
                                            status: 1,
                                            a: '办理环节'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '秘书一处',
                    badge: {
                        value: 2,
                        type: 'info'
                    },
                    tags: [
                        {
                            text: '缺失反馈',
                            type: 'danger'
                        }
                    ],
                    innerPadding: 20,
                    children: [
                        {
                            title: '秘书一处',
                            badge: {
                                value: 2,
                                type: 'info'
                            },
                            children: [
                                {
                                    type: 'table',
                                    columns: [
                                        {
                                            title: '状态',
                                            key: 'status',
                                            type: 'status'
                                        },
                                        {
                                            title: '办理环节',
                                            key: 'a'
                                        }
                                    ],
                                    data: [
                                        {
                                            status: 1,
                                            a: '办理环节'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
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
        receiveBroadcastMessage(event) {},
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
@use '../style/common.scss';
.idm-db-IFlowTable {
    font-size: 16px;
}
.progress {
    &-wrap {
        padding: 30px 50px;
    }
    &-item {
        padding: 12px;
        color: #666;
        background: #eee;
        clip-path: polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 50% 200%, 0% 100%, 5% 50%);
        &:first-child {
            clip-path: polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 50% 200%, 0% 100%, 0% 0%);
        }
        &:last-child {
            clip-path: polygon(0% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 200%, 0% 100%, 5% 50%);
        }
        &.info {
            color: white;
            background: #0086d9;
        }
        &.success {
            color: white;
            background: #57bd6a;
        }
        &.active {
            position: relative;
            &:after {
                content: '';
                position: absolute;
                left: 50%;
                bottom: -35px;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border: 20px solid transparent;
                border-top: 10px solid #0086d9;
            }
        }
    }
    &-content {
        gap: 20px;
        padding: 20px;
    }
}
</style>
