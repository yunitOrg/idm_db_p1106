<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <div class="flex flex-col">
            <a-card title="领导批示" class="card">
                <a-spin :spinning="comment.loading">
                    <div>
                        <div v-for="item in comment.data" :key="item.id" class="flex gap-1 comment-item">
                            <div class="flex-1 w-0">{{ item.opinionContent }}</div>
                            <div class="text-gray">{{ item.leaderText }} {{ item.createTime }}</div>
                            <div v-if="canEdit(item.leader)" @click="editCommentHandle(item)" class="text-primary">修改</div>
                            <div v-if="canEdit(item.leader)" @click="deleteComment(item)" class="text-danger">删除</div>
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
                                <div class="text-gray">{{ item.leaderText }} {{ item.createTime }}</div>
                                <div v-if="canEdit(item.leader)" @click="editRateHandle(item)" class="text-primary">修改</div>
                                <div v-if="canEdit(item.leader)" @click="deleteRate(item)" class="text-danger">删除</div>
                            </div>
                            <div>{{ item.commentContent }}</div>
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
            if (this.rate.data.some((n) => n.leader == window.IDM.user.getCurrentUserInfo().userid)) return false
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
            var formId = proFormExt.getProductFormId('2411061059356d9kjpjSqA8jnpff2Iw')
            let url =
                window.DSF.getURLRoot() + 'ctrl/formControl/sysForm?moduleId=241106105632rl3E9KmAMO4jU5Fdzmg&formId=' + formId + '&nodeId=0&validateByList=1&listId=DbNoValidate'
            url += '&fid=' + this.id
            if (comment.id) {
                url += '&pk=' + comment.id
            }

            top.openWinView(this, {
                title: [comment.id ? '修改批示' : '新增批示', 'font-size: 18px;'],
                area: '1200,800',
                url: url,
                reloadGrid: false,
                callback: () => {
                    this.fetchComments(this.id)
                }
            })
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
            // 如果当前用户对当前通知评价过就打开已有的表单，更新。
            // 如果没有则新建表单保存。
            var formId = proFormExt.getProductFormId('241105110648KhVlGWSR2kx1icU9e1K')
            let url = window.DSF.getURLRoot() + 'ctrl/formControl/sysForm?moduleId=241105110441rwsLO5APwBWEQbz9Jzm&formId=' + formId + '&validateByList=1&listId=DbNoValidate'

            window.DSF.Utils.ajaxRequest('ctrl/dbComments/getOwnCommentsByNoticeId', { noticeId: this.id }, (result) => {
                if ('success' == result.type) {
                    if (result.data) {
                        url += '&nodeId=-2&pk=' + result.data.id
                    } else {
                        url += '&nodeId=0&fid=' + this.id
                    }

                    top.openWinView(this, {
                        title: rate.id ? '修改评价' : '新增评价',
                        area: '1200,800',
                        url: url,
                        reloadGrid: false,
                        callback: () => {
                            this.fetchRates(this.id)
                        }
                    })
                }
            })
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
        fetchComments(id) {
            this.comment.loading = true
            window.IDM.http
                .get('ctrl/dbInstruction/getInstructionByType', {
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
        canEdit(leader) {
            return window.IDM.user.userObject.userid == leader
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
    padding:10px 0;
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
