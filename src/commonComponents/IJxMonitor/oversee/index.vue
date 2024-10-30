<template>
    <Section title="督办事项">
        <div class="h-full stat-wrap">
            <div v-for="stat in stats" :key="stat.approvalType" class="flex items-stretch stat-item">
                <div class="flex justify-center items-center stat-item-icon">
                    <img :src="icons[approvalType]" />
                </div>
                <div class="flex-1 w-0 flex flex-col items-center justify-center stat-item-info">
                    <div class="stat-item-title">{{ stat.approvalTypeText }}</div>
                    <div class="stat-item-value">{{ stat.countNum }} / {{ stat.taskFinishTotal }}</div>
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
    props: {
        year: {
            type: String,
            required: true
        }
    },
    components: {
        Section
    },
    data() {
        return {
            stats: [],
            icons: {
                1: require('./images/重要批示.png'),
                2: require('./images/重要文件.png'),
                3: require('./images/重点任务.png'),
                4: require('./images/交办事项.png'),
                5: require('./images/调查核实.png'),
                6: require('./images/建议管理.png')
            }
        }
    },
    watch: {
        year: {
            handler() {
                this.fetchData()
            },
            immediate: true
        }
    },
    methods: {
        fetchData() {
            window.IDM.http
                .get('dbWorkbench/largeSizeApprovalTypeStatistics', {
                    year: this.year
                })
                .then((res) => {
                    this.stats = res.data
                })
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
