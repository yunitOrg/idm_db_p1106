<template>
    <Tabs :items="tabs" v-model="current" class="h-full">
        <div class="flex justify-end" style="padding: 2rem 0; gap: 2.5rem">
            <Status v-for="i in [1, 2, 3, 4]" :key="i" :value="i" :showLabel="true" />
        </div>
        <a-table :columns="columns" :bordered="true"> </a-table>
    </Tabs>
</template>
<script>
import Tabs from './tabs.vue'
import Status from './status.vue'
export default {
    components: {
        Status,
        Tabs
    },
    data() {
        return {
            tabs: [
                {
                    value: '1',
                    label: '省发改委',
                    count: 10
                },
                {
                    value: '2',
                    label: '省财政厅 ',
                    count: 20
                },
                {
                    value: '3',
                    label: '省应急管理厅',
                    count: 10
                },
                {
                    value: '4',
                    label: '省地方金融管理局',
                    count: 12
                },
                {
                    value: '5',
                    label: '省统计局',
                    count: 12
                },
                {
                    value: '6',
                    label: '省国动办',
                    count: 12
                },
                {
                    value: '7',
                    label: '省管局',
                    count: 12
                }
            ],
            current: '1'
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
                    dataIndex: 'dbStatus',
                    filters: [
                        {
                            text: '超期',
                            value: '2'
                        },
                        {
                            text: '临期',
                            value: '3'
                        },
                        {
                            text: '预警',
                            value: '4'
                        },
                        {
                            text: '正常',
                            value: '5'
                        }
                    ],
                    onFilter: (value, record) => record.dbStatus.indexOf(value) === 0,
                    width: '15.06rem',
                    align: 'center'
                },
                {
                    title: '重要程度',
                    dataIndex: 'dbStatus',
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
                    onFilter: (value, record) => record.name.indexOf(value) === 0,
                    width: '15.75rem',
                    align: 'center'
                },
                {
                    title: '承办部门',
                    dataIndex: 'ss',
                    width: '21.38rem',
                    align: 'center'
                },
                {
                    title: '标题',
                    dataIndex: 'bt',
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
                    dataIndex: 'over',
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
        }
    }
}
</script>
