<template>
    <div class="h-full flex flex-col urge-warp">
        <div class="flex justify-center header">
            <div @click="closeHandle" class="pointer btn-back"></div>
            <div class="caption">执行情况</div>
        </div>
        <div class="flex-1 h-0 overflow-auto">
            <div class="group-wrap">
                <div class="group-title">立项信息</div>
                <table class="urge-table">
                    <tr>
                        <th>标题</th>
                        <td  colspan="3">{{ data.data2.approvalBt }}</td>
                    </tr>
                    <tr>
                        <th>督办类型</th>
                        <td>{{ data.data2.approvalTypeText+'-'+data.data2.extApprovalTypeTextLv2 }}</td>
                        <th>重要程度</th>
                        <td>{{  data.data2.approvalImportantText }}</td>
                    </tr>
                </table>
            </div>
            <div class="group-wrap" v-for="(el,index) in data.data" :key="index">
                <div class="group-title">{{el.handlerUnitText}}</div>
                <table class="urge-table">
                    <tr>
                        <th>反馈人</th>
                        <td> {{el.feedbackPersonText && el.feedbackPersonText.length>0?el.feedbackPersonText:'无'}}</td>
                        <th>反馈时间</th>
                        <td>{{el.feedbackTime && el.feedbackTime.length>0?el.feedbackTime:'--'}}</td>
                        <th>落实状态</th>
                        <td>{{el.implementationStatusText && el.implementationStatusText.length>0? el.implementationStatusText:'--'}}</td>
                    </tr>
                    <tr>
                        <th>执行情况</th>
                        <td colspan="5" v-html="el.feedbackContent && el.feedbackContent.length>0?el.feedbackContent:'无'"></td>
                    </tr>
                    <tr v-if="el.dbStatus < 6 && el.isSms==1">
                        <th>是否催办</th>
                        <td colspan="5">
                            <div v-if="el.dbStatus < 6 && el.isSms==1" @click="urgeHandle(el)" class="pointer btn-operation">
                                <img v-if="el.urgeStatus == 1" src="./images/icon_urge_active.png" />
                                <img v-else src="./images/icon_urge.png" />
                            </div>
                            <!-- <div  @click="urgeHandle(el)" class="pointer btn-operation">
                                <img src="./images/icon_urge.png" />
                            </div> -->
                        </td>
                    </tr>
                    <tr v-if="el.attachFileEntityList && el.attachFileEntityList.length>0">
                        <th>附件栏</th>
                        <td colspan="5">
                            <div style="cursor: pointer;" v-for="(file) in el.attachFileEntityList" :key="file.id" @click="handleOpen(file)">{{file.fileName}}</div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div v-if="data.noticeStatus < 6 && data.noticeInfo.isSms==1" class="flex justify-center dock">
            <a-button @click="ugreHandle" :disabled="saving" :loading="saving" type="primary" size="large">一键催办</a-button>
        </div>
        <div v-if="data.auditStatus!=0" :class="['auditStatus',data.auditStatus==1?'auditStatus1':data.auditStatus==-1?'auditStatus2':'']">
        </div>
    </div>
</template>
<script>
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
        return {}
    },
    methods: {
        handleOpen(file){
            if(file.url && file.url.length>0){
                window.open(file.url)
            }
        },
        ugreHandle() {
            this.$emit('urge', this.data)
        },
        closeHandle() {
            this.$emit('close')
        },
        //催办页面
        urgeHandle(record) {
            console.log(11,record);
            this.$emit('urge', record)
        }
    },
    mounted() {
        console.log(this.data,"++++");
        console.log(this.data.noticeInfo);
    }
}
</script>
<style lang="scss" scoped>
.urge-warp {
    background-color: white;
    padding: 1.5rem 2rem 4rem;
    border-radius: 1.25rem;
    position: relative;
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
   .auditStatus{
        position: absolute;
        right: 2rem;
        top: 6rem;
        width:20rem;
        height: 16rem;
    }
    .auditStatus1{
        background: url(./images/auditStatus1.png) no-repeat;
        background-size: 100% 100%;
    }
    .auditStatus2{
        background: url(./images/auditStatus2.png) no-repeat;
        background-size: 100% 100%;
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
        padding: 1.3rem 0;
        background: #ffffff;
        box-shadow: 0rem 0.19rem 0.81rem 0rem rgba(0, 0, 0, 0.4);
        :deep(.ant-btn-lg) {
            padding: 2rem 7rem;
            font-size: 2.38rem;
            height: auto;
            border-radius: 1rem;
        }
    }
}
</style>
