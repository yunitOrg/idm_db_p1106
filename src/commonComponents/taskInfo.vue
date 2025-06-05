<template>
    <div>
        <div class="taskInfo">
            <div class="taskInfo-li" v-for="(item, index) in list" :key="index">
                <!--左侧-->
                <div class="subtaskLeft">
                    <!-- <div class="subtask-label">
                        <span
                            :class="{
                                'subtask-yellow': item.dbStatus == '1' || item.dbStatus == '4',
                                'subtask-blue': item.dbStatus == '2' || item.dbStatus == '3',
                                'subtask-green': item.dbStatus == '6' || item.dbStatus == '5',
                                'subtask-red': item.dbStatus == '7',
                                'subtask-other': item.dbStatus == '8'
                            }"
                            v-if="item.dbStatusText"
                            >{{ item.dbStatusText }}</span
                        >
                        <span class="subtask-red" v-if="item.timeoutStatusText && item.timeoutStatus != 0">{{ item.timeoutStatusText }}</span>
                    </div> -->
                    <div class="subtask-popleft">
                        <div>
                            <img v-if="item.handlerType == 1" src="../assets/250106174803uPnjA6NTo3NuG37lXdA.png" alt="" class="taskinfo-title-icon" />
                            <img v-else-if="item.handlerType == 2" src="../assets/250106174812lBxOtl8eBdDzderYvYO.png" alt="" class="taskinfo-title-icon" />
                            <img v-else src="../assets/home.png" alt="" class="taskinfo-title-icon" />
                            <span style="margin-right: 10px">{{ item.handlerUnitText }}</span>
                            <template v-if="isMoOpen">
                                <!-- <span>{{ item.feedbackPeriodText }}</span> -->
                            </template>
                            <template v-else>
                                <span style="font-size: 14px">({{ item.startDate }} ~ {{ item.endDate }}) &nbsp;{{ item.feedbackPeriodText }}</span>
                            </template>
                        </div>
                        <!-- <template v-show="isMoOpen">
                            <div style="margin-top: 5px" v-if="item.startDate">
                                <img :src="hanldeImg('time1.png')" alt="" class="taskinfo-title-icon" />
                                <span>{{ item.startDate }} ~ {{ item.endDate }}</span>
                            </div>
                        </template> -->
                        <div :style="isMoOpen ? `margin-top: 5px` : `margin-top: 15px`" v-if="item.extImplementationStatusText">
                            <img src="../assets/jindu.png" alt="" class="taskinfo-title-icon" />
                            <span style="margin-right: 5px">{{ item.extImplementationStatusText }}</span>
                        </div>

                        <div :style="isMoOpen ? `margin-top: 5px` : `margin-top: 15px`">
                            <img src="../assets/lingdang.png" alt="" class="taskinfo-title-icon" />
                            <span style="margin-right: 5px">催办<i class="recordCount" @click="toRecordPage(item.id)">{{ item.recordCount || 0 }}</i>次</span>
                        </div>
                    </div>
                </div>
                <!--右侧-->
                <div class="subtaskRight">
                    <!-- <div class="right-time">{{ item.lastFeedbackDate }}</div> -->
                    <div class="light">
                        <img title="已反馈" v-if="item.padLight == '1'" src="../assets/green-light.png">
                        <img title="临期" v-if="item.padLight == '2'" src="../assets/yellow-light.png">
                        <img title="超期"  v-if="item.padLight == '4'" src="../assets/red-light.png">
                    </div>
                    <div class="right-content">
                        <span class="task-font">
                            <div @click="handleJump(item)">
                                <div class="top">
                                    <span class="lastFeedbackContentPeriodNum" v-if="item.lastFeedbackContentPeriodNum">{{item.lastFeedbackContentPeriodNum}}</span>
                                    <span class="lastFeedbackDate" v-if="item.nowPeriodEndDate">{{item.nowPeriodEndDate}}</span>
                                    <div class="subtask-label">
                                        <span
                                            :class="{
                                                'subtask-yellow': item.dbStatus == '1' || item.dbStatus == '4',
                                                'subtask-blue': item.dbStatus == '2' || item.dbStatus == '3',
                                                'subtask-green': item.dbStatus == '6' || item.dbStatus == '5',
                                                'subtask-red': item.dbStatus == '7',
                                                'subtask-other': item.dbStatus == '8'
                                            }"
                                            v-if="item.dbStatusText"
                                            >{{ item.dbStatusText }}</span
                                        >
                                        <span class="subtask-red" v-if="item.timeoutStatusText && item.timeoutStatus != 0">{{ item.timeoutStatusText }}</span>
                                    </div>
                                    <div v-if="item.lastFeedbackDate">
                                        <img :src="hanldeImg('time1.png')" alt="" class="taskinfo-title-icon" />
                                        <span>{{ item.lastFeedbackDate }}</span>
                                    </div>
                                </div>
                                <div class="content">{{item.lastFeedbackContent}}</div>
                            </div>
                            <div
                                v-for="(file, fileIndex) in item.lastFeedbackAttachFiles"
                                :key="fileIndex"
                                :file-id="file.id"
                                @click.stop="handleOpen(file)"
                                class="attachment-row task-file"
                            >
                                <svg-icon icon-class="file"></svg-icon>
                                {{ file.fileName }}
                            </div>
                        </span>
                    </div>
                </div>
                <div class="subtaskMore">
                    <a-badge v-if="item.unreadInstruction != null" :count="item.unreadInstruction" @click="handleOptions({ key: 'notice_leader_instruction_view', record: item })">
                        <img src="../assets/linqi.png" alt="查看批示" />
                    </a-badge>
                    <div @click="handleShowDialog(item)">
                        <svg-icon icon-class="history"></svg-icon>
                    </div>
                    <template v-if="btngroup">
                        <img @click="handleCuiCata(item)" :src="hanldeImg('bell.png')" alt="" />
                        <img @click="handleCuiBell(item)" :src="hanldeImg('able.png')" alt="" />
                    </template>
                    <div v-if="item.furtherImplementation == 1" style="color: red">再落实</div>
                    <a-popover v-if="item.buttonList && item.buttonList.length" placement="bottomRight">
                        <template slot="content">
                            <p v-for="(subitem, index) in item.buttonList" :key="index" @click="handleOptions({ key: subitem.value, record: item })">
                                <span>{{ subitem.text }}</span>
                            </p>
                        </template>
                        <!-- <svg-icon icon-class="detail" class="rightSvg"></svg-icon> -->
                        <img src="../assets/more.png" alt="" />
                    </a-popover>
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
                            <span class="task-font" @click="handleJump(item)">{{ item.feedbackContent }}</span>
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
        isMoOpen: {
            type: Boolean
        },
        porpsList: {
            type: Array
        },
        themeList: {
            type: Array
        },
        origin: {
            type: String
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
        if (this.porpsList && this.porpsList?.length) {
            var _this = this;
            this.list = this.porpsList
            this.list.forEach((item,index)=>{
                (function (item,index) {
                    window.IDM.http
                        .get('ctrl/urgeRecord/getUrgeRecordCount', {
                            noticeId: item.id
                        })
                        .then(({ data }) => {
                            _this.list[index].recordCount = data.data
                        })
                })(item,index)
            })
        }
        this.init()
    },
    methods: {
        toRecordPage(id){
            window.open(IDM.url.getWebPath("/ctrl/list/240627164529UQum8phjmAxV4GydBzO?moduleId=240509093547WwIEk66utTYmu3WTy1a&noticeId="+id))
        },
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
        renderImg(path){
            return IDM.url.getWebPath(path)
        },
        // 弹框
        async handleShowDialog(item) {
            if (this.origin == 'ItasklistDetail') {
                const query = {
                    id: item.id
                }
                const roles = []
                if (item.buttonList.some((n) => n.value == 'notice_leader_instruction')) roles.push('comment.create')
                if (item.buttonList.some((n) => n.value == 'notice_comments')) roles.push('rate.create')
                if (roles.length > 0) query.roles = roles.join(',')
                try {
                    top.openFeedbackHistory(window.IDM.url.getWebPath(`p1000/idm/index.html#/preview/2404301716248fZmfPNT5BD7RmeytaG?${window.IDM.url.stringify(query)}`))
                } catch (e) {
                    console.log('弹框失败', e)
                }
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
        /**
         * @Desc 设置主题
         */
        ThemeListAttrToStyle() {
            var themeList = this.themeList
            if (!themeList) {
                return
            }
            const themeNamePrefix = IDM.setting && IDM.setting.applications && IDM.setting.applications.themeNamePrefix ? IDM.setting.applications.themeNamePrefix : 'idm-theme-'
            for (var i = 0; i < themeList.length; i++) {
                var item = themeList[i]
                let bulletBgColorObj = {
                    color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
                }
                let svgStyle = {
                    color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : '',
                    fill: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
                }
                let timeDateStyle = {
                    'border-left-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
                }
                let dotObject = {
                    'border-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
                }
                let dotAfterObject = {
                    'background-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
                }
                // IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} .taskInfo .taskInfo-li .right-content`, bulletBgColorObj)
                IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} .taskInfo .taskInfo-li .rightSvg`, svgStyle)
                // IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} .taskInfo .task-font`, bulletBgColorObj)

                IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} .task-dialog .right-file`, bulletBgColorObj)
                IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} .task-dialog .ant-timeline-item-tail`, timeDateStyle)
                IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} .task-dialog .subtaskdot`, dotObject)
                IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} .task-dialog .subtaskdot:after`, dotAfterObject)
            }
        },
        getMockData() {
            this.list = getSubTaskList()
        },
        initData() {
            console.log(this.list)
            if (this.porpsList && this.porpsList?.length) {
                return
            }
            if (this.moduleObject.env !== 'production') {
                this.getMockData()
                return
            }
        },
        init() {
            this.ThemeListAttrToStyle()
            this.initData()
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
    .subtaskLeft {
        display: flex;
        width: 240px;
        .taskinfo-title-icon {
            width: 20px;
            height: 20px;
            margin-right: 10px;
        }
    }
    .subtaskRight {
        flex: 1;
        width: 0;
        display: flex;
        font-size: 16px;
        .light{
            margin-right: 6px;
        }
        .taskinfo-title-icon {
            width: 20px;
            height: 20px;
            margin-right: 10px;
        }
        .right-content {
            width: calc(100% - 82px);
            display: flex;
            justify-content: space-between;
            span {
                display: inline-block;
                text-align: justify;
            }
            .task-font {
                cursor: pointer;
                padding-right: 10px;
                .top{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    white-space: nowrap;
                }
                .content{
                    margin: 6px 0;
                }
            }
            .task-file {
                cursor: pointer;
                color: #0086d9;
                margin-top: 5px;
                svg {
                    fill: red;
                }
            }
        }
    }
    .subtaskMore {
        display: flex;
        align-items: center;
        text-align: center;
        cursor: pointer;
        gap: 10px;
        svg,
        img {
            vertical-align: middle;
            font-size: 22px;
            width: 22px;
            height: 22px;
        }
    }
    .top .subtask-label:not(:first-child){
        margin-left: 30px;
    }
    .subtask-label {
        min-width: 60px;
        display: flex;
        flex-wrap: wrap;
        margin-left: 10px;
        span {
            padding: 0px 5px;
            border-radius: 3px;
            height: 27px;
            line-height: 26px;
            margin-right: 5px;
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
        .subtask-other {
            background-color: rgba(30, 54, 35, 0.1);
            color: #1e3623;
            border: 1px solid #1e3623;
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
        font-size: 16px;
        word-break: break-all;
        div{
            vertical-align: middle;
            img,span{
                vertical-align: middle;
            }
        }
    }
    .recordCount{
        font-style: normal;
        color: #0086d9;
        cursor: pointer;
    }
    .right-time {
        width: 82px;
        flex: 0 0 auto;
        margin-right: 20px;
        color: #333333;
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
