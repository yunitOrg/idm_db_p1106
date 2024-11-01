<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <Swiper ref="swiper" :class="[className.wrap]">
            <SwiperSlide v-for="(slot, slotIndex) in slots" :key="slotIndex"  class="drag_container" idm-ctrl-inner :idm-ctrl-id="moduleObject.id" :idm-container-index="slotIndex">
                
            </SwiperSlide>
        </Swiper>
    </div>
</template>
<script>
import bindProp from '../mixins/bindProp'
import bindStyle from '../mixins/bindStyle'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
export default {
    mixins: [
        bindProp({
            count: 1,
            width: '100%',
            height: '100%'
        }),
        bindStyle({
            wrap() {
                return this.propData
            }
        })
    ],
    components: {
        Swiper,
        SwiperSlide
    },
    data() {
        return {}
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
