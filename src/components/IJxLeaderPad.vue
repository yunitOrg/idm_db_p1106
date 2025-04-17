<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="idm-db-IJxLeaderPad"
        :class="className.wrap">
        <div class="h-screen flex flex-col idm-db-IJxLeaderPad-container">
            <TopBar :params="params" :leaderInfo="leaderInfo" />
            <NavBar v-if="navs.length > 0 && isShouye == false" :items="navs"></NavBar>
            <div class="flex-1 h-0 main-container">
                <!-- 领导工作首页 -->
                <shouye class="shouye" v-if="isShouye == true" :params="params" @onHomeType="onHomeType">
                </shouye>
                <Urge v-if="urgeData && isShouye == false" :params="params" :data="urgeData" @close="urgeClose()" />
                <Detail v-else-if="dept.label!='重要批示' && dept.label!='重点任务' &&detailData && isShouye == false"  :params="params"  :data="detailData"
                    @urge="() => showUrge(detailData.noticeInfo)" @close="detailData = null" />
                <Detail2 v-else-if="detailData && isShouye == false && (dept.label=='重要批示' || dept.label=='重点任务')" :params="params" :data="detailData"
                    @urge="showUrge2" @close="detailData = null" />
                <Cube v-else-if="current == '2' && isShouye == false" :params="params" @home="homeHandle"></Cube>
                <Follow v-if="current == '3' && isShouye == false" :dept="dept"  :params="params" @detail="showDetail"
                    @urge="showUrge"
                    @ishowCollect="collectModelVisible=true"
                    @closeCollect="collectModelVisible=false">
                    <template #extra>
                        <div @click="homeHandle" class="pointer btn-back">返回首页</div>
                    </template>
                </Follow>
                <Dept v-if="(current != '2' || current != '3') && isShouye == false" :homeType="homeType" :dept="dept" :params="params"
                    @detail="showDetail" @urge="showUrge"
                    @ishowCollect="collectModelVisible=true"
                    @closeCollect="collectModelVisible=false">
                    <template #extra>
                        <div v-if="dept.value != '0'" @click="homeHandle" class="pointer btn-back">返回首页</div>
                    </template>
                </Dept>

            </div>
            <DeptModel v-if="model.visible" :title="model.title" :data="model.data" @change="deptChangeHandle"
                @close="model.visible = false"></DeptModel>
            <collectModel v-if="collectModelVisible"></collectModel>
        </div>
    </div>
</template>
<script>
import shouye from '../commonComponents/IJxLeaderPad/shouye.vue'
import bindProp from '../mixins/bindProp'
import bindStyle from '../mixins/bindStyle'
import TopBar from '../commonComponents/IJxLeaderPad/topBar.vue'
import NavBar from '../commonComponents/IJxLeaderPad/navBar.vue'
import Dept from '../commonComponents/IJxLeaderPad/dept.vue' //承办单位以及事项分类和事项分类的列表
import Cube from '../commonComponents/IJxLeaderPad/cube.vue'
import Follow from '../commonComponents/IJxLeaderPad/follow.vue' //特别关注的列表项
import Urge from '../commonComponents/IJxLeaderPad/urge.vue'
import Detail from '../commonComponents/IJxLeaderPad/detail.vue' //首页的列表详情项
import Detail2 from '../commonComponents/IJxLeaderPad/detail2.vue' //首页的重点批示和重点任务列表详情项
import DeptModel from '../commonComponents/IJxLeaderPad/deptModel.vue'
import collectModel from '../commonComponents/IJxLeaderPad/collectModel.vue'
import dayjs from 'dayjs'
const homeData = () => ({
    label: '全部',
    value: '0',
    isFanhui:true
})
export default {
    mixins: [bindProp(), bindStyle()],
    components: {
        shouye,
        TopBar,
        NavBar,
        Dept,
        Cube,
        Follow,
        Urge,
        Detail,
        Detail2,
        DeptModel,
        collectModel
    },
    data() {
        return {
            isShouye: window.IDM?.url.queryObject().isShouye=="false"?false:true || true,
            current: window.IDM?.url.queryObject().type || '0',
            dept: homeData(),
            urgeData: null,
            detailData: null,
            isApproval:0,
            model: {
                visible: false
            },
            leaderInfo: {},
            homeType: {},
            collectModelVisible:false,
            urgeTobackDetail:{},
            a:""
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
                    // year:2024,
                    month: 12
                },
                window.IDM.url.queryObject()
            )
        },
        navs() {
            if (this.params.isShouye == "false" && this.params.type == "0") {
                let navs = [
                    {
                        label: '省政府各部门',
                        value: '1',
                        active: this.dept.value != 0 && this.current == '1' && this.dept.queryType == 2,
                        on: {
                            click: () => {
                                window.IDM.http
                                    .post(
                                        this.a + 'ctrl/dbWorkbench/getPadLeaderUnit',
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
                                        this.a + 'ctrl/dbWorkbench/getPadLeaderUnit',
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
                                this.dept = {
                                    label: '特别关注',
                                    value: 1
                                }
                                this.current = "3"
                            }
                        }
                    }
                ]
                return navs
            }
            if (this.homeType.type == "事项分类") {         
                let navs = [
                    {
                        label: '重要批示',
                        value: '1',
                        active: this.dept.approvalTypeParam == 1,
                        on: {
                            click: () => {
                                this.detailData=null
                                this.urgeData=null
                                this.urgeTobackDetail={}
                                this.dept = {
                                    label: '重要批示',
                                    value: "",
                                    approvalTypeParam:1
                                }
                                this.current = "1"
                            }
                        }
                    },
                    {
                        label: '重要文件',
                        value: '2',
                        active: this.dept.approvalTypeParam == 2,
                        on: {
                            click: () => {
                                this.detailData=null
                                this.urgeData=null
                                this.urgeTobackDetail={}
                                this.dept = {
                                    label: '重要文件',
                                    value: "",
                                    approvalTypeParam:2
                                }
                                this.current = "1"
                            }
                        }
                    },
                    {
                        label: '重点任务',
                        value: '3',
                        active: this.dept.approvalTypeParam == 3,
                        on: {
                            click: () => {
                                this.detailData=null
                                this.urgeData=null
                                this.urgeTobackDetail={}
                                this.dept = {
                                    label: '重点任务',
                                    value: "",
                                    approvalTypeParam:3
                                }
                                this.current = "1"
                            }
                        }
                    },
                    {
                        label: '交办事项',
                        value: '4',
                        active: this.dept.approvalTypeParam == 4,
                        on: {
                            click: () => {
                                this.detailData=null
                                this.urgeData=null
                                this.urgeTobackDetail={}
                                this.dept = {
                                    label: '交办事项',
                                    value: "",
                                    approvalTypeParam:4
                                }
                                this.current = "1"
                            }
                        }
                    },
                    {
                        label: '调查核实',
                        value: '5',
                        active: this.dept.approvalTypeParam == 5,
                        on: {
                            click: () => {
                                this.detailData=null
                                this.urgeData=null
                                this.urgeTobackDetail={}
                                this.dept = {
                                    label: '调查核实',
                                    value: "",
                                    approvalTypeParam:5
                                }
                                this.current = "1"
                            }
                        }
                    },
                    {
                        label: '建议提案',
                        value: '6',
                        active: this.dept.approvalTypeParam == 6,
                        on: {
                            click: () => {
                                this.detailData=null
                                this.urgeData=null
                                this.urgeTobackDetail={}
                                this.dept = {
                                    label: '建议提案',
                                    value: "",
                                    approvalTypeParam:6
                                }
                                this.current = "1"
                            }
                        }
                    }
                ]
                navs.map((el,index)=>{
                    el.num=this.homeType.el[index].num
                })
                return navs
            }
            if (this.homeType.type == "特别关注") {
                let nav=[
                    {
                        label: '亮点',
                        value: '1',
                        active: this.dept.value == 1,
                        on: {
                            click: () => {
                                this.detailData=null
                                this.urgeData=null
                                this.urgeTobackDetail={}
                                this.dept = {
                                    label: '亮点',
                                    value: 1
                                }
                                this.current = "3"
                            }
                        }
                    },
                    {
                        label: '难点',
                        value: '2',
                        active: this.dept.value == 2,
                        on: {
                            click: () => {
                                this.detailData=null
                                this.urgeData=null
                                this.urgeTobackDetail={}
                                this.dept = {
                                    label: '难点',
                                    value: 2
                                }
                                this.current = "3"
                            }
                        }
                    },
                    {
                        label: '风险点',
                        value: '3',
                        active: this.dept.value == 3,
                        on: {
                            click: () => {
                                this.detailData=null
                                this.urgeData=null
                                this.urgeTobackDetail={}
                                this.dept = {
                                    label: '风险点',
                                    value: 3
                                }
                                this.current = "3"
                            }
                        }
                    }
                ]
                nav.map((el,index)=>{
                    el.num=this.homeType.el[index].num
                })
                return nav
            }
            if (this.homeType.type == "承办单位") {
                if ([1, 5, 6].includes(this.leaderInfo.type)) {
                    return [
                        {
                            label: '省政府各部门',
                            value: '1',
                            active: this.dept.value != 0 && this.current == '1' && this.dept.queryType == 2,
                            on: {
                                click: () => {
                                    window.IDM.http
                                        .post(
                                            this.a+'ctrl/dbWorkbench/getPadLeaderUnit',
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
                                            this.a+'ctrl/dbWorkbench/getPadLeaderUnit',
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
                                            this.a+'ctrl/dbWorkbench/getPadLeaderUnit',
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
                        }
                    ]
                }
            }
            return []
        }
    },
    watch: {
        current(value) {
            this.urgeData = null
            this.detailData = null
            if (this.isShouye == true) {
                this.dept = homeData()
            }
        },
        params: {
            handler(value) {
                window.IDM.http
                    .get(this.a+'ctrl/dbWorkbench/getPadLeaderInfo', {
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
        showDetail(value,params) {
            // this.isApproval =value.isApproval? value.isApproval:0
            if(this.dept.label=='重要批示' || this.dept.label=='重点任务' ){
                //去除params中的attentionReasonType和padNoticeQueryType
                delete params.padNoticeQueryType
                delete params.attentionReasonType
                this.urgeTobackDetail={
                        value,
                        params
                    }
                window.IDM.http
                    .post(this.a+'ctrl/dbScreen/getLeaderPadlargeSizeFeedbackInfo', {
                       ...params,
                       approvalId:value.id
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                    )
                    .then(({ data }) => {
                        console.log(data);
                        this.detailData = {
                            data: data.data,
                            data2:value,
                            noticeInfo: value,
                        }
                    })
            }else{

                window.IDM.http
                    .get(this.a+'ctrl/dbWorkbench/getLastfeedbackInfo', {
                        ...this.params,
                        noticeId: value.id,
                    })
                    .then(({ data }) => {
                        this.detailData = {
                            ...data.data,
                            noticeInfo: value
                        }
                    })
            }
        },
        showUrge(value) {
            window.IDM.http
                .get(this.a+'ctrl/dbWorkbench/getLeaderPadNoticeInfo', {
                    ...this.params,
                    noticeId: value.id,
                    approvalId:value.approvalId,
                    handlerUnit:value.handlerUnit,
                    handlerUnitSchema:value.handlerUnitSchema,
                    handlerUnitText:value.handlerUnitText
                })
                .then(({ data }) => {
                    this.urgeData = data.data
                })
        },
        //显示从重要批示和重点任务详情页点击过来要打开催办页面
        showUrge2(el){
            console.log(el,"========");
            window.IDM.http
                .get(this.a+'ctrl/dbWorkbench/getLeaderPadNoticeInfo', {
                    ...this.params,
                    noticeId: el.noticeId,
                    approvalId:el.approvalId,
                    handlerUnit:el.handlerUnit,
                    handlerUnitSchema:el.handlerUnitSchema,
                    handlerUnitText:el.handlerUnitText
                })
                .then(({ data }) => {
                    this.urgeData = data.data
                })
        },
        urgeClose(){
            // if(this.dept.label=='重要批示' || this.dept.label=='重点任务'){
            //     this.showDetail(this.urgeTobackDetail.value,this.urgeTobackDetail.params)
            // }
            this.urgeData = null
        },
        homeHandle() {
            if (this.params.isShouye == "false" && this.params.type == "0") {
                this.homeType = {}
                this.detailData = null
                this.urgeData = null
                this.dept = homeData()
                this.dept.isFanhui = true
                this.current = '1'
                this.isShouye = false
            }else{
                this.detailData = null
                this.urgeData = null
                this.dept = homeData()
                this.current = ''
                this.homeType = {}
                this.isShouye = true
            }
        },
        deptChangeHandle(dept) {
            if (this.params.isShouye == "false" && this.params.type == "0") {
                this.isShouye = false
                this.detailData = null
                this.urgeData = null
                this.urgeTobackDetail={}
                this.model.visible = false
                this.dept = {
                    queryType: this.model.queryType,
                    label: dept.unitName,
                    value: dept.unitId
                }
                this.current = '1'
            }else{
                this.isShouye = false
                this.detailData = null
                this.urgeData = null
                this.urgeTobackDetail={}
                this.model.visible = false
                this.dept = {
                    queryType: this.model.queryType,
                    label: dept.unitName,
                    value: dept.unitId
                }
                this.current = '1'
            }
        },
        //获取点击首页的type类型
        onHomeType(obj) {
            this.homeType = obj
            if (this.homeType.type == "事项分类") {
                this.isShouye = false
                switch (this.homeType.value) {
                    case 1:
                        this.dept.label = "重要批示"
                        this.dept.value = ""
                        this.dept.approvalTypeParam=this.homeType.value
                        break;
                    case 2:
                        this.dept.label = "重点文件"
                        this.dept.value = ""
                        this.dept.approvalTypeParam=this.homeType.value
                        break;
                    case 3:
                        this.dept.label = "重点任务"
                        this.dept.value =  ""
                        this.dept.approvalTypeParam=this.homeType.value
                        break;
                    case 4:
                        this.dept.label = "交办事项"
                        this.dept.value =  ""
                        this.dept.approvalTypeParam=this.homeType.value
                        break;
                    case 5:
                        this.dept.label = "调查核实"
                        this.dept.value =  ""
                        this.dept.approvalTypeParam=this.homeType.value
                        break;
                    case 6:
                        this.dept.label = "建议提案"
                        this.dept.value =  ""
                        this.dept.approvalTypeParam=this.homeType.value
                        break;
                }
            }
            if (this.homeType.type == "特别关注") {
                this.isShouye = false
                this.current = "3"
                switch (this.homeType.value) {
                    case 1:
                        this.dept.label = "亮点"
                        this.dept.value = this.homeType.value
                        break;
                    case 2:
                        this.dept.label = "难点"
                        this.dept.value = this.homeType.value
                        break;
                    case 3:
                        this.dept.label = "风险点"
                        this.dept.value = this.homeType.value
                        break;
                }
            }
            if (this.homeType.type == "承办单位") {
                if (this.homeType.value == '1') {//省政府各部门
                    window.IDM.http
                        .post(
                            this.a+'ctrl/dbWorkbench/getPadLeaderUnit',
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
                if (this.homeType.value == '2') {//各设区市政府
                    window.IDM.http
                        .post(
                            this.a+'ctrl/dbWorkbench/getPadLeaderUnit',
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
                if (this.homeType.value == '3') {//分管部门
                    window.IDM.http
                        .post(
                            this.a+'ctrl/dbWorkbench/getPadLeaderUnit',
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
    // background: #8fc7ff;
    overflow-y: hidden;
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

    &.ant-table-bordered .ant-table-header>table,
    &.ant-table-bordered .ant-table-body>table,
    &.ant-table-bordered .ant-table-fixed-left table,
    &.ant-table-bordered .ant-table-fixed-right table,
    &.ant-table-bordered.ant-table-empty .ant-table-placeholder,
    &.ant-table-bordered .ant-table-thead>tr>th,
    &.ant-table-bordered .ant-table-tbody>tr>td {
        border-color: #8fc7ff;
        border-width: 0.13rem;
    }

    .ant-table-thead tr th {
        background: #e8f4ff;
    }

    .ant-table-thead>tr>th .anticon-filter {
        color: black;
        font-size: 1rem;
        width: 3rem;
    }

    .ant-empty {
        font-size: 2.38rem;
    }
}
</style>
