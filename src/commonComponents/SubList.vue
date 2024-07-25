<template>
    <div class="pervise-wrap">
        <template v-if="record.assignType == 3">
            <!-- 任务 -->
            <TaskItem
                v-for="(item, index) in dataSource"
                :data="item"
                :key="index"
                :moduleObject="moduleObject"
                @handleOptions="handleOptions"
                @handleContentJump="handleContentJump"
                @handleFileOpen="handleFileOpen"
            >
                <template #default="{ data }">
                    <SubList :record="data" :moduleObject="moduleObject" />
                </template>
            </TaskItem>
        </template>
        <template v-else-if="[2, 4, -1].includes(record.assignType)">
            <!-- 通知 -->
            <NoticeItem
                :themeList="propData.themeList"
                :porpsList="dataSource"
                @handleOptions="handleOptions"
                @handleContentJump="handleContentJump"
                @handleFileOpen="handleFileOpen"
            />
        </template>
        <div v-if="env_develop_mode">任务信息</div>
    </div>
</template>
<script>
import NoticeItem from './NoticeItem.vue'
import TaskItem from './TaskItem.vue'
import API from '../api/index'
import bindStyle from '../mixins/bindStyle'
export default {
    name: 'SubList',
    props: {
        record: {
            type: Object,
            required: true
        },
        moduleObject: {
            type: Object
        }
    },
    mixins: [bindStyle],
    components: {
        NoticeItem,
        TaskItem
    },
    data() {
        return {
            singMoreShowData: [], // 多任务里面
            env_develop_mode: window.IDM.env_develop_mode,
            dataSource: [],
            propData: this.$root.propData.compositeAttr || {}
        }
    },
    mounted() {
        this.init()
    },
    watch: {
        record: {
            handler() {
                this.initData()
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        handleJiaImg() {
            return IDM.url.getModuleAssetsWebPath(require('../assets/jia.png'), this.moduleObject)
        },
        handleJianImg() {
            return IDM.url.getModuleAssetsWebPath(require('../assets/jian.png'), this.moduleObject)
        },
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
                    top.Public.officeLook(item.fileName, item.id, '', true, { officeModuleId: 'skyDrive' })
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
        // 切换时间
        onChangeTime(date) {
            this.search.startDate = date.length > 0 ? date[0] : ''
            this.search.endDate = date.length > 0 ? date[1] : ''
        },
        // 督办类型选择
        async handleSuperSelectData(type, result) {
            let res = type == 1 ? await API.ApiPprovalTypeSelect() : await API.ApiDbStatusSelect()
            if (res.code == '200') {
                this[result] = res.data
            }
        },
        /**
         * 类别转换 预转换
         * @param pk 源文件ID
         * @param convertId 转换规则ID
         */
        changeFileByConvert(sourcePk, convertId, urlParam) {
            window.IDM.http.post(
                'ctrl/convert/moduleRuleConvert',
                {
                    convertId: convertId, //指定转换的类型
                    initDataSource: 1, // 0：转换后的数据直接存到数据库 1：转换后的数据存到redis中
                    srcInfo: sourcePk //原来数据的主键
                },
                function (result) {
                    if ('success' == result.type) {
                        var data = result.data
                        var url =
                            window.DSF.getURLRoot() + 'ctrl/formControl/form?moduleId=' + data.moduleId + '&pk=' + data.pk + '&sourcePk=' + sourcePk + '&relationId=' + sourcePk
                        url += '&initDataSource=1' //增加初始化
                        if (urlParam !== undefined) {
                            url += urlParam
                        }
                        window.open(url)
                        // simpleWin(this, {"url": url, "isfresh": true, "name": result.data.moduleName});
                    } else {
                        // layuiError(result.message)
                    }
                }
            )
        },
        // 操作项
        handleOptions(obj) {
            if (this.propData.handleActionFunc && this.propData.handleActionFunc.length > 0) {
                let name = this.propData.handleActionFunc[0].name
                window[name] &&
                    window[name].call(this, {
                        _this: this,
                        option: obj
                    })
            } else {
                // 一般不会进入else 都会有处理函数
                let { item, fatherItem } = obj
                switch (item.value) {
                    case 'approval_terminate': // 立项办结
                        this.changeFileByConvert(fatherItem.id, '240517100312L9QgULGuY1BqbsvLY6n', `&fid=${fatherItem.id}&sourceType=1`)
                        break
                    case 'task_urge':
                        {
                            // 任务催办
                            let id = ''
                            if (fatherItem.isSingleTask == 1) {
                                // 单任务立项
                                id = fatherItem.taskId
                            } else {
                                id = fatherItem.id
                            }
                            let url = `ctrl/formControl/sysForm?moduleId=240509093547WwIEk66utTYmu3WTy1a&formId=240510102244FeFxPwYSdJ9pr1bPILG&nodeId=0&fid=${id}&sourceType=2`
                            url && window.open(url)
                        }
                        break
                    case 'task_terminate': // 任务办结
                        this.changeFileByConvert(fatherItem.fid, '240517100312L9QgULGuY1BqbsvLY6n', `&fid=${fatherItem.id}&sourceType=2`)
                        break
                    case 'notice_urge':
                        {
                            // 通知催办
                            let url = `ctrl/formControl/sysForm?moduleId=240509093547WwIEk66utTYmu3WTy1a&formId=240510102244FeFxPwYSdJ9pr1bPILG&nodeId=0&fid=${fatherItem.id}&sourceType=3`
                            url && window.open(url)
                        }
                        break
                }
            }
        },
        // 点击标题跳转url
        handleJumpUrl(recodrd) {
            if (this.propData.handleTableFunc && this.propData.handleTableFunc.length > 0) {
                let name = this.propData.handleTableFunc[0].name
                window[name] &&
                    window[name].call(this, {
                        _this: this,
                        item: recodrd
                    })
            }
        },
        // 子项展开收缩
        async handleShowList(item) {
            item.isShow = !item.isShow
        },
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {}
            this.init()
        },
        async initData() {
            switch (this.record.assignType) {
                case 2:
                case 4:
                    window.IDM.http
                        .get('ctrl/dbNotice/getNextNoticeByNoticeId', {
                            noticeId: this.record.id
                        })
                        .then(({ data }) => {
                            this.dataSource = data.data
                        })
                    break
                case 3:
                    window.IDM.http
                        .get('ctrl/dbTask/getSplitTaskByNoticeId', {
                            noticeId: this.record.id
                        })
                        .then(({ data }) => {
                            this.dataSource = data.data.map((n) => ({
                                ...n,
                                assignType: -1
                            }))
                        })
                    break
                case -1:
                    window.IDM.http
                        .get('ctrl/dbNotice/getNextNoticeByTaskId', {
                            taskId: this.record.id
                        })
                        .then(({ data }) => {
                            this.dataSource = data.data
                        })
                    break
                default:
                    break
            }
        },
        init() {
            this.handleStyle()
            this.convertThemeListAttrToStyleObject()
        }
    }
}
</script>

<style lang="scss" scoped>
.ant-popover-placement-bottomRight {
    width: 100px !important;
    text-align: center !important;
}
.ant-popover-inner-content {
    padding: 0 !important;
    p {
        padding: 5px 16px !important;
        margin-bottom: 0 !important;
        cursor: pointer !important;
    }
    p:hover {
        background-color: rgba(0, 0, 0, 0.1) !important;
    }
    p + p {
        margin-top: 10px !important;
    }
}
.pervise-single-wrap {
    padding: 0 0 0 30px;
    .taskInfo-li {
        position: relative;
    }
    .taskInfo-li + .taskInfo-li {
        &::after {
            content: '';
            width: calc(100% - 30px);
            height: 1px;
            border-top: 1px dotted #ccc;
            position: absolute;
            top: 0;
            box-sizing: border-box;
            left: 0;
        }
    }
}
.super-inputbtn {
    width: 200px !important;
    margin-right: 20px !important;
}
.super-input {
    width: 200px !important;
    margin-right: 20px !important;
    input {
        height: 40px !important;
    }
}
</style>
