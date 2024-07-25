<template>
    <div class="pervise-wrap">
        <SubList :record="record" :propData="propData" :moduleObject="moduleObject" />
        <div v-if="env_develop_mode">任务信息</div>
    </div>
</template>
<script>
import SubList from '../commonComponents/SubList.vue' // 单任务
import bindStyle from '../mixins/bindStyle'
export default {
    name: 'ISuperTaskInfo',
    mixins: [bindStyle],
    components: {
        SubList
    },
    data() {
        return {
            moduleObject: {},
            env_develop_mode: window.IDM.env_develop_mode,
            record: {},
            propData: this.$root.propData.compositeAttr || {}
        }
    },
    mounted() {
        this.moduleObject = this.$root.moduleObject
        this.init()
    },
    methods: {
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {}
            this.init()
        },
        receiveBroadcastMessage(event) {
            switch (event.type) {
                case 'linkageResult':
                    if (event.messageKey == 'dynamicRenderModule') {
                        this.record = event.message.record
                    }
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
