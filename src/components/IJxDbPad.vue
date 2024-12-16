<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" @click="clickHandle" class="idm-db-IJxDbPad" :class="className.wrap"></div>
</template>
<script>
import bindProp from '../mixins/bindProp'
import bindStyle from '../mixins/bindStyle'
export default {
    mixins: [bindProp(), bindStyle()],
    data() {
        return {}
    },
    methods:{
        
    }
}
</script>
