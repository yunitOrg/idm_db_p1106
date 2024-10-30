<template>
    <Section title="重难点事项">
        <div class="h-full flex flex-col justify-center stat-wrap">
            <div class="flex justify-between stat-list-wrap">
                <div v-for="stat in stats" :key="stat.key" class="flex-1 w-0 flex flex-col stat-item" :class="[`stat-item-type-${stat.type}`]">
                    <div class="flex-1 h-0 stat-item-value">
                        <template v-if="stat.type == 1 || stat.type == 2">
                            {{ stat.value }}
                        </template>
                    </div>
                    <div class="stat-item-title">{{ stat.title }}</div>
                </div>
            </div>
            <div class="flex-1 h-0 flex items-stretch stat-table-wrap">
                <dv-scroll-board :config="config" class="flex-1 w-0" />
                <dv-scroll-board :config="config" class="flex-1 w-0" />
            </div>
        </div>
    </Section>
</template>
<script>
import Section from '../section/index.vue'
export default {
    components: {
        Section
    },
    data() {
        return {
            stats: [
                {
                    key: '1',
                    title: '催办数',
                    value: 7,
                    type: 1
                },
                {
                    key: '2',
                    title: '催办率',
                    value: 70,
                    type: 3
                },
                {
                    key: '3',
                    title: '超期数',
                    value: 2,
                    type: 2
                },
                {
                    key: '4',
                    title: '超期率',
                    value: 4,
                    type: 3
                }
            ],
            config: {
                header: ['部门', '催办数', '催办率'],
                headerBGC: 'rgba(6,65,173,0.36)',
                oddRowBGC: 'transparent',
                evenRowBGC: 'rgba(6,65,173,0.12)',
                headerHeight: 48,
                rowNum: 4,
                data: [
                    ['行1列1', '行1列2', '行1列3'],
                    ['行2列1', '行2列2', '行2列3'],
                    ['行3列1', '行3列2', '行3列3'],
                    ['行4列1', '行4列2', '行4列3'],
                    ['行5列1', '行5列2', '行5列3'],
                    ['行6列1', '行6列2', '行6列3'],
                    ['行7列1', '行7列2', '行7列3'],
                    ['行8列1', '行8列2', '行8列3'],
                    ['行9列1', '行9列2', '行9列3'],
                    ['行10列1', '行10列2', '行10列3']
                ]
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.stat {
    &-wrap {
        padding: 20px;
        gap: 16px;
    }
    &-table-wrap {
        gap: 26px;
    }
    &-list-wrap {
        gap: 12px;
    }
    &-item {
        background: rgba(0, 99, 184, 0.14);
        height: 176px;
        color: white;
        text-align: center;
        border-radius: 8px;
        padding: 0 6px;
        &-title {
            font-size: 18px;
            padding: 14px 0;
            border-top: 1px solid transparent;
        }
        &-type-1,
        &-type-2 {
            background: url('./images/type1.png') no-repeat center -10px/ 100% auto;
            .stat-item-value {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 38px;
            }
        }
        &-type-2 {
            background-image: url('./images/type2.png');
        }
        &-type-3 {
            .stat-item-title {
                border-top: 1px solid rgba(74, 123, 255, 0.4);
            }
        }
    }
}
</style>
