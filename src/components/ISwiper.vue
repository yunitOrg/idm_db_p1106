<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="idm-db-iswiper">
        <div v-if="moduleObject.env == 'develop'" class="indicator-wrap">
            <div v-for="(slot, slotIndex) in slots" :key="slotIndex" @click="dataIndex = slotIndex" class="indicator-item">
                {{ slotIndex + 1 }}
            </div>
        </div>
        <div
            v-for="(_, slotIndex) in slots"
            :key="slotIndex"
            class="drag_container swiper-item"
            :class="[dataIndex != slotIndex ? 'hidden' : 'block']"
            idm-ctrl-inner
            :idm-ctrl-id="moduleObject.id"
            :idm-container-index="slotIndex"
        ></div>
    </div>
</template>
<script>
import bindProp from '../mixins/bindProp'
import bindStyle from '../mixins/bindStyle'
export default {
    mixins: [
        bindProp({
            count: 1,
            width: '100%',
            height: '100%'
        }),
        bindStyle({
            _root() {
                return this.propData
            }
        })
    ],
    data() {
        return {
            dataIndex: 0,
            options: {
                preventClicks: false,
                preventClicksPropagation: false
            }
        }
    },
    computed: {
        slots() {
            return Array.from({ length: this.propData.count })
        }
    },
    methods: {
        receiveBroadcastMessage(data) {
            console.debug('iSwiper receiveBroadcastMessage', data)
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
                        case 'customFun':
                            linkageObject.resFunction?.length &&
                                IDM.invokeCustomFunctions.call(this, linkageObject.resFunction, {
                                    moduleObject: this.moduleObject,
                                    messageObject: data
                                })
                            break
                    }
                })
                return
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.idm-db-iswiper {
    .swiper-item {
        height: 100%;
    }
    .hidden {
        display: none;
    }
    .block {
        display: block;
    }
    .indicator {
        &-wrap {
            display: flex;
            gap: 1px;
            padding: 1px;
            background-color: white;
        }
        &-item {
            background-color: var(--idmCoreLoadColor);
            padding: 2px 8px;
        }
    }
}
</style>
