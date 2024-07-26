<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="wrap">
        <a-form-model :model="filter" layout="inline" class="filter-wrap">
            <a-form-model-item v-for="field in fields" :key="field.value" :label="field.label" :prop="field.value">
                <a-select v-if="field.type == 'select'" v-model="filter[field.value]" :mode="field.selectMode" :allowClear="true" style="min-width: 100px">
                    <a-select-option v-for="item in optionData[field.value]" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
                </a-select>
                <template v-else-if="field.type == 'date'">
                    <a-date-picker v-model="filter[`${field.value}Start`]" />
                    ~
                    <a-date-picker v-model="filter[`${field.value}End`]" />
                </template>
                <a-input v-else v-model="filter[field.value]" />
            </a-form-model-item>
        </a-form-model>
        <a-table :dataSource="dataSource" :pagination="pagination" :rowKey="propData.rowKey" @change="handleTableChange" @expand="handleExpand" :expandRowByClick="false">
            <a-table-column v-for="column in propData.columns" :title="column.label" :data-index="column.value" :sorter="column.sorter" :key="column.key">
                <template #default="value, record, index">
                    <template v-if="column.type == 'index'">
                        {{ index + 1 }}
                    </template>
                    <template v-else-if="column.type == 'select'">
                        {{ optionData[column.value]?.find((n) => n.key == value)?.value }}
                    </template>
                    <template v-else-if="column.type == 'href'">
                        <a
                            :href="
                                urlGetWebPath(
                                    expressReplace(
                                        column.href,
                                        {
                                            moduleObject,
                                            record
                                        },
                                        true
                                    )
                                )
                            "
                            :target="column.target"
                            >{{ value }}</a
                        >
                    </template>
                    <template v-else-if="column.type == 'actions'">
                        <a-dropdown v-if="column.dropdown">
                            <a-menu slot="overlay" :selectable="false" @click="({ key }) => handleMenuClick(key, value, record, column)">
                                <a-menu-item v-for="item in getActions(value, column)" :key="item[column.valueKey]">
                                    {{ item[column.labelKey] }}
                                </a-menu-item>
                            </a-menu>
                            <img src="../assets/more.png" alt="" />
                        </a-dropdown>
                        <a-space v-else>
                            <a-button
                                v-for="item in getActions(value, column)"
                                :key="item[column.valueKey]"
                                @click.stop="handleMenuClick(item[column.valueKey], value, record, column)"
                            >
                                {{ item[column.labelKey] }}
                            </a-button>
                        </a-space>
                    </template>
                    <template v-else>
                        {{ value }}
                    </template>
                </template>
            </a-table-column>

            <template v-if="propData.expandedRow" #expandedRowRender="record">
                <div class="drag_container" idm-ctrl-inner :idm-ctrl-id="moduleObject.id" :idm-container-index="record[propData.rowKey]"></div>
            </template>
        </a-table>
    </div>
</template>

<script>
import { commonParam, dataUtil } from '../utils'
import bindStyle from '../mixins/bindStyle'
import { nextTick } from 'vue'
export default {
    mixins: [bindStyle],
    data() {
        return {
            moduleObject: {},
            dataSource: [
                {
                    id: '1',
                    title: '标题',
                    buttonList: [
                        {
                            text: '按钮1',
                            value: '1'
                        }
                    ]
                }
            ],
            totalCount: 0,
            filter: {},
            sort: {},
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: true,
                showTotal: (total, range) => `当前显示${range[0]}-${range[1]}，总共${total}条`
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
                        label: '操作',
                        value: 'buttonList',
                        type: 'actions',
                        dataSource: 'record',
                        labelKey: 'text',
                        valueKey: 'value',
                        dropdown: true
                    }
                ],
                rowKey: 'id',
                expandedRow: false
            }
        }
    },
    computed: {
        fields() {
            return this.propData.columns.filter((n) => n.filter)
        }
    },
    mounted() {
        this.moduleObject = this.$root.moduleObject
        this.init()
    },
    methods: {
        urlGetWebPath: window.IDM.url.getWebPath,
        expressReplace: window.IDM.express.replace,
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
                this.dataSource = [
                    {
                        id: '1',
                        title: '标题'
                    }
                ]
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
        handleExpand(expanded, record) {
            if (window.IDM.env_develop_mode) {
                return
            }
            if (expanded) {
                nextTick(() => {
                    console.log('render', record[this.propData.rowKey], record)
                    this.moduleObject.dynamicRenderModuleGroupInitData(
                        this.moduleObject.packageid,
                        record[this.propData.rowKey],
                        {
                            record
                        },
                        false
                    )
                })
            }
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
        },
        handleMenuClick(key, value, record, column) {
            if (Array.isArray(column.hanldeInterfaceFunc) && column.hanldeInterfaceFunc.length > 0) {
                window[column.hanldeInterfaceFunc[0].name]?.call(this, {
                    _this: this,
                    key,
                    value,
                    record,
                    column
                })
            }
        },
        getActions(value, column) {
            if (column.dataSource == 'record') {
                return value
            }
            return column.actions
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
    :deep(.ant-form-item-label) {
        color: #333333;
        font-size: 16px;
        font-weight: 500;
    }
}
:deep(.ant-table) {
    border: 1px solid #e8e8e8;
    border-radius: 3px;
    .ant-table-thead > tr > th {
        color: #333 !important;
        font-size: 16px !important;
        font-weight: bold !important;
        padding: 10px 10px !important;
        background-color: #f6fbfa !important;
    }
    .ant-table-tbody .odd {
        cursor: pointer;
    }
    .ant-table-tbody .even {
        background-color: #f6fbfa;
        cursor: pointer;
    }
    .ant-table-tbody > tr > td {
        color: #333333;
        font-size: 16px;
        font-weight: 500;
    }
    .ant-table-thead > tr > th:nth-child(2) {
        text-align: center !important;
    }
    .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
        background: none !important;
    }
    .ant-table-expanded-row {
        > td {
            padding: 0;
        }
    }
}
.subtaskinfo {
    .subtask-li {
        border-top: 1px dashed #ccc;
    }
    .subtask-li:first-child {
        border: 0;
    }
}
.pervise-kong {
    padding: 10px;
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
</style>
