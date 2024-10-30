<template>
    <Section title="督办事项">
        <div class="h-full stat-wrap">
            <div v-for="(stat, statIndex) in stats" :key="stat.key" class="flex items-stretch stat-item">
                <div class="flex justify-center items-center stat-item-icon">
                    <img :src="icons[statIndex]" />
                </div>
                <div class="flex-1 w-0 flex flex-col items-center justify-center stat-item-info">
                    <div class="stat-item-title">{{ stat.title }}</div>
                    <div class="stat-item-value">{{ stat.total }} / {{ stat.finish }}</div>
                    <div class="flex stat-item-label">
                        <div>总数</div>
                        <div>已办结</div>
                    </div>
                </div>
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
                    title: '重要批示',
                    total: 51,
                    finish: 28
                },
                {
                    key: '1',
                    title: '重要文件',
                    total: 51,
                    finish: 28
                },
                {
                    key: '1',
                    title: '重点任务',
                    total: 51,
                    finish: 28
                },
                {
                    key: '1',
                    title: '交办事项',
                    total: 51,
                    finish: 28
                },
                {
                    key: '1',
                    title: '调查核实',
                    total: 51,
                    finish: 28
                },
                {
                    key: '1',
                    title: '建议提案',
                    total: 51,
                    finish: 28
                }
            ],
            icons: [
                require('./images/重要批示.png'),
                require('./images/重要文件.png'),
                require('./images/重点任务.png'),
                require('./images/交办事项.png'),
                require('./images/调查核实.png'),
                require('./images/建议管理.png')
            ]
        }
    }
}
</script>
<style lang="scss" scoped>
.stat {
    &-wrap {
        display: grid;
        grid-template-columns: repeat(3, 369px);
        justify-content: center;
        align-items: center;
        padding: 40px;
    }
    &-item {
        background: url('./images/stat_item_bg.png') no-repeat left center/auto 100%;
        color: white;
        text-align: center;
        height: 149px;
        &-icon {
            width: 149px;
            > img {
                width: 64px;
                height: 64px;
                object-fit: cover;
            }
        }
        &-title {
            font-size: 28px;
            color: #17f8f8;
            padding: 8px 0;
        }
        &-value {
            font-size: 30px;
        }
        &-label {
            font-size: 18px;
            gap: 40px;
        }
    }
}
</style>
