<template>
    <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <div class="subtaskinfo" ref="subtaskinfo">
            <template v-if="singMoreShowData.length">
                <taskInfo
                    origin="ItasklistDetail"
                    :themeList="propData.themeList"
                    :btngroup="propData.btngroup"
                    :porpsList="singMoreShowData"
                    :isMoOpen="true"
                    @handleContentJump="handleContentJump"
                    @handleFileOpen="handleFileOpen"
                    @handleCuiCata="handleCuiCata"
                    @handleCuiBell="handleCuiBell"
                    @handleOptions="handleOptions"
                ></taskInfo>
            </template>
            <template v-else>
                <a-empty :imageStyle="{ height: propData.emptySize + 'px' }" description="暂无数据"></a-empty>
            </template>
        </div>
    </div>
</template>

<script>
import { getSubTaskList } from '../utils/mock'
import taskInfo from '../commonComponents/taskInfo.vue' // 子任务
import bindProp from '../mixins/bindProp'
import dataUtil from '../utils/dataUtil'
export default {
    name: 'ISubTaskInfo',
    mixins: [
        bindProp({
            btngroup: false,
            interfaceUrl: 'ctrl/dbAppraise/getNoticeByTaskId'
        })
    ],
    components: {
        taskInfo
    },
    data() {
        return {
            singMoreShowData: [],
            taskId: ''
        }
    },
    mounted() {
        this.init()
    },
    methods: {
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
                    top.Public.officeLook(item.fileName, item.id, '', true)
                }
            }
        },
        // 子项跳转
        handleContentJump(item) {
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
        // 催办
        handleCuiCata(item) {
            if (this.propData.hanldeCuiban && this.propData.hanldeCuiban.length > 0) {
                let name = this.propData.hanldeCuiban[0].name
                window[name] &&
                    window[name].call(this, {
                        _this: this,
                        item: item
                    })
            }
        },
        // 在落实
        handleCuiBell(item) {
            if (this.propData.handleLuoshi && this.propData.handleLuoshi.length > 0) {
                let name = this.propData.handleLuoshi[0].name
                window[name] &&
                    window[name].call(this, {
                        _this: this,
                        item: item
                    })
            }
        },
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {}
            this.init()
        },
        /**
         * @Desc 设置样式
         */
        handleStyle() {
            let styleObject = {}
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
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .subtaskinfo', styleObject)
        },
        getMockData() {
            this.singMoreShowData = getSubTaskList()
            this.sendHeight()
        },
        getTaskId() {
            try {
                const { id } = top.getTaskParam() // 调用dsf方法初始化
                return id
            } catch (e) {
                console.log('ISubTaskInfo: 获取任务id失败', e)
            }
        },
        sendHeight() {
            this.$nextTick(() => {
                try {
                    let height = this.$refs.subtaskinfo.offsetHeight + 30
                    top.updateSingleTaskIframeHeight(height)
                } catch (e) {
                    console.log('获取总高度', e)
                }
            })
        },
        async initData() {
            if (this.moduleObject.env !== 'production') {
                this.getMockData()
                return
            }
            dataUtil
                .fetchData(
                    {
                        dataSourceType: 'customInterface',
                        customInterface: {
                            url: this.propData.interfaceUrl,
                            requestParamFun: this.propData.interfaceParamsFunc,
                            responseDataFun: this.propData.hanldeInterfaceFunc
                        }
                    },
                    {
                        params: {
                            taskId: this.getTaskId()
                        }
                    }
                )
                .then((data) => {
                    this.singMoreShowData = data.data
                    this.$nextTick(() => {
                        this.sendHeight()
                    })
                })
        },
        init() {
            this.handleStyle()
            this.initData()
        },
        // 操作项
        handleOptions(obj) {
            if (_.isArray(this.propData.handleActionFunc) && this.propData.handleActionFunc.length > 0) {
                window.IDM.invokeCustomFunctions.call(this, this.propData.handleActionFunc, obj)
            }
        }
    }
}
</script>

<style lang="scss">
.subtaskinfo {
    .taskInfo-li:first-child {
        border: 0;
    }
    .taskInfo-li {
        border-top: 1px dotted #ccc;
    }
}
</style>
