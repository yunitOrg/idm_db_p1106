<template>
  <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
  <div
    idm-ctrl="idm_module"
    :id="moduleObject.id"
    :idm-ctrl-id="moduleObject.id"
  >
    <div class="superviseprojectstat">
      <div class="project-search mbt20">
        <span class="project-span">立项时间：</span>
        <a-config-provider :locale="locale">
          <a-range-picker
            ref="picker"
            :placeholder="['开始时间', '结束时间']"
            format="YYYY-MM"
            :mode="mode"
            :value="search.time"
            allowClear
            @panelChange="handlePanelChange2"
            @change="handleTimeChange"
          >
          </a-range-picker>
        </a-config-provider>
        <template v-if="propData.keyWrod">
          <span class="project-span ml20">关键字：</span>
          <!-- <a-input v-model="search.extKeyword" style="width:200px" placeholder="请输入" allow-clear></a-input> -->
           <a-select
            v-model="search.extKeyword"
            show-search
            allowClear
            placeholder="请选择关键字"
            option-filter-prop="children"
            style="width: 200px"
            :filter-option="filterOption"
           >
            <a-select-option v-for="(item, index) in keywrodlist" :key="index" :value="item.value">{{ item.text }}</a-select-option>
           </a-select>
        </template>
        <a-button class="super-btn super-theme-btn h40" type="primary" @click="handleSearch">查询</a-button>
        <a-button class="super-btn h40" @click="handleReset">导出</a-button>
      </div>
      <a-table
        ref="superTable"
        :columns="columns"
        :data-source="data"
        :locale="{emptyText: '暂无数据'}"
        :scroll="{ y: tableRealMaxHeight }"
        :rowKey="(record, index) => (record.monthFormat)"
        bordered
        :pagination="false"
      />
      <div class="pagination" v-if="propData.papShow">
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
            :pageSizeOptions="propData.pageSizeOptions?propData.pageSizeOptions.split(','):['10', '20', '30', '40']"
            @change="handlePageSize"
            @showSizeChange="onShowSizeChange"
          />
        </a-config-provider>
      </div>
    </div>
  </div>
</template>

<script>
import locale from 'ant-design-vue/es/locale/zh_CN';
import API from '../api/index'
import moment from "moment";
import { openWindow } from '../utils/index'
export default {
  name: 'ISuperviseProjectStat',
  data() {
    return {
      locale,
      moduleObject: {},
      tableRealMaxHeight: '',
      data: [],
      mode: ['month', 'month'],
      keywrodlist: [],
      search: {
        pageNo: 1,
        pageSize: 30,
        totalCount: 0,
        extKeyword: '',
        startDate: `${moment().format('YYYY')}-01`,
        endDate: moment().format('YYYY-MM'),
        time: [moment(`${moment().format('YYYY')}-01`, 'YYYY-MM'), moment(moment().format('YYYY-MM'))]
      },
      propData: this.$root.propData.compositeAttr || {
        keyWrod: true,
        disabledPagination: false,
        showSizeChanger: false,
        showQuickJumper: true,
        papShow: false,
        tableHeightFlag: false,
        tableMaxHeight: 'calc(100vh - 300px)',
        pageSizeOptions: '10,20,30,40',
        showTotalFormat: '当前显示@[range[0]]-@[range[1]]，总共@[total]条',
      },
      columns: [
        {
          title: '月份',
          dataIndex: 'monthFormat',
          key: 'monthFormat',
          align: 'center'
        },
        {
          title: '立项数',
          dataIndex: 'projectAmount',
          key: 'projectAmount',
          align: 'center'
        },
        {
          title: '在办数',
          align: 'center',
          children: [
            {
              title: '逾期办理数',
              dataIndex: 'prOverDueAmount',
              key: 'prOverDueAmount',
              align: 'center',
            },
            {
              title: '按期办理数',
              dataIndex: 'prOnTimeAmount',
              key: 'prOnTimeAmount',
              align: 'center',
            }
          ]
        },
        {
          title: '办结数',
          children: [
            {
              title: '逾期办结数',
              dataIndex: 'fnOverDueAmount',
              key: 'fnOverDueAmount',
              align: 'center',
            },
            {
              title: '按期办结数',
              dataIndex: 'fnOnTimeAmount',
              key: 'fnOnTimeAmount',
              align: 'center',
            }
          ]
        },
        {
          title: '办结率',
          dataIndex: 'fnRate',
          key: 'fnRate',
          align: 'center',
        },
        {
          title: '终止',
          dataIndex: 'terminatedAmount',
          key: 'terminatedAmount',
          align: 'center',
        }
      ]
    }
  },
  mounted() {
    this.moduleObject = this.$root.moduleObject;
    this.init();
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    // 导出
    handleReset() {
      let url = `/ctrl/dbStatistics/project/export?startDate=${this.search.startDate}&endDate=${this.search.endDate}&extKeyword=${this.search.extKeyword}`
      openWindow(url)
    },
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.init()
    },
    handleTimeChange(value) {
      if (value.length == 0) {
        this.search.startDate = ''
        this.search.endDate = ''
      }
    },
    handlePanelChange2(value, mode) {
      this.mode = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]];
      if (this.search.time[1] && this.search.time[1]._d != value[1]._d) {
        this.$refs['picker'].$refs.picker.sOpen=false
      }
      this.search.time = value
      this.search.startDate = value[0].format('YYYY-MM');
      this.search.endDate = value[1].format('YYYY-MM');
    },
    handlePageSize(page, pageSize) {
      this.search.pageNo = page;
      this.initData()
    },
    onShowSizeChange(current, size) {
      this.search.pageNo = current;
      this.search.pageSize = size;
      this.initData()
    },
    // 查询
    handleSearch() {
      this.initData()
    },
    /**
     * @Desc 设置主题
     */
     convertThemeListAttrToStyleObject() {
      var themeList = this.propData.themeList;
      if (!themeList) {
          return
      }
      const themeNamePrefix =
          IDM.setting && IDM.setting.applications && IDM.setting.applications.themeNamePrefix
              ? IDM.setting.applications.themeNamePrefix
              : 'idm-theme-'
      for (var i = 0; i < themeList.length; i++) {
        var item = themeList[i]
        let btnThemeObj = {
          'background-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : '',
          'border-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
        }
        IDM.setStyleToPageHead(`.${themeNamePrefix}${item.key} #${(this.moduleObject.id || "module_demo")} .superviseprojectstat .super-theme-btn`, btnThemeObj)
      }
    },
    handleStyle() {
      let styleObject = {};
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key]
          if (!element && element !== false && element != 0) {
            continue
          }
          switch (key) {
            case 'width':
              styleObject['width'] = element;
              break
            case 'height':
              styleObject['height'] = element;
              break
            case 'ulbox':
              IDM.style.setBoxStyle(styleObject, element)
              break
            case 'bgColor':
              styleObject['background-color'] = element && element.hex8;
              break
            case 'boxShadow':
              styleObject['box-shadow'] = element;
              break
            case 'boxborder':
              IDM.style.setBorderStyle(styleObject, element);
              break
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .superviseprojectstat", styleObject);
    },
    handleDomHeight({height}) {
      let span = document.createElement('span')
      let result = {}
      result.width = span.offsetWidth;
      result.height = span.offsetHeight;
      span.style.display = 'inline-block';
      span.style.visibility = 'hidden';
      span.style.height = height
      document.body.appendChild(span)
      result.width = span.offsetWidth
      result.height = span.offsetHeight;
      span.parentNode?.removeChild(span)
      return result
    },
    // 查看表格是否添加滚动条
    handleTableScrollHeight() {
      this.$nextTick(() => {
        let table = this.$refs.superTable?.$el
        let tableContent = table.querySelector('.ant-table-body')
        let expectHeight = this.handleDomHeight({height: this.propData.tableMaxHeight}),
          realHeight = tableContent.offsetHeight;
        if (realHeight > expectHeight.height) {
          this.tableRealMaxHeight = this.propData.tableMaxHeight
        }
        if (this.propData.tableHeightFlag) {
          tableContent.style.height = this.propData.tableMaxHeight
          let styleObject = {
            border: '1px solid #e8e8e8',
            'border-top-color': 'transparent',
          }
          let styleleft = {
            'border-left-color': 'transparent',
          }
          let styleright = {
            'border-right-color': 'transparent'
          }
          window.IDM.setStyleToPageHead(this.moduleObject.id + " .ant-table-body", styleObject);
          window.IDM.setStyleToPageHead(this.moduleObject.id + " .ant-table-content table", styleleft);
          window.IDM.setStyleToPageHead(this.moduleObject.id + " .ant-table-content thead th:last-child", styleright);
          window.IDM.setStyleToPageHead(this.moduleObject.id + " .ant-table-content tbody tr td:last-child", styleright);
        }
      })
    },
    async initData() {
      let params = {};
      if (this.propData.handleTableParams && this.propData.handleTableParams.length > 0) {
          let name = this.propData.handleTableParams[0].name
          params = window[name] && window[name].call(this, {
            _this: this,
            search: this.search,
            keywrodlist: this.keywrodlist
          });
        }
      if (this.propData.dataSourceForm) {
        let obj = Object.assign({}, this.search, params);
        IDM.datasource.request(this.propData.dataSourceForm[0]?.id, {
          moduleObject: this.moduleObject,
          param: {
            ...obj
          }
          }, (data) => {
            this.data = data;
            this.handleTableScrollHeight()
        })
      } else {
        let obj = Object.assign({}, this.search, params);
        let res = await API.ApiDbstatisProjectList(obj)
        if (res.code == '200') {
          this.data = res.data || []
          this.handleTableScrollHeight()
        }
      }
      // 关键字
      if (this.propData.keyWorddataSource) {
        IDM.datasource.request(this.propData.keyWorddataSource[0]?.id, {
          moduleObject: this.moduleObject,
          }, (data) => {
            this.keywrodlist = data;
        })
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

<style lang="scss" scoped>
.superviseprojectstat{
  ::v-deep .ant-table-thead > tr >th {
    color: #333 !important;
    font-size: 16px !important;
    font-weight: bold !important;
    padding: 10px 10px !important;
    background-color: #F6FBFA !important;
  }
  ::v-deep .ant-table-tbody tr:nth-child(2n) {
    background-color: #F6FBFA;
  }
  .mbt20{
    margin-bottom: 20px;
  }
  .ml20{
    margin-left: 20px;
  }
  .h40{
    height: 40px;
  }
  .project-span{
    color: #333;
    font-size: 16px;
  }
  .super-btn{
    width: 80px;
    font-size: 16px;
  }
  .super-btn:first-of-type{
    margin-left: 20px;
  }
  .super-btn+.super-btn{
    margin-left: 10px;
  }
  .pagination{
    margin: 20px 0;
    text-align: center;
  }
}
</style>
