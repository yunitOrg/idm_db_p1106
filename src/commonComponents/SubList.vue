<template>
    <div class="pervise-wrap">
        <template v-if="isMutipleTask">
            <!-- 任务 -->
            <TaskItem
                v-for="(item, index) in dataSource"
                :data="item"
                :key="index"
                :moduleObject="moduleObject"
                @handleOptions="handleOptions"
                @handleContentJump="handleContentJump"
                @handleFileOpen="handleFileOpen"
            >
                <template #default="{ data }">
                    <SubList :record="data" :propData="propData" :moduleObject="moduleObject" />
                </template>
            </TaskItem>
        </template>
        <template v-else-if="isSingleNotice">
            <!-- 通知 -->
            <NoticeItem
                :themeList="propData.themeList"
                :porpsList="dataSource"
                origin="ItasklistDetail"
                @handleOptions="handleOptions"
                @handleContentJump="handleContentJump"
                @handleFileOpen="handleFileOpen"
            />
        </template>
    </div>
</template>
<script>
import NoticeItem from './NoticeItem.vue'
import TaskItem from './TaskItem.vue'
export default {
    name: 'SubList',
    props: {
        record: {
            type: Object,
            required: true
        },
        propData: {
            type: Object,
            required: true
        },
        moduleObject: {
            type: Object,
            required: true
        }
    },
    components: {
        NoticeItem,
        TaskItem
    },
    data() {
        return {
            dataSource: []
        }
    },
    computed: {
        isMutipleTask() {
            if (_.isArray(this.propData.handleTaskFunc) && this.propData.handleTaskFunc.length > 0) {
                return _.every(
                    window.IDM.invokeCustomFunctions(this.propData.handleTaskFunc, {
                        record: this.record
                    }),
                    Boolean
                )
            }
            return this.record.assignType == 3
        },
        isSingleNotice() {
            if (_.isArray(this.propData.handleNoticeFunc) && this.propData.handleNoticeFunc.length > 0) {
                return _.every(
                    window.IDM.invokeCustomFunctions(this.propData.handleNoticeFunc, {
                        record: this.record
                    }),
                    Boolean
                )
            }
            return [2, 4, -1].includes(this.record.assignType)
        }
    },
    watch: {
        record: {
            handler(record) {
                this.initData(record)
                    .then((data) => {
                        if (_.isArray(this.propData.hanldeInterfaceFunc) && this.propData.hanldeInterfaceFunc.length > 0) {
                            return _.flatten(
                                window.IDM.invokeCustomFunctions(this.propData.hanldeInterfaceFunc, {
                                    record,
                                    data
                                })
                            )
                        }
                        return data
                    })
                    .then((data) => {
                        this.dataSource = data
                        if (record.assignType && record.assignType != 1 && this.dataSource.length == 0) {
                            window.IDM.message.info('督办任务分解立项流程尚未流转完毕')
                        }
                    })
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        handleJiaImg() {
            return IDM.url.getModuleAssetsWebPath(require('../assets/jia.png'), this.moduleObject)
        },
        handleJianImg() {
            return IDM.url.getModuleAssetsWebPath(require('../assets/jian.png'), this.moduleObject)
        },
        // 附件跳转
        handleFileOpen(item) {
            if (this.propData.handleFileFunc && this.propData.handleFileFunc.length > 0) {
                let name = this.propData.handleFileFunc[0].name
                window[name] &&
                    window[name].call(this, {
                        _this: this,
                        item: item
                    })
            } else {
                if (top.Public) {
                    // 使用public.js调用方法
                    top.Public.officeLook(item.fileName, item.id, '', true, { officeModuleId: 'skyDrive' })
                }
            }
        },
        // 子项跳转
        handleContentJump(item) {
            if (this.propData.handleChildFunc && this.propData.handleChildFunc.length > 0) {
                const name = this.propData.handleChildFunc[0].name
                window[name] &&
                    window[name].call(this, {
                        _this: this,
                        item: item
                    })
            } else {
                window.open(window.IDM.url.getWebPath(item.lastFeedbackUrl))
            }
        },
        // 操作项
        handleOptions(obj) {
            if (_.isArray(this.propData.handleActionFunc) && this.propData.handleActionFunc.length > 0) {
                window.IDM.invokeCustomFunctions(this.propData.handleActionFunc, obj)
            }
        },
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {}
        },
        initData(record) {
            if (_.isArray(this.propData.handleRequestFunc) && this.propData.handleRequestFunc.length > 0) {
                return Promise.all(
                    window.IDM.invokeCustomFunctions(this.propData.handleRequestFunc, {
                        record
                    })
                ).then((...result) => {
                    return _.flatten(...result)
                })
            }
            switch (record.assignType) {
                case 2:
                case 4:
                    return window.IDM.http
                        .get('ctrl/dbNotice/getNextNoticeByNoticeId', {
                            noticeId: record.id
                        })
                        .then(({ data }) => {
                            return data.data
                        })
                case 3:
                    return window.IDM.http
                        .get('ctrl/dbTask/getSplitTaskByNoticeId', {
                            noticeId: record.id
                        })
                        .then(({ data }) => {
                            return data.data.map((n) => ({
                                ...n,
                                assignType: -1
                            }))
                        })
                case -1:
                    return window.IDM.http
                        .get('ctrl/dbNotice/getNextNoticeByTaskId', {
                            taskId: record.id
                        })
                        .then(({ data }) => {
                            return data.data
                        })
                default:
                    return Promise.resolve([])
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.ant-popover-placement-bottomRight {
    width: 100px !important;
    text-align: center !important;
}
.ant-popover-inner-content {
    padding: 0 !important;
    p {
        padding: 5px 16px !important;
        margin-bottom: 0 !important;
        cursor: pointer !important;
    }
    p:hover {
        background-color: rgba(0, 0, 0, 0.1) !important;
    }
    p + p {
        margin-top: 10px !important;
    }
}
.pervise-single-wrap {
    padding: 0 0 0 30px;
    .taskInfo-li {
        position: relative;
    }
    .taskInfo-li + .taskInfo-li {
        &::after {
            content: '';
            width: calc(100% - 30px);
            height: 1px;
            border-top: 1px dotted #ccc;
            position: absolute;
            top: 0;
            box-sizing: border-box;
            left: 0;
        }
    }
}
.super-inputbtn {
    width: 200px !important;
    margin-right: 20px !important;
}
.super-input {
    width: 200px !important;
    margin-right: 20px !important;
    input {
        height: 40px !important;
    }
}
</style>
