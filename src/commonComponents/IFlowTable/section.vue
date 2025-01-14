<template>
    <table v-if="data.type == 'table'" class="w-full table">
        <thead>
            <tr>
                <th v-for="column in data.columns" :key="column.key">
                    {{ column.title }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in data.data" :key="index">
                <td v-for="column in data.columns" :key="column.key">
                    {{ item[column.key] }}
                </td>
            </tr>
        </tbody>
    </table>
    <div
        v-else
        class="section-wrap"
        :style="{
            '--content-padding': `${data.innerPadding}px`
        }"
    >
        <div @click="toggleExpand" class="flex items-center section-caption">
            <svg-icon :icon-class="expanded ? 'expand' : 'collaspe'"></svg-icon>
            <svg-icon icon-class="zhuban" class="handlerIcon"></svg-icon>
            <div class="title">{{ data.title }}</div>
            <div v-for="(tag, index) in data.tags" :key="index" :class="['tag', `tag-${tag.tag}`, `tag-${tag.type}`]">{{ tag.text }}</div>
        </div>
        <div
            v-if="expanded"
            class="flex flex-col section-content"
            :class="{
                border: data.innerPadding > 0
            }"
        >
            <IFlowTableSection v-for="(item, index) in data.children" :key="index" :data="item" />
        </div>
    </div>
</template>
<script>
export default {
    name: 'IFlowTableSection',
    props: {
        data: {
            type: Object
        }
    },
    data() {
        return {
            expanded: this.data.expanded
        }
    },
    methods: {
        toggleExpand() {
            this.expanded = !this.expanded
        }
    }
}
</script>
<style lang="scss" scoped>
.table {
    background: #e6e6e6;
    border-collapse: separate;
    border-spacing: 1px;
    thead tr th,
    tbody tr td {
        background: white;
        padding: 12px;
        text-align: center;
    }
    thead tr th,
    tbody tr:nth-child(even) td {
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
        .table {
            margin-top: -1px;
        }
    }
}
</style>
