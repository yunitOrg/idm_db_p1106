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
    <div class="ideaback">
      <div class="idea-top">
        <div class="idea-title">{{ propData.dialogTitle || "意见反馈" }}</div>
        <!-- <img src="../assets/close.png" alt="" @click="handleClose"> -->
      </div>
      <a-spin class="ideaback-loading" :spinning="loading"></a-spin>
      <div class="mdt20">
        <a-form
          :form="form"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 19 }"
        >
          <a-form-item>
            <span slot="label" class="font-label">{{ propData.dialogDesc || "反馈描述：" }}</span>
            <a-textarea style="height: 140px;" placeholder="请输入内容" v-decorator="['content', { rules: [{ required: true, message: '请填写内容!' }] }]"/>
          </a-form-item>
          <a-form-item>
            <div slot="label" class="font-label">
              <div class="label" style="margin-bottom: -5px;">{{ propData.dialogUpload || "上传附件：" }}</div>
              <span class="label" style="padding-right: 15px;" v-show="propData.dialogTian">（选填）</span>
            </div>
            <div class="upload" @click="handleUploadFile" v-if="fileAry.length <= 0"><img src="../assets/add.png" alt=""></div>
            <div class="flex">
              <div class="filebox" v-if="fileAry.length">
                <div v-for="(item, index) in fileAry" :key="index">
                  <span @click="handlePreview(item)">{{ item.name }}</span>
                  <span class="delete" @click="handleDelete(index)"><a-icon type="delete" /></span>
                </div>
              </div>
            </div>
          </a-form-item>
        </a-form>
      </div>
      <a-button class="submit" type="primary" @click="handleSubmit" :style="{
        right: propData.dialogBtnX,
        bottom: propData.dialogBtnY
      }">提交</a-button>
    </div>
  </div>
</template>

<script>
import API from '../api/meeting'
export default {
  name: 'IdeaBack',
  data() {
    return {
      loading: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      fileAry: [],
      fileObj: {},
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        dialogTian: true,
        height: "100vh",
        dialogBtnX: "50%",
        dialogBtnY: "50px"
      }
    }
  },
  mounted() {
    this.moduleObject = this.$root.moduleObject;
    this.init()
  },
  methods: {
    handleDelete(index) {
      this.fileAry.splice(index, 1)
    },
    // 关闭弹框
    handleClose() {
      try{
        top.feedbackClose()
      } catch(e) {
        console.log("关闭弹框", e)
      }
    },
    // 预览
    handlePreview() {
      if (this.propData.previewFileFunc && this.propData.previewFileFunc.length > 0) {
        let name = this.propData.previewFileFunc[0].name
          window[name] && window[name].call(this, {
          _this: this,
          fileObj: this.fileObj
        });
      }
    },
    // 上传文件
    async handleUpload(file) {
      this.loading = true;
      let obj = {}
      if (this.propData.uploadFileParamsFunc && this.propData.uploadFileParamsFunc.length > 0) {
        let name = this.propData.uploadFileParamsFunc[0].name
        obj = window[name] && window[name].call(this, {
          _this: this,
        });
      } else {
        obj = IDM.url.queryObject();
      }
      let formdata = new FormData();
      Object.keys(obj).forEach(item => {
        formdata.append(item, obj[item])
      })
      formdata.append('file', file);
      const { data } = await window.IDM.http.post('ctrl/file/upload', formdata, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        })
      if (data.code == '200') {
        this.fileObj = data;
        this.fileAry.push(file);
        this.loading = false;
      } else {
        this.loading = false;
      }
    },
    // 上传
    handleUploadFile() {
      this.uploadFile(e => {
        let files = e.target.files;
        this.handleUpload(files[0]);
      })
    },
    uploadFile(fn, accept = '', multiple=false, webkitdirectory=false) {
      const input = document.createElement('input');
      input.type = 'file';
      input.webkitdirectory = webkitdirectory
      input.accept = accept,
      input.multiple = multiple
      input.onchange = (e) => {
        fn(e);
      };
      setTimeout(() => {
        input.click();
      }, 0);
    },
    handleSubmit() {
      this.form.validateFields(async (err, fieldValue) => {
        if (err) {
          return
        }
        let params = {};
        if (this.propData.dataSourceParamFunc && this.propData.dataSourceParamFunc.length > 0) {
          let name = this.propData.dataSourceParamFunc[0].name
          params = window[name] && window[name].call(this, {
            _this: this,
          });
        }
        let res = await API.ApiIdearBack({file: this.fileAry, content: fieldValue.content, params});
        if (res.code == '200') {
          window.IDM.message.success('提交成功');
          this.handleClose()
        }
      })
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
        titleStyle = {};
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
            const element = this.propData[key]
            if (!element && element !== false && element != 0) {
                continue
            }
            switch (key) {
                case 'width':
                    styleObject['width'] = element
                    break
                case 'height':
                    styleObject['height'] = element
                    break
                case 'ulbox':
                    IDM.style.setBoxStyle(styleObject, element)
                    break
                case 'bgColor':
                    styleObject['background-color'] = element && element.hex8
                    break
                case 'boxShadow':
                    styleObject['box-shadow'] = element
                    break
                case 'boxborder':
                    IDM.style.setBorderStyle(styleObject, element)
                    break
                case 'dialogTitleStyle':
                    IDM.style.setFontStyle(titleStyle, element, true)
                  break
            }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id + ' .ideaback', styleObject)
      window.IDM.setStyleToPageHead(this.moduleObject.id + ' .ideaback .idea-title', titleStyle)
    },
    initData() {

    },
    init() {
      this.handleStyle()
      this.initData()
    }
  }
}
</script>

<style lang="scss" scoped>
.ideaback{
  position: relative;
  .ideaback-loading{
    // opacity: 0.1;
    position: absolute;
    top: 50%;
    right: 50%;
  }
  .idea-top{
    height: 60px;
    background-image:  linear-gradient(266deg, #9AC7FF 0%, #6195FE 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    .idea-title{
      font-size: 26px;
      color: #fff;
      font-weight: 600;
    }
  }
  ::v-deep .ant-form-item-label > label::after{
    content: "";
  }
  .mdt20{
    margin-top: 20px;
  }
  .flex{
    display: flex;
  }
  .upload{
    cursor: pointer;
    margin-left: 10px;
    width: 96px;
    height: 96px;
    background-color: #F1F6FB;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
  }
  .filebox{
    max-height: 200px;
    overflow: auto;
    box-sizing: border-box;
    padding: 0 10px;
    div{
      color: blue;
      font-size: 16px;
      line-height: 24px;
      cursor: pointer;
    }
    .delete{
      cursor: pointer;
      padding-left: 10px;
      color: #333;
    }
  }
  .font-label{
    height: 40px;
    font-size: 16px;
    color: #333;
    .label{
      line-height: 24px;
    }
  }
  .submit{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 130px;
    background-color: #6195FE;
    height: 55px;
    font-size: 16px;
  }
}
</style>

