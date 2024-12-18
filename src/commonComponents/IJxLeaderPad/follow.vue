<template>
    <Tabs :items="tabs" v-model="current" class="h-full">
        <div class="flex justify-end" style="padding: 2rem 0; gap: 2.5rem">
            <Status v-for="i in [4, 3, 2, 1]" :key="i" :value="i" :showLabel="true" />
        </div>
        <a-table :columns="columns" :bordered="true"> </a-table>
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
            tabs: [
                {
                    value: '1',
                    label: '已关注',
                    count: 10
                },
                {
                    value: '2',
                    label: '已催办 ',
                    count: 20
                }
            ],
            current: '1',
            data: []
        }
    },
    computed: {
        columns() {
            return [
                {
                    title: '序号',
                    dataIndex: 'index',
                    width: '8rem',
                    align: 'center'
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
                    onFilter: (value, record) => record.padLight.indexOf(value) === 0,
                    width: '15.06rem',
                    align: 'center'
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
                    onFilter: (value, record) => record.approvalImportant.indexOf(value) === 0,
                    width: '15.75rem',
                    align: 'center'
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
                        style: {
                            minWidth: '22rem'
                        }
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
                    width: '22.63rem',
                    align: 'center'
                },
                {
                    title: '操作',
                    dataIndex: 'ss',
                    width: '18.19rem',
                    align: 'center'
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
        query: {
            handler() {
                this.fetchData()
            },
            immediate: true
        }
    },
    methods: {
        fetchData() {
            window.IDM.http
                .post(
                    'ctrl/dbWorkbench/getLeaderPadNoticeList',
                    {
                        ...this.query,
                        pageSize: 9999
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(({ data }) => {
                    this.data = data.data.data
                })
        }
    }
}
</script>
