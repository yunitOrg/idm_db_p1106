<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="wrap">
        <a-form-model :model="filter" layout="inline" class="filter-wrap">
            <a-form-model-item v-for="field in fields" :key="field.value" :label="field.label" :prop="field.value">
                <a-input v-if="field.type == 'text'" v-model="filter[field.value]" />
                <a-select v-if="field.type == 'select'" v-model="filter[field.value]" :mode="field.selectMode" :allowClear="true" style="min-width: 100px">
                    <a-select-option v-for="item in optionData[field.value]" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
                </a-select>
                <template v-if="field.type == 'date'">
                    <a-date-picker v-model="filter[`${field.value}Start`]" />
                    ~
                    <a-date-picker v-model="filter[`${field.value}End`]" />
                </template>
                <!-- <a-range-picker v-if="field.type == 'date'" v-model="filter[field.value]" /> -->
            </a-form-model-item>
        </a-form-model>
        <a-table :columns="columns" :dataSource="dataSource" :pagination="pagination" :rowKey="propData.rowKey" @change="handleTableChange" @expandedRowsChange="handleExpand">
            <template #href="value, record, index">
                {{ value }}
            </template>
            <template #actions="value, record">
                <a-space v-if="value && value.length">
                    <a-button v-for="(item, index) in value" :key="index" @click.stop="handleOptions({ item: item, fatherItem: record })">
                        {{ item.text }}
                    </a-button>
                </a-space>
            </template>
            <template #menus="value, record">
                <a-dropdown v-if="value && value.length">
                    <a-menu slot="overlay" :selectable="false" @click="({ key }) => handleOptions({ item: value.find((n) => n.value == key), fatherItem: record })">
                        <a-menu-item v-for="item in value" :key="item.value">
                            {{ item.text }}
                        </a-menu-item>
                    </a-menu>
                    <img src="../assets//more.png" alt="" />
                </a-dropdown>
            </template>
            <template v-if="propData.expandedRow" #expandedRowRender="record">
                <div class="drag_container" idm-ctrl-inner :idm-ctrl-id="moduleObject.id" :idm-container-index="record[propData.rowKey]"></div>
            </template>
        </a-table>
    </div>
</template>

<script>
import { commonParam, dataUtil } from '../utils'
import bindStyle from '../mixins/bindStyle'
import { nextTick, h } from 'vue'
export default {
    mixins: [bindStyle],
    data() {
        return {
            moduleObject: {},
            dataSource: [
                {
                    id: '1',
                    title: '标题'
                }
            ],
            totalCount: 0,
            filter: {},
            sort: {},
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0
            },
            conditionObject: {},
            optionData: {},
            propData: this.$root.propData.compositeAttr || {
                dataSourceType: 'customInterface',
                columns: [
                    {
                        label: 'ID',
                        value: 'id',
                        type: 'text',
                        sorter: true,
                        filter: true
                    },
                    {
                        label: '名称',
                        value: 'title',
                        type: 'href',
                        sorter: true,
                        filter: true,
                        href: '/aaa/@[id]'
                    },
                    {
                        label: '类型',
                        value: 'category',
                        type: 'select',
                        select: [
                            {
                                key: 1,
                                value: '类型1'
                            },
                            {
                                key: 2,
                                value: '类型2'
                            }
                        ],
                        sorter: true,
                        filter: true
                    },
                    {
                        label: '时间',
                        value: 'date',
                        type: 'date',
                        sorter: true,
                        filter: true
                    },
                    {
                        label: '操作',
                        value: 'buttonList',
                        type: 'menus'
                    }
                ],
                rowKey: 'id',
                expandedRow: false
            }
        }
    },
    computed: {
        columns() {
            return this.propData.columns.map((column, columnIndex) => {
                const customRender = (value, record, index) => {
                    switch (column.type) {
                        case 'select':
                            return this.optionData[column.value]?.find((n) => n.key == value)?.value
                        case 'index':
                            return index + 1
                        case 'href':
                            return <a href={window.IDM.express.replace(column.href, record, true)}>{value}</a>
                        default:
                            return value
                    }
                }
                return Object.assign(
                    {
                        title: column.label,
                        dataIndex: column.value,
                        sorter: column.sorter
                    },
                    ['actions', 'menus'].includes(column.type)
                        ? {
                              scopedSlots: {
                                  customRender: column.type
                              }
                          }
                        : {
                              customRender
                          }
                )
            })
        },
        fields() {
            return this.propData.columns.filter((n) => n.filter)
        }
    },
    mounted() {
        this.moduleObject = this.$root.moduleObject
        this.init()
    },
    methods: {
        setContextValue(object) {
            console.debug('iTable setContextValue', object)
        },
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr
            console.debug('iTable propDataWatchHandle', propData)
            this.init()
        },
        receiveBroadcastMessage(data) {
            console.debug('iTable receiveBroadcastMessage', data)
            switch (data.type) {
                case 'linkageDemand':
                    switch (data.messageKey) {
                        case 'filter':
                            Object.keys(data.message).forEach((key) => {
                                this.$set(this.filter, key, data.message[key])
                            })
                            break
                        case 'reset':
                            this.filter = {}
                            break
                    }
                    break
            }
            if (this.propData.linkageEnd?.length) {
                this.propData.linkageEnd.forEach((linkageObject) => {
                    const currentItemType = linkageObject.reslinkageType == 'custom' ? linkageObject.reslinkageTypeCustom : linkageObject.reslinkageType
                    if (currentItemType != data.type) {
                        return
                    }
                    //再次处理过滤条件
                    if (linkageObject.resResultRule && !IDM.getExpressData(linkageObject.resResultRule, data)) {
                        return
                    }
                    switch (linkageObject.resType) {
                        //重新加载刷新数据
                        case 'linkageReload':
                            this.reload(true, data.message, data.messageKey)
                            break
                        //重新加载数据来源
                        case 'linkageDemand':
                            this.resultChangeTableData(data.message)
                            break
                        case 'linkageShowModule':
                            this.showThisModuleHandle()
                            break
                        case 'linkageHideModule':
                            this.hideThisModuleHandle()
                            break
                        case 'customFun':
                            linkageObject.resFunction?.length &&
                                IDM.invokeCustomFunctions.apply(this, [
                                    linkageObject.resFunction,
                                    {
                                        moduleObject: this.moduleObject,
                                        messageObject: data
                                    }
                                ])
                            break
                    }
                })
                return
            }
            if (data.type && data.type == 'linkageDemand') {
                if (data.messageKey) {
                    this.onReInitDataMsgKey(data.message, data.messageKey)
                }
                if (data?.message?.data) {
                    this.resultChangeTableData(data.message)
                }
            } else if (data.type && data.type == 'linkageReload') {
                this.reload(data.message && data.message.reloadFirstPage)
            }
        },
        init() {
            this.initData()
            this.loadColumnsOptions()
            this.handleStyle()
            this.convertThemeListAttrToStyleObject()
        },
        /**
         * 消息变动实时重新加载
         */
        onReInitDataMsgKey(conditionObject, messageKey) {
            this.conditionObject[messageKey] = conditionObject
            this.reload(true)
        },
        /**
         * 重新加载
         */
        reload(reloadFirstPage, conditionObject, messageKey) {
            if (reloadFirstPage) {
                this.pagination.current = 1
            }
            this.selectedRowKeys = []
            if (messageKey) {
                this.conditionObject[messageKey] = conditionObject
            }
            //请求数据源
            this.initData()
        },
        initData() {
            if (window.IDM.env_develop_mode) {
                return
            }
            //把已选择的清空
            this.selectedRowKeys = []
            let params = {
                ...commonParam(),
                ...this.filter
            }
            //接收其他组件联动参数
            if (this.propData.linkageParamList && this.propData.linkageParamList.length > 0) {
                this.propData.linkageParamList.forEach((lpitem) => {
                    if (Object.keys(lpitem).length > 0) {
                        if (lpitem.msgKey && this.conditionObject[lpitem.msgKey]) {
                            if (lpitem.paramFun && lpitem.paramFun.length > 0) {
                                //有函数
                                try {
                                    params[lpitem.paramKey || lpitem.msgKey] =
                                        window[lpitem.paramFun[0].name] &&
                                        window[lpitem.paramFun[0].name].call(this, {
                                            ...params,
                                            ...lpitem.paramFun[0].param,
                                            moduleObject: this.moduleObject,
                                            paramValue: this.conditionObject[lpitem.msgKey]
                                        })
                                } catch (error) {
                                    params[lpitem.paramKey || lpitem.msgKey] =
                                        typeof this.conditionObject[lpitem.msgKey] == 'object'
                                            ? JSON.stringify(this.conditionObject[lpitem.msgKey])
                                            : this.conditionObject[lpitem.msgKey]
                                }
                            } else {
                                params[lpitem.paramKey || lpitem.msgKey] =
                                    typeof this.conditionObject[lpitem.msgKey] == 'object'
                                        ? JSON.stringify(this.conditionObject[lpitem.msgKey])
                                        : this.conditionObject[lpitem.msgKey]
                            }
                        }
                    }
                })
            }
            params[this.propData.pageIndex || 'pageIndex'] = this.pagination.current
            params[this.propData.pageSize || 'pageSize'] = this.pagination.pageSize
            params[this.propData.orderType || 'orderType'] = this.sort.orderType
            params[this.propData.reversed || 'reversed'] = this.sort.reversed
            this.loading = true
            dataUtil
                .fetchData(
                    {
                        dataSourceType: this.propData.dataSourceType,
                        customInterface: {
                            url: this.propData.customInterfaceUrl,
                            requestParamFun: this.propData.requestParamFun,
                            requestContentType: this.propData.requestContentType,
                            requestType: this.propData.requestType,
                            responseDataFun: this.propData.responseDataFun,
                            requestErrorFun: this.propData.requestErrorFun
                        },
                        customFunction: this.propData.customFunction
                    },
                    {
                        params
                    }
                )
                .then((data) => {
                    this.resultChangeTableData(data)
                })
                .finally(() => {
                    this.loading = false
                })
        },
        loadColumnsOptions() {
            // load columns options
            this.propData.columns
                .filter((n) => n.type == 'select')
                .forEach((n) => {
                    dataUtil
                        .fetchData({
                            dataSourceType: n.dataSourceType,
                            customInterface: {
                                url: n.customInterfaceUrl,
                                requestParamFun: n.requestParamFun,
                                requestContentType: n.requestContentType,
                                requestType: n.requestType,
                                responseDataFun: n.responseDataFun,
                                requestErrorFun: n.requestErrorFun
                            },
                            customFunction: n.customFunction
                        })
                        .then((data) => {
                            this.$set(this.optionData, n.value, data)
                        })
                })
        },
        handleTableChange(pagination, filters, sorter) {
            this.pagination.current = pagination.current
            this.pagination.pageSize = pagination.pageSize
            this.sort = {
                orderType: sorter.order ? sorter.field : '',
                reversed: sorter.order ? sorter.order == 'descend' : ''
            }
            this.initData()
        },
        /**
         * 数据改变事件
         */
        resultChangeTableData(listResultData) {
            this.loading = false
            //设置数据源
            var rows = listResultData && listResultData.data ? listResultData.data.rows : []
            if (rows.length == 0) {
                rows = listResultData && listResultData.rows
            }
            this.dataSource = rows
            var totalCount = listResultData && listResultData.data ? listResultData.data.total : -1
            if (totalCount == -1) {
                totalCount = listResultData && listResultData.total
            }
            if (totalCount && totalCount != -1) {
                this.pagination.total = totalCount
            }
        },
        handleExpand(expandedRowKeys) {
            if (window.IDM.env_develop_mode) {
                return
            }
            nextTick(() => {
                expandedRowKeys.forEach((key) => {
                    this.moduleObject.dynamicRenderModuleGroupInitData(
                        this.moduleObject.packageid,
                        key,
                        {
                            record: this.dataSource.find((n) => n[this.propData.rowKey] == key)
                        },
                        false
                    )
                })
            })
        },
        handleOptions(obj) {
            console.log('handleOptions', obj)
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
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.filter-wrap {
    padding: 10px;
    background-color: #f5f5f5;
}
</style>
