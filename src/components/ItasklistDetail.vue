<template>
  <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
  <div
    idm-ctrl="idm_module"
    :id="moduleObject.id"
    :idm-ctrl-id="moduleObject.id"
    v-if="authPower"
  >
    <div class="taskdetail" ref="taskRef">
      <div class="task-title" v-if="propData.titleShow == 'show'">
        <div>
          <template v-if="propData.titleIconShow == 'show'">
            <svg v-if="propData.titleIcon && propData.titleIcon.length"
              class="task-title-icon"
              aria-hidden="true"
            >
              <use :xlink:href="`#${propData.titleIcon[0]}`"></use>
            </svg>
            <svg-icon v-else icon-class="shu" class="task-title-icon"></svg-icon>
          </template>
          <span class="task-title-font">{{ propData.titleName }}</span>
        </div>
        <span class="task-right-icon">
          <div
            v-if="propData.titleRightModule == 'module'"
            class="drag_container"
            idm-ctrl-inner
            :idm-ctrl-id="moduleObject.id"
            idm-container-index="taskRightIcon"
          ></div>
          <template v-if="propData.titleRightModule == 'svgList'">
            <svg
              v-for="(item, index) in propData.titleRightGroup"
              :style="setIconStyle('titleIcon', item)"
              :key="index"
              @click="handleSvgClick(item)"
            >
              <use :xlink:href="`#${item?.titleBtnIcon && item.titleBtnIcon[0]}`"></use>
            </svg>
          </template>
          <a-switch
            v-if="propData.showHideCloumn=='show'"
            default-checked @change="onSwitchChange" />
        </span>
      </div>
      <!--列表-->
      <div class="task-ul">
        <a-spin class="task-loading" :spinning="loading"></a-spin>
        <template v-if="list && list.length > 0">
          <div v-for="(item, index) in list" :key="index">
            <div class="task-li">
              <div class="task-name">
                <div class="task-namelefticon" v-if="propData.showHideIcon == 'left'">
                  <svg-icon :icon-class="item.isShow ? 'arrow-down' : 'arrow-right'" class="task-icon"></svg-icon>
                </div>
                <div class="task-li-title">
                  <div class="task-li-titleTop" @click.stop="handleShowDetail(item)">
                    <template v-if="judgeComState">
                      <span class="task-li-tip taskbtn2" v-if="item.timeoutStatusText && item.timeoutStatus != 0">{{ item.timeoutStatusText }}</span>
                      <span class="task-li-tip" :class="item.dbStatus == '4' || item.dbStatus == '5' ? 'taskbtn2' : 'taskbtn1'" v-if="item.dbStatusText">{{ item.dbStatusText }}</span>
                    </template>
                    <span class="task-li-content">{{index+1}}. {{ item[propData.contentFiled || 'taskDesc'] }}</span>
                  </div>
                    <!--查看-->
                      <div class="mt10">
                        <div class="task-li-flex">
                          <span class="task-li-flex">
                            <svg-icon icon-class="time" style="margin-right:7px;font-size: 18px;fill: #666666;"></svg-icon>
                            {{ item.startDate }}~{{ item.endDate }}
                          </span>
                          <span class="task-li-flex mtl30">
                            <svg-icon icon-class="for" style="margin-right:7px;font-size: 18px;fill: #666666;"></svg-icon>{{ item.feedbackPeriodText }}
                          </span>
                        </div>
                        <div class="task-li-list">
                          <div class="task-li-flex">
                            <span class="task-li-flex" v-if="item.hostList && item.hostList.length">
                              <img src="../assets/zhuban.png" alt="" style="width: 16px;height: 16px;margin-right: 7px;">
                              <span v-for="(subitem, subindex) in item.hostList" :key="subindex"
                                class="task-span"
                                :class="subitem.dbStatus <=  1 ? 'task-ban-gray' : 'task-ban-blue'">
                                {{ subitem.unitName }}
                              </span>
                            </span>
                            <span style="display:flex;align-items:center;margin-left:30px;" v-if="item.assistList && item.assistList.length">
                              <img src="../assets/xieban.png" alt="" style="width: 16px;height: 16px;margin-right: 7px;">
                              <span v-for="(subitem, subindex) in item.assistList" :key="subindex"
                                class="task-span"
                                :class="subitem.dbStatus <=  1 ? 'task-ban-gray' : 'task-ban-blue'">
                                {{ subitem.unitName }}
                              </span>
                            </span>
                          </div>
                          <template v-if="judgeComState">
                            <div style="display:flex;">
                              <template v-if="propData.btngroup">
                                <div class="task-groupbtn" style="margin-right: 5px;" @click="handleCuiCata(item)">
                                  <img :src="hanldeImg('bell.png')" alt="">
                                </div>
                                <div class="task-groupbtn" style="margin-right: 5px;" @click="handleCuiBell(item)">
                                  <img :src="hanldeImg('able.png')" alt="">
                                </div>
                              </template>
                              <div @click.stop="handleShowDetail(item)">
                                <svg-icon :icon-class="item.isShow ? 'hide-box' : 'show-box'" class="task-icon"></svg-icon>
                              </div>
                            </div>
                          </template>
                        </div>
                      </div>
                </div>
                <!--右侧按钮组-->
                <div class="task-nameicon" v-if="judgeUser">
                  <div class="taskbtn" @click="handleBtn('edit', item)">
                    <svg-icon icon-class="edit" style="fill:#369FE1;font-size:18px;" ></svg-icon>
                    <span>修改</span>
                  </div>
                  <div class="taskbtn" @click="handleBtn('delete', item)">
                    <svg-icon icon-class="delete" style="fill:#FFBC30;font-size:18px;" ></svg-icon>
                    <span>删除</span>
                  </div>
                </div>
              </div>
              <template v-if="judgeComState">
                <div class="itasklist-default" v-if="item.isShow">
                  <taskInfo
                    :isMoOpen="propData.isMoOpen"
                    origin="ItasklistDetail"
                    :themeList="propData.themeList"
                    :porpsList="singMoreShowData"
                    @handleContentJump="handleContentJump"
                    @handleFileOpen="handleFileOpen"
                  ></taskInfo>
                </div>
              </template>
            </div>
          </div>
        </template>
        <template v-else>
          <a-empty :imageStyle="{height: propData.emptySize + 'px'}" description="暂无数据"></a-empty>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import ItasklistDetail from '../mixins/ItasklistDetail.js'
import taskInfo from '../commonComponents/taskInfo.vue' // 单任务
import API from '../api/index'
export default {
  name: 'ItasklistDetail',
  components: {
    taskInfo
  },
  data() {
    return {
      loading: false,
      indexDataFiled: 'idmContainerId',
      moduleObject: {},
      list: [],
      judgeUser: false,
      judgeComState: true,
      singMoreShowData: []
    }
  },
  mixins: [ItasklistDetail],
  computed: {
    authPower() {
      if(this.moduleObject.env !== 'production') return true
      if (this.propData.powerJudge == 'show') {
        const name = this.propData.powerFunc[0].name
        let judge = false;
        if (name) {
          judge = window[name] && window[name].call(this, {_this: this})
        }
        return judge
      } else {
        return true
      }
    }
  },
  mounted() {
    this.moduleObject = this.$root.moduleObject;
    this.judgeComponent()
    this.judgeshowNotice()
    this.init()
    this.windowMountAttribute()
  },
  methods: {
    hanldeImg(img) {
      return IDM.url.getModuleAssetsWebPath(require(`../assets/${img}`), this.moduleObject)
    },
    // 催办
    handleCuiCata(item) {
      if(this.propData.hanldeCuiban && this.propData.hanldeCuiban.length > 0) {
        let name = this.propData.hanldeCuiban[0].name
        window[name] && window[name].call(this, {
          _this: this,
          item: item
        })
      }
    },
    // 在落实
    handleCuiBell(item) {
      if(this.propData.handleLuoshi && this.propData.handleLuoshi.length > 0) {
        let name = this.propData.handleLuoshi[0].name
        window[name] && window[name].call(this, {
          _this: this,
          item: item
        })
      }
    },
    // 附件跳转
    handleFileOpen(item) {
      if(this.propData.handleFileFunc && this.propData.handleFileFunc.length > 0) {
        let name = this.propData.handleFileFunc[0].name
        window[name] && window[name].call(this, {
          _this: this,
          item: item
        })
      } else {
         if (top.Public) { // 使用public.js调用方法
          top.Public.officeLook(item.fileName, item.id, '', true, {"officeModuleId": "skyDrive"})
        }
      }
    },
    // 子项跳转
    handleContentJump(item) {
      if(this.propData.handleChildFunc && this.propData.handleChildFunc.length > 0) {
        let name = this.propData.handleChildFunc[0].name
        window[name] && window[name].call(this, {
          _this: this,
          item: item
        })
      } else {
        window.open(item.lastFeedbackUrl)
      }
    },
    // 操作按钮
    handleBtn(type, item) {
      switch(type) {
        case 'edit':{
          try {
            top.editSonTask(item.id);
          } catch (e) {
              console.log('编辑子任务', e);
          }
        }
          break
        case 'delete':{
          try {
            top.deleteSonTask(item.id);
          } catch (e) {
              console.log('新建子任务', e);
          }
        }
          break
      }
      
    },
    // 控制 修改 删除按钮
    judgeComponent() {
      try {
        this.judgeUser = top.canEdit();
      } catch (e) {
          console.log('获取权限', e);
      }
    },
    // 控制查看状态
    judgeshowNotice() {
      try {
        this.judgeComState = top.showNotice();
      } catch (e) {
          console.log('获取权限', e);
      }
    },
    /**
     * @Desc 挂载到window上属性
     */
     windowMountAttribute() {
      window.ItasklistDetail = {
        initData: this.initData, // 初始化
      }
    },
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.init()
    },
    // 展示收缩
    async handleShowDetail(item) {
      if (!item.isShow) {
        let res = await API.ApiGetMsgApproval({taskId: item.id})
        if (res.code == '200') {
          this.singMoreShowData = res.data
        }
      }
      if (this.propData.accordion == 'show') { // 只展示一个
        this.list.forEach(k => {
          if (k.key == item.key) {
            item.isShow = !item.isShow
          } else {
            k.isShow = false
          }
        })
      } else {
        item.isShow = !item.isShow
      }
      setTimeout(() => {
        this.$nextTick(() => {
          this.getComponentsHeight()
        })
      }, 200)
    },
    // 获取组件总高度
    getComponentsHeight() {
      this.$nextTick(() => {
        setTimeout(() => {
          try{
            let height = this.$refs.taskRef.offsetHeight
            top.updateSonTaskIframeHeight(height + 20)
          }catch(e) {
            console.log('获取总高度', e)
          }
        }, 100)
      })
    },
    // 加工数据
    handleInitProcess() {
      if (this.list.length) {
        this.list.forEach((item, index) => {
          if (!item[this.indexDataFiled]) {
            item[this.indexDataFiled]  = 'index' + (index === 0 ? 0 : IDM.uuid());
          }
          this.$set(item, 'key', index)
          this.$set(item, 'isShow', false)
        })
        if (this.propData.handleDataFunc && this.propData.handleDataFunc.length > 0) {
          let name = this.propData.handleDataFunc[0].name
          window[name] && window[name].call(this, {
            _this: this,
            data: this.list
          });
        }
        // this.list[0].isShow = true
        this.getComponentsHeight()
      }
    },
    async getMockData() {
      let res = await API.ApigetTaskApproval({approvalId: '240624172842HXh32meKopKm8dm5Kd7'})
      if (res.code == '200') {
        this.list = res.data;
        this.handleInitProcess()
      }
      // this.list = getTaskDetail()
      // this.handleInitProcess()
    },
    initData() {
      if (this.moduleObject.env !== 'production') {
        this.getMockData()
        return
      }
      this.loading = true
      let params = this.commonParam()
      let customParams = {};
      if (this.propData.requireParamsFunc && this.propData.requireParamsFunc.length > 0) {
        let name = this.propData.requireParamsFunc[0].name
        customParams = window[name] && window[name].call(this, {
          _this: this
        });
      }
      // 如果是1 dsf会隐藏该组件就不用调用接口
      if(customParams?.isSingleTask == 1) {
        return
      }
      setTimeout(() => {
        this.loading = false
      }, 200)
      switch(this.propData.dataSourceType) {
        case 'dataSourceName':{ // 数据源
          if (this.propData.dataSourceForm) {
            IDM.datasource.request(this.propData.dataSourceForm[0]?.id, {
              moduleObject: this.moduleObject,
              ...params,
              ...customParams
              }, (data) => {
                this.list = data;
                this.handleInitProcess()
            })
          }
        }
          break
        case 'customInterface':{ // 接口
          this.propData.customInterfaceUrl &&
          window.IDM.http[this.propData.requestType || 'get'](
            this.propData.customInterfaceUrl,
            {
              ...params,
              ...customParams
            },
            {
              headers: this.propData.requestContentType?{
                'Content-Type':
                  this.propData.requestContentType ||
                  'application/json;charset=UTF-8'
              }:{}
            }
          )
          .then(res => {
            let resultData = res && res.data;
            this.list = resultData;
            this.handleInitProcess()
          })
        }
          break
        case 'pageCommonInterface': // 页面接口
          // 使用页面接口逻辑在 setContextValue 执行
          break
        case 'customFunction':{ // 自定义函数
          if (this.propData.customFunction && this.propData.customFunction.length > 0) {
            let resultData = []
            let name = this.propData.customFunction[0].name
            resultData = window[name] && window[name].call(this, {
              _this: this,
              params: {
                ...params,
                ...customParams
              }
            });
            this.list = resultData;
            this.handleInitProcess()
          }
        }
          break
      }
    },
    /**
     * 获取子组件的内容到componentData并返回错误信息
     */
     getChildrenContextToThis() {
      let hasErrorData = [];
      this.list.forEach((item) => {
        const allModulePackageId = this.moduleObject?.getModuleChildrenPackageId(
          this.moduleObject.packageid,
          item[this.indexDataFiled],
          false
        );
        //所有返回结果
        let moduleAllData = window.IDM.broadcast.getModuleContextValue(
          allModulePackageId,
          null
        );
        if (moduleAllData.errorData.length > 0) {
          //有校验失败的
          hasErrorData.push({ item, errorData: moduleAllData.errorData });
          return false;
        }
        //所有已经校验通过的返回结果,数组形式
        let moduleDataArray = moduleAllData.resultData;
        moduleDataArray &&
          moduleDataArray.forEach((mitem) => {
            if (mitem.key) {
              item[mitem.key] = mitem.data;
            }
          });
      });
      if (!hasErrorData.length) {
        this.errorMessage = "";
      }
      return hasErrorData;
    },
    // 更新子组件, 当前组件无法把数据传输到子容器内(问题)
    renderDragComponent() {
      this.list.forEach((item, index) => {
        this.moduleObject.dynamicRenderModuleGroupInitData &&
          this.moduleObject.dynamicRenderModuleGroupInitData(
            this.moduleObject.packageid,
            item[this.indexDataFiled],
            item,
            false,
            this.propData.sendMessageKey
          );
      });
    },
    init() {
      this.handleStyle()
      this.convertThemeListAttrToStyleObject()
      this.initData()
    }
  }
}
</script>

<style lang="scss" scoped>
.taskdetail{
  .mtl30{
    margin-left: 30px;
  }
  .mt10{
    margin-top: 10px;
  }
  .task-loading{
    width: 100%;
    height: 100%;
  }
  .dragShow{
    visibility: visible;
  }
  .task-title{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .task-right-icon{
    display: flex;
    align-items: center;
    svg{
      cursor: pointer;
    }
  }
  .task-li-list{
    display:flex;
    align-items:center;
    margin-top:10px;
    justify-content:space-between;
  }
  .task-groupbtn{
    img {
      width: 20px;
      height: 20px;
    }
  }
  .task-span{
    color: #7DA3E4;
    padding: 2px 6px;
    background-color: #ECF1FB;
    border-radius:3px;
    margin-right:5px;
    font-size: 14px;
  }
  .task-ban-gray{
    color: #666666;
    background-color: rgb(102 102 102 / 10%)
  }
  .task-ban-blue{
    color: #0086D9;
    background-color: rgb(0 134 217 / 10%);
  }
  .task-ul {
    .task_drag{
      min-height: 100px;
    }
    .ant-collapse{
      border: 0;
    }
    .task-li{
      transition: all 1s ease-in-out;
      cursor: pointer;
    }
    .task-namelefticon{
      text-align: center;
    }
    .task-icon{
      font-size: 16px;
    }
    .task-icon+.task-icon{
      margin-left: 10px;
    }
    .task-li-flex{
      display:flex;
      align-items:center;
      font-size: 14px;
    }
    .task-name{
      display: flex;
      align-items: center;
      justify-content: space-between;
      .task-li-title{
        width: 100%;
        display: inline-block;
      }
      .task-li-titleTop{
        text-align: justify;
      }
      .task-li-tip{
        font-size: 16px;
        padding:2px 5px;
        border-radius:3px;
      }
      .taskbtn1{
        background:#ECF1FB;
        color:#89ACE7;
        border:1px solid #89ACE7;
        margin-right:5px;
      }
      .taskbtn2{
        background:#FDEFEF;
        color:#E82D2D;
        border:1px solid #E82D2D;
        margin-right:10px;
      }
      .task-li-content{
        flex: 1;
        text-align: justify;
      }
    }
    .task-nameicon{
      min-width: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      .taskbtn{
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #666;
      }
      .taskbtn+.taskbtn{
        margin-left: 20px;
      }
      span{
        margin-top: 4px;
      }
    }
    .task-iconlist{
      display: flex;
      flex-direction: column;
      align-items: center;
      .task-iconlist-bottom{
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
  
}
/*
* 滚动条设置
*/

.taskdetail::-webkit-scrollbar {
  width: 9px;
  height: 6px;
}
.taskdetail::-webkit-scrollbar-thumb {
  background-color: #fff;
}
.taskdetail::-webkit-scrollbar-thumb {
  min-height: 18px;
  border-radius: 4px;
}
</style>

<style lang="scss">
.task-ul {
  .ant-collapse-icon-position-right > .ant-collapse-item > .ant-collapse-header{
    padding: 0 60px 0 0;
  }
}
.itasklist-default{
  margin-top: 10px;
    .taskInfo-li{
      border-top: 1px dotted #ccc;
    }
  }
</style>
