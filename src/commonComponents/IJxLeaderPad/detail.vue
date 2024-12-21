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
                        <td>{{ data.approvalBt }}</td>
                        <th>落实状态</th>
                        <td>{{ data.extImplementationStatusText }}</td>
                    </tr>
                    <tr>
                        <th>督办类型</th>
                        <td>{{ data.approvalTypeInfo }}</td>
                        <th>重要程度</th>
                        <td>{{ data.approvalImportantText }}</td>
                    </tr>
                    <tr>
                        <th>反馈人</th>
                        <td>{{ data.feedbackPersonText }}</td>
                        <th>反馈时间</th>
                        <td>{{ data.feedbackTime }}</td>
                    </tr>
                    <tr>
                        <th>执行情况</th>
                        <td colspan="3" v-html="data.showFeedbackContent"></td>
                    </tr>
                </table>
            </div>
        </div>
        <div v-if="data.noticeStatus < 6" class="flex justify-center dock">
            <a-button @click="ugreHandle" :disabled="saving" :loading="saving" type="primary" size="large">一键催办</a-button>
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
        ugreHandle() {
            this.$emit('urge', this.data)
        },
        closeHandle() {
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
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            gap: 1rem;
            align-items: center;
            font-size: 2.38rem;
            color: #0b7eed;
            &:before {
                display: block;
                content: '';
                width: 2.75rem;
                height: 2.75rem;
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
            padding: 1rem 2.7rem;
            font-size: 2.38rem;
            height: auto;
        }
    }
}
</style>
