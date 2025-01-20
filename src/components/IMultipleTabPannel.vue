<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="idm-db-IMultipleTabPannel">
        <div>
            <div class="flex tab-wrap">
                <div class="flex-1 w-0 flex tab-list">
                    <div
                        v-for="tab in propData.tabs"
                        :key="tab.key"
                        @click.stop="tabChangeHandle(tab)"
                        class="tab-item"
                        :class="{
                            active: tab.key == activeKey
                        }"
                    >
                        {{ tab.text }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { commonParam } from '../utils'
import bindStyles from '../mixins/bindStyles'
import bindProp from '../mixins/bindProp'
export default {
    mixins: [bindStyles(), bindProp()],
    data() {
        return {
            activeKey: []
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
    watch: {},
    methods: {
        setContextValue(object) {},
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr
            this.init()
        },
        init() {
            this.initData()
        },
        initData() {
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
        },
        tabChangeHandle() {}
    }
}
</script>
<style lang="scss" scoped>
@use '../style/common.scss';
.idm-db-IMultipleTabPannel {
    .tab {
        &-wrap {
            border-bottom: 1px solid #ddd;
        }
        &-list {
            gap: 10px;
        }
        &-item {
            padding: 10px 0;
        }
    }
}
</style>
