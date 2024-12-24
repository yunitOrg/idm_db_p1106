<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="idm-db-IJxLeaderPad" :class="className.wrap">
        <div class="h-screen flex flex-col idm-db-IJxLeaderPad-container">
            <TopBar :params="params" :leaderInfo="leaderInfo" />
            <NavBar v-if="navs.length > 0" :items="navs"></NavBar>
            <div class="flex-1 h-0 main-container">
                <Urge v-if="urgeData" :params="params" :data="urgeData" @close="urgeData = null" />
                <Detail v-else-if="detailData" :params="params" :data="detailData" @urge="() => showUrge(detailData.noticeInfo)" @close="detailData = null" />
                <Cube v-else-if="current == '2'" :params="params" @home="homeHandle"></Cube>
                <Follow v-else-if="current == '3'" :params="params" @detail="showDetail" @urge="showUrge">
                    <template #extra>
                        <div @click="homeHandle" class="pointer btn-back">返回首页</div>
                    </template>
                </Follow>
                <Dept v-else :dept="dept" :params="params" @detail="showDetail" @urge="showUrge">
                    <template #extra>
                        <div v-if="dept.value != '0'" @click="homeHandle" class="pointer btn-back">返回首页</div>
                    </template>
                </Dept>
            </div>
            <DeptModel v-if="model.visible" :title="model.title" :data="model.data" @change="deptChangeHandle" @close="model.visible = false"></DeptModel>
        </div>
    </div>
</template>
<script>
import bindProp from '../mixins/bindProp'
import bindStyle from '../mixins/bindStyle'
import TopBar from '../commonComponents/IJxLeaderPad/topBar.vue'
import NavBar from '../commonComponents/IJxLeaderPad/navBar.vue'
import Dept from '../commonComponents/IJxLeaderPad/dept.vue'
import Cube from '../commonComponents/IJxLeaderPad/cube.vue'
import Follow from '../commonComponents/IJxLeaderPad/follow.vue'
import Urge from '../commonComponents/IJxLeaderPad/urge.vue'
import Detail from '../commonComponents/IJxLeaderPad/detail.vue'
import DeptModel from '../commonComponents/IJxLeaderPad/deptModel.vue'
import dayjs from 'dayjs'
const homeData = () => ({
    label: '全部',
    value: '0'
})
export default {
    mixins: [bindProp(), bindStyle()],
    components: {
        TopBar,
        NavBar,
        Dept,
        Cube,
        Follow,
        Urge,
        Detail,
        DeptModel
    },
    data() {
        return {
            current: window.IDM?.url.queryObject().type || '0',
            dept: homeData(),
            urgeData: null,
            detailData: null,
            model: {
                visible: false
            },
            leaderInfo: {}
        }
    },
    computed: {
        params() {
            const date = dayjs()
            const user = window.IDM.user.userObject
            return Object.assign(
                {},
                {
                    userId: user.userid,
                    userName: user.username,
                    year: date.format('YYYY'),
                    month: 12
                },
                window.IDM.url.queryObject()
            )
        },
        navs() {
            if ([1, 5].includes(this.leaderInfo.type)) {
                return [
                    {
                        label: '省政府各部门',
                        value: '1',
                        active: this.dept.value != 0 && this.current == '1' && this.dept.queryType == 2,
                        on: {
                            click: () => {
                                window.IDM.http
                                    .post(
                                        'ctrl/dbWorkbench/getPadLeaderUnit',
                                        {
                                            ...this.params,
                                            queryType: 2
                                        },
                                        {
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }
                                        }
                                    )
                                    .then(({ data }) => {
                                        this.model = {
                                            queryType: 2,
                                            title: '省政府各部门',
                                            data: data.data,
                                            visible: true
                                        }
                                    })
                            }
                        }
                    },
                    {
                        label: '各设区市政府',
                        value: '4',
                        active: this.current == '1' && this.dept.queryType == 1,
                        on: {
                            click: () => {
                                window.IDM.http
                                    .post(
                                        'ctrl/dbWorkbench/getPadLeaderUnit',
                                        {
                                            ...this.params,
                                            queryType: 1
                                        },
                                        {
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }
                                        }
                                    )
                                    .then(({ data }) => {
                                        this.model = {
                                            queryType: 1,
                                            title: '各设区市政府',
                                            data: data.data,
                                            visible: true
                                        }
                                    })
                            }
                        }
                    },
                    {
                        label: '特别关注',
                        value: '3',
                        active: this.current == '3',
                        on: {
                            click: () => {
                                this.current = '3'
                            }
                        }
                    }
                ]
            }
            if ([2, 3].includes(this.leaderInfo.type)) {
                return [
                    {
                        label: '分管部门',
                        value: '1',
                        active: this.dept.value != 0,
                        on: {
                            click: () => {
                                window.IDM.http
                                    .post(
                                        'ctrl/dbWorkbench/getPadLeaderUnit',
                                        {
                                            ...this.params
                                        },
                                        {
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }
                                        }
                                    )
                                    .then(({ data }) => {
                                        this.model = {
                                            title: '分管部门',
                                            data: data.data,
                                            visible: true
                                        }
                                    })
                            }
                        }
                    },
                    {
                        label: '办理质效',
                        value: '2',
                        active: this.current == '2',
                        on: {
                            click: () => {
                                this.current = '2'
                            }
                        }
                    },
                    {
                        label: '特别关注',
                        value: '3',
                        active: this.current == '3',
                        on: {
                            click: () => {
                                this.current = '3'
                            }
                        }
                    }
                ]
            }
            return []
        }
    },
    watch: {
        current(value) {
            this.urgeData = null
            this.detailData = null
            if (value != '1') {
                this.dept = homeData()
            }
        },
        params: {
            handler(value) {
                window.IDM.http
                    .get('ctrl/dbWorkbench/getPadLeaderInfo', {
                        userId: value.userId
                    })
                    .then(({ data }) => {
                        this.leaderInfo = data.data
                    })
            },
            immediate: true
        }
    },
    methods: {
        showDetail(value) {
            window.IDM.http
                .get('ctrl/dbWorkbench/getLastfeedbackInfo', {
                    ...this.params,
                    noticeId: value.id
                })
                .then(({ data }) => {
                    this.detailData = {
                        ...data.data,
                        noticeInfo: value
                    }
                })
        },
        showUrge(value) {
            window.IDM.http
                .get('ctrl/dbWorkbench/getLeaderPadNoticeInfo', {
                    ...this.params,
                    noticeId: value.id
                })
                .then(({ data }) => {
                    this.urgeData = data.data
                })
        },
        homeHandle() {
            this.dept = homeData()
            this.current = '1'
        },
        deptChangeHandle(dept) {
            this.detailData = null
            this.urgeData = null
            this.model.visible = false
            this.dept = {
                queryType: this.model.queryType,
                label: dept.unitName,
                value: dept.unitId
            }
            this.current = '1'
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
    gap: 2.5rem;
    .main-container {
        padding: 0 3.75rem 3.75rem;
    }
    .btn-back {
        font-size: 2.75rem;
        padding: 0.5rem 2.5rem 0;
        color: white;
        position: relative;
        z-index: 1;
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
