<template>
  <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
<div idm-ctrl="idm_module"
  :id="moduleObject.id"
  :idm-ctrl-id="moduleObject.id">
  <div class="isuperTail">
    <div class="isupertail-ul" :style="`height:${propData.listHeight}`" >
      <template v-if="list.length > 0">
        <a-spin class="supertail-loading" :spinning="loading"></a-spin>
        <div class="isupertail-li" v-for="(item, index) in list" :key="index">
          <div class="tail-left">
            <div class="tail-mb10">
              <span class="bt">承办部门：</span>
              <span class="gray">{{ item[propData.underPart] || item.underPart }}</span>
              <span class="bt ml20">签收人：</span>
              <span class="gray">{{ item[propData.people] || item.people }}</span>
            </div>
            <div class="tail-mb10">
              <span class="bt">下发时间：</span>
              <span class="gray">{{ item[propData.time] || item.time }}</span>
            </div>
            <div class="tail-mb10">
              <span class="bt">签收状态：</span>
              <span class="gray">{{ item[propData.status] || item.status }}</span>
            </div>
            <div class="tail-mb10">
              <span class="bt">签收时间：</span>
              <span class="gray">{{ item[propData.signTime] || item.signTime }}</span>
            </div>
          </div>
          <div class="tail-right">
            <img :src="hanldeImg('cui.png')" alt="" @click="handleFirstCui(item)">
            <img :src="hanldeImg('bell.png')" alt="" @click="handleFirstHui(item)">
          </div>
        </div>
      </template>
      <template v-else>
        <div class="isuperTail-empty">
          <a-empty :imageStyle="{height: 100 + 'px'}" description="暂无数据"></a-empty>
        </div>
      </template>
    </div>
    <div class="mt20" v-if="list.length > 0">
      <a-button type="primary" @click="handleCui">一键催办</a-button>
      <a-button @click="handleHui">一键回收</a-button>
    </div>
  </div>
</div>
</template>

<script>
import { getTaskGenList } from '../utils/mock';
export default {
  name: 'ISuperTail',
  data() {
    return {
      list: [],
      moduleObject: {},
      loading: false,
      propData: this.$root.propData.compositeAttr || {
        width: '500px',
        listHeight: 'calc(100vh - 200px)',
        innerItemColor: {
          hex8: '#f5f5f5'
        },
        nameFont: {
          fontColors: {
            hex: "#333",
            hex8: "#333"
          }
        },
        innerFont: {
          fontColors: {
            hex: "#2c2727",
            hex8: "#2c2727"
          }
        },
        innerItemLi: '15px',
        innerBox: {
          marginTopVal: "",
          marginRightVal: "",
          marginBottomVal: "",
          marginLeftVal: "",
          paddingTopVal: "",
          paddingRightVal: "10px",
          paddingBottomVal: "",
          paddingLeftVal: "10px"
        },
        innerItemBox: {
          marginTopVal: "",
          marginRightVal: "",
          marginBottomVal: "",
          marginLeftVal: "",
          paddingTopVal: "10px",
          paddingRightVal: "10px",
          paddingBottomVal: "10px",
          paddingLeftVal: "10px"
        },
        ulbox: {
          marginTopVal: "",
          marginRightVal: "",
          marginBottomVal: "",
          marginLeftVal: "",
          paddingTopVal: "10px",
          paddingRightVal: "",
          paddingBottomVal: "10px",
          paddingLeftVal: ""
        }
      }
    }
  },
  mounted() {
    this.moduleObject = this.$root.moduleObject;
    this.init()
  },
  methods: {
    // 一键催办
    handleCui() {
      if (this.propData.hadnleCui && this.propData.hadnleCui.length > 0) {
        let name = this.propData.hadnleCui[0].name
        window[name] && window[name].call(this, {
          _this: this,
          data: this.list
        });
      }
    },
    // 一键回收
    handleHui() {
      if (this.propData.handleHui && this.propData.handleHui.length > 0) {
        let name = this.propData.handleHui[0].name
        window[name] && window[name].call(this, {
          _this: this,
          data: this.list
        });
      }
    },
    handleFirstCui(item) {
      if (this.propData.hadnleFirstCui && this.propData.hadnleFirstCui.length > 0) {
        let name = this.propData.hadnleFirstCui[0].name
        window[name] && window[name].call(this, {
          _this: this,
          item: item
        });
      }
    },
    handleFirstHui(item) {
      if (this.propData.handleFirstHui && this.propData.handleFirstHui.length > 0) {
        let name = this.propData.handleFirstHui[0].name
        window[name] && window[name].call(this, {
          _this: this,
          item: item
        });
      }
    },
    hanldeImg(img) {
      return IDM.url.getModuleAssetsWebPath(require(`../assets/${img}`), this.moduleObject)
    },
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.init()
    },
    /**
     * @Desc 设置样式
     */
     handleStyle() {
      let styleObject = {},
        innerItemBox = {},
        innerLi = {},
        nameFont = {},
        innerFont = {},
        innerBox = {};
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key]
          if (!element && element !== false && element != 0) {
            continue
          }
          switch (key) {
            case 'width':
              styleObject['width'] = element;
              break
            case 'height':
              styleObject['height'] = element;
              break
            case 'ulbox':
              IDM.style.setBoxStyle(styleObject, element)
              break
            case 'bgColor':
              styleObject['background-color'] = element && element.hex8;
              break
            case 'boxShadow':
              styleObject['box-shadow'] = element;
              break
            case 'boxborder':
              IDM.style.setBorderStyle(styleObject, element);
              break
            case 'innerBox':
              IDM.style.setBoxStyle(innerBox, element)
              break
            case 'innerItemBox':
              IDM.style.setBoxStyle(innerItemBox, element)
              break
            case 'innerItemColor':
              innerItemBox['background-color'] = element && element.hex8;
              break
            case 'innerItemLi':
              innerLi['margin-top'] = element;
              break
            case 'nameFont':
              IDM.style.setFontStyle(nameFont, element);
              break
            case 'innerFont':
              IDM.style.setFontStyle(innerFont, element);
              break
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .isuperTail", styleObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .isupertail-ul", innerBox);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .isupertail-li", innerItemBox);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .isuperTail .bt", nameFont);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .isuperTail .gray", innerFont);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .isupertail-li+.isupertail-li", innerLi);
    },
    getMockData() {
      // this.list = getTaskGenList()
      this.list = []
    },
    initData() {
      if (this.moduleObject.env !== 'production') {
        this.getMockData()
        return
      }
      let customParams = {};
      if (this.propData.dataSourceParamFunc && this.propData.dataSourceParamFunc.length > 0) {
        let name = this.propData.dataSourceParamFunc[0].name
        customParams = window[name] && window[name].call(this, {
          _this: this,
        });
      }
      if (this.propData.dataSourceForm) {
        this.loading = true
        IDM.datasource.request(this.propData.dataSourceForm[0]?.id, {
          moduleObject: this.moduleObject,
          param: {
            ...customParams
          }
          }, (data) => {
            this.loading = false;
            this.list = data;
        }, (e) => {
          this.loading = false;
        })
        return
      }
    },
    init() {
      this.handleStyle()
      this.initData()
    }
  }
}
</script>

<style lang="scss" scoped>
.isuperTail{
  .bt{
    font-weight: 600;
    font-size: 16px;
  }
  .gray{
    font-size: 16px;
  }
  .mt20{
    margin-top: 20px;
    text-align: center;
    button{
      min-width: 80px;
      height: 40px;
    }
    button+button{
      margin-left: 10px;
    }
  }
  .ml20{
    margin-left: 20px;
  }
  .isuperTail-empty{
    height: 100%;
    position: relative;
    .ant-empty{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  /*
  * 滚动条设置
  */
  .isupertail-ul::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .isupertail-ul::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1);
  }
  .isupertail-ul::-webkit-scrollbar-track-piece {
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.1);
  }
  .supertail-loading{
    position: absolute;
    top: 50%;
    left: 50%;
  }
  .isupertail-ul{
    position: relative;
    overflow-y: scroll;
    .isupertail-li{
      display: flex;
      justify-content: space-between;
      border-radius: 10px;
      box-sizing: border-box;
    }
    .tail-mb10+.tail-mb10{
      margin-top: 10px;
    }
    .tail-right{
      display: flex;
      align-items: center;
      img{
        cursor: pointer;
        width: 30px;
        height: 30px;
      }
      img+img{
        margin-left: 10px;
      }
    }
  }
}
</style>
