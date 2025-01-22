<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <div :class="className.wrap">
            <a-menu v-model="current" :mode="mode" :selectable="true">
                <a-menu-item v-for="item in items" :key="item.value">
                    <a-badge :count="item.data?.length" :offset="[10, 0]">
                        {{ item.label }}
                    </a-badge>
                </a-menu-item>
            </a-menu>
        </div>
    </div>
</template>

<script>
import { commonParam } from '../utils'
import bindStyle from '../mixins/bindStyle'
export default {
    mixins: [bindStyle()],
    data() {
        return {
            moduleObject: this.$root.moduleObject,
            mode: 'horizontal',
            current: [],
            items: [],
            propData: this.$root.propData.compositeAttr || {
                sourceType: 'static',
                items: [
                    {
                        value: 1,
                        label: '菜单1'
                    },
                    {
                        value: 2,
                        label: '菜单2'
                    }
                ]
            }
        }
    },
    mounted() {
        this.init()
    },
    computed: {
        dataChange() {
            return {
                current: this.current,
                items: this.items
            }
        }
    },
    watch: {
        dataChange: {
            handler(value) {
                const rows = value.items.find((n) => value.current.some((m) => m == n.value))?.data || []
                this.IDM.broadcast?.send({
                    type: 'linkageDemand',
                    rangeModule: this.propData.linkageDemandPageModule,
                    message: {
                        current: value.current,
                        data: {
                            total: rows.length,
                            rows
                        }
                    }
                })
            },
            deep: true
        },
        current: {
            handler(value) {
                this.IDM.broadcast?.send({
                    type: 'linkageResult',
                    rangeModule: this.propData.linkageResultPageModule,
                    message: value
                })
            }
        }
    },
    methods: {
        setContextValue(object) {
            console.debug('IMenu setContextValue', object)
        },
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr
            console.debug('IMenu propDataWatchHandle', propData)
            this.init()
        },
        initData() {
            console.debug('IMenu initData', this.propData)
            if (this.propData.sourceType == 'dataSource') {
                const params = commonParam()
                if (this.propData.dataSource && this.propData.dataSource.length > 0) {
                    window.IDM.datasource.request(
                        this.propData.dataSource[0].id,
                        {
                            moduleObject: this.moduleObject,
                            ...params
                        },
                        (data) => {
                            this.items = data
                            this.current = [this.items[0]?.value]
                        }
                    )
                }
            }
            if (this.propData.sourceType == 'static') {
                this.items = this.propData.items
                this.current = [this.items[0]?.value]
            }
        },
        init() {
            this.initData()
        }
    }
}
</script>
<style lang="scss" scoped>
:deep(.ant-menu) {
    &.ant-menu-horizontal {
        line-height: 1;
        border-bottom-color: #ccc;
        .ant-menu-item {
            font-size: 16px;
            font-weight: 500;
            background: #f8f8f8;
            border-radius: 6px 6px 0px 0px;
            border: 1px solid #cccccc;
            margin-right: 10px;
            padding: 10px 30px;
            &-active {
                border-bottom-width: 1px;
            }
            &-selected {
                border-color: #3489df;
                border-bottom-color: white;
                background: none;
            }
        }
    }
}
</style>
