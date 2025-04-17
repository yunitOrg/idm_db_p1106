<template>
    <Tabs :items="tabs" v-model="active" class="h-full" @input="changeHandle">
        <div class="h-full flex flex-col">
            <div class="flex justify-end " style="padding: 2rem 0; gap: 2.5rem;align-items: center; position: relative;">
                <div class="searchBox">
                    <div class="bt">
                        <span>标题：</span>
                        <a-input  v-model="bt" placeholder="" />
                    </div>
                    <div class="selectBox selectBox2">
                        <span>年份：</span>
                        <a-select v-model="year" @change="getYear()">
                            <a-select-option :value="item.value" v-for="(item, index) in yearOptions" :key="index">
                                {{ item.text }}
                            </a-select-option>
                        </a-select>
                    </div>
                    <div class="selectBox">
                        <span>类型：</span>
                        <a-cascader v-model="leixing" allowClear placeholder="" :options="options" change-on-select @change="getLeixing"/>
                    </div>
                    <!-- <div class="dateArray">
                        <span>办结期限：</span>
                        <a-config-provider :locale="locale">
                            <a-range-picker valueFormat="YYYY-MM-DD" :placeholder="['开始时间', '结束时间']" mode="['month', 'month']" v-model="times" @change="getTimes()"/>
                        </a-config-provider>
                    </div> -->
                    <div class="bt" v-if="homeType.type=='事项分类' && (dept.label=='重点任务'|| dept.label=='重要批示')">
                        <span>承办单位：</span>
                        <a-input  v-model="dwName" placeholder="" />
                    </div>
                    <!-- <div class="selectBox" v-if="homeType.type=='承办单位'">
                        <span>督办分类：</span>
                        <a-select v-model="dbfl" allowClear @change="getSuperType()">
                            <a-select-option :value="item.value" v-for="(item, index) in superType" :key="index">
                                {{ item.text }}
                            </a-select-option>
                        </a-select>
                    </div> -->
                    <div class="btn" @click="fetchData()">
                        检索
                    </div>
                    <div class="btn" @click="reset()">
                        重置
                    </div>
                </div>
                <Status v-for="i in [4, 2, 1]" :key="i" :value="i" :showLabel="true" />
            </div>
            <div class="flex-1 h-0 overflow-auto">
                <a-config-provider :locale="locale">
                    <a-table :columns="columns" :dataSource="data" :loading="loading" :bordered="true" :pagination="false">
                        <template slot="status" slot-scope="text">
                            <div class="flex justify-center">
                                <Status :value="text" />
                            </div>
                        </template>
                        <template slot="important" slot-scope="text, record">
                            <div
                                class="flex justify-center"
                                :style="{
                                    color: record.approvalImportant == 2 ? 'red' : '#333'
                                }"
                            >
                                {{ record.approvalImportantText }}
                            </div>
                        </template>
                        <template slot="approvalBt" slot-scope="text, record">
                            <div @click="detailHandle(record)" class="pointer text-start">{{ text }}</div>
                        </template>
                        <template slot="operation" slot-scope="text, record">
                            <div class="flex items-center justify-center">
                                <div @click="followHandle(record)" class="pointer btn-operation">
                                    <img v-if="record.attentionstatus == 1" src="./images/icon_follow_active.png" />
                                    <img v-else src="./images/icon_follow.png" />
                                </div>
                                <div v-if="record.dbStatus < 6 && record.isSms==1" @click="urgeHandle(record)" class="pointer btn-operation">
                                    <img v-if="record.urgeStatus == 1" src="./images/icon_urge_active.png" />
                                    <img v-else src="./images/icon_urge.png" />
                                </div>
                            </div>
                        </template>
                    </a-table>
                    <template #renderEmpty>
                        <div class="flex flex-col items-center empty">
                            <img src="./images/s.gif" class="icon" />
                            <div class="text">暂无数据</div>
                        </div>
                    </template>
                </a-config-provider>
            </div>
        </div>
        <template #extra>
            <slot name="extra"></slot>
        </template>
    </Tabs>
    
</template>
<script>
import locale from 'ant-design-vue/es/locale/zh_CN'
import Tabs from './tabs.vue'
import Status from './status.vue'
import { EventBus } from '../../mixins/eventBus.js';
export default {
    props: {
        dept: {
            type: Object
        },
        params: {
            type: Object
        },
        homeType:{
            type:Object
        }
    },
    components: {
        Status,
        Tabs
    },
    data() {
        return {
            bt:"",
            year:new Date().getFullYear(),
            leixing:[],
            dwName:"",
            dbfl:"",
            times:[],
            locale,
            data: [],
            active:this.dept.value,
            loading: false,
            record:{},//当前点击的收藏
            attentionReason:"",//点击收藏从收藏弹窗得到的值
            fetchStatData:{
                allCount:"",
                overdueCount:"",
                nearCount:"",
                inProcessCount:"",
                haveDoneCount:"",
            },//全部的时候tab页签对应的值
            superType:[
                {text:"重要批示",value:1},
                {text:"重要文件",value:2},
                {text:"重点任务",value:3},
                {text:"交办事项",value:4},
                {text:"调查核实",value:5},
                {text:"建议提案 ",value:6}
            ],
            options:[
                {
                    label: 'zhejiang',
                    value: '1',
                    children: [
                        {
                            label: 'hangzhou',
                            value: '2',
                        }
                    ],
                },
                {
                    label: 'zhejiang',
                    value: '1',
                    children: [
                        {
                            label: 'hangzhou',
                            value: '2',
                        }
                    ],
                }
            ],
            a:""
        }
    },
    computed: {
        yearOptions(){
            //获取从2024年到当年的年份
            let year = new Date().getFullYear()
            let arr = [
                {
                    text: "至今",
                    value:9999
                }
            ]
            for (let i = 2024; i <= year; i++) {
                arr.push({
                    text: i,
                    value:i
                })
            }
            return arr
        },
        tabs(){
            if (this.params.isShouye == "false" && this.params.type == "0") {
                let a = [
                    {
                        label: this.dept.label,
                        value: this.dept.value,
                        count: this.fetchStatData.allCount
                    }
                ]
                let arr = [
                    {
                        label: "超期",
                        value: "1",
                        count: this.fetchStatData.overdueCount
                    },
                    {
                        label: "临期",
                        value: "2",
                        count: this.fetchStatData.nearCount
                    },
                    {
                        label: "正常",
                        value: "3",
                        count: this.fetchStatData.inProcessCount
                    },
                    {
                        label: "已办",
                        value: "4",
                        count: this.fetchStatData.haveDoneCount
                    }
                ]
                arr.forEach((item) => {
                    a.push(item)
                })
                return a 
            }else{
                let a = [
                    {
                        label: this.dept.label,
                        value: this.dept.value,
                        count: this.data.length
                    }
                ]
                return a 
            }
           
        },
        columns() {
            return [
                {
                    title: '序号',
                    dataIndex: 'index',
                    width: '9rem',
                    align: 'center',
                    customRender: (text, record, index) => index + 1
                },
                {
                    title: '督办状态',
                    dataIndex: 'padLight',
                    filters: [
                        {
                            text: '超期',
                            value: '4'
                        },
                        {
                            text: '预警',
                            value: '2'
                        },
                        {
                            text: '正常',
                            value: '1'
                        }
                    ],
                    onFilter: (value, record) => value == record.padLight,
                    width: '19rem',
                    align: 'center',
                    scopedSlots: {
                        customRender: 'status'
                    },
                    sorter: (prev, current) => current.padLight > prev.padLight
                },
                {
                    title: '重要程度',
                    dataIndex: 'approvalImportant',
                    filters: [
                        {
                            text: '重要',
                            value: 2
                        },
                        {
                            text: '普通',
                            value: 1
                        },
                        {
                            text: '空',
                            value: 0
                        }
                    ],
                    onFilter: (value, record) => value == record.approvalImportant,
                    width: '19rem',
                    align: 'center',
                    scopedSlots: {
                        customRender: 'important'
                    },
                    sorter: (prev, current) => current.approvalImportant > prev.approvalImportant
                },
                {
                    title: '标题',
                    dataIndex: 'approvalBt',
                    align: 'center',
                    scopedSlots: {
                        customRender: 'approvalBt'
                    }
                },
                {
                    title: '承办单位',
                    dataIndex: 'handlerUnitText',
                    width: '21.38rem',
                    align: 'center'
                },
                {
                    title: '办结期限',
                    dataIndex: 'endDate',
                    width: '26rem',
                    align: 'center'
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    width: '18.19rem',
                    align: 'center',
                    scopedSlots: {
                        customRender: 'operation'
                    }
                }
            ]
        },
        query() {
            return {
                ...this.params,
                orgId: this.dept.value != '0' ? this.dept.value : null,
            }
        }
    },
    watch: {
        dept: {
            handler(val) {
                this.year=new Date().getFullYear()
                this.leixing=[]
                this
            },
            immediate: true
        },
        active:{
            handler(val) {
                if(val){
                    // console.log(val,"=====");
                    // this.active = val
                    // this.dept.isFanhui=false
                    // this.$nextTick(()=>{
                    //     this.fetchData()
                    // })
                }
            },
            immediate: true
        },
        query: {
            handler() {
                if(this.dept.label != ("全部"|| "超期"|| "临期" || "正常" || "已办")){
                    this.active = this.dept.value
                }
                if(this.dept?.isFanhui==true){
                    this.active = this.dept.value
                }
                this.$nextTick(()=>{
                    this.getOptions()
                    this.fetchData()
                })
            },
            immediate: true
        }
    },
    created() {
        EventBus.$on('getCollect', (message) => {
            console.log(1111,message);
            this.attentionReason = message;
            this.collectHandle(this.record)
        });
        EventBus.$on('deleteCollect', (message) => {
            console.log(2222);
            this.attentionReason = "";
            this.$emit("closeCollect")
        });
        
    },
    mounted() {
        this.getOptions()
    },
    methods: {
        //获取年份
        getYear(){
            this.$nextTick(()=>{
                // this.fetchData()
            })
        },
        //得到类型的值
        getLeixing(value,selectedOptions){
            this.$nextTick(()=>{
                // this.fetchData()
            })
        },
        changeHandle(active){
            this.active=active
            this.dept.isFanhui=false
            this.$nextTick(()=>{
                this.fetchData()
            })
        },
        //获取类型下拉数据
        getOptions(){
            window.IDM.http.get(this.a+'/ctrl/dbWorkbench/getApprovalTypePull', {
                approvalTypeParam:this.dept.approvalTypeParam? this.dept.approvalTypeParam:null
            })
            .then(({ data }) => {
                this.options=data.data
            })
        },
        //获取日期时间
        getTimes(times){
            console.log(this.times);
        },
        fetchData() {
            this.loading = true
            window.IDM.http
                .post(
                    this.a+'ctrl/dbWorkbench/getLeaderPadNoticeList',
                    {
                        ...this.query,
                        approvalTypeParam:this.homeType.type=='事项分类'?this.dept.approvalTypeParam? this.dept.approvalTypeParam:null: this.leixing && this.leixing.length>0? this.leixing[0]:null,
                        dbEjTypeParam:this.homeType.type=='事项分类'?this.leixing[0] :this.leixing[1] , 
                        pageNo: 1,
                        pageSize: 9999,
                        bt:this.bt,
                        startTime:this.times[0]?this.times[0]:"",
                        endTime:this.times[1]?this.times[1]:"",
                        fileStatus:this.active != '0' ? this.active : 0,
                        dwName:this.dwName && this.dwName.length>0?this.dwName:"",
                        yearParam: this.year,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(({ data }) => {
                    this.data = data.data
                   this.$nextTick(()=>{
                    if (this.params.isShouye == "false" && this.params.type == "0") {

                        this.fetchStat()
                    }
                   })
                })
                .finally(() => {
                    this.loading = false
                })
            
        },
        //获取有全部tab的时候所有tab页签的count
        fetchStat() {
           
                window.IDM.http
                    .post(
                        this.a + 'ctrl/dbWorkbench/getPadUndertakeCount',
                        {
                            ...this.query,
                            pageNo: 1,
                            pageSize: 9999,
                            bt: this.bt,
                            startTime: this.times[0] ? this.times[0] : "",
                            endTime: this.times[1] ? this.times[1] : "",
                            yearParam: this.year,
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    )
                    .then(({ data }) => {
                        console.log(data);
                        this.fetchStatData=data.data

                    })
                    .finally(() => {
                    })
        },
        //判断是否已经收藏过，如果已经收藏过，则提示已经收藏过，否则提示收藏成功
        followHandle(record) {
            if(record.attentionstatus==0){
                this.record=record
                this.$emit('ishowCollect')
            }else{
                this.attentionReason=''
                this.collectHandle(record)
            }
        },
        //确定收藏后调用此方法
        collectHandle(record) {
            window.IDM.http
                .post(this.a+'ctrl/dbNotice/attention', {
                    ...this.params,
                    noticeId: record.id,
                    opType: this.attentionReason.length<=0 ? 0 : 1,
                    attentionReason:this.attentionReason
                })
                .then(({ data }) => {})
            if (record.attentionstatus==1) {
                record.attentionstatus = 0
            } else {
                record.attentionstatus = 1
            }
            this.$emit("closeCollect")
        },
        detailHandle(record) {
            // this.$emit('detail', record, {
            //             ...this.query,
            //             approvalTypeParam:this.homeType.type=='事项分类'?this.dept.approvalTypeParam? this.dept.approvalTypeParam:null: this.leixing && this.leixing.length>0? this.leixing[0]:null,
            //             dbEjTypeParam:this.homeType.type=='事项分类'?this.leixing[0] :this.leixing[1] , 
            //             pageNo: 1,
            //             pageSize: 9999,
            //             bt:this.bt,
            //             startTime:this.times[0]?this.times[0]:"",
            //             endTime:this.times[1]?this.times[1]:"",
            //             fileStatus:this.active != '0' ? this.active : 0,
            //             dwName:this.dwName && this.dwName.length>0?this.dwName:"",
            //         })
            console.log(record);
            let url = this.a+ `ctrl/formControl/sysForm?moduleId=240508144008KksWD26gkR8FDH07bfS&formId=240508144446G9V6RVMn48B03NtLByV&nodeId=-1&validateByList=1&listId=DbNoValidate&pk=${record.approvalId }`
            window.open(IDM.url.getWebPath(url))
        },
        urgeHandle(record) {
            console.log(11);
            this.$emit('urge', record)
        },
        //重置
        reset(){
            this.bt=""
            this.leixing=[]
            this.year=new Date().getFullYear()
            this.dwName=""
            this.$nextTick(()=>{
                this.fetchData()
            })
        }
    },
    beforeDestroy() {
        EventBus.$off('getCollect');
    }
}
</script>
<style lang="scss">
    .ant-cascader-menus{
        font-size: 2rem;
        .ant-cascader-menu-item{
            line-height: 2.5rem;
        }
    }
</style>
<style lang="scss" scoped>
.empty {
    gap: 1.8rem;
    padding: 5rem 0;
    .icon {
        width: 18.69rem;
        height: 15.56rem;
        transform: translateX(1.3rem);
        background: url('./images/icon_empty.png') no-repeat;
        background-size: cover;
    }
    .text {
        font-size: 3rem;
        color: #666;
    }
}
.btn-operation {
    width: 7rem;
    padding: 0 2rem;
    position: relative;
    img {
        width: 100%;
    }
    &:after {
        position: absolute;
        display: block;
        content: '';
        right: 0;
        top: 0.8rem;
        bottom: 0.8rem;
        width: 2px;
        background-color: #b8b8b8;
    }
    &:last-child {
        &:after {
            display: none;
        }
    }
}
.searchBox{
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    &>div{
        margin-right: 2em;
    }
    .bt{
        display: flex;
        align-items: center;
        font-size: 2.38rem;
            color: #333333;
        &>span{
            white-space: nowrap;
        }
        ::v-deep .ant-input{
            width:10em;
            height: 2.1em;
            font-size: 2rem;
            // color: #333333;
        }
    }
    .selectBox{
        display: flex;
        align-items: center;
        font-size: 2.38rem;
        color: #333333;
        &>span{
            white-space: nowrap;
        }
        ::v-deep .ant-select{
            width:8em !important;
            height: 2.1em;
            font-size: 2rem;
            // color: #333333;
            .ant-select-selection--single{
                height: 2.1em;
                .ant-select-selection__rendered{
                    line-height: 2.1em;
                }
            }
        }
        ::v-deep  .ant-cascader-picker{
            height: 2.1em;
            width: 13em;
            font-size: 2rem;
            .ant-cascader-input{
                height: 100%;
                .ant-cascader-pic{
                    height: 2em;
                    line-height: 2em;
                }
            }
        }
    }
    .selectBox2{
        ::v-deep .ant-select{
            width:5em !important
        }
    }
    .dateArray{
        display: flex;
        align-items: center;
        font-size: 2.38rem;
        color: #333333;
        ::v-deep .ant-calendar-picker{
            width:18em;
            height: 2.5em;
            .ant-calendar-picker-input{
                height: 2.5em;
                .ant-calendar-range-picker-input{
                    font-size: 2rem !important;
                    color: #333333;
                }
            }
        }
        
    }
    .btn{
        width: 4em;
        height: 1.7em;
        font-size: 2.38rem;
        text-align: center;
        line-height: 4rem;
        background: #2477c9;
        color: #fff;
        justify-content: space-between;
        cursor: default;
    }
}
</style>
