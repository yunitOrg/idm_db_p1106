<template>
    <Tabs :items="tabs" v-model="current" class="h-full">
        <div class="h-full flex flex-col">
            <div class="flex justify-end" style="padding: 2rem 0; gap: 2.5rem">
                <Status v-for="i in [4, 3, 2, 1]" :key="i" :value="i" :showLabel="true" />
            </div>
            <div class="flex-1 h-0 overflow-auto">
                <a-table :columns="columns" :dataSource="data" :bordered="true" :pagination="false">
                    <template slot="status" slot-scope="text">
                        <div class="flex justify-center">
                            <Status :value="text" />
                        </div>
                    </template>
                    <template slot="operation" slot-scope="text, record">
                        <div class="flex items-center justify-center">
                            <div @click="followHandle(record)" class="pointer btn-operation">
                                <img v-if="record.attentionstatus == 1" src="./images/icon_follow_active.png" />
                                <img v-else src="./images/icon_follow.png" />
                            </div>
                            <div @click="urgeHandle(record)" class="pointer btn-operation">
                                <img v-if="record.urgeStatus == 1" src="./images/icon_urge_active.png" />
                                <img v-else src="./images/icon_urge.png" />
                            </div>
                        </div>
                    </template>
                </a-table>
            </div>
        </div>
    </Tabs>
</template>
<script>
import Tabs from './tabs.vue'
import Status from './status.vue'
export default {
    props: {
        params: {
            type: Object
        }
    },
    components: {
        Status,
        Tabs
    },
    data() {
        return {
            stat: {
                urgeCount: 0,
                attentionCount: 0
            },
            current: '1',
            data: []
        }
    },
    computed: {
        tabs() {
            return [
                {
                    value: '1',
                    label: '已关注',
                    count: this.stat.attentionCount
                },
                {
                    value: '2',
                    label: '已催办 ',
                    count: this.stat.urgeCount
                }
            ]
        },
        columns() {
            return [
                {
                    title: '序号',
                    dataIndex: 'index',
                    width: '9rem',
                    align: 'center',
                    customRender: (text, record, index) => index + 1
                },
                {
                    title: '督办状态',
                    dataIndex: 'padLight',
                    filters: [
                        {
                            text: '超期',
                            value: '4'
                        },
                        {
                            text: '临期',
                            value: '3'
                        },
                        {
                            text: '预警',
                            value: '2'
                        },
                        {
                            text: '正常',
                            value: '1'
                        }
                    ],
                    onFilter: (value, record) => record.padLight == value,
                    width: '16rem',
                    align: 'center',
                    scopedSlots: {
                        customRender: 'status'
                    }
                },
                {
                    title: '重要程度',
                    dataIndex: 'approvalImportantText',
                    filters: [
                        {
                            text: '重要',
                            value: '2'
                        },
                        {
                            text: '普通',
                            value: '1'
                        }
                    ],
                    onFilter: (value, record) => record.approvalImportant == value,
                    width: '15.75rem',
                    align: 'center',
                    customRender: (text, record) => (text == '2' ? '重要' : '普通')
                },
                {
                    title: '承办部门',
                    dataIndex: 'handlerUnitText',
                    width: '21.38rem',
                    align: 'center'
                },
                {
                    title: '标题',
                    dataIndex: 'approvalBt',
                    align: 'center',
                    customHeaderCell: () => ({
                        style: {}
                    }),
                    customCell: () => ({
                        style: {
                            textAlign: 'left'
                        }
                    })
                },
                {
                    title: '办结期限',
                    dataIndex: 'endDate',
                    width: '26rem',
                    align: 'center'
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    width: '18.19rem',
                    align: 'center',
                    scopedSlots: {
                        customRender: 'operation'
                    }
                }
            ]
        },
        query() {
            return {
                ...this.params,
                padNoticeQueryType: this.current
            }
        }
    },
    watch: {
        params: {
            handler() {
                this.fetchStat()
            },
            immediate: true
        },
        query: {
            handler() {
                this.fetchData()
            },
            immediate: true
        }
    },
    methods: {
        fetchStat() {
            window.IDM.http
                .post(
                    'ctrl/dbWorkbench/getPadAttentionUrgeCount',
                    {
                        ...this.params
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(({ data }) => {
                    this.stat = data.data
                })
        },
        fetchData() {
            window.IDM.http
                .post(
                    'ctrl/dbWorkbench/getLeaderPadNoticeList',
                    {
                        ...this.query,
                        pageNo: 1,
                        pageSize: 9999
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(({ data }) => {
                    this.data = data.data
                })
        },
        followHandle(record) {
            window.IDM.http
                .post('ctrl/dbNotice/attention', {
                    ...this.params,
                    noticeId: record.id,
                    opType: record.attentionstatus == 1 ? 0 : 1
                })
                .then(({ data }) => {})
            if (record.attentionstatus == 1) {
                record.attentionstatus = 0
            } else {
                record.attentionstatus = 1
            }
        },
        urgeHandle(row) {
            this.$emit('urge', row)
        }
    }
}
</script>
<style lang="scss" scoped>
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
</style>
