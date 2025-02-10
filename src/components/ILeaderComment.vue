<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <div class="flex flex-col gap-2">
            <a-card title="领导批示">
                <div>
                    <div class="flex">
                        <div class="flex-1 w-0">批示内容</div>
                        <a-button>
                            <a-icon type="edit" />
                        </a-button>
                    </div>
                </div>
            </a-card>
            <a-card title="评价">
                <div>
                    <div class="flex">
                        <div class="flex-1 w-0">评价</div>
                        <a-button>
                            <a-icon type="edit" />
                        </a-button>
                    </div>
                </div>
            </a-card>
            <a-form v-if="comment" layout="vertical">
                <a-form-item label="批示内容">
                    <a-textarea v-model="comment.content"></a-textarea>
                </a-form-item>
                <a-form-item label="">
                    <div class="flex justify-center gap-2">
                        <a-button @click="saveComment" type="primary">保存</a-button>
                        <a-button v-if="comment.id" type="danger">删除</a-button>
                        <a-button @click="comment = null">取消</a-button>
                    </div>
                </a-form-item>
            </a-form>
            <a-form v-else-if="rate" layout="horizontal">
                <a-form-item label="评分">
                    <a-rate v-model="rate.value" />
                </a-form-item>
                <a-form-item label="评语">
                    <a-textarea v-model="rate.content"></a-textarea>
                </a-form-item>
                <a-form-item label="">
                    <div class="flex justify-center gap-2">
                        <a-button @click="saveRate" type="primary">保存</a-button>
                        <a-button v-if="rate.id" type="danger">删除</a-button>
                        <a-button @click="rate = null">取消</a-button>
                    </div>
                </a-form-item>
            </a-form>
            <div v-else class="flex justify-center gap-2">
                <a-button @click="editCommentHandle({})">批示</a-button>
                <a-button
                    @click="
                        editRateHandle({
                            value: 5
                        })
                    "
                    >评价</a-button
                >
            </div>
        </div>
    </div>
</template>
<script>
import bindProp from '../mixins/bindProp'
export default {
    mixins: [bindProp()],
    data() {
        return {
            comment: null,
            rate: null
        }
    },
    methods: {
        initData() {},
        editCommentHandle(comment) {
            this.comment = comment
        },
        saveComment() {},
        editRateHandle(rate) {
            this.rate = rate
        },
        saveRate() {}
    }
}
</script>
<style lang="scss" scoped>
@use '../style/common.scss';
.gap-2 {
    gap: 20px;
}
</style>
