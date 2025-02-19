<template>
    <div v-if="data.type == 'table'">
        <a-table
            :columns="renderHeader(data.headers)"
            :data-source="data.data"
            :bordered="true"
            :pagination="false"
            :rowClassName="(_, i) => (i % 2 ? 'even' : 'odd')"
            class="a-table"
        >
            <template #status="text, row">
                <img :src="status[text]" :alt="row.alt" :title="row.alt" />
            </template>
        </a-table>
    </div>
    <div
        v-else
        class="section-wrap"
        :style="{
            '--content-padding': `${data.innerPadding}px`
        }"
    >
        <div @click="toggleExpand" class="flex items-center section-caption">
            <svg-icon v-if="data.collapseable" :icon-class="expanded ? 'expand' : 'collaspe'"></svg-icon>
            <svg-icon v-if="data.icon" :icon-class="data.icon" class="handlerIcon"></svg-icon>
            <div v-if="data.title" class="title">{{ data.title }}</div>
            <div v-for="(tag, index) in data.tags" :key="index" :class="['tag', `tag-${tag.tag}`, `tag-${tag.type}`]">{{ tag.text }}</div>
        </div>
        <div
            v-if="expanded"
            class="flex flex-col section-content"
            :class="{
                border: data.innerPadding > 0
            }"
        >
            <IFlowTableSection v-for="item in data.children" :key="item.id" :moduleObject="moduleObject" :data="item" />
        </div>
    </div>
</template>
<script>
export default {
    name: 'IFlowTableSection',
    props: {
        moduleObject: {
            type: Object
        },
        data: {
            type: Object
        }
    },
    data() {
        return {
            expanded: this.data.expanded,
            status: ['flow_backsend.png', 'flow_processed.png', 'flow_read.png', 'flow_send.png', 'flow_unread.png'].reduce((carry, current) => {
                carry[current] = this.getAssetUrl(current)
                return carry
            }, {})
        }
    },
    methods: {
        toggleExpand() {
            if (this.data.collapseable) {
                this.expanded = !this.expanded
            }
        },
        getAssetUrl(path) {
            return window.IDM.url.getModuleAssetsWebPath(require(`../../assets/flowTable/${path}`), this.moduleObject)
        },
        renderHeader(headers) {
            return headers.map((column, columnIndex) => {
                const option = {
                    title: column.text,
                    dataIndex: column.key,
                    align: 'center'
                }
                if (column.key == 'status') {
                    option.scopedSlots = {
                        customRender: 'status'
                    }
                } else {
                    option.customRender = (text, row, rowIndex) => {
                        if (row.colSpan) {
                            return {
                                children: text,
                                attrs: {
                                    colSpan: row.colSpan[columnIndex]
                                }
                            }
                        }
                        return text
                    }
                }
                return option
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.a-table {
    :deep(table) {
        font-size: 16px;
        border-radius: 0;
    }
    :deep(.ant-table-thead) {
        tr th {
            background: #f9fcfe;
            &:last-child {
                border-top-right-radius: 0;
            }
        }
    }
    :deep(.even) {
        background: #f9fcfe;
    }
}
.section {
    &-wrap {
        --info: #0086d9;
        --success: #57bd6a;
        --danger: #e30000;
    }
    &-caption {
        padding: 12px 10px;
        gap: 8px;
        border: 1px solid #e6e6e6;
        .handlerIcon {
            width: 1.2em;
            height: 1.2em;
        }
        .title {
            font-weight: bold;
        }
        .tag {
            color: white;
            &-badge {
                color: white;
                border-radius: 50em;
                padding: 0 10px;
                background: var(--tag-color);
            }
            &-status {
                border-radius: 4px;
                padding: 2px 10px;
                font-size: 12px;
                background: var(--tag-color);
            }
            &-tag {
                border-radius: 4px;
                padding: 0 5px;
                color: var(--tag-color);
                border: 1px solid var(--tag-border);
                position: relative;
                overflow: hidden;
                &:before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    background: var(--tag-border);
                    opacity: 0.1;
                }
            }
            &-info {
                --tag-color: var(--info);
                --tag-border: var(--info);
            }
            &-success {
                --tag-color: var(--success);
                --tag-border: var(--success);
            }
            &-danger {
                --tag-color: var(--danger);
                --tag-border: var(--danger);
            }
        }
    }
    &-content {
        gap: 20px;
        padding: var(--content-padding, 0);
        &.border {
            border: 1px solid #e6e6e6;
            border-top: none;
        }
        .a-table {
            margin-top: -1px;
        }
    }
}
</style>
