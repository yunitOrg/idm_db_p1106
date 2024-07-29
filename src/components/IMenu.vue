<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <div class="menu-wrap">
            <a-menu v-model="current" :mode="mode" :selectable="true">
                <a-menu-item v-for="item in items" :key="item.value">{{ item.label }}</a-menu-item>
            </a-menu>
        </div>
    </div>
</template>

<script>
import { commonParam } from '../utils'
import bindStyle from '../mixins/bindStyle'
export default {
    mixins: [
        bindStyle({
            wrap: '.menu-wrap'
        })
    ],
    data() {
        return {
            moduleObject: {},
            mode: 'horizontal',
            current: [],
            items: [],
            propData: this.$root.propData.compositeAttr || {
                sourceType: 'static',
                items: []
            }
        }
    },
    mounted() {
        this.moduleObject = this.$root.moduleObject
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
                        data: {
                            total: rows.length,
                            rows
                        }
                    }
                })
            },
            deep: true
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
            this.handleStyle()
            this.convertThemeListAttrToStyleObject()
        }
    }
}
</script>

<style lang="scss" scoped></style>
