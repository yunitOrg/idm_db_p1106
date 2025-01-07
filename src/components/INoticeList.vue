<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="idm-db-INoticeList" :class="className.wrap">
        <div class="taskInfo" ref="container">
            <div class="taskInfo-li" v-for="(item, index) in dataSource" :key="index">
                <!--左侧-->
                <div class="subtaskLeft">
                    <div class="subtask-label">
                        <span :class="statusClass(item)" v-if="item.dbStatusText">{{ item.dbStatusText }}</span>
                        <span class="subtask-red" v-if="item.timeoutStatusText && item.timeoutStatus != 0">{{ item.timeoutStatusText }}</span>
                    </div>
                    <div class="subtask-popleft">
                        <div class="flex items-center">
                            <img src="../assets/home.png" alt="" class="taskinfo-title-icon" />
                            <span>{{ item.handlerUnitText }} &nbsp;{{ item.feedbackPeriodText }}</span>
                        </div>
                        <div v-if="item.startDate" class="flex items-center">
                            <img src="../assets/time1.png" alt="" class="taskinfo-title-icon" />
                            <span>{{ item.startDate }} ~ {{ item.endDate }}</span>
                        </div>
                        <div v-if="item.handlerText" class="flex items-center">
                            <img src="../assets/phone.png" alt="" class="taskinfo-title-icon" />
                            <span style="margin-right: 5px">{{ item.handlerText }}</span>
                            <span v-if="item.handlerTel">({{ item.handlerTel }})</span>
                        </div>
                    </div>
                </div>
                <!--右侧-->
                <div class="flex-1 w-0 flex items-start subtaskRight">
                    <div v-if="item.lastFeedbackDate" class="flex items-center right-time">
                        <svg-icon icon-class="time"></svg-icon>
                        {{ item.lastFeedbackDate }}
                    </div>
                    <div class="right-content">
                        <div class="task-font" @click="handleJump(item)" v-if="item.lastFeedbackContent">
                            <div v-html="item.lastFeedbackContent"></div>
                            <div class="task-file">
                                <div v-for="(file, fileIndex) in item.lastFeedbackAttachFiles" :key="fileIndex" @click.stop="handleOpen(file)" class="flex items-center file-item">
                                    <svg-icon icon-class="file"></svg-icon>
                                    <div class="name">{{ file.fileName }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="right-svg">
                            <a-badge
                                v-if="item.unreadInstruction > 0"
                                :count="item.unreadInstruction"
                                @click="handleOptions({ key: 'notice_leader_instruction_view', record: item })"
                            >
                                <img :src="hanldeImg('linqi.png')" alt="查看指示" />
                            </a-badge>
                            <div v-if="item.lastFeedbackContent && item.feedbackType != 1" @click="handleShowDialog(item)">
                                <img :src="handleHistoryImg()" alt="" />
                            </div>
                            <template v-if="btngroup">
                                <div style="margin-left: 5px" @click="handleCuiCata(item)">
                                    <img :src="hanldeImg('bell.png')" alt="" />
                                </div>
                                <div style="margin-left: 5px" @click="handleCuiBell(item)">
                                    <img :src="hanldeImg('able.png')" alt="" />
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <div v-if="item.buttonList && item.buttonList.length > 0" class="subtaskMore">
                    <a-dropdown placement="bottomRight">
                        <template slot="overlay">
                            <a-menu style="text-align: center">
                                <a-menu-item v-for="subitem in item.buttonList" :key="subitem.value" @click="handleOptions({ key: subitem.value, record: item })">
                                    <a-badge :count="subitem.badge" :offset="[10, 0]">
                                        {{ subitem.text }}
                                    </a-badge>
                                </a-menu-item>
                            </a-menu>
                        </template>
                        <a-badge :count="item.buttonList.reduce((carry, current) => carry + current.badge || 0, 0)">
                            <img src="../assets/more.png" alt="" />
                        </a-badge>
                    </a-dropdown>
                </div>
            </div>
        </div>
        <!--历史弹框-->
        <a-modal :title="dialogObj.title" :visible="dialogObj.show" :footer="null" width="60%" @cancel="dialogObj.show = false">
            <div class="task-dialog">
                <a-timeline>
                    <a-timeline-item v-for="(item, index) in historyDialog" :key="index">
                        <div class="right-time">{{ item.feedbackTime }}</div>
                        <template slot="dot">
                            <div class="subtaskdot"></div>
                        </template>
                        <div class="right-content">
                            <span class="task-font" @click="handleJump(item)" v-html="item.feedbackContent"></span>
                            <div class="right-file">
                                <div
                                    v-for="(subitem, subindex) in item.feedbackAttachFiles"
                                    :key="subindex"
                                    :title="subitem.fileName"
                                    @click.stop="handleOpen(subitem)"
                                    class="flex items-center file-item"
                                >
                                    <svg-icon icon-class="file"></svg-icon>
                                    <div class="name">{{ subitem.fileName }}</div>
                                </div>
                            </div>
                        </div>
                    </a-timeline-item>
                </a-timeline>
            </div>
        </a-modal>
    </div>
</template>
<script>
import { getSubTaskList } from '../utils/mock'
import API from '../api/index'
import bindStyle from '../mixins/bindStyle'
import bindProp from '../mixins/bindProp'
export default {
    mixins: [bindProp(), bindStyle()],
    data() {
        return {
            record: null,
            dataSource: [],
            activeKey: [],
            list: [],
            historyDialog: [],
            dialogObj: {
                title: '',
                show: false,
                confirmLoading: false
            }
        }
    },
    watch: {
        record: {
            handler() {
                this.initData()
            },
            immediate: true
        }
    },
    updated() {
        top.updateSingleTaskIframeHeight?.call(this, this.$refs.container.offsetHeight + 30)
    },
    methods: {
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {}
        },
        receiveBroadcastMessage(event) {
            switch (event.type) {
                case 'linkageResult':
                    if (event.messageKey == 'dynamicRenderModule') {
                        this.record = event.message.record
                    }
                    break
            }
        },
        initData() {
            if (this.moduleObject.env !== 'production') {
                this.dataSource = getSubTaskList()
                return
            }
            if (_.isArray(this.propData.handleRequestFunc) && this.propData.handleRequestFunc.length > 0) {
                return Promise.all(
                    window.IDM.invokeCustomFunctions.call(this, this.propData.handleRequestFunc, {
                        record: this.record
                    })
                )
                    .then((...result) => {
                        return _.flatten(...result)
                    })
                    .then((data) => {
                        if (_.isArray(this.propData.hanldeInterfaceFunc) && this.propData.hanldeInterfaceFunc.length > 0) {
                            return _.flatten(
                                window.IDM.invokeCustomFunctions(this.propData.hanldeInterfaceFunc, {
                                    record: this.record,
                                    data
                                })
                            )
                        }
                        return data
                    })
                    .then((data) => {
                        this.dataSource = data
                    })
            }
        },
        handleJiaImg() {
            return IDM.url.getModuleAssetsWebPath(require('../assets/jia.png'), this.moduleObject)
        },
        handleJianImg() {
            return IDM.url.getModuleAssetsWebPath(require('../assets/jian.png'), this.moduleObject)
        },
        handleHistoryImg() {
            return IDM.url.getModuleAssetsWebPath(require('../assets/history.png'), this.moduleObject)
        },
        hanldeImg(img) {
            return IDM.url.getModuleAssetsWebPath(require(`../assets/${img}`), this.moduleObject)
        },
        handleJump(item) {
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
        // 预览文件
        handleOpen(item) {
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
                    top.Public.officeLook(item.fileName, item.id, '', true)
                }
            }
        },
        handleOptions(item) {
            if (_.isArray(this.propData.handleActionFunc) && this.propData.handleActionFunc.length > 0) {
                window.IDM.invokeCustomFunctions(this.propData.handleActionFunc, item)
            }
        },
        handleDialogOk() {
            this.dialogObj.show = false
        },
        // 弹框
        async handleShowDialog(item) {
            if (_.isArray(this.propData.handleHistoryFunc) && this.propData.handleHistoryFunc.length > 0) {
                window.IDM.invokeCustomFunctions(this.propData.handleHistoryFunc, {
                    record: item
                })
                return
            }
            const res = await API.ApiGetHistoryFeed({ noticeId: item.id })
            if (res.code == '200') {
                this.historyDialog = res.data
                if (this.historyDialog && this.historyDialog.length > 0) {
                    this.dialogObj.show = true
                }
            }
        },
        // 催办
        handleCuiCata(item) {
            this.$emit('handleCuiCata', item)
        },
        // 在落实
        handleCuiBell(item) {
            this.$emit('handleCuiBell', item)
        },
        // 状态class
        statusClass(item) {
            if (item.dbStatus == '1' || item.dbStatus == '4') return 'subtask-yellow'
            if (item.dbStatus == '2' || item.dbStatus == '3') return 'subtask-blue'
            if (item.dbStatus == '6' || item.dbStatus == '5') return 'subtask-green'
            if (item.dbStatus == '7' || item.dbStatus == '4') return 'subtask-red'
            return 'subtask-blue'
        }
    }
}
</script>
<style lang="scss" scoped>
@use '../style/common.scss';
.idm-db-INoticeList {
    .placeholder {
        border: 1px dotted #999;
        padding: 20px 0;
        text-align: center;
    }
}
.taskInfo {
    .taskInfo-li {
        display: flex;
        padding: 14px 0 10px 30px;
    }
    .taskInfo-li + .taskInfo-li {
        border-top: 1px dotted #ccc;
    }
    .subtaskLeft {
        display: flex;
        .taskinfo-title-icon {
            width: 20px;
            height: 20px;
            margin-right: 10px;
        }
    }
    .subtaskRight {
        font-size: 16px;
        gap: 20px;
        .right-content {
            display: flex;
            flex: 1;
            gap: 20px;
            font-size: 16px;
            .task-font {
                flex: 1;
                text-align: justify;
                cursor: pointer;
            }
            .task-file {
                .file-item {
                    cursor: pointer;
                    margin-top: 5px;
                    gap: 5px;
                    svg {
                        color: red;
                    }
                    .name {
                        color: #0086d9;
                        text-decoration: underline;
                    }
                }
            }
        }
    }
    .subtaskMore {
        width: 84px;
        text-align: center;
        cursor: pointer;
        right: 0;
        svg {
            font-size: 18px;
        }
    }
    .subtask-label {
        min-width: 73px;
        display: flex;
        flex-wrap: wrap;
        span {
            padding: 0px 5px;
            margin-right: 5px;
            border-radius: 3px;
            height: 27px;
            line-height: 26px;
        }
        .subtask-yellow {
            background-color: rgb(250 100 0 / 10%);
            color: #fa6400;
            border: 1px solid #fa6400;
        }
        .subtask-blue {
            background-color: rgb(0 134 217 / 10%);
            color: #0086d9;
            border: 1px solid #0086d9;
        }
        .subtask-gray {
            background-color: rgb(204 204 204 / 10%);
            color: #cccccc;
            border: 1px solid #cccccc;
        }
        .subtask-red {
            background-color: rgb(227 0 0 / 10%);
            color: #e30000;
            border: 1px solid #e30000;
        }
        .subtask-green {
            background-color: rgb(87 189 106 / 10%);
            color: #57bd6a;
            border: 1px solid #57bd6a;
        }
        .subtask-cheng {
            background-color: #ffffff;
            color: #ffba00;
            border: 1px solid #ffba00;
        }
    }
    .subtask-popleft {
        // width: 283px;
        width: 350px;
        font-size: 16px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding-right: 15px;
    }
    .right-time {
        width: 115px;
        color: #0086d9;
        fill: #0086d9;
        gap: 5px;
    }
    .right-svg {
        display: flex;
        cursor: pointer;
        gap: 10px;
        svg {
            font-size: 22px;
            width: 22px;
            height: 22px;
        }
        img {
            width: 22px;
            height: 22px;
        }
    }
    .rightSvg {
        cursor: pointer;
    }
}
.task-dialog {
    padding: 10px 30px;
    .right-time {
        color: #0086d9;
        margin-right: 20px;
        font-size: 16px;
    }
    :deep(.ant-timeline-item-tail) {
        border-left-style: dotted;
    }
    :deep(.ant-timeline-item-last) {
        padding: 0 !important;
        .ant-timeline-item-content {
            display: flex;
            min-height: unset;
        }
    }
    :deep(.ant-timeline-item-content) {
        display: flex;
        margin-left: 20px;
    }
    .right-content {
        cursor: pointer;
        font-size: 16px;
        color: #333333;
        flex: 1;
        span {
            display: inline-block;
            text-align: justify;
            display: inline-block;
        }
    }
    .right-file {
        .file-item {
            cursor: pointer;
            margin-top: 5px;
            gap: 5px;
            svg {
                color: red;
            }
            .name {
                color: #0086d9;
                text-decoration: underline;
            }
        }
    }
    .subtaskdot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 1px solid #0086d9;
        position: relative;
        &::after {
            content: '';
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background-color: #0086d9;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
}
</style>
