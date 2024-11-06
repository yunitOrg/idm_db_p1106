<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <Cube :data="data" :title="propData.title" @navigate="navigateHandle" :class="[className.wrap]" />
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
        }
    }
}
</script>
