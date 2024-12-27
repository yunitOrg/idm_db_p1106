<template>
    <div>
        <div class="taskInfo">
            <div class="taskInfo-li" v-for="(item, index) in porpsList" :key="index">
                <!--左侧-->
                <div class="subtaskLeft">
                    <div class="subtask-label">
                        <span :class="statusClass(item)" v-if="item.dbStatusText">{{ item.dbStatusText }}</span>
                        <span class="subtask-red" v-if="item.timeoutStatusText && item.timeoutStatus != 0">{{ item.timeoutStatusText }}</span>
                    </div>
                    <div class="subtask-popleft">
                        <div>
                            <img src="../assets/home.png" alt="" class="taskinfo-title-icon" />
                            <span>{{ item.handlerUnitText }} &nbsp;{{ item.feedbackPeriodText }}</span>
                        </div>
                        <div v-if="item.startDate">
                            <img src="../assets/time1.png" alt="" class="taskinfo-title-icon" />
                            <span>{{ item.startDate }} ~ {{ item.endDate }}</span>
                        </div>
                        <div v-if="item.handlerText">
                            <img src="../assets/phone.png" alt="" class="taskinfo-title-icon" />
                            <span style="margin-right: 5px">{{ item.handlerText }}</span>
                            <span v-if="item.handlerTel">({{ item.handlerTel }})</span>
                        </div>
                    </div>
                </div>
                <!--右侧-->
                <div class="subtaskRight">
                    <div class="right-time">{{ item.lastFeedbackDate }}</div>
                    <div class="right-content">
                        <div class="task-font" @click="handleJump(item)" v-if="item.lastFeedbackContent">
                            <div v-html="item.lastFeedbackContent"></div>
                            <div class="task-file">
                                <i v-for="(file, fileIndex) in item.lastFeedbackAttachFiles" :key="fileIndex" @click.stop="handleOpen(file)">
                                    <svg-icon icon-class="file"></svg-icon>
                                    {{ file.fileName }}
                                </i>
                            </div>
                        </div>
                        <div class="right-svg">
                            <a-badge
                                v-if="item.unreadInstruction != null"
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
                <template v-if="porpsList?.length">
                    <div class="subtaskMore">
                        <template v-if="item.buttonList && item.buttonList.length">
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
                                <!-- <svg-icon icon-class="detail" class="rightSvg"></svg-icon> -->
                                <a-badge :count="item.buttonList.reduce((carry, current) => carry + current.badge || 0, 0)">
                                    <img src="../assets/more.png" alt="" />
                                </a-badge>
                            </a-dropdown>
                        </template>
                    </div>
                </template>
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
                                <div v-for="(subitem, subindex) in item.feedbackAttachFiles" :key="subindex" :title="subitem.fileName" @click.stop="handleOpen(subitem)">
                                    <svg-icon icon-class="file"></svg-icon>
                                    {{ subitem.fileName }}
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
import API from '../api/index'
import { getSubTaskList } from '../utils/mock'
export default {
    props: {
        propData: {
            type: Object,
            required: true
        },
        porpsList: {
            type: Array,
            default: () => {
                return getSubTaskList()
            }
        },
        themeList: {
            type: Array
        },
        btngroup: {
            type: Boolean
        }
    },
    data() {
        return {
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
    mounted() {
        this.moduleObject = this.$root.moduleObject
    },
    methods: {
        handleHistoryImg() {
            return IDM.url.getModuleAssetsWebPath(require('../assets/history.png'), this.moduleObject)
        },
        hanldeImg(img) {
            return IDM.url.getModuleAssetsWebPath(require(`../assets/${img}`), this.moduleObject)
        },
        handleJump(item) {
            this.$emit('handleContentJump', item)
        },
        // 预览文件
        handleOpen(item) {
            this.$emit('handleFileOpen', item)
        },
        handleOptions(item) {
            this.$emit('handleOptions', item)
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
            if (this.porpsList) {
                let res = await API.ApiGetHistoryFeed({ noticeId: item.id })
                if (res.code == '200') {
                    this.historyDialog = res.data
                    if (this.historyDialog && this.historyDialog.length > 0) {
                        this.dialogObj.show = true
                    }
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
        flex: 1;
        display: flex;
        font-size: 16px;
        gap: 20px;
        .right-content {
            display: flex;
            flex: 1;
            gap: 20px;
            .task-font {
                flex: 1;
                text-align: justify;
                cursor: pointer;
            }
            .task-file {
                cursor: pointer;
                i {
                    display: block;
                    font-style: normal;
                    margin-top: 5px;
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
        margin-top: 3px;
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
        width: 100px;
        color: #333333;
    }
    .right-svg {
        display: flex;
        cursor: pointer;
        gap: 10px;
        padding: 2px;
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
// 弹框
.task-dialog {
    padding: 10px 30px;
    .right-time {
        color: #333333;
        margin-right: 20px;
        font-size: 16px;
    }
    .ant-timeline-item-tail {
        border-left-style: dotted;
    }
    .ant-timeline-item-last {
        padding: 0 !important;
        .ant-timeline-item-content {
            display: flex;
            min-height: unset;
        }
    }
    .right-content {
        cursor: pointer;
    }
    .ant-timeline-item-content {
        display: flex;
        margin-left: 20px;
        .right-content {
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
            cursor: pointer;
            div {
                padding-top: 5px;
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
