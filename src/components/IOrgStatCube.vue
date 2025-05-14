<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <Cube :data="data" :title="propData.title" @navigate="navigateHandle" :class="['wrap', className.wrap]" />
    </div>
</template>
<script>
import bindProp from '../mixins/bindProp'
import bindStyle from '../mixins/bindStyle'
import Cube from '../commonComponents/IJxMonitor/main/cube.vue'
import dataUtil from '../utils/dataUtil'
export default {
    mixins: [
        bindProp({
            width: '',
            height: ''
        }),
        bindStyle({
            wrap() {
                return this.propData
            }
        })
    ],
    components: {
        Cube
    },
    data() {
        return {
            loading: false,
            data: []
        }
    },
    mounted() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            this.loading = true
            dataUtil
                .fetchData({
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
                    this.data = data
                })
                .finally(() => {
                    this.loading = false
                })
        },
        navigateHandle(e) {
            window.IDM.invokeCustomFunctions.call(this, this.propData.clickFunction, e)
        },
        /**
         * 组件通信：接收消息的方法
         */
        receiveBroadcastMessage(messageObject) {
            switch (messageObject.type) {
                case 'linkMessageObject':
                    this.fetchData()
                break
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.wrap {
    aspect-ratio: 1/0.8;
}
</style>
