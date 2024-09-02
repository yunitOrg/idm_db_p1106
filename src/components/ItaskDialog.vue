<template>
    <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <a-config-provider :locale="locale">
            <div v-if="list.length > 0" class="subtaskdialog">
                <a-timeline>
                    <a-timeline-item v-for="(item, index) in list" :key="index">
                        <template slot="dot">
                            <div class="subtaskdot"></div>
                        </template>
                        <div class="right-time">{{ item[propData.timeField || 'feedbackTime'] }}</div>
                        <div class="right-content">
                            <span @click="handleJump(item)" class="subtask-span">{{ item[propData.contentFiled || 'feedbackContent'] }}</span>
                            <div class="right-file">
                                <div
                                    v-for="(subitem, subindex) in item[propData.fileGroupField || 'feedbackAttachFiles']"
                                    :key="subindex"
                                    :title="subitem.fileName"
                                    @click.stop="handleOpen(subitem)"
                                >
                                    <svg-icon icon-class="file"></svg-icon>
                                    {{ subitem[propData.fileNameField || 'fileName'] }}
                                </div>
                            </div>
                        </div>
                    </a-timeline-item>
                </a-timeline>
            </div>
            <a-empty v-else-if="!fetching" />
        </a-config-provider>
    </div>
</template>

<script>
import { getTaskDialog } from '../utils/mock'
import zh_CN from 'ant-design-vue/lib/locale/zh_CN'
export default {
    data() {
        return {
            locale: zh_CN,
            list: [],
            moduleObject: {},
            fetching: true,
            propData: this.$root.propData.compositeAttr || {
                width: '100%',
                height: '100%',
                timeChooseLine: 'dotted',
                ulbox: {
                    marginTopVal: '',
                    marginRightVal: '',
                    marginBottomVal: '',
                    marginLeftVal: '',
                    paddingTopVal: '10px',
                    paddingRightVal: '20px',
                    paddingBottomVal: '10px',
                    paddingLeftVal: '20px'
                },
                timeLiBottom: '20px',
                timeDateLeft: '20px',
                timeDateRight: '20px',
                timeLiFont: {
                    fontColors: {
                        hex: '#333',
                        hex8: '#333'
                    }
                }
            }
        }
    },
    mounted() {
        this.moduleObject = this.$root.moduleObject
        this.init()
    },
    methods: {
        // 子项跳转
        handleJump(item) {
            if (this.propData.handleChildFunc && this.propData.handleChildFunc.length > 0) {
                let name = this.propData.handleChildFunc[0].name
                window[name] &&
                    window[name].call(this, {
                        _this: this,
                        item: item
                    })
            } else {
                window.open(item.lastFeedbackUrl)
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
                    top.Public.officeLook(item.fileName, item.id, '', true, { officeModuleId: 'skyDrive' })
                }
            }
        },
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {}
            this.init()
        },
        /**
         * @Desc 设置主题
         */
        convertThemeListAttrToStyleObject() {
            var themeList = this.propData.themeList
            if (!themeList) {
                return
            }
            const themeNamePrefix = IDM.setting && IDM.setting.applications && IDM.setting.applications.themeNamePrefix ? IDM.setting.applications.themeNamePrefix : 'idm-theme-'
            for (var i = 0; i < themeList.length; i++) {
                var item = themeList[i]
                let bulletBgColorObj = {
                    color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
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
                IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} #${this.moduleObject.id || 'module_demo'} .subtaskdialog .right-file`, bulletBgColorObj)
                IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} #${this.moduleObject.id || 'module_demo'} .subtaskdialog .subtask-span`, bulletBgColorObj)
                IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} #${this.moduleObject.id || 'module_demo'} .subtaskdialog .ant-timeline-item-tail`, timeDateStyle)
                IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} #${this.moduleObject.id || 'module_demo'} .subtaskdialog .subtaskdot`, dotObject)
                IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} #${this.moduleObject.id || 'module_demo'} .subtaskdialog .subtaskdot:after`, dotAfterObject)
            }
        },
        /**
         * @Desc 设置样式
         */
        handleStyle() {
            let styleObject = {},
                liObject = {},
                timeObject = {},
                timeMarginLeftObject = {},
                timeTimeRightObject = {},
                borderStyle = {},
                contentFontObject = {},
                fileStyleObject = {},
                listTitleNameObj = {}
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
                        case 'timeLiBottom':
                            liObject['padding'] = `0 0 ${element}`
                            break
                        case 'timeLiFont':
                            IDM.style.setFontStyle(timeObject, element, true)
                            break
                        case 'timeDateRight':
                            timeMarginLeftObject['margin'] = `0 0 0 ${element}`
                            break
                        case 'timeDateLeft':
                            timeTimeRightObject['margin-right'] = element
                            break
                        case 'timeChooseLine':
                            borderStyle['border-left-style'] = element
                            break
                        case 'timeLineColor':
                            borderStyle['border-color'] = element && element.hex8
                            break
                        case 'timeContentFont':
                            IDM.style.setFontStyle(contentFontObject, element, true)
                            break
                        case 'fileContentFont':
                            IDM.style.setFontStyle(fileStyleObject, element, true)
                            break
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .subtaskdialog', styleObject)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .subtaskdialog .ant-timeline-item', liObject)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .subtaskdialog .right-time', timeObject)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .subtaskdialog .ant-timeline-item-content', timeMarginLeftObject)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .subtaskdialog .ant-timeline-item-content .right-time', timeTimeRightObject)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .subtaskdialog .ant-timeline-item-tail', borderStyle)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .subtaskdialog .right-content span', contentFontObject)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .subtaskdialog .right-content .right-file', fileStyleObject)
        },
        /**
         * 通用的url参数对象
         * 所有地址url参数转换
         */
        commonParam() {
            let urlObject = IDM.url.queryObject()
            return {
                pageId: window.IDM.broadcast && window.IDM.broadcast.pageModule ? window.IDM.broadcast.pageModule.id : '',
                urlData: JSON.stringify(urlObject)
            }
        },
        getMockData() {
            this.list = getTaskDialog()
        },
        initData() {
            if (this.porpsList && this.porpsList?.length) {
                return
            }
            // if (this.moduleObject.env !== 'production') {
            //     this.getMockData()
            //     return
            // }
            let params = this.commonParam()
            let customParams = {}
            this.fetching = true
            if (this.propData.dataSourceParamFunc && this.propData.dataSourceParamFunc.length > 0) {
                let name = this.propData.dataSourceParamFunc[0].name
                customParams =
                    window[name] &&
                    window[name].call(this, {
                        _this: this,
                        params: params
                    })
            }
            if (this.propData.dataSourceForm) {
                IDM.datasource.request(
                    this.propData.dataSourceForm[0]?.id,
                    {
                        moduleObject: this.moduleObject,
                        ...params,
                        ...customParams
                    },
                    (data) => {
                        console.log('ITaskDialog response', this.data)
                        this.list = data || []
                        this.fetching = false
                    }
                )
            }
        },
        init() {
            this.initData()
            this.handleStyle()
            this.convertThemeListAttrToStyleObject()
        }
    }
}
</script>

<style lang="scss" scoped>
.subtaskdialog {
    :deep(.ant-timeline) {
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
        .ant-timeline-item-content {
            display: flex;
        }
    }
    .right-content {
        flex: 1;
        span {
            text-align: justify;
            display: inline-block;
        }
    }
    .right-content {
        cursor: pointer;
    }
    .right-file {
        cursor: pointer;
        div {
            padding-top: 5px;
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
:deep(.ant-empty) {
    padding-top: 15vh;
    .ant-empty-image {
        height: 80px;
    }
    .ant-empty-description {
        font-size: 16px;
        color: #999;
    }
}
</style>
