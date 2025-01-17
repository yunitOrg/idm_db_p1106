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
            <IFlowTableSection v-for="(item, index) in sections" :key="index" :moduleObject="moduleObject" :data="item" />
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
            sections: []
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
                    this.sections = res.data.data
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
        padding: 20px;
    }
}
.i-checked {
    width: 24px;
    height: 24px;
    fill: white;
}
</style>
