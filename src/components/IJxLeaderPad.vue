<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="idm-db-IJxLeaderPad" :class="className.wrap">
        <a-config-provider :locale="locale">
            <div class="h-screen flex flex-col idm-db-IJxLeaderPad-container">
                <TopBar :params="params" />
                <NavBar v-model="current" :items="navs"></NavBar>
                <div class="flex-1 h-0 main-container">
                    <Urge v-if="urgeData" :params="params" :data="urgeData" @close="urgeData = null" />
                    <Dept v-else-if="current == 1" :params="params" @urge="showUrge" />
                    <Cube v-else-if="current == 2" :params="params" />
                    <Follow v-else-if="current == 3" :params="params" @urge="showUrge" />
                </div>
            </div>
        </a-config-provider>
    </div>
</template>
<script>
import bindProp from '../mixins/bindProp'
import bindStyle from '../mixins/bindStyle'
import TopBar from '../commonComponents/IJxLeaderPad/topBar.vue'
import NavBar from '../commonComponents/IJxLeaderPad/navBar.vue'
import Dept from '../commonComponents/IJxLeaderPad/dept.vue'
import locale from 'ant-design-vue/es/locale/zh_CN'
import Cube from '../commonComponents/IJxLeaderPad/cube.vue'
import Follow from '../commonComponents/IJxLeaderPad/follow.vue'
import Urge from '../commonComponents/IJxLeaderPad/urge.vue'
export default {
    mixins: [bindProp(), bindStyle()],
    components: {
        TopBar,
        NavBar,
        Dept,
        Cube,
        Follow,
        Urge
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
            current: window.IDM?.url.queryObject().type || '1',
            urgeData: null
        }
    },
    computed: {
        params() {
            return window.IDM.url.queryObject()
        }
    },
    watch: {
        current() {
            this.urgeData = null
        }
    },
    methods: {
        showUrge(value) {
            window.IDM.http
                .get('ctrl/dbWorkbench/getLeaderPadNoticeInfo', {
                    ...this.params,
                    noticeId: value.id
                })
                .then(({ data }) => {
                    this.urgeData = data.data
                })
        }
    }
}
</script>
<style lang="scss">
@use '../style/common.scss';
html {
    font-size: 14px;
}
@media only screen and (max-width: 2560px) {
    html {
        font-size: 12px;
    }
}
@media only screen and (max-width: 1920px) {
    html {
        font-size: 8px;
    }
}
</style>
<style lang="scss" scoped>
.idm-db-IJxLeaderPad-container {
    .main-container {
        padding: 0 3.75rem 3.75rem;
    }
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
    .ant-empty {
        font-size: 2.38rem;
    }
}
</style>
