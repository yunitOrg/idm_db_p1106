<template>
    <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <div class="supervisebook">
            <div class="superviseTop super-mb20">
                <div>
                    <a-input v-model="search.contentQuery" placeholder="请输入检索内容" class="super-input h40">
                        <a-icon slot="suffix" type="search" class="super-searchicon" />
                    </a-input>
                    <a-button class="super-btn super-theme-btn h40" type="primary" @click="handleSearch">检索</a-button>
                    <a-button class="super-btn h40" @click="handleReset">重置</a-button>
                </div>
                <a-button class="super-btn h40" @click="handleExport" v-if="!propData.isMoOpen">导出</a-button>
            </div>
            <div class="superviseSearch super-mb10">
                <div class="super-middle" style="width: 25%">
                    <span class="super-mr10">编号</span>
                    <a-input v-model="search.whQuery" placeholder="请输入编号" allowClear class="super-inputbtn"></a-input>
                </div>
                <div class="super-middle" style="width: 20%" v-if="!propData.isMoOpen">
                    <span class="super-mr10">督办类型</span>
                    <a-select v-model="search.approvalType" allowClear style="width: 50%">
                        <a-select-option :value="item.value" v-for="(item, index) in superType" :key="index">
                            {{ item.text }}
                        </a-select-option>
                    </a-select>
                </div>
                <div class="super-middle" style="width: 20%">
                    <span class="super-mr10">项目状态</span>
                    <a-select v-model="search.dbStatus" allowClear style="width: 50%">
                        <a-select-option :value="item.value" v-for="(item, index) in superState" :key="index">
                            {{ item.text }}
                        </a-select-option>
                    </a-select>
                </div>
                <div class="super-middle" style="width: 40%">
                    <span class="super-mr10">立项日期</span>
                    <template v-if="propData.isMoOpen">
                        <a-config-provider :locale="locale">
                            <a-date-picker v-model="search.startDate" valueFormat="YYYY-MM-DD" />
                        </a-config-provider>
                        <span class="super-split">~</span>
                        <a-config-provider :locale="locale">
                            <a-date-picker v-model="search.endDate" valueFormat="YYYY-MM-DD" />
                        </a-config-provider>
                    </template>
                    <template v-else>
                        <a-config-provider :locale="locale">
                            <a-range-picker valueFormat="YYYY-MM-DD" @change="onChangeTime" v-model="search.dbTime" />
                        </a-config-provider>
                    </template>
                </div>
            </div>
            <template v-if="reload">
                <a-config-provider :locale="locale">
                    <a-table
                        ref="superTable"
                        :columns="columns"
                        :data-source="listData"
                        :pagination="false"
                        @expand="getInnerData"
                        @change="tableOnChange"
                        :loading="loading"
                        :expandIconAsCell="false"
                        :expandIconColumnIndex="1"
                        :locale="{ emptyText: '暂无数据' }"
                        expandRowByClick
                        :rowClassName="(record, index) => (index % 2 == 0 ? 'odd' : 'even')"
                        :scroll="{ y: propData.tableMaxHeight, x: propData.tableMaxWidth }"
                        :rowKey="(record, index) => record.id"
                        class="components-table-demo-nested"
                        :style="{
                            '--bodyHeight': propData.tableMaxHeight
                        }"
                    >
                        <!--状态-->
                        <span slot="dbStatusText" slot-scope="text, record">
                            <span v-if="record.timeoutStatus == '2'" class="subtask-table-red subtask-table-redborder">{{ record.timeoutStatusText }}</span>
                            <span
                                :class="{
                                    'subtask-table-gray': record.dbStatus == '2' || record.dbStatus == '3',
                                    'subtask-table-lan': record.dbStatus == '4',
                                    'subtask-table-green': record.dbStatus == '5',
                                    'subtask-table-red': record.dbStatus == '6'
                                }"
                            >
                                {{ text }}</span
                            >
                        </span>
                        <!--标题-->
                        <span slot="bt" slot-scope="text, record" @click.stop="handleJumpUrl(record)" class="super-decoration">
                            {{ text }}
                        </span>
                        <!--操作-->
                        <span slot="operation" slot-scope="record" @click.stop="(e) => {}" v-if="record.buttonList && record.buttonList.length">
                            <a-popover placement="bottomRight">
                                <template slot="content">
                                    <p v-for="(item, index) in record.buttonList" :key="index" @click="handleOptions({ item: item, fatherItem: record })">
                                        <span>{{ item.text }}</span>
                                    </p>
                                </template>
                                <img src="../assets//more.png" alt="" />
                            </a-popover>
                        </span>
                        <!--展开图标-->
                        <template slot="expandIcon">
                            <div style="display: inline-block">
                                <svg-icon icon-class="move" style="font-size: 18px; color: #134fed; cursor: pointer; margin-right: 3px"></svg-icon>
                            </div>
                        </template>
                        <!--展开内容-->
                        <template slot="expandedRowRender" slot-scope="record">
                            <div class="pervise-wrap">
                                <!--单项-->
                                <template v-if="record.isSingleTask == 1">
                                    <template v-if="record.contentSinglBook && record.contentSinglBook.length">
                                        <div class="pervise-single-wrap">
                                            <taskInfo
                                                :isMoOpen="propData.isMoOpen"
                                                :themeList="propData.themeList"
                                                :porpsList="record.contentSinglBook"
                                                @handleOptions="handleOptions"
                                                @handleContentJump="handleContentJump"
                                                @handleFileOpen="handleFileOpen"
                                            ></taskInfo>
                                        </div>
                                    </template>
                                    <template v-if="record.contentSinglBook.length == 0 && contentSinglBookFlag">
                                        <div class="pervise-kong">
                                            <a-empty :imageStyle="{ height: propData.emptySize + 'px' }" description="暂无数据"></a-empty>
                                        </div>
                                    </template>
                                </template>
                                <!--多项-->
                                <template v-else>
                                    <template v-if="record.contentMoreBook && record.contentMoreBook.length">
                                        <div class="task-ul" v-for="(item, index) in record.contentMoreBook" :key="index">
                                            <div class="task-li">
                                                <div class="task-li-box">
                                                    <div class="task-name" @click="handleShowList(item)">
                                                        <div class="task-li-title">
                                                            <span class="task-label">
                                                                <span class="task-red" v-if="item.timeoutStatusText && item.timeoutStatus != 0">{{ item.timeoutStatusText }}</span>
                                                                <span
                                                                    :class="{
                                                                        'task-gray': item.dbStatus == '1',
                                                                        'task-blue': item.dbStatus == '2',
                                                                        'task-green': item.dbStatus == '3',
                                                                        'task-red': item.dbStatus == '4'
                                                                    }"
                                                                    >{{ item.dbStatusText }}</span
                                                                >
                                                            </span>
                                                            <span class="task-center">
                                                                <template v-if="propData.isMoOpen">{{ index + 1 }}. </template>
                                                                {{ item[propData.contentFiled || 'taskDesc'] }}</span
                                                            >
                                                        </div>
                                                        <div class="task-subtitle">
                                                            <div class="task-subtitle-left">
                                                                <span>开始日期：{{ item.startDate }}</span>
                                                                <span>办理期限：{{ item.endDate }}</span>
                                                                <span>反馈周期：{{ item.feedbackPeriodText }}</span>
                                                            </div>
                                                            <div class="task-nameicon" style="font-size: 16px">
                                                                <!-- <svg-icon :icon-class="item.isShow ? 'hide-box' : 'show-box'" class="task-icon"></svg-icon> -->
                                                                <img :src="item.isShow ? handleJianImg() : handleJiaImg()" alt="" />
                                                            </div>
                                                        </div>
                                                        <div class="task-ban">
                                                            <div class="task-li-flex">
                                                                <span class="task-li-flex task-typeicon setflex" v-if="item.hostList && item.hostList.length">
                                                                    <img src="../assets/zhuban.png" alt="" class="task-ban-img" />
                                                                    <span
                                                                        v-for="(subitem, subindex) in item.hostList"
                                                                        :key="subindex"
                                                                        class="task-ban-span"
                                                                        :class="subitem.dbStatus <= 1 ? 'task-ban-gray' : 'task-ban-blue'"
                                                                    >
                                                                        {{ subitem.unitName }}
                                                                    </span>
                                                                </span>
                                                                <span
                                                                    style="display: flex; align-items: center; padding-left: 30px"
                                                                    class="task-typeicon"
                                                                    v-if="item.assistList && item.assistList.length"
                                                                >
                                                                    <img src="../assets/xieban.png" alt="" class="task-ban-img" />
                                                                    <span
                                                                        v-for="(subitem, subindex) in item.assistList"
                                                                        :key="subindex"
                                                                        class="task-ban-span"
                                                                        :class="subitem.dbStatus <= 1 ? 'task-ban-gray' : 'task-ban-blue'"
                                                                    >
                                                                        {{ subitem.unitName }}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="task-action">
                                                        <a-popover placement="bottomRight" v-if="item.buttonList && item.buttonList.length">
                                                            <template slot="content">
                                                                <p
                                                                    v-for="(subitem, index) in item.buttonList"
                                                                    :key="index"
                                                                    @click="handleOptions({ item: subitem, fatherItem: item })"
                                                                >
                                                                    <span>{{ subitem.text }}</span>
                                                                </p>
                                                            </template>
                                                            <!-- <svg-icon icon-class="detail" class="optionSvg"></svg-icon> -->
                                                            <img src="../assets//more.png" alt="" />
                                                        </a-popover>
                                                    </div>
                                                </div>
                                                <div class="pervise-single-wrap" v-if="item.isShow">
                                                    <taskInfo
                                                        :isMoOpen="propData.isMoOpen"
                                                        :themeList="propData.themeList"
                                                        :porpsList="singMoreShowData"
                                                        @handleOptions="handleOptions"
                                                        @handleContentJump="handleContentJump"
                                                        @handleFileOpen="handleFileOpen"
                                                    ></taskInfo>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-if="record.contentMoreBook.length == 0 && contentMoreBookFlag">
                                        <div class="pervise-kong">
                                            <a-empty :imageStyle="{ height: propData.emptySize + 'px' }" description="暂无数据"></a-empty>
                                        </div>
                                    </template>
                                </template>
                            </div>
                        </template>
                    </a-table>
                </a-config-provider>

                <div class="pagination" :style="`text-align: ${propData.paginationPostion}`">
                    <a-config-provider :locale="locale">
                        <a-pagination
                            v-model="search.pageNo"
                            :show-quick-jumper="propData.showSizeChanger"
                            show-size-changer
                            :default-current="1"
                            :showQuickJumper="propData.showQuickJumper"
                            :show-total="showTotalFormat"
                            :page-size.sync="search.pageSize"
                            :disabled="propData.disabledPagination"
                            :total="search.totalCount"
                            :pageSizeOptions="propData.pageSizeOptions ? propData.pageSizeOptions.split(',') : ['10', '20', '30', '40']"
                            @change="handlePageSize"
                            @showSizeChange="onShowSizeChange"
                        />
                    </a-config-provider>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import locale from 'ant-design-vue/es/locale/zh_CN'
import { getTableList } from '../utils/mock'
import taskInfo from '../commonComponents/taskInfo.vue' // 单任务
import API from '../api/index'
export default {
    name: 'ISuperviseBook',
    components: {
        taskInfo
    },
    data() {
        return {
            locale,
            tableRealMaxHeight: '',
            loading: false,
            contentSinglBookFlag: false,
            contentMoreBookFlag: false,
            search: {
                pageNo: 1,
                pageSize: 30,
                totalCount: 0,
                whQuery: '', // 编号
                contentQuery: '', // 检索内容
                approvalType: '', // 督办类型
                dbStatus: '', // 项目状态
                startDate: '', // 开始时间
                endDate: '', // 结束时间
                dbTime: [] // 立项日期
            },
            reload: true,
            singMoreShowData: [], // 多任务里面
            superType: [], // 督办类型数据
            superState: [], // 项目状态数据
            sortOrder: 'ascend', // 默认正序排序
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                emptySize: '100',
                isMoOpen: true,
                showQuickJumper: true,
                disabledPagination: false,
                paginationPostion: 'right',
                showSizeChanger: false,
                defaultPageSize: '30',
                tableMaxHeight: 'calc(100vh - 300px)',
                isSorte: true,
                pageSizeOptions: '10,20,30,40',
                showTotalFormat: '当前显示@[range[0]]-@[range[1]]，总共@[total]条',
                columnDeleteNameList: [
                    {
                        name: '督办类型'
                    },
                    {
                        name: '主办部门'
                    },
                    {
                        name: '协办部门'
                    }
                ],
                columnAddNameList: [
                    {
                        key: 7,
                        name: '承办部门',
                        field: 'hostStr'
                    }
                ],
                ulbox: {
                    marginTopVal: '',
                    marginRightVal: '',
                    marginBottomVal: '',
                    marginLeftVal: '',
                    paddingTopVal: '20px',
                    paddingRightVal: '20px',
                    paddingBottomVal: '20px',
                    paddingLeftVal: '20px'
                }
            },
            columns: [
                {
                    title: '序号',
                    key: 'index',
                    align: 'center',
                    width: '4%',
                    customRender: (column, recodrd, index) => {
                        return index + 1
                    }
                },
                {
                    title: '项目状态',
                    dataIndex: 'dbStatusText',
                    align: 'left',
                    key: 'dbStatusText',
                    width: '10%',
                    sortField: 'dbStatus',
                    scopedSlots: { customRender: 'dbStatusText' }
                },
                { title: '编号', dataIndex: 'wh', align: 'center', key: 'wh', width: '10%', sortField: 'wh' },
                { title: '标题', dataIndex: 'bt', align: 'center', key: 'bt', width: '20%', sortField: 'bt', scopedSlots: { customRender: 'bt' } },
                { title: '督办类型', dataIndex: 'approvalTypeText', align: 'center', key: 'approvalTypeText', width: '9%', sortField: 'approvalType' },
                { title: '立项日期', dataIndex: 'ngrq', align: 'center', key: 'ngrq', width: '9%', sortField: 'ngrq' },
                { title: '交办日期', dataIndex: 'handoverDate', align: 'center', key: 'handoverDate', width: '9%', sortField: 'handoverDate' },
                { title: '办结期限', dataIndex: 'endDate', align: 'center', key: 'endDate', width: '9%', sortField: 'endDate' },
                { title: '主办部门', dataIndex: 'hostStr', align: 'center', key: 'hostStr', width: '8%' },
                { title: '协办部门', dataIndex: 'assistStr', align: 'center', key: 'assistStr', width: '8%' },
                { title: '操作', key: 'operation', align: 'center', width: '100px', scopedSlots: { customRender: 'operation' } }
            ],
            listData: [],
            expandedRowKeys: []
        }
    },
    mounted() {
        this.addSorteField()
        this.moduleObject = this.$root.moduleObject
        this.search.pageSize = this.propData.defaultPageSize

        this.handleSuperSelectData(1, 'superType')
        this.handleSuperSelectData(2, 'superState')
        this.init()
        window.ISuperviseBook = {
            initData: this.initData
        }
        // 增加列
        if (this.propData.columnDeleteNameList && this.propData.columnDeleteNameList.length > 0) {
            this.columns = this.columns.filter((item) => {
                return !this.propData.columnDeleteNameList.map((item) => item.name).includes(item.title)
            })
        }
        // 删除列
        if (this.propData.columnAddNameList && this.propData.columnAddNameList.length > 0) {
            this.propData.columnAddNameList.forEach((item) => {
                let obj = { title: item.name, dataIndex: item.field, align: 'center', key: item.field }
                this.columns.splice(item.key, 0, obj)
            })
        }
        // 加工列
        if (this.propData.handleTableColumn && this.propData.handleTableColumn.length > 0) {
            let name = this.propData.handleTableColumn[0].name
            this.columns =
                window[name] &&
                window[name].call(this, {
                    _this: this,
                    columns: this.columns
                })
        }
    },
    methods: {
        addSorteField() {
            let ary = ['dbStatusText', 'wh', 'bt', 'approvalTypeText', 'ngrq', 'handoverDate', 'endDate']
            this.columns.forEach((item) => {
                if (this.propData.isSorte && ary.includes(item.dataIndex)) {
                    item.sorter = true
                }
            })
        },
        handleJiaImg() {
            return IDM.url.getModuleAssetsWebPath(require('../assets/jia.png'), this.moduleObject)
        },
        handleJianImg() {
            return IDM.url.getModuleAssetsWebPath(require('../assets/jian.png'), this.moduleObject)
        },
        // 排序
        tableOnChange(pagination, filters, sorter) {
            if (this.propData.isSorte) {
                if (sorter.order) {
                    this.search.orderType = sorter.column.sortField
                    this.search.reversed = sorter.order != 'ascend'
                    this.sortOrder = sorter.order
                    this.initData()
                }
            }
        },
        // 附件跳转
        handleFileOpen(item) {
            if (this.propData.handleFileFunc && this.propData.handleFileFunc.length > 0) {
                let name = this.propData.handleFileFunc[0].name
                window[name] &&
                    window[name].call(this, {
                        _this: this,
                        item: item
                    })
            } else {
                if (top.Public) {
                    // 使用public.js调用方法
                    top.Public.officeLook(item.fileName, item.id, '', true, { officeModuleId: 'skyDrive' })
                }
            }
        },
        // 子项跳转
        handleContentJump(item) {
            if (this.propData.handleChildFunc && this.propData.handleChildFunc.length > 0) {
                let name = this.propData.handleChildFunc[0].name
                window[name] &&
                    window[name].call(this, {
                        _this: this,
                        item: item
                    })
            } else {
                window.open(item.lastFeedbackUrl)
            }
        },
        // 切换时间
        onChangeTime(date) {
            this.search.startDate = date.length > 0 ? date[0] : ''
            this.search.endDate = date.length > 0 ? date[1] : ''
        },
        // 督办类型选择
        async handleSuperSelectData(type, result) {
            let res = type == 1 ? await API.ApiPprovalTypeSelect() : await API.ApiDbStatusSelect()
            if (res.code == '200') {
                this[result] = res.data
            }
        },
        // 刷新列表
        refreshTable() {
            this.expandedRowKeys = []
            this.reload = false
            setTimeout(() => {
                this.reload = true
            }, 200)
        },
        // 搜索
        handleSearch() {
            this.refreshTable()
            this.initData()
        },
        // 导出
        handleExport() {
            if (this.propData.handleBtnExport && this.propData.handleBtnExport.length > 0) {
                let name = this.propData.handleBtnExport[0].name
                window[name] &&
                    window[name].call(this, {
                        _this: this,
                        search: this.search
                    })
            }
        },
        // 重置
        handleReset() {
            this.search.pageNo = 1
            this.search.pageSize = 30
            this.search.whQuery = ''
            this.search.contentQuery = ''
            this.search.approvalType = ''
            this.search.dbStatus = ''
            this.search.startDate = ''
            this.search.endDate = ''
            this.search.dbTime = []
            this.handleSearch()
        },
        /**
         * 类别转换 预转换
         * @param pk 源文件ID
         * @param convertId 转换规则ID
         */
        changeFileByConvert(sourcePk, convertId, urlParam) {
            window.IDM.http.post(
                'ctrl/convert/moduleRuleConvert',
                {
                    convertId: convertId, //指定转换的类型
                    initDataSource: 1, // 0：转换后的数据直接存到数据库 1：转换后的数据存到redis中
                    srcInfo: sourcePk //原来数据的主键
                },
                function (result) {
                    if ('success' == result.type) {
                        var data = result.data
                        var url =
                            window.DSF.getURLRoot() + 'ctrl/formControl/form?moduleId=' + data.moduleId + '&pk=' + data.pk + '&sourcePk=' + sourcePk + '&relationId=' + sourcePk
                        url += '&initDataSource=1' //增加初始化
                        if (urlParam !== undefined) {
                            url += urlParam
                        }
                        window.open(url)
                        // simpleWin(this, {"url": url, "isfresh": true, "name": result.data.moduleName});
                    } else {
                        // layuiError(result.message)
                    }
                }
            )
        },
        // 操作项
        handleOptions(obj) {
            if (this.propData.handleActionFunc && this.propData.handleActionFunc.length > 0) {
                let name = this.propData.handleActionFunc[0].name
                window[name] &&
                    window[name].call(this, {
                        _this: this,
                        option: obj
                    })
            } else {
                // 一般不会进入else 都会有处理函数
                let { item, fatherItem } = obj
                switch (item.value) {
                    case 'approval_terminate': // 立项办结
                        this.changeFileByConvert(fatherItem.id, '240517100312L9QgULGuY1BqbsvLY6n', `&fid=${fatherItem.id}&sourceType=1`)
                        break
                    case 'task_urge':
                        {
                            // 任务催办
                            let id = ''
                            if (fatherItem.isSingleTask == 1) {
                                // 单任务立项
                                id = fatherItem.taskId
                            } else {
                                id = fatherItem.id
                            }
                            let url = `ctrl/formControl/sysForm?moduleId=240509093547WwIEk66utTYmu3WTy1a&formId=240510102244FeFxPwYSdJ9pr1bPILG&nodeId=0&fid=${id}&sourceType=2`
                            url && window.open(url)
                        }
                        break
                    case 'task_terminate': // 任务办结
                        this.changeFileByConvert(fatherItem.fid, '240517100312L9QgULGuY1BqbsvLY6n', `&fid=${fatherItem.id}&sourceType=2`)
                        break
                    case 'notice_urge':
                        {
                            // 通知催办
                            let url = `ctrl/formControl/sysForm?moduleId=240509093547WwIEk66utTYmu3WTy1a&formId=240510102244FeFxPwYSdJ9pr1bPILG&nodeId=0&fid=${fatherItem.id}&sourceType=3`
                            url && window.open(url)
                        }
                        break
                }
            }
        },
        // 显示分页总数
        showTotalFormat(total, range) {
            if (this.propData.showTotalFormat && IDM.express) {
                return IDM.express.replace.call(this, this.propData.showTotalFormat, { total, range })
            } else {
                return false
            }
        },
        // 点击标题跳转url
        handleJumpUrl(recodrd) {
            if (this.propData.handleTableFunc && this.propData.handleTableFunc.length > 0) {
                let name = this.propData.handleTableFunc[0].name
                window[name] &&
                    window[name].call(this, {
                        _this: this,
                        item: recodrd
                    })
            }
        },
        // table 展开子表格
        async getInnerData(expanded, recodrd) {
            if (expanded) {
                this.handleOpenChildTable(recodrd)
            }
        },
        // 子项展开收缩
        async handleShowList(item) {
            if (!item.isShow) {
                let res = await API.ApiGetMsgApproval({ taskId: item.id })
                if (res.code == '200') {
                    this.singMoreShowData = res.data
                }
            }
            if (this.propData.accordion == 'show') {
                // 只展示一个
                this.list.forEach((k) => {
                    if (k.key == item.key) {
                        item.isShow = !item.isShow
                    } else {
                        k.isShow = false
                    }
                })
            } else {
                item.isShow = !item.isShow
            }
        },
        onExpand(key, props) {
            if (props.expanded) {
                // 收缩
                this.expandedRowKeys = this.expandedRowKeys.filter((item) => item != key)
            } else {
                // 展开
                this.expandedRowKeys = [...this.expandedRowKeys, key]
                this.handleOpenChildTable(props.record)
            }
        },
        // 打开子表
        async handleOpenChildTable(recodrd) {
            let res = {}
            // isSingleTask:1 单任务 否则多任务
            if (recodrd.isSingleTask == 1) {
                res = await API.ApiGetMsgApproval({ taskId: recodrd.taskId })
                if (res.code == '200') {
                    let ary = res.data
                    recodrd.contentSinglBook = ary
                    this.$nextTick(() => {
                        if (recodrd.contentSinglBook.length == 0) {
                            this.contentSinglBookFlag = true
                        }
                    })
                }
            } else {
                res = await API.ApigetTaskApproval({ approvalId: recodrd.id })
                let ary = res.data
                if (ary && ary.length > 0) {
                    ary.forEach((item) => {
                        this.$set(item, 'isShow', false)
                    })
                }
                recodrd.contentMoreBook = ary
                this.$nextTick(() => {
                    if (recodrd.contentMoreBook.length == 0) {
                        this.contentMoreBookFlag = true
                    }
                })
            }
        },
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {}
            this.init()
        },
        /**
         * @Desc 设置主题
         */
        convertThemeListAttrToStyleObject() {
            var themeList = this.propData.themeList
            if (!themeList) {
                return
            }
            const themeNamePrefix = IDM.setting && IDM.setting.applications && IDM.setting.applications.themeNamePrefix ? IDM.setting.applications.themeNamePrefix : 'idm-theme-'
            for (var i = 0; i < themeList.length; i++) {
                var item = themeList[i]
                let bulletBgColorObj = {
                    color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
                }
                let timeDateStyle = {
                    'border-left-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
                }
                let btnThemeObj = {
                    'background-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : '',
                    'border-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
                }

                IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} #${this.moduleObject.id || 'module_demo'} .supervisebook .super-theme-btn`, btnThemeObj)
                // IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} #${(this.moduleObject.id || "module_demo")} .supervisebook .super-decoration`, bulletBgColorObj)
            }
        },
        /**
         * 通用的url参数对象
         * 所有地址url参数转换
         */
        commonParam() {
            let urlObject = IDM.url.queryObject()
            return {
                pageId: window.IDM.broadcast && window.IDM.broadcast.pageModule ? window.IDM.broadcast.pageModule.id : '',
                urlData: JSON.stringify(urlObject)
            }
        },
        handleStyle() {
            let styleObject = {},
                liObject = {},
                svgObject = {},
                titleObject = {},
                timeRightObj = {},
                timeLiObject = {},
                timeFontObject = {},
                timeContentObject = {},
                timeBorderStyle = {},
                timeLeftRightObject = {}
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key]
                    if (!element && element !== false && element != 0) {
                        continue
                    }
                    switch (key) {
                        case 'width':
                            styleObject['width'] = element
                            break
                        case 'height':
                            styleObject['height'] = element
                            break
                        case 'ulbox':
                            IDM.style.setBoxStyle(styleObject, element)
                            break
                        case 'bgColor':
                            styleObject['background-color'] = element && element.hex8
                            break
                        case 'boxShadow':
                            styleObject['box-shadow'] = element
                            break
                        case 'boxborder':
                            IDM.style.setBorderStyle(styleObject, element)
                            break
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .supervisebook', styleObject)
        },
        getMockData() {
            this.listData = getTableList()
        },
        handlePageSize(page, pageSize) {
            this.search.pageNo = page
            this.refreshTable()
            this.initData()
        },
        onShowSizeChange(current, size) {
            this.search.pageNo = current
            this.search.pageSize = size
            this.refreshTable()
            this.initData()
        },
        handleDomHeight({ height }) {
            let span = document.createElement('span')
            let result = {}
            result.width = span.offsetWidth
            result.height = span.offsetHeight
            span.style.display = 'inline-block'
            span.style.visibility = 'hidden'
            span.style.height = height
            document.body.appendChild(span)
            result.width = span.offsetWidth
            result.height = span.offsetHeight
            span.parentNode?.removeChild(span)
            return result
        },
        // 查看表格是否添加滚动条
        handleTableScrollHeight() {
            this.$nextTick(() => {
                let table = this.$refs.superTable?.$el
                let tableContent = table.querySelector('.ant-table-body')
                let expectHeight = this.handleDomHeight({ height: this.propData.tableMaxHeight }),
                    realHeight = tableContent.offsetHeight
                if (realHeight > expectHeight.height) {
                    this.tableRealMaxHeight = this.propData.tableMaxHeight
                }
            })
        },
        async initData() {
            // if (this.moduleObject.env !== 'production') {
            //   this.getMockData()
            //   return
            // }
            this.loading = true
            if (this.propData.handleFieldFunc && this.propData.handleFieldFunc.length > 0) {
                let name = this.propData.handleFieldFunc[0].name
                let obj =
                    window[name] &&
                    window[name].call(this, {
                        _this: this,
                        search: this.search
                    })
                this.search = Object.assign({}, obj, this.search)
            }
            let res = await API.ApiGetDBList(this.search)
            if (res.code == '200') {
                this.loading = false
                let data = res || {}
                if (this.propData.hanldeInterfaceFunc && this.propData.hanldeInterfaceFunc.length > 0) {
                    let name = this.propData.hanldeInterfaceFunc[0].name
                    data =
                        window[name] &&
                        window[name].call(this, {
                            _this: this,
                            data: data
                        })
                }
                this.search.totalCount = data.count
                this.listData = data.data
                if (this.listData && this.listData.length > 0) {
                    this.listData.forEach((item) => {
                        this.$set(item, 'contentMoreBook', [])
                        this.$set(item, 'contentSinglBook', [])
                    })
                }
                // this.handleTableScrollHeight();
            }
        },
        init() {
            this.handleStyle()
            this.convertThemeListAttrToStyleObject()
            this.initData()
        }
    }
}
</script>

<style lang="scss">
.supervisebook {
    .ant-table {
        border: 1px solid #e8e8e8;
        border-radius: 3px;
    }
    .subtaskinfo {
        .subtask-li {
            border-top: 1px dashed #ccc;
        }
        .subtask-li:first-child {
            border: 0;
        }
    }
    .pervise-kong {
        padding: 10px;
    }
}
.ant-popover-placement-bottomRight {
    width: 100px !important;
    text-align: center !important;
}
.ant-popover-inner-content {
    padding: 0 !important;
    p {
        padding: 5px 16px !important;
        margin-bottom: 0 !important;
        cursor: pointer !important;
    }
    p:hover {
        background-color: rgba(0, 0, 0, 0.1) !important;
    }
    p + p {
        margin-top: 10px !important;
    }
}
.pervise-single-wrap {
    padding: 0 0 0 30px;
    .taskInfo-li {
        position: relative;
    }
    .taskInfo-li + .taskInfo-li {
        &::after {
            content: '';
            width: calc(100% - 30px);
            height: 1px;
            border-top: 1px dotted #ccc;
            position: absolute;
            top: 0;
            box-sizing: border-box;
            left: 0;
        }
    }
}
.super-inputbtn {
    width: 200px !important;
    margin-right: 20px !important;
}
.super-input {
    width: 200px !important;
    margin-right: 20px !important;
    input {
        height: 40px !important;
    }
}
</style>

<style lang="scss" scoped>
.supervisebook {
    ::v-deep .ant-table-thead > tr > th {
        color: #333 !important;
        font-size: 16px !important;
        font-weight: bold !important;
        padding: 10px 10px !important;
        background-color: #f6fbfa !important;
    }
    ::v-deep .ant-table-tbody .odd {
        cursor: pointer;
    }
    ::v-deep .ant-table-tbody .even {
        background-color: #f6fbfa;
        cursor: pointer;
    }
    ::v-deep .ant-table-tbody > tr > td {
        color: #333333;
        font-size: 16px;
        font-weight: 500;
    }
    ::v-deep .ant-table-thead > tr > th:nth-child(2) {
        text-align: center !important;
    }
    ::v-deep .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
        background: none !important;
    }

    /*
* 滚动条设置
*/
    // ::v-deep .ant-table-body::-webkit-scrollbar {
    //   width: 4px;
    //   height: 4px;
    // }
    // ::v-deep .ant-table-body::-webkit-scrollbar-thumb {
    //   background-color: #ccc;
    // }
    // ::v-deep .ant-table-body::-webkit-scrollbar-thumb {
    //   min-height: 18px;
    //   border-radius: 4px;
    // }
    .superviseTop {
        display: flex;
        justify-content: space-between;
    }
    .super-split {
        padding: 0 5px;
    }
    .super-decoration {
        color: #2673d3;
        text-align: left;
        width: 100%;
        display: inline-block;
        &:hover {
            text-decoration: underline;
        }
    }
    .subtask-table-gray {
        color: #cccccc;
    }
    .subtask-table-lan {
        color: #0086d9;
    }
    .subtask-table-red {
        color: #e30000;
    }
    .subtask-table-green {
        color: #57bd6a;
    }
    .subtask-table-redborder {
        background-color: rgb(227 0 0 / 10%);
        border: 1px solid #e30000;
        padding: 2px 5px;
        margin-right: 5px;
        border-radius: 3px;
    }
    .super-searchicon {
        font-size: 18px;
        line-height: 40px;
        display: flex;
    }
    .super-middle {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
    .super-mr10 {
        color: #333333;
        margin-right: 20px;
        font-size: 16px;
        font-weight: 500;
    }
    .h40 {
        height: 40px;
    }
    .super-mb20 {
        margin-bottom: 20px;
    }
    .super-mb10 {
        margin-bottom: 10px;
    }
    .super-btn {
        width: 80px;
        font-size: 16px;
    }
    .super-btn + .super-btn {
        margin-left: 10px;
    }
    .superviseSearch {
        display: flex;
        background-color: #f5f5f5;
        padding: 5px 0;
    }
    .optionSvg {
        font-size: 18px;
        &:focus {
            border: 0;
            outline: none;
        }
    }
    .pagination {
        margin: 10px 0 0 0;
    }
    .pervise-wrap {
        border-radius: 2px;
        margin: -8px;
        background-color: #fff;
    }
}
.task-ul + .task-ul {
    margin-top: 10px;
}
.task-li {
    transition: all 1s ease-in-out;
    border: 1px solid #e8e8e8;
    .task-li-box {
        position: relative;
        display: flex;
        justify-content: space-between;
        background-color: #eeeeee;
        padding: 10px 15px;
        cursor: pointer;
    }
    .task-name {
        display: flex;
        flex-direction: column;
        width: 93%;
    }
    .task-li-title {
        .task-center {
            word-wrap: break-word;
            color: #333333;
            font-weight: bold;
        }
    }
    .task-action {
        width: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        // padding-right: 25px;
    }
    .task-li-flex {
        display: flex;
        align-items: center;
    }
    .setflex {
        flex-wrap: wrap;
    }
    .task-ban {
        margin-top: 5px;
    }
    .task-ban-img {
        width: 16px;
        height: 16px;
        margin-right: 7px;
    }
    .task-ban-span {
        padding: 2px 6px;
        border-radius: 3px;
        margin: 3px 5px 3px 3px;
        font-size: 14px;
    }
    .task-ban-gray {
        color: #666666;
        background-color: rgb(102 102 102 / 10%);
    }
    .task-ban-blue {
        color: #0086d9;
        background-color: rgb(0 134 217 / 10%);
    }
    .task-typeicon {
        background-color: #fff;
        padding: 5px;
        border-radius: 3px;
    }
    .task-subtitle {
        padding-top: 5px;
        display: flex;
        span + span {
            margin-left: 5%;
        }
        .task-subtitle-left {
            width: 100%;
            span {
                color: #666;
            }
        }
        .task-nameicon {
            position: absolute;
            right: 130px;
            top: 50%;
            transform: translateY(-50%);
            img {
                width: 18px;
                height: 18px;
            }
        }
    }
    .task-label {
        span {
            padding: 2px 5px;
            margin-right: 5px;
            border-radius: 3px;
        }
        .task-gray {
            background-color: rgb(204 204 204 / 10%);
            color: #cccccc;
            border: 1px solid #cccccc;
        }
        .task-blue {
            background-color: rgb(0 134 217 / 10%);
            color: #0086d9;
            border: 1px solid #0086d9;
        }
        .task-green {
            background-color: rgb(87 189 106 / 10%);
            color: #57bd6a;
            border: 1px solid #57bd6a;
        }
        .task-red {
            background-color: rgb(227 0 0 / 10%);
            color: #e30000;
            border: 1px solid #e30000;
        }
        .task-cheng {
            background-color: #ffffff;
            color: #ffba00;
            border: 1px solid #ffba00;
        }
    }
}
:deep(.ant-table) {
    .ant-table-header,
    .ant-table-body {
        scrollbar-gutter: stable;
    }
    .ant-table-body {
        height: var(--bodyHeight);
        overflow-y: auto !important;
    }
}
</style>
