<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <div class="pervise-wrap super-task-info-wrap">
            <SubList :record="record" :propData="propData" :moduleObject="moduleObject" />
            <div v-if="env_develop_mode" class="placeholder">任务信息</div>
        </div>
    </div>
</template>
<script>
import SubList from '../commonComponents/SubList.vue' // 单任务
import bindStyle from '../mixins/bindStyle'
export default {
    name: 'ISuperTaskInfo',
    mixins: [
        bindStyle({
            wrap: '.super-task-info-wrap'
        })
    ],
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
<style lang="scss" scoped>
.placeholder {
    border: 1px dotted #999;
    padding: 20px 0;
    text-align: center;
}
</style>
