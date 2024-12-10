<template>
  <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="body">
    <div class="tabs">
      <div class="tab" :class="{active:activeKey == item.key}" v-for="item in tabList" :key="item.key" @click="changeTab(item)">
        <div class="tab-inner">
          <img :src="hanldeImg(activeKey == item.key ? item.openSrc:item.src)" alt="">
          <span>{{item.name}}</span>
        </div>
      </div>
    </div>
    <div class="container">
      <template v-for="item in tabList">
        <div
         :key="item.key"
          class="drag_container"
          v-if="item.opened"
          :class="`idm-tab-inner-${item.key}`"
          idm-ctrl-inner
          :idm-ctrl-id="moduleObject.id"
          :idm-container-index="item.key"
        >
          <!--统一的插槽写法，主要用于vue组件，其他语言的脚手架可忽略-->
          <slot :name="moduleObject.id+item.key"></slot>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import bindProp from '../mixins/bindProp'
import bindStyle from '../mixins/bindStyle'
export default {
    mixins: [
        bindProp(),
        bindStyle()
    ],
    components: {
    },
    data() {
        return {
            moduleObject: this.$root.moduleObject,
            env_develop_mode: window.IDM.env_develop_mode,
            record: null,
            propData: this.$root.propData.compositeAttr || {},
            tabList: [{
              src:"db.png",
              openSrc:"db-open.png",
              name:"督办情况",
              key:'1',
              opened:true
            },{
              src:"xn.png",
              openSrc:"xn-open.png",
              name:"效能分析",
              key:'2',
              opened:false
            },{
              src:"gt.png",
              openSrc:"gt-open.png",
              name:"挂图作战",
              key:'3',
              opened:false
            }],
            activeKey: '1'
        }
    },
    methods: {
        hanldeImg(img) {
            return IDM.url.getModuleAssetsWebPath(require(`../assets/${img}`), this.moduleObject)
        },
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
        changeTab(item){
          this.activeKey = item.key;
          this.tabList.forEach(e=>{
            if (e.key == this.activeKey) {
              e.opened = true;
            }else{
              e.opened = false;
            }
          })
          this.$forceUpdate()
        }
    }
}
</script>
<style lang="scss" scoped>
.tabs{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 44px 48px;
  .tab{
    padding-bottom: 17px;
    flex: 1;
    cursor: pointer;
    &+.tab{
      margin-left: 32px;
    }
    .tab-inner{
      background: rgba(255,255,255,0.40);
      border-radius: 20px;
      height: 226px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: PingFangSC-Medium;
      font-size: 40px;
      color: #FFFFFF;
      font-weight: 500;
      img{
        margin-bottom: 20px;
      }
    }
    &.active{
      background: url(../assets/selectbg.png);
      background-size: 100% 100%;
      .tab-inner{
        font-family: PingFangSC-Medium;
        font-size: 40px;
        color: #333333;
        font-weight: 500;
      }
    }
  }
}
.container{
  padding: 20px 48px;
}
</style>
