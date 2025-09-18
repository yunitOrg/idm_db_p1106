<template>
    <Tabs :items="tabs" v-model="current" class="h-full" :showInfo="showInfo"  @input="changeHandle">
        <div class="h-full flex flex-col">
            <div class="flex justify-end" style="padding: 2rem 0; gap: 2.5rem;align-items: center;position: relative;justify-content: start;">
                <div class="searchBox">
                    <div class="bt">
                        <span>标题：</span>
                        <a-input v-model="bt" placeholder="" />
                    </div>
                    <div class="selectBox selectBox2">
                        <span>年份：</span>
                        <a-select v-model="year" @change="getYear()">
                            <a-select-option :value="item.value" v-for="(item, index) in yearOptions" :key="index">
                                {{ item.text }}
                            </a-select-option>
                        </a-select>
                    </div>
                    <!-- <div class="selectBox">
                        <span>类型：</span>
                        <a-cascader v-model="leixing" allowClear placeholder="" :options="options" change-on-select
                            @change="getLeixing" />
                    </div> -->
                    <div class="selectBox">
                        <span>落实状态：</span>
                        <a-cascader v-model="lszt" allowClear placeholder="" :options="options2" change-on-select
                            @change="getLszt" />
                    </div>
                    <!-- <div class="dateArray">
                        <span>办结期限：</span>
                        <a-config-provider :locale="locale">
                            <a-range-picker valueFormat="YYYY-MM-DD" :placeholder="['开始时间', '结束时间']" mode="['month', 'month']" v-model="times" @change="getTimes()"/>
                        </a-config-provider>
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
                        <!-- <template slot="important" slot-scope="text, record">
                            <div class="flex justify-center" :style="{
                                color: record.approvalImportant == 2 ? 'red' : '#333'
                            }">
                                {{ record.approvalImportantText }}
                            </div>
                        </template> -->
                        <!-- <template slot="approvalBt" slot-scope="text, record">
                            <div @click="detailHandle(record)" class="pointer text-start">{{ text }}</div>
                        </template> -->
                        <!-- <template slot="jvgzrwyq" slot-scope="text, record">
                            <div @click="jtgzrwHandle(record)" class="pointer text-start">{{ record.jvgzrwyq }}</div>
                        </template> -->
                        <template slot="operation" slot-scope="text, record">
                            <div class="flex items-center justify-center">
                                <div @click="followHandle(record)" class="pointer btn-operation">
                                    <img v-if="record.attentionstatus == 1" src="./images/icon_follow_active.png" />
                                    <img v-else src="./images/icon_follow.png" />
                                </div>
                                <div v-if="record.dbStatus < 6 && record.isSms == 1" @click="urgeHandle(record)"
                                    class="pointer btn-operation">
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
        params: {
            type: Object
        },
        dept: {
            type: Object
        }
    },
    components: {
        Status,
        Tabs
    },
    data() {
        return {
            bt: "",
            year: new Date().getFullYear(),
            leixing: [],
            lszt:[],
            times: [],
            locale,
            stat: {
                urgeCount: 0,
                attentionCount: 0
            },
            current: '3',
            data: [],
            loading: false,
            attentionReason: "",
            options: [
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
            options2:[
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
            a:"",
            showInfo:'',//表格上展示的文字
        }
    },
    computed: {
        yearOptions() {
            //获取从2024年到当年的年份
            let year = new Date().getFullYear()
            let arr = [
                {
                    text: "至今",
                    value: 9999
                }
            ]
            for (let i = 2024; i <= year; i++) {
                arr.push({
                    text: i,
                    value: i
                })
            }
            return arr
        },
        tabs() {
            return [
                {
                    value: '3',
                    label: '省政府工作报告 ',
                    count: this.stat.reportCount
                },
                {
                    value: '1',
                    label: '手动关注',
                    count: this.stat.attentionCount
                },
                {
                    value: '2',
                    label: '已催办 ',
                    count: this.stat.urgeCount
                }
            ]
        },
        columns() {
            if (this.current == '3') {
                return [
                {
                        title: '序号',
                        dataIndex: 'index',
                        width: '9rem',
                        align: 'center',
                        customRender: (text, record, index) => {
                            // 只有在需要显示的行（_jointIndex === 0）才显示序号并设置 rowSpan
                            if (record._jointIndex === 0) {
                            // 计算合并后的序号
                            let visibleIndex = 1;
                            for (let i = 0; i < index; i++) {
                                if (this.data[i]._jointIndex === 0) {
                                visibleIndex++;
                                }
                            }
                            
                            // 返回序号并设置 rowSpan
                            return {
                                children: visibleIndex,
                                attrs: { rowSpan: record._jvgzrwyq_rowSpan || 1 }
                            };
                            }
                            
                            // 对于不需要显示的行，不显示内容并设置 rowSpan 为 0
                            return {
                            children: '',
                            attrs: { rowSpan: 0 }
                            };
                        }
                    },
                    // {
                    //     title: '督办状态',
                    //     dataIndex: 'padLight',
                    //     filters: [
                    //         {
                    //             text: '超期',
                    //             value: '4'
                    //         },
                    //         {
                    //             text: '预警',
                    //             value: '2'
                    //         },
                    //         {
                    //             text: '正常',
                    //             value: '1'
                    //         }
                    //     ],
                    //     onFilter: (value, record) => value == record.padLight,
                    //     width: '19rem',
                    //     align: 'center',
                    //     scopedSlots: {
                    //         customRender: 'status'
                    //     },
                    //     sorter: (prev, current) => current.padLight > prev.padLight
                    // },
                    // {
                    //     title: '重要程度',
                    //     dataIndex: 'approvalImportant',
                    //     filters: [
                    //         {
                    //             text: '重要',
                    //             value: 2
                    //         },
                    //         {
                    //             text: '普通',
                    //             value: 1
                    //         },
                    //         {
                    //             text: '空',
                    //             value: 0
                    //         }
                    //     ],
                    //     onFilter: (value, record) => value == record.approvalImportant,
                    //     width: '19rem',
                    //     align: 'center',
                    //     scopedSlots: {
                    //         customRender: 'important'
                    //     },
                    //     sorter: (prev, current) => current.approvalImportant > prev.approvalImportant
                    // },
                    // {
                    //     title: '标题',
                    //     dataIndex: 'approvalBt',
                    //     align: 'center',
                    //     scopedSlots: {
                    //         customRender: 'approvalBt'
                    //     }
                    // },
                    // {
                    //     title: '落实状态',
                    //     dataIndex: 'extImplementationStatusText',
                    //     width: '21.38rem',
                    //     align: 'center',
                    // },
                    // {
                    //     title: '承办单位',
                    //     dataIndex: 'handlerUnitText',
                    //     width: '21.38rem',
                    //     align: 'center'
                    // },
                    // {
                    //     title: '办结期限',
                    //     dataIndex: 'endDate',
                    //     width: '26rem',
                    //     align: 'center'
                    // },
                    {
                        title: '具体工作任务和要求',
                        dataIndex: 'jvgzrwyq',
                        width: '30rem',
                        align: 'center',
                        customRender: (text, record) => {
                            const rowSpan = record._jvgzrwyq_rowSpan;
                            // 只有 rowSpan 为 0 时不显示内容，其他情况都应该显示
                            if (rowSpan === 0) {
                            return {
                                children: '',
                                attrs: { rowSpan: 0 }  // 尝试使用 attrs 而不是 props
                            };
                            }
                            // rowSpan > 0 时显示内容并设置 rowSpan
                            return {
                            children: this.$createElement('div', {
                                class: ['text-start']
                            }, record.jvgzrwyq || ''),
                            attrs: { rowSpan: rowSpan || 1 }  // 尝试使用 attrs 而不是 props
                            };
                        }
                    },
                    {
                        title: '牵头部门',
                        dataIndex: '_qtbm',
                        width: '21.38rem',
                        align: 'center',
                        //添加点击事件
                        customRender: (text, record) => {
                            return this.$createElement('div', {
                                on: {
                                    click: () => this.jtgzrwHandle(record)
                                },
                                class: ['pointer']
                            }, record._qtbm || '');
                        }
                    },
                    {
                    title: '责任处室',
                    dataIndex: '_zrcs',
                    width: '21.38rem',
                    align: 'center',
                    customRender: (text, record) => {
                        return record._zrcs || '';
                    }
                    },
                    {
                    title: '落实状态',
                    dataIndex: '_jointRsztText',
                    width: '21.38rem',
                    align: 'center',
                    customRender: (text, record) => {
                        return record._jointRsztText || '';
                    }
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
            } else {
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
                    // {
                    //     title: '重要程度',
                    //     dataIndex: 'approvalImportant',
                    //     filters: [
                    //         {
                    //             text: '重要',
                    //             value: 2
                    //         },
                    //         {
                    //             text: '普通',
                    //             value: 1
                    //         },
                    //         {
                    //             text: '空',
                    //             value: 0
                    //         }
                    //     ],
                    //     onFilter: (value, record) => value == record.approvalImportant,
                    //     width: '19rem',
                    //     align: 'center',
                    //     scopedSlots: {
                    //         customRender: 'important'
                    //     },
                    //     sorter: (prev, current) => current.approvalImportant > prev.approvalImportant
                    // },
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
            }
        },
        query() {
            return {
                ...this.params,
                padNoticeQueryType: this.current,
                attentionReasonType: this.dept.value
            }
        }
    },
    watch: {
        dept: {
            handler(val) {
                this.year = new Date().getFullYear()
                this.getDbGkData()
                this.leixing = []
            },
            immediate: true
        },
        params: {
            handler() {
                this.fetchStat()
                this.fetchStat()
            },
            immediate: true
        },
        query: {
            handler() {
                console.log(this.query, "----hhhhh");
                this.fetchStat()
                this.fetchData()
            },
            immediate: true
        }
    },
    created() {
        EventBus.$on('getCollect', (message) => {
            this.attentionReason = message;
            this.collectHandle(this.record)
        });
        EventBus.$on('deleteCollect', (message) => {
            this.attentionReason = "";
            this.$emit("closeCollect")
        });
    },
    mounted() {
        this.getOptions()
        this.getOptions2()
        this.getDbGkData()
    },
    methods: {
          //获取年份
        getYear(){
            this.$nextTick(()=>{
                this.fetchStat()
                this.fetchData()
                this.getDbGkData()
            })
        },
         //得到类型的值
        getLeixing(value,selectedOptions){
            console.log(this.leixing);
            if(this.current=='3'){
                this.$nextTick(()=>{
                    this.getDbGkData()
                })
            }
        },
        //得到落实状态的值
        getLszt(value,selectedOptions){
            console.log(this.lszt);
            if(this.current=='3'){
                this.$nextTick(()=>{
                    // this.getDbGkData()
                })
            }
        },
        //tab切换的事件
        changeHandle(active){
            // this.active=active
            if(active!='3'){
                this.showInfo=''
            }else if(active=='3'){
                this.getDbGkData()
            }
        },
        //获取类型下拉数据
        getOptions() {
            window.IDM.http.get(this.a + '/ctrl/dbWorkbench/getApprovalTypePull', {
                approvalTypeParam: this.dept.approvalTypeParam ? this.dept.approvalTypeParam : null
            })
                .then(({ data }) => {
                    this.options = data.data
                })
        },
        //获取落实状态下拉数据
        getOptions2() {
            window.IDM.http.get(this.a + '/ctrl/dbWorkbench/getNewExtImplementationStatus', {
                approvalTypeParam: this.dept.approvalTypeParam ? this.dept.approvalTypeParam : null
            })
                .then(({ data }) => {
                    this.options2 = data.data
                })
        },
        fetchStat() {
            window.IDM.http
                .post(
                    this.a + 'ctrl/dbWorkbench/getPadAttentionUrgeCount',
                    {
                        ...this.params,
                        attentionReasonType: this.dept.value,
                        yearParam: this.year
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(({ data }) => {
                    this.stat = data.data
                })
        },
          //获取督办概况的数据/ctrl/dbWorkbench/getDbSummaryContent
        getDbGkData(){
            console.log(this.current,';;;');
            if(this.current=='3'){
                window.IDM.http.post( this.a +'/ctrl/dbWorkbench/getDbSummaryContent',
                        {
                             ...this.query,
                            approvalTypeParam: this.leixing && this.leixing.length > 0 ? this.leixing[0] : null,
                            dbEjTypeParam: this.leixing && this.leixing.length > 1 ? this.leixing[1] : "",
                            pageNo: 1,
                            pageSize: 9999,
                            bt: this.bt,
                            startTime: this.times[0] ? this.times[0] : "",
                            endTime: this.times[1] ? this.times[1] : "",
                            yearParam: this.year,
                            lszt:this.lszt && this.lszt.length > 0 ? this.lszt[0] : ""
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    )
                    .then(({ data }) => {
                        this.showInfo=data.message
                    })
                    .finally(() => {
                     
                    })
            }
        },
        // 修改数据处理方法，根据 jointJsonArray 展开数据
        processTableData(rawData) {
            const expandedData = [];
            
            rawData.forEach((item, index) => {
            const jointArray = item.jointJsonArray || [];
            
            // 如果 jointJsonArray 为空或长度为0，添加一条记录
            if (jointArray.length === 0) {
                expandedData.push({
                ...item,
                _originalIndex: index,
                _jointIndex: 0,
                _jointTotal: 1,
                _qtbm: item.qtbm || '',
                _zrcs: item.zrcs || '',
                _jtrsqk: item.jtrsqk || '',
                _rsztText: item.rsztText || '',
                _jointRsztText: item.jointRsztText || ''
                });
            } else {
                // 根据 jointJsonArray 长度展开数据
                jointArray.forEach((jointItem, jointIndex) => {
                expandedData.push({
                    ...item,
                    _originalIndex: index,
                    _jointIndex: jointIndex,
                    _jointTotal: jointArray.length,
                    _qtbm: jointItem.qtbms || '',
                    _zrcs: jointItem.zrcs || '',
                    _jtrsqk: jointItem.jtrsqk || '',
                    _rsztText: jointItem.rsztText || '',
                    _jointRsztText: jointItem.jointRsztText || ''
                });
                });
            }
            });
            console.log(expandedData,"----");
            // 添加合并信息
            return this.addMergeInfo(expandedData);
        },
        
        // 添加合并信息
        addMergeInfo(data) {
            const mergedData = [...data];
            let i = 0;
            
            while (i < mergedData.length) {
            const currentRow = mergedData[i];
            
            // 只有第一个子项才需要设置 rowSpan
            if (currentRow._jointIndex === 0) {
                const total = currentRow._jointTotal;
                currentRow._jvgzrwyq_rowSpan = total;
                
                // 后续相同原始记录的行设置 rowSpan 为 0
                for (let j = 1; j < total; j++) {
                if (i + j < mergedData.length && mergedData[i + j]._originalIndex === currentRow._originalIndex) {
                    mergedData[i + j]._jvgzrwyq_rowSpan = 0;
                }
                }
                
                i += total;
            } else {
                i++;
            }
            }
            
            return mergedData;
        },
        fetchData() {
            this.loading = true
            let url = ''
            if(this.current ==='3'){
                url='ctrl/dbWorkbench/getUndertakeLeaderPadNoticeList'
            }else if(this.current ==='1'){    
                   url='ctrl/dbWorkbench/getLeaderPadFollowList'
            }else if(this.current ==='2'){
                url="ctrl/dbWorkbench/getUndertakeLeaderPadNoticeList"
            }
            console.log(this.l);
            window.IDM.http
                .post(
                    this.a + url,
                    {
                        ...this.query,
                        approvalTypeParam: this.leixing && this.leixing.length > 0 ? this.leixing[0] : null,
                        dbEjTypeParam: this.leixing && this.leixing.length > 1 ? this.leixing[1] : "",
                        pageNo: 1,
                        pageSize: 9999,
                        bt: this.bt,
                        startTime: this.times[0] ? this.times[0] : "",
                        endTime: this.times[1] ? this.times[1] : "",
                        yearParam: this.year,
                        lszt:this.lszt && this.lszt.length > 0 ? this.lszt[0] : ""
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(({ data }) => {
                    // this.data = data.data
                    // 对需要合并的列进行处理，例如 handlerUnitText 列
                     // 使用新的数据处理方法
                    this.data = this.processTableData(data.data);
                    console.log(this.data,"++++");
                })
                .finally(() => {
                    this.loading = false
                })
        },
        followHandle(record) {
            if (record.attentionstatus == 0) {
                this.record = record
                this.$emit('ishowCollect')
            } else {
                this.attentionReason = ''
                this.collectHandle(record)
            }
        },
        //确定收藏后调用此方法
        collectHandle(record) {
            window.IDM.http
                .post(this.a + 'ctrl/dbNotice/attention', {
                    ...this.params,
                    noticeId: record.id,
                    opType: this.attentionReason.length <= 0 ? 0 : 1,
                    attentionReason: this.attentionReason
                })
                .then(({ data }) => { })
            if (record.attentionstatus == 1) {
                record.attentionstatus = 0
            } else {
                record.attentionstatus = 1
            }
            this.$emit("closeCollect")
        },
        //点击具体工作和任务的详情
        jtgzrwHandle(record) {
            this.$emit('jtgzrw', record)
        },
        //之前点击标题的详情
        detailHandle(record) {
            // if (record.isApproval == 1) {
            //     this.$emit('detail', record, {
            //         ...this.query,
            //         // approvalTypeParam:this.leixing && this.leixing.length>0? this.leixing[0] :null,
            //         dbEjTypeParam: this.leixing && this.leixing.length > 1 ? this.leixing[1] : "",
            //         pageNo: 1,
            //         pageSize: 9999,
            //         bt: this.bt,
            //         startTime: this.times[0] ? this.times[0] : "",
            //         endTime: this.times[1] ? this.times[1] : "",
            //     })
            // } else {
            //     this.$emit('urge', record)
            // }
            let url =this.a+ `ctrl/formControl/sysForm?moduleId=240508144008KksWD26gkR8FDH07bfS&formId=240508144446G9V6RVMn48B03NtLByV&nodeId=-1&validateByList=1&listId=DbNoValidate&pk=${record.approvalId }`
            window.open(IDM.url.getWebPath(url))
        },
        urgeHandle(record) {
            // if (record.isApproval && record.isApproval == 1) {
            //     console.log(111111);
            //     console.log(record);
            //     this.$emit('detail', record, {
            //         ...this.query,
            //         approvalTypeParam: this.leixing && this.leixing.length > 0 ? this.leixing[0] : null,
            //         dbEjTypeParam: this.leixing && this.leixing.length > 1 ? this.leixing[1] : "",
            //         pageNo: 1,
            //         pageSize: 9999,
            //         bt: this.bt,
            //         startTime: this.times[0] ? this.times[0] : "",
            //         endTime: this.times[1] ? this.times[1] : "",
            //     })
            // } else {
            //     this.$emit('urge', record)
            // }
            this.$emit('urge', record)
        },
        
        //重置
        reset(){
            this.bt=""
            this.leixing=[]
            this.lszt=[]
            this.year=new Date().getFullYear()
            this.$nextTick(()=>{
                this.fetchStat()
                this.fetchData()
                this.getDbGkData()
            })
        }
    }
}
</script>
<style lang="scss">
.ant-cascader-menus {
    font-size: 2rem;

    .ant-cascader-menu-item {
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

.searchBox {
    display: flex;
    align-items: center;
    // position: absolute;
    // left: 0;

    &>div {
        margin-right: 2em;
    }

    .bt {
        display: flex;
        align-items: center;
        font-size: 2.38rem;
        color: #333333;

        &>span {
            white-space: nowrap;
        }

        ::v-deep .ant-input {
            width: 17em;
            height: 2.1em;
            font-size: 2rem;
            // color: #333333;
        }
    }

    .selectBox {
        display: flex;
        align-items: center;
        font-size: 2.38rem;
        color: #333333;

        &>span {
            white-space: nowrap;
        }

        ::v-deep .ant-select {
            width: 8em !important;
            height: 2.1em;
            font-size: 2rem;

            // color: #333333;
            .ant-select-selection--single {
                height: 2.1em;

                .ant-select-selection__rendered {
                    line-height: 2.1em;
                }
            }
        }

        ::v-deep .ant-cascader-picker {
            height: 2.1em;
            font-size: 2rem;

            .ant-cascader-input {
                height: 100%;
            }
        }
    }

    .selectBox2 {
        ::v-deep .ant-select {
            width: 5em !important
        }
    }

    .dateArray {
        display: flex;
        align-items: center;
        font-size: 2.38rem;
        color: #333333;

        ::v-deep .ant-calendar-picker {
            width: 18em;
            height: 2.5em;

            .ant-calendar-picker-input {
                height: 2.5em;

                .ant-calendar-range-picker-input {
                    font-size: 2rem !important;
                    color: #333333;
                }
            }
        }

    }

    .btn {
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
}</style>
