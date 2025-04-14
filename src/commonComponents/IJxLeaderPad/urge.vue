<template>
    <div class="h-full flex flex-col urge-warp">
        <div class="flex justify-center header">
            <div @click="closeHandle" class="pointer btn-back"></div>
            <div class="caption">催办通知</div>
        </div>
        <div class="flex-1 h-0 overflow-auto">
            <div class="group-wrap">
                <div class="group-title">立项信息</div>
                <table class="urge-table">
                    <tr>
                        <th>标题</th>
                        <td>{{ data.approvalBt }}</td>
                        <th>编号</th>
                        <td>{{ data.approvalWh }}</td>
                    </tr>
                    <tr>
                        <th>督办类型</th>
                        <td>{{ data.approvalTypeInfo }}</td>
                        <th>重要程度</th>
                        <td>{{ data.approvalImportantText }}</td>
                    </tr>
                    <tr>
                        <th>督办依据</th>
                        <td colspan="3">{{ data.approvalGist }}</td>
                    </tr>
                    <tr>
                        <th>主办部门</th>
                        <td>{{ data.handlerUnitText }}</td>
                        <th>办理方式</th>
                        <td>{{ data.assignTypeText }}</td>
                    </tr>
                </table>
            </div>
            <div class="group-wrap">
                <div class="group-title">催办信息</div>
                <table class="urge-table">
                    <tr>
                        <th>通知时间</th>
                        <td>{{ time.format('YYYY-MM-DD HH:mm') }}</td>
                    </tr>
                    <tr>
                        <th>通知范围</th>
                        <td>
                            <a-checkbox-group v-model="urgeUserIds">
                                <template >
                                    <div class="group" v-show="item.unitName" v-for="item in urgeUserList" :key="item.value">
                                        <span>{{ item.unitName }}：</span>
                                        <a-checkbox  v-for="(e) in item.group" :key="e.value"  :checked="true" :value="e.value">
                                            {{ e.text }}
                                        </a-checkbox>
                                    </div>
                                </template>
                                <template >
                                    <div>
                                        <a-checkbox v-show="!item.unitName" v-for="item in urgeUserList" :key="item.value" :checked="true" :value="item.value">
                                            {{ item.text }}
                                        </a-checkbox>
                                    </div>
                                </template>
                              
                            </a-checkbox-group>
                        </td>
                    </tr>
                    <tr>
                        <th>通知方式</th>
                        <td>
                            <a-checkbox :checked="true">短信</a-checkbox>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="flex justify-center dock">
            <a-button @click="saveHandle" :disabled="submitDisabled" :loading="saving" type="primary" size="large">发送</a-button>
        </div>
    </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
    props: {
        params: {
            type: Object
        },
        data: {
            type: Object
        }
    },
    data() {
        return {
            urgeUserIds: [],
            urgeUserList:[],
            saving: false,
            time: dayjs()
        }
    },
    computed: {
        submitDisabled() {
            if (this.urgeUserIds.length == 0) return true
            if (this.saving) return true
            return false
        }
    },
    watch: {
        time: {
            handler() {
                setTimeout(() => {
                    this.time = dayjs()
                }, 1000)
            },
            immediate: true
        },
        data: {
            handler() {
                this.urgeUserIds = this.data.urgeUserList.map((n) => n.value)
                this.getUrgeUserList()
            },
            immediate: true
        }
    },
    mounted() {
       
    },
    methods: {
        getUrgeUserList(){
            // 用于按 unitName 分组的临时对象
            const groups = {};
            const result = [];
            let that = this
            this.data.urgeUserList.forEach(item => {
            const unitName = item.unitName;
            if (unitName) {
                if (!groups[unitName]) {
                groups[unitName] = {
                    group: [],
                    unitName: unitName
                };
                }
                // 创建新对象并移除 unitName 属性
                const { unitName: _, ...rest } = item; // 使用解构移除 unitName
                groups[unitName].group.push(rest);
            } else {
                // 直接添加未分组的项
                result.push(item);
            }
            });
            // 将分组后的结果合并到最终数组
            console.log(Object.values(groups));
            Object.values(groups).forEach(group => {
                console.log( that.data.urgeUserList);
               let index= that.data.urgeUserList.findIndex(el=> el.unitName==group.unitName);
               console.log(index);
                //将group插入到index所对应的位置
                if(index!=-1){
                    result.splice(index,0,group)    
                }
            });
            console.log(result);
            this.urgeUserList=result
        },
        saveHandle() {
            this.saving = true
            window.IDM.http
                .post(
                    'ctrl/dbWorkbench/padNoticeUrge',
                    {
                        ...this.params,
                        noticeId: this.data.id,
                        urgeUserIds: this.urgeUserIds
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(({ data }) => {
                    this.closeHandle()
                })
                .finally(() => {
                    this.saving = false
                })
        },
        closeHandle() {
            console.log(222);
            this.$emit('close')
        }
    }
}
</script>
<style lang="scss" scoped>
.urge-warp {
    background-color: white;
    padding: 1.5rem 2rem 4rem;
    border-radius: 1.25rem;
    .header {
        position: relative;
        .caption {
            font-size: 3rem;
            color: #333;
        }
        .btn-back {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            gap: 1rem;
            align-items: center;
            color: #0b7eed;
            &:before {
                display: block;
                content: '';
                width: 3.75rem;
                height: 3.75rem;
                background: url('./images/icon_back.png') no-repeat;
                background-size: 100% 100%;
            }
        }
    }
    .group-wrap {
        .group-title {
            padding: 2.25rem 0;
            font-size: 2.75rem;
            color: #333;
            gap: 1.25rem;
            display: flex;
            align-items: center;
            &:before {
                display: block;
                content: '';
                width: 0.88rem;
                height: 3.31rem;
                background: url('./images/icon_title.png') no-repeat;
                background-size: 100% 100%;
            }
        }
    }
    .urge-table {
        width: 100%;
        background-color: #8fc7ff;
        font-size: 2.38rem;
        border-collapse: separate;
        border-spacing: 2px;
        table-layout: fixed;
        tr {
            th,
            td {
                padding: 1.5rem 2.5rem;
            }
            th {
                text-align: center;
                width: 15%;
                background-color: #e8f4ff;
            }
            td {
                background-color: white;
            }
        }
    }
    :deep(.ant-checkbox-group){
        .group{
            display: block;
            &>span{
                display: inline-block;
                width:  17rem;
                text-align: right;
            }
        }
    }
    :deep(.ant-checkbox-group .group){
        font-size: 2.38rem;
        // margin-left: 5px;
    }
    :deep(.ant-checkbox-wrapper) {
        font-size: 2.38rem;
    }
    :deep(.ant-checkbox-inner) {
        width: 2.05rem;
        height: 2.05rem;
    }
    .dock {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 1rem 0;
        background: #ffffff;
        box-shadow: 0rem 0.19rem 0.81rem 0rem rgba(0, 0, 0, 0.4);
        z-index: 999;
        :deep(.ant-btn-lg) {
            padding: 1rem 4rem;
            font-size: 2.38rem;
            height: auto;
            border-radius: 1rem;
        }
    }
}
</style>
