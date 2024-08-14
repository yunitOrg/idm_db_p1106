<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <div class="pervise-wrap super-task-info-wrap" :class="className.wrap">
            <SubList v-if="record" :record="record" :propData="propData" :moduleObject="moduleObject" />
            <div v-if="env_develop_mode" class="placeholder">任务信息</div>
        </div>
    </div>
</template>
<script>
import SubList from '../commonComponents/SubList.vue' // 单任务
import bindStyle from '../mixins/bindStyle'
export default {
    mixins: [bindStyle()],
    components: {
        SubList
    },
    data() {
        return {
            moduleObject: this.$root.moduleObject,
            env_develop_mode: window.IDM.env_develop_mode,
            record: null,
            propData: this.$root.propData.compositeAttr || {}
        }
    },
    methods: {
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {}
        },
        receiveBroadcastMessage(event) {
            switch (event.type) {
                case 'linkageResult':
                    if (event.messageKey == 'dynamicRenderModule') {
                        this.record = event.message.record
                    }
                    break
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.super-task-info-wrap {
    .placeholder {
        border: 1px dotted #999;
        padding: 20px 0;
        text-align: center;
    }
}
</style>
