<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <div class="flex flex-col gap-2">
            <a-card title="领导批示">
                <a-spin :spinning="comment.loading">
                    <div>
                        <div v-for="item in comment.data" :key="item.id">
                            <div class="flex">
                                <div class="flex-1 w-0">{{ item.content }}</div>
                                <a-button v-if="canEdit(item.leaderId)" @click="comment.current = clone(item)" icon="edit"> </a-button>
                            </div>
                            <div class="flex justify-end gap-2">
                                <div>{{ item.leaderName }}</div>
                                <div>{{ item.createTime }}</div>
                            </div>
                        </div>
                    </div>
                </a-spin>
            </a-card>
            <a-card title="评价">
                <a-spin :spinning="rate.loading">
                    <div>
                        <div v-for="item in rate.data" :key="item.id">
                            <div class="flex">
                                <div class="flex-1 w-0 flex items-center">
                                    <div>{{ item.leaderName }}：</div>
                                    <a-rate :value="item.score" disabled></a-rate>
                                </div>
                                <a-button v-if="canEdit(item.leaderId)" @click="rate.current = clone(item)" icon="edit"> </a-button>
                            </div>
                            <div>{{ item.content }}</div>
                        </div>
                    </div>
                </a-spin>
            </a-card>
            <a-modal v-if="comment.current" :visible="true" :title="comment.current.id ? '修改批示' : '新增批示'" @cancel="comment.current = null" width="90vw">
                <a-form layout="vertical">
                    <a-form-item label="批示模板">
                        <a-select v-model="comment.tpl.current">
                            <a-select-option v-for="item in comment.tpl.data" :key="item.value" :value="item.value">{{ item.text }}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="批示内容">
                        <a-textarea v-model="comment.current.content" :rows="4"></a-textarea>
                    </a-form-item>
                </a-form>
                <template #footer>
                    <a-button @click="saveComment" :loading="comment.submitting" type="primary">保存</a-button>
                    <a-button v-if="comment.current.id" @click="deleteComment(comment.current.id)" :loading="comment.deletting" type="danger">删除</a-button>
                    <a-button @click="comment.current = null">取消</a-button>
                </template>
            </a-modal>
            <a-modal v-if="rate.current" :visible="true" :title="rate.current.id ? '修改评价' : '新增评价'" @cancel="rate.current = null" width="90vw">
                <a-form layout="horizontal">
                    <a-form-item label="评分">
                        <a-rate v-model="rate.current.score" />
                    </a-form-item>
                    <a-form-item label="评语">
                        <a-textarea v-model="rate.current.content" :rows="4"></a-textarea>
                    </a-form-item>
                </a-form>
                <template #footer>
                    <a-button @click="saveRate" :loading="rate.submitting" type="primary">保存</a-button>
                    <a-button v-if="rate.current.id" @click="deleteRate(rate.current.id)" :loading="rate.deletting" type="danger">删除</a-button>
                    <a-button @click="rate.current = null">取消</a-button>
                </template>
            </a-modal>
            <div v-if="canCreate" class="flex justify-center gap-2">
                <a-button @click="editCommentHandle({})">批示</a-button>
                <a-button
                    v-if="canRate"
                    @click="
                        editRateHandle({
                            score: 5
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
import bindStyles from '../mixins/bindStyles'
export default {
    mixins: [bindProp(), bindStyles()],
    data() {
        return {
            id: window.IDM.url.queryObject().id,
            comment: {
                data: [],
                current: null,
                tpl: {
                    data: [],
                    current: null
                },
                submitting: false,
                deletting: false,
                loading: true
            },
            rate: {
                data: [],
                current: null,
                submitting: false,
                deletting: false,
                loading: true
            }
        }
    },
    watch: {
        'comment.tpl.current'(value) {
            this.comment.current.content = this.comment.tpl.data.find((n) => n.value == value).text
        }
    },
    computed: {
        canRate() {
            if (this.rate.loading) return false
            if (this.rate.data.some((n) => n.leaderId == window.IDM.user.getCurrentUserInfo().userid)) return false
            return true
        },
        canCreate() {
            return window.IDM.user.userObject.roleIds?.split(',').some((n) => n == '180622194442OrvtuD1M4OjnOF15lOq')
        }
    },
    mounted() {
        this.initData()
    },
    methods: {
        clone: _.clone,
        initData() {
            this.fetchCommentTpls()
            this.fetchComments(this.id)
            this.fetchRates(this.id)
        },
        editCommentHandle(comment) {
            this.comment.current = comment
        },
        saveComment() {
            this.comment.submitting = true
            window.IDM.http
                .post(this.comment.current.id ? 'ctrl/dbInstruction/update' : 'ctrl/dbInstruction/add', {
                    noticeId: this.id,
                    ...this.comment.current
                })
                .then(({ data }) => {
                    this.fetchComments(this.id)
                    window.IDM.layer.msg(data.message)
                    if (data.code == '200') {
                        this.comment.current = null
                        this.commentChange()
                    }
                })
                .finally(() => {
                    this.comment.submitting = false
                })
        },
        deleteComment(id) {
            this.comment.deletting = true
            window.IDM.http
                .post('ctrl/dbInstruction/delete', {
                    id
                })
                .then(({ data }) => {
                    this.fetchComments(this.id)
                    window.IDM.layer.msg(data.message)
                    if (data.code == '200') {
                        this.comment.current = null
                        this.commentChange()
                    }
                })
                .finally(() => {
                    this.comment.deletting = false
                })
        },
        editRateHandle(rate) {
            this.rate.current = rate
        },
        saveRate() {
            this.rate.submitting = true
            window.IDM.http
                .post(this.rate.current.id ? 'ctrl/dbAppraise/update' : 'ctrl/dbAppraise/add', {
                    noticeId: this.id,
                    ...this.rate.current
                })
                .then(({ data }) => {
                    this.fetchRates(this.id)
                    window.IDM.layer.msg(data.message)
                    if (data.code == '200') {
                        this.rate.current = null
                    }
                })
                .finally(() => {
                    this.rate.submitting = false
                })
        },
        deleteRate(id) {
            this.rate.deletting = true
            window.IDM.http
                .post('ctrl/dbAppraise/delete', {
                    id
                })
                .then(({ data }) => {
                    this.fetchRates(this.id)
                    window.IDM.layer.msg(data.message)
                    if (data.code == '200') {
                        this.rate.current = null
                    }
                })
                .finally(() => {
                    this.rate.deletting = false
                })
        },
        fetchCommentTpls() {
            window.IDM.http.get('ctrl/dbInstruction/getDbInstructionTemplateSelect').then(({ data }) => {
                this.comment.tpl.data = data.data
            })
        },
        fetchComments(id) {
            this.comment.loading = true
            window.IDM.http
                .get('ctrl/dbInstruction/query', {
                    id
                })
                .then(({ data }) => {
                    this.comment.data = data.data
                })
                .finally(() => {
                    this.comment.loading = false
                })
        },
        fetchRates(noticeId) {
            this.rate.loading = true
            window.IDM.http
                .get('ctrl/dbAppraise/queryAppraise', {
                    noticeId
                })
                .then(({ data }) => {
                    this.rate.data = data.data
                })
                .finally(() => {
                    this.rate.loading = false
                })
        },
        commentChange() {
            top.document.querySelector('#vkbLOc0HEn2SV9Ct iframe')?.contentWindow.location.reload()
        },
        canEdit(leaderId) {
            return window.IDM.user.userObject.userid == leaderId
        }
    }
}
</script>
<style lang="scss" scoped>
@use '../style/common.scss';
.gap-2 {
    gap: 20px;
}
</style>
