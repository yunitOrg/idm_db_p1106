<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" @click="clickHandle"
        class="flex items-stretch idm-db-IJxLeaderItem" :class="className.wrap">
        <img :src="data.photoUrl" class="thumb" />
        <div class="flex-1 w-0 flex flex-col">
            <div class="name">{{ data.userName }}</div>
            <div class="flex-1 h-0 flex flex-col justify-between infos">
                <div class="flex">
                    <div class="label">任务数：</div>
                    <div class="text-info value">{{ data.taskTotal }}</div>
                </div>
                <div class="flex">
                    <div class="label">已办结：</div>
                    <div class="text-success value">{{ data.taskFinishTotal }}</div>
                </div>
                <div class="flex">
                    <div class="label">超　期：</div>
                    <div class="text-danger value">{{ data.taskTimeoutTotal }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import bindProp from '../mixins/bindProp'
import bindStyle from '../mixins/bindStyle'
export default {
    mixins: [bindProp(), bindStyle()],
    data() {
        return {
            data: {
                name: '姓名'
            }
        }
    },
    methods: {
        receiveBroadcastMessage(event) {
            if (event.type == 'linkageResult') {
                if (event.messageKey == 'dynamicRenderModule') {
                    this.data = event.message
                }
            }
        },
        clickHandle() {
            window.IDM.invokeCustomFunctions.call(this.propData.clickFunction, this.data)
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../style/common.scss';

.idm-db-IJxLeaderItem {
    background: rgba(0, 121, 255, 0.10);
    font-size: 16px;
}

.thumb {
    width: 80px;
    object-fit: cover;
}

.name {
    color: white;
    padding: 6px 0;
    text-align: center;
    background: rgba(0, 121, 255, 0.39);
}

.infos {
    padding: 4px 20px;

    .label {
        color: #C1C1C1;
    }
}

.text-success {
    color: #00FFFF;
}

.text-info {
    color: #0091FF;
}

.text-danger {
    color: #E54415;
}
</style>
