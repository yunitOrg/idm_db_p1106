<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <div class="flex flex-col">
            <a-card title="领导批示" class="card">
                <a-spin :spinning="comment.loading">
                    <div>
                        <div v-for="item in comment.data" :key="item.id" class="flex gap-1 comment-item">
                            <div class="flex-1 w-0">{{ item.content }}</div>
                            <div class="text-gray">{{ item.leaderName }} {{ item.createTime }}</div>
                            <div v-if="canEdit(item.leaderId)" @click="editCommentHandle(item)" class="text-primary">修改</div>
                            <div v-if="canEdit(item.leaderId)" @click="deleteComment(item)" class="text-danger">删除</div>
                        </div>
                    </div>
                </a-spin>
            </a-card>
            <a-card title="评价" class="card">
                <a-spin :spinning="rate.loading">
                    <div>
                        <div v-for="item in rate.data" :key="item.id">
                            <div class="flex gap-1">
                                <div class="flex-1 w-0">
                                    <a-rate :value="item.score" disabled></a-rate>
                                </div>
                                <div class="text-gray">{{ item.leaderName }} {{ item.createTime }}</div>
                                <div v-if="canEdit(item.leaderId)" @click="editRateHandle(rate)" class="text-primary">修改</div>
                                <div v-if="canEdit(item.leaderId)" @click="deleteRate(rate)" class="text-danger">删除</div>
                            </div>
                            <div>{{ item.content }}</div>
                        </div>
                    </div>
                </a-spin>
            </a-card>
            <div v-if="canCreate" class="flex justify-center gap-2 mt-2">
                <a-button type="primary" @click="editCommentHandle({})" class="btn">批示</a-button>
                <a-button
                    v-if="canRate"
                    @click="
                        editRateHandle({
                            score: 5
                        })
                    "
                    class="btn"
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
            this.fetchComments(this.id)
            this.fetchRates(this.id)
        },
        editCommentHandle(comment) {
            this.comment.current = comment
        },
        deleteComment(item) {
            item.deletting = true
            window.IDM.http
                .post('ctrl/dbInstruction/deleteInstructionById', {
                    instructionId: item.id
                })
                .then(({ data }) => {
                    this.fetchComments(this.id)
                    window.IDM.layer.msg(data.message)
                    if (data.code == '200') {
                        this.commentChange()
                    }
                })
                .finally(() => {
                    item.deletting = false
                })
        },
        editRateHandle(rate) {
            this.rate.current = rate
        },
        deleteRate(item) {
            item.deletting = true
            window.IDM.http
                .post('ctrl/dbComments/deleteCommentById', {
                    commentId: item.id
                })
                .then(({ data }) => {
                    this.fetchRates(this.id)
                    window.IDM.layer.msg(data.message)
                    if (data.code == '200') {
                    }
                })
                .finally(() => {
                    item.deletting = false
                })
        },
        fetchComments(noticeId) {
            this.comment.loading = true
            window.IDM.http
                .get('ctrl/dbInstruction/getInstructionByNoticeId', {
                    noticeId
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
                .get('ctrl/dbComments/getCommentsByNoticeId', {
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
.gap-1 {
    gap: 10px;
}
.gap-2 {
    gap: 20px;
}
.mt-2 {
    margin-top: 20px;
}
.text-gray {
    color: #999;
}
.text-primary {
    color: var(--main-color, #2673d3);
}
.text-danger {
    color: red;
}
.card {
    margin-top: -1px;
    :deep(.ant-card-head) {
        background-color: #f6fbfa;
        min-height: auto;
        padding: 10px 20px;
        .ant-card-head-title {
            padding: 0;
            font-size: 18px;
            font-weight: 500;
        }
    }
}
.comment-item {
    border-bottom: 1px dashed rgba(230, 230, 230, 1);
    &:last-child {
        border-bottom: none;
    }
}
.btn {
    border-radius: 2px;
    padding: 12px 36px;
    height: auto;
}
</style>
