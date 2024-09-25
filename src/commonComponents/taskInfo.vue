<template>
  <div>
    <div class="taskInfo">
      <div class="taskInfo-li" v-for="(item, index) in list" :key="index">
        <!--左侧-->
        <div class="subtaskLeft">
          <div class="subtask-label">
            <span :class="{
              'subtask-yellow': item.dbStatus == '1' || item.dbStatus == '4',
              'subtask-blue': item.dbStatus == '2' || item.dbStatus == '3',
              'subtask-green': item.dbStatus == '6' || item.dbStatus == '5',
              'subtask-red': item.dbStatus == '7',
              'subtask-other': item.dbStatus == '8',
            }" v-if="item.dbStatusText">{{ item.dbStatusText }}</span>
            <span class="subtask-red" v-if="item.timeoutStatusText && item.timeoutStatus != 0">{{ item.timeoutStatusText }}</span>
          </div>
          <div class="subtask-popleft">
            <div>
              <img src="../assets/home.png" alt="" class="taskinfo-title-icon" >
              <span style="margin-right: 10px;">{{ item.handlerUnitText }}</span>
              <template v-if="isMoOpen">
                <span>{{ item.feedbackPeriodText }}</span>
              </template>
              <template v-else>
                <span style="font-size: 14px;">({{ item.startDate }} ~ {{ item.endDate }}) &nbsp;{{ item.feedbackPeriodText }}</span>
              </template>
            </div>
            <template v-show="isMoOpen">
              <div style="margin-top: 5px;" v-if="item.startDate">
                <img :src="hanldeImg('time1.png')" alt="" class="taskinfo-title-icon" >
                <span>{{ item.startDate }} ~ {{ item.endDate }}</span>
              </div>
            </template>
            <div :style="isMoOpen?`margin-top: 5px`:`margin-top: 15px`" v-if="item.handlerText">
              <img src="../assets/phone.png" alt="" class="taskinfo-title-icon" >
              <span style="margin-right: 5px;">{{ item.handlerText }}</span>
              <span v-if="item.handlerTel">({{ item.handlerTel }})</span>
            </div>
          </div>
        </div>
        <!--右侧-->
        <div class="subtaskRight">
          <div class="right-time">{{ item.lastFeedbackDate }}</div>
          <div class="right-content">
            <span class="task-font" @click="handleJump(item)" v-if="item.lastFeedbackContent">
              {{ item.lastFeedbackContent }}
              <div class="task-file">
                <i v-for="(file, fileIndex) in item.lastFeedbackAttachFiles" :key="fileIndex" @click.stop="handleOpen(file)">
                  <svg-icon icon-class="file"></svg-icon>
                  {{ file.fileName }}
                </i>
              </div>
            </span>
            <div class="right-svg" v-if="item.lastFeedbackContent && item.feedbackType != 1">
              <div @click="handleShowDialog(item)">
                <img :src="handleHistoryImg()" alt="">
              </div>
              <template v-if="btngroup">
                <div style="margin-left: 5px;" @click="handleCuiCata(item)">
                  <img :src="hanldeImg('bell.png')" alt="">
                </div>
                <div style="margin-left: 5px;" @click="handleCuiBell(item)">
                  <img :src="hanldeImg('able.png')" alt="">
                </div>
              </template>
            </div>
          </div>
        </div>
        <template v-if="porpsList?.length">
          <div class="subtaskMore" v-if="!origin">
            <template v-if="item.buttonList && item.buttonList.length">
              <a-popover placement="bottomRight">
                <template slot="content">
                  <p v-for="(subitem, index) in item.buttonList" :key="index" @click="handleOptions(subitem, item)">
                    <span>{{ subitem.text }}</span>
                  </p>
                </template>
                <!-- <svg-icon icon-class="detail" class="rightSvg"></svg-icon> -->
                <img src="../assets/more.png" alt="">
              </a-popover>
            </template>
          </div>
        </template>
      </div>
    </div>
    <!--历史弹框-->
    <a-modal
      :title="dialogObj.title"
      :visible="dialogObj.show"
      :footer="null"
      width="60%"
      @cancel="dialogObj.show=false"
    >
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
                <div v-for="(subitem, subindex) in item.feedbackAttachFiles" :key="subindex" :title="subitem.fileName"  @click.stop="handleOpen(subitem)">
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
        title: "",
        show: false,
        confirmLoading: false
      },
    }
  },
  mounted() {
    this.moduleObject = this.$root.moduleObject;
    if (this.porpsList && this.porpsList?.length) {
      this.list = this.porpsList
    }
    this.init()
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
    handleOptions(item, fatherItem) {
      this.$emit('handleOptions', {
        item: item,
        fatherItem: fatherItem
      })
    },
    handleDialogOk() {
      this.dialogObj.show = false
    },
    // 弹框
    async handleShowDialog(item) {
      if (this.origin == 'ItasklistDetail') {
        let iframeUrl = `../p1000/idm/index.html#/preview/2404301716248fZmfPNT5BD7RmeytaG?id=${item.id}`
        try{
          top.openFeedbackHistory(iframeUrl)
        }catch(e) {
          console.log('弹框失败', e)
        }
        return
      }
      if (this.porpsList) {
        let res = await API.ApiGetHistoryFeed({noticeId: item.id})
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
      var themeList = this.themeList;
      if (!themeList) {
          return
      }
      const themeNamePrefix =
          IDM.setting && IDM.setting.applications && IDM.setting.applications.themeNamePrefix
              ? IDM.setting.applications.themeNamePrefix
              : 'idm-theme-'
      for (var i = 0; i < themeList.length; i++) {
        var item = themeList[i]
        let bulletBgColorObj = {
            'color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
        }
        let svgStyle = {
          'color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : '',
          'fill': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
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

<style lang="scss">
// 弹框
.task-dialog{
  padding: 10px 30px;
  .right-time{
    color: #333333;
    margin-right: 20px;
    font-size: 16px;
  }
  .ant-timeline-item-tail{
    border-left-style: dotted;
  }
  .ant-timeline-item-last{
    padding: 0 !important;
    .ant-timeline-item-content{
      display: flex;
      min-height: unset;
    }
  }
  .right-content{
    cursor: pointer;
  }
  .ant-timeline-item-content{
    display: flex;
    margin-left: 20px;
    .right-content{
      font-size: 16px;
      color: #333333;
      flex: 1;
      span{
        display: inline-block;
        text-align: justify;
        display: inline-block;
      }
    }
    .right-file{
      cursor: pointer;
      div{
        padding-top: 5px;
      }
    }
  }
  .subtaskdot{
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid #0086D9;
    position: relative;
    &::after{
      content: "";
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: #0086D9;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>

<style lang="scss" scoped>
.taskInfo{
  .taskInfo-li{
    display: flex;
    padding: 14px 0 10px 30px;
  }
  .subtaskLeft{
    display: flex;
    // flex:1;
    width: 40%;
    // flex: 0 0 auto;
    .taskinfo-title-icon{
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }
  .subtaskRight{
    // flex: 1;
    width: calc(60% - 84px);
    display: flex;
    font-size: 16px;
    .right-content{
      width: calc(100% - 82px);
      display: flex;
      justify-content: space-between;
      span{
        width: 80%;
        display: inline-block;
        text-align: justify;
      }
      .task-font{
        margin-right: 2px;
        cursor: pointer;
      }
      .task-file{
        cursor: pointer;
        i{
          display: block;
          font-style: normal;
          margin-top: 5px;
        }
      }
    }
  }
  .subtaskMore{
    width: 84px;
    text-align: center;
    cursor: pointer;
    svg{
      font-size: 18px;
    }
  }
  .subtask-label{
    min-width: 73px;
    display: flex;
    flex-wrap: wrap;
    margin-top: 3px;
    span{
      padding: 0px 5px;
      margin-right: 5px;
      border-radius: 3px;
      height: 27px;
      line-height: 26px;
    }
    .subtask-yellow{
      background-color: rgb(250 100 0 / 10%);
      color: #FA6400;
      border: 1px solid #FA6400;
    }
    .subtask-blue{
      background-color: rgb(0 134 217 / 10%);
      color: #0086d9;
      border: 1px solid #0086d9;
    }
    .subtask-gray{
      background-color: rgb(204 204 204 / 10%);
      color: #CCCCCC;
      border: 1px solid #CCCCCC;
    }
    .subtask-red{
      background-color:rgb(227 0 0 / 10%);
      color: #e30000;
      border: 1px solid #e30000;
    }
    .subtask-other{
      background-color:rgba(30, 54, 35,0.1);
      color: #1e3623;
      border: 1px solid #1e3623;
    }
    .subtask-green{
      background-color: rgb(87 189 106 / 10%);
      color: #57BD6A;
      border: 1px solid #57BD6A;
    }
    .subtask-cheng{
      background-color:#ffffff;
      color: #FFBA00;
      border: 1px solid #FFBA00;
    }
  }
  .subtask-popleft{
    font-size: 16px;
  }
  .right-time{
    width: 82px;
    flex: 0 0 auto;
    margin-right: 20px;
    color: #333333;
  }
  .right-svg{
    // position: absolute;
    // right: 120px;
    width: 20%;
    display: flex;
    cursor: pointer;
    svg{
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-left: 20px;
    }
    img{
      width: 18px;
      height: 18px;
    }
  }
  .rightSvg{
    cursor: pointer;
  }
}
</style>
