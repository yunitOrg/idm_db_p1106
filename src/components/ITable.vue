<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="wrap">
        <a-form-model :model="filter" layout="inline" class="filter-wrap">
            <a-form-model-item v-for="(field, fieldIndex) in fields" :key="field.value" :label="field.label" :prop="field.value">
                <a-input v-if="field.type == 'text'" v-model="filter[field.value]" />
                <a-select v-if="field.type == 'select'" v-model="filter[field.value]" :mode="field.selectMode" :allowClear="true" style="min-width: 100px">
                    <a-select-option v-for="item in optionData[fieldIndex]" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
                </a-select>
                <a-range-picker v-if="field.type == 'date'" v-model="filter[field.value]" />
            </a-form-model-item>
        </a-form-model>
        <a-table :columns="columns" :dataSource="dataSource"></a-table>
    </div>
</template>

<script>
import { commonParam, dataUtil } from '../utils'
import bindStyle from '../mixins/bindStyle'
export default {
    mixins: [bindStyle],
    data() {
        return {
            moduleObject: {},
            dataSource: [],
            filter: {},
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
                        type: 'text',
                        sorter: true,
                        filter: true
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
                    }
                ]
            }
        }
    },
    computed: {
        columns() {
            return this.propData.columns.map((column) => {
                return {
                    title: column.label,
                    dataIndex: column.value,
                    sorter: column.sorter,
                    customRender: (value, record, index) => {
                        switch (column.type) {
                            case 'select':
                                return this.optionData[index]?.find((n) => n.key == value)?.value
                            default:
                                return value
                        }
                    }
                }
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
        init() {
            this.initData()
            this.handleStyle()
            this.convertThemeListAttrToStyleObject()
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
        /**
         * 消息变动实时重新加载
         */
        onReInitDataMsgKey(conditionObject, messageKey) {
            this.conditionObject[messageKey] = conditionObject
            this.reload(true)
        },
        initData() {
            //把已选择的清空
            this.selectedRowKeys = []
            var params = commonParam()
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
            params[this.propData.pageIndex || 'pageIndex'] = this.current
            params[this.propData.pageSize || 'pageSize'] = this.pageSize
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
                        params: {
                            ...params,
                            ...this.moduleObject
                        }
                    }
                )
                .then((data) => {
                    this.resultChangeTableData(data)
                })
                .finally(() => {
                    this.loading = false
                })
            // load columns options
            this.propData.columns
                .filter((n) => n.type == 'select')
                .forEach((n, i) => {
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
                            this.$set(this.optionData, i, data)
                        })
                })
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
                this.totalCount = totalCount
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
