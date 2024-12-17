<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" @click="clickHandle" class="idm-db-IJxLeaderPad" :class="className.wrap">
        <a-config-provider :locale="locale">
            <div class="h-screen flex flex-col idm-db-IJxLeaderPad-container">
                <NavBar v-model="current" :items="navs"></NavBar>
                <div class="flex-1 h-0">
                    <Dept v-if="current == 1" />
                    <Cube v-if="current == 2" />
                </div>
            </div>
        </a-config-provider>
    </div>
</template>
<script>
import bindProp from '../mixins/bindProp'
import bindStyle from '../mixins/bindStyle'
import NavBar from '../commonComponents/IJxLeaderPad/navBar.vue'
import Dept from '../commonComponents/IJxLeaderPad/dept.vue'
import locale from 'ant-design-vue/es/locale/zh_CN'
import Cube from '../commonComponents/IJxLeaderPad/cube.vue'
export default {
    mixins: [bindProp(), bindStyle()],
    components: {
        NavBar,
        Dept,
        Cube
    },
    data() {
        return {
            locale,
            navs: [
                {
                    label: '分管部门',
                    value: '1'
                },
                {
                    label: '办理质效',
                    value: '2'
                },
                {
                    label: '特别关注',
                    value: '3'
                }
            ],
            current: window.IDM?.url.queryObject().type || '2'
        }
    },
    methods: {}
}
</script>
<style lang="scss">
@import '../style/common.scss';
html {
    font-size: 16px;
}
@media only screen and (max-width: 2540px) {
    html {
        font-size: 14px;
    }
}
@media only screen and (max-width: 1900px) {
    html {
        font-size: 10px;
    }
}
</style>
<style lang="scss" scoped>
.idm-db-IJxLeaderPad-container {
    background: #305fb1;
    padding: 3.75rem;
}
:deep(.ant-table) {
    font-size: 2.38rem;
    &.ant-table-bordered .ant-table-header > table,
    &.ant-table-bordered .ant-table-body > table,
    &.ant-table-bordered .ant-table-fixed-left table,
    &.ant-table-bordered .ant-table-fixed-right table,
    &.ant-table-bordered.ant-table-empty .ant-table-placeholder,
    &.ant-table-bordered .ant-table-thead > tr > th,
    &.ant-table-bordered .ant-table-tbody > tr > td {
        border-color: #8fc7ff;
        border-width: 0.13rem;
    }
    .ant-table-thead tr th {
        background: #e8f4ff;
    }
    .ant-table-thead > tr > th .anticon-filter {
        color: black;
        font-size: 1rem;
        width: 3rem;
    }
}
</style>
