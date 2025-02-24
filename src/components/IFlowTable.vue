<template>
    <div ref="container" idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="idm-db-IFlowTable">
        <div class="flex progress-wrap">
            <div
                v-for="item in progress.data"
                :key="item.tabId"
                @click="processChangeHandle(item)"
                class="flex-1 w-0 flex justify-center items-center pointer progress-item"
                :class="{
                    info: item.tabStatus == 1,
                    success: item.tabStatus == 2,
                    active: item.tabId == progress.current
                }"
            >
                <svg-icon v-if="item.tabStatus == 2" icon-class="check" class="i-checked"></svg-icon>
                {{ item.tabName }}
            </div>
        </div>
        <div class="flex flex-col progress-content">
            <IFlowTableSection v-for="item in sections" :key="item.key" :moduleObject="moduleObject" :data="item" />
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
                data: [],
                current: null
            },
            sections: [],
            key: ''
        }
    },
    watch: {
        'progress.current': {
            handler(value) {
                this.fetchData(value)
            }
        }
    },
    mounted() {
        this.fetchTabs()
    },
    methods: {
        receiveBroadcastMessage(event) {},
        fetchTabs() {
            if (window.IDM.env_develop_mode) {
                this.progress = {
                    data: [
                        {
                            tabId: '0',
                            tabName: '立项审核',
                            tabStatus: '2',
                            selected: false
                        },
                        {
                            tabId: '1',
                            tabName: '督查通知',
                            tabStatus: '2',
                            selected: false
                        },
                        {
                            tabId: '2',
                            tabName: '日常反馈',
                            tabStatus: '2',
                            selected: false
                        },
                        {
                            tabId: '3',
                            tabName: '办结反馈',
                            tabStatus: '2',
                            selected: true
                        }
                    ],
                    current: '3'
                }
                this.sections = [
                    {
                        id: '2502181612174Kbc8H3mAmtRfKyzBFT',
                        type: 'pannel',
                        title: '秘书处',
                        collapseable: false,
                        expanded: true,
                        innerPadding: 0,
                        icon: 'host',
                        tags: null,
                        headers: null,
                        data: null,
                        children: [
                            {
                                id: '2502181612174Kbc8H3mAmtRfKyzBFT',
                                type: 'table',
                                title: null,
                                collapseable: false,
                                expanded: true,
                                innerPadding: null,
                                icon: null,
                                tags: null,
                                headers: [
                                    {
                                        text: '状态',
                                        key: 'status',
                                        tag: null,
                                        type: 'status'
                                    },
                                    {
                                        text: '办理环节',
                                        key: 'actName',
                                        tag: null,
                                        type: ''
                                    },
                                    {
                                        text: '办理部门',
                                        key: 'deptName',
                                        tag: null,
                                        type: ''
                                    },
                                    {
                                        text: '办理人',
                                        key: 'handleUName',
                                        tag: null,
                                        type: ''
                                    },
                                    {
                                        text: '接收时间',
                                        key: 'rDate',
                                        tag: null,
                                        type: ''
                                    },
                                    {
                                        text: '阅读时间',
                                        key: 'pDate',
                                        tag: null,
                                        type: ''
                                    },
                                    {
                                        text: '办理时间',
                                        key: 'eDate',
                                        tag: null,
                                        type: ''
                                    },
                                    {
                                        text: '办理用时',
                                        key: 'handleTime',
                                        tag: null,
                                        type: ''
                                    }
                                ],
                                data: [
                                    {
                                        deptName: '办公厅/督查室',
                                        handleTime: '',
                                        pDate: '2025-02-18 16:12',
                                        rDate: '2025-02-18 16:12',
                                        overDesc: '',
                                        alt: '已处理',
                                        isOver: false,
                                        eDate: '2025-02-18 16:12:18',
                                        actName: '开始',
                                        handleUName: '张亨叶',
                                        status: 'flow_processed.png'
                                    },
                                    {
                                        deptName: '秘书处',
                                        handleTime: '1分10秒',
                                        pDate: '2025-02-18 16:12',
                                        rDate: '2025-02-18 16:12',
                                        overDesc: '',
                                        alt: '已处理',
                                        isOver: false,
                                        eDate: '2025-02-18 16:13:28',
                                        actName: '承办司局督查联络员接收督办通知',
                                        handleUName: '周航',
                                        status: 'flow_processed.png'
                                    },
                                    {
                                        deptName: '秘书处',
                                        handleTime: '31秒',
                                        pDate: '2025-02-18 16:13',
                                        rDate: '2025-02-18 16:13',
                                        overDesc: '',
                                        alt: '已处理',
                                        isOver: false,
                                        eDate: '2025-02-18 16:13:59',
                                        actName: '承办司局主要负责人批示',
                                        handleUName: '周航',
                                        status: 'flow_processed.png'
                                    },
                                    {
                                        deptName: '秘书处',
                                        handleTime: '23时36分18秒',
                                        pDate: '',
                                        rDate: '2025-02-18 16:13',
                                        overDesc: '',
                                        alt: '未读',
                                        isOver: false,
                                        eDate: '',
                                        actName: '承办司局分管负责人批示',
                                        handleUName: '周东升',
                                        status: 'flow_unread.png',
                                        colspan:3
                                    }
                                ],
                                children: null
                            }
                        ]
                    }
                ]
                return
            }
            window.IDM.http.get('ctrl/dbOverview/flow/tab', window.IDM.url.queryObject()).then((res) => {
                this.progress = {
                    data: res.data.data,
                    current: res.data.data.find((n) => n.selected).tabId
                }
            })
        },
        fetchData(tabId) {
            if (window.IDM.env_develop_mode) {
                this.sections = [
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
                        tags: [
                            {
                                text: 2,
                                type: 'info',
                                tag: 'badge'
                            },
                            {
                                text: '未反馈',
                                type: 'info',
                                tag: 'status'
                            },
                            {
                                text: '缺失反馈',
                                type: 'danger',
                                tag: 'tag'
                            }
                        ],
                        innerPadding: 20,
                        expanded: true,
                        children: [
                            {
                                title: '秘书一处',
                                tags: [
                                    {
                                        text: 2,
                                        type: 'info',
                                        tag: 'badge'
                                    }
                                ],
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
                                tags: [
                                    {
                                        text: 2,
                                        type: 'info',
                                        tag: 'badge'
                                    }
                                ],
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
                        tags: [
                            {
                                text: 2,
                                type: 'info',
                                tag: 'badge'
                            },
                            {
                                text: '缺失反馈',
                                type: 'danger',
                                tag: 'tag'
                            }
                        ],
                        innerPadding: 20,
                        children: [
                            {
                                title: '秘书一处',
                                tags: [
                                    {
                                        text: 2,
                                        type: 'info',
                                        tag: 'badge'
                                    }
                                ],
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
            window.IDM.http
                .get('ctrl/dbOverview/flow/tab/info', {
                    ...window.IDM.url.queryObject(),
                    tabId
                })
                .then((res) => {
                    this.sections = res.data.data.map((n) => ({
                        ...n,
                        key: n.id + res.data.serverTime
                    }))
                })
        },
        processChangeHandle(item) {
            if (item.tabStatus == 0) return
            this.progress.current = item.tabId
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
        gap: 8px;
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
    }
}
.i-checked {
    width: 24px;
    height: 24px;
    fill: white;
}
</style>
