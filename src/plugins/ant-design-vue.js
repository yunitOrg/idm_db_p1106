import Vue from 'vue'
import 'ant-design-vue/lib/input/style/css';
import 'ant-design-vue/lib/select/style/css';
import 'ant-design-vue/lib/button/style/css';
import 'ant-design-vue/lib/date-picker/style/css';
import 'ant-design-vue/lib/time-picker/style/css';
import 'ant-design-vue/lib/icon/style/css';
import 'ant-design-vue/lib/spin/style/css';
import 'ant-design-vue/lib/modal/style/css';
import 'ant-design-vue/lib/collapse/style/css';
import 'ant-design-vue/lib/switch/style/css';
import 'ant-design-vue/lib/tooltip/style/css';
import 'ant-design-vue/lib/timeline/style/css';
import 'ant-design-vue/lib/table/style/css';
import 'ant-design-vue/lib/pagination/style/css';
import 'ant-design-vue/lib/empty/style/css';
import 'ant-design-vue/lib/popover/style/css';
import 'ant-design-vue/lib/row/style/css';
import 'ant-design-vue/lib/checkbox/style/css';
import 'ant-design-vue/lib/message/style/css';
import 'ant-design-vue/lib/radio/style/css';


import {
    Input,
    Select,
    Button,
    DatePicker,
    TimePicker,
    Icon,
    Spin,
    Modal,
    Popconfirm,
    message,
    Collapse,
    Switch,
    Tooltip,
    Timeline,
    ConfigProvider,
    Table,
    Pagination,
    Empty,
    Popover,
    Row,
    Checkbox,
    Radio,
} from 'ant-design-vue'

Vue.use(Input)
Vue.use(Select)
Vue.use(Button)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(Icon)
Vue.use(Spin)
Vue.use(Modal)
Vue.use(Popconfirm)
Vue.use(Collapse)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Timeline)
Vue.use(Table)
Vue.use(Pagination);
Vue.use(ConfigProvider);
Vue.use(Empty);
Vue.use(Popover);
Vue.use(Row);
Vue.use(Checkbox);
Vue.use(Radio);
Vue.prototype.$message = message;
