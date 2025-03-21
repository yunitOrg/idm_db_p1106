<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="idm-db-ICheckList">
        <div v-for="group in groups" :key="group.key" class="group-item">
            <div class="group-title">
                {{ group.text }}：
                <a-checkbox :indeterminate="group.indeterminate" :checked="group.checkAll" @change="(e) => onCheckAllChange(e, group)">全选</a-checkbox>
            </div>
            <a-checkbox-group v-model="group.checkedList" :options="group.children" @change="(checkedList) => onChange(checkedList, group)" class="group-children" />
        </div>
    </div>
</template>
<script>
import { bindStyle, bindProp } from '../mixins'
import { getChinesePinyinAbbreviation, dataUtil } from '../utils'
export default {
    mixins: [bindProp({}), bindStyle()],
    components: {},
    data() {
        return {
            groups: []
        }
    },
    computed: {
        allValues() {
            return this.groups.reduce((carry, current) => carry.concat(current.checkedList), [])
        }
    },
    mounted() {
        this.fetchData()
    },
    methods: {
        getChinesePinyinAbbreviation,
        receiveBroadcastMessage(event) {
            switch (event.messageKey) {
                case 'checkValues':
                    event.message?.call(this, [...new Set(this.allValues)])
                    break
            }
        },
        fetchData() {
            if (window.IDM.env_develop_mode) {
                this.groups = this.mergeOption([
                    {
                        text: '公共字段',
                        children: [
                            {
                                text: '立项号',
                                checked: true
                            },
                            {
                                text: '立项日期',
                                checked: true
                            },
                            {
                                text: '督查类别',
                                checked: true
                            },
                            {
                                text: '承办类型',
                                checked: true
                            },
                            {
                                text: '督查事项',
                                checked: true
                            },
                            {
                                text: '签收日期',
                                checked: true
                            },
                            {
                                text: '承办处室',
                                checked: true
                            },
                            {
                                text: '承办人',
                                checked: true
                            },
                            {
                                text: '办结期限',
                                checked: true
                            },
                            {
                                text: '状态',
                                checked: true
                            },
                            {
                                text: '当前阶段',
                                checked: true
                            },
                            {
                                text: '最新反馈时间',
                                checked: true
                            },
                            {
                                text: '最新反馈内容',
                                checked: true
                            },
                            {
                                text: '主办司局'
                            },
                            {
                                text: '协办司局'
                            },
                            {
                                text: '反馈方式'
                            },
                            {
                                text: '手机号'
                            },
                            {
                                text: '座机号'
                            }
                        ]
                    },
                    {
                        text: '领导批示',
                        children: [
                            {
                                text: '委内编号'
                            },
                            {
                                text: '是否持续推进'
                            },
                            {
                                text: '持续推进立项号'
                            }
                        ]
                    },
                    {
                        text: '持续推进',
                        children: [
                            {
                                text: '前件立项号'
                            },
                            {
                                text: '前件督查类别'
                            },
                            {
                                text: '前件督查事项'
                            },
                            {
                                text: '持续推进落实事项'
                            }
                        ]
                    },
                    {
                        text: '重大决策部署',
                        children: [
                            {
                                text: '部署任务'
                            }
                        ]
                    },
                    {
                        text: '委内重要会议',
                        children: [
                            {
                                text: '会议名称'
                            },
                            {
                                text: '交办事项'
                            },
                            {
                                text: '会议时间'
                            },
                            {
                                text: '主持人'
                            }
                        ]
                    },
                    {
                        text: '专项督查',
                        children: [
                            {
                                text: '专项领域'
                            },
                            {
                                text: '具体措施'
                            }
                        ]
                    },
                    {
                        text: '全委重大专项任务',
                        children: [
                            {
                                text: '专项领域'
                            },
                            {
                                text: '具体措施'
                            }
                        ]
                    }
                ])
                return
            }
            dataUtil.fetchData
                .call(this, {
                    dataSourceType: this.propData.dataSourceType,
                    dataSource: this.propData.dataSource,
                    customInterface: {
                        url: this.propData.customInterfaceUrl,
                        requestParamFun: this.propData.requestParamFun,
                        requestContentType: this.propData.requestContentType,
                        requestType: this.propData.requestType,
                        responseDataFun: this.propData.responseDataFun,
                        requestErrorFun: this.propData.requestErrorFun
                    },
                    pageCommonInterface: {
                        dataset: this.contextDataset,
                        dataName: this.propData.dataName,
                        dataFiled: this.propData.dataFiled,
                        dataFunc: this.propData.dataFunc
                    },
                    customFunction: this.propData.customFunction
                })
                .then((data) => {
                    this.groups = this.mergeOption(data)
                })
        },
        mergeOption(data) {
            return data
                .map((n) => ({
                    indeterminate: false,
                    checkAll: false,
                    key: n.key || this.getChinesePinyinAbbreviation(n.text).toLowerCase(),
                    ...n,
                    children: n.children.map((n) => ({
                        ...n,
                        label: n.text,
                        value: n.key || this.getChinesePinyinAbbreviation(n.text).toLowerCase()
                    }))
                }))
                .map((n) => {
                    const checkedList = n.children.filter((n) => n.checked).map((n) => n.value)
                    return {
                        checkedList,
                        checkAll: checkedList.length == n.children.length,
                        ...n
                    }
                })
        },
        onCheckAllChange(e, group) {
            Object.assign(group, {
                checkedList: e.target.checked ? group.children.map((n) => n.value) : [],
                indeterminate: false,
                checkAll: e.target.checked
            })
        },
        onChange(checkedList, group) {
            group.indeterminate = !!checkedList.length && checkedList.length < group.children.length
            group.checkAll = checkedList.length === group.children.length
        }
    }
}
</script>
<style lang="scss" scoped>
@use '../style/common.scss';
.idm-db-ICheckList {
    font-size: 16px;
}
.group {
    &-title {
        padding: 10px;
    }
    &-children {
        display: flex;
        padding: 10px;
        border: 1px solid #ddd;
        border-width: 1px 0;
        flex-wrap: wrap;
        row-gap: 10px;
    }
}
</style>
