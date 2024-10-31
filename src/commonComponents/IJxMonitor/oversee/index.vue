<template>
    <Section title="督办事项">
        <div class="h-full stat-wrap">
            <div v-for="stat in stats" :key="stat.approvalType" class="flex items-stretch stat-item">
                <div class="flex justify-center items-center stat-item-icon"></div>
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
            stats: []
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
                .post(
                    'ctrl/dbWorkbench/largeSizeApprovalTypeStatistics',
                    {
                        year: this.year
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then((res) => {
                    this.stats = res.data.data
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
            height: 149px;
            background: url('./images/dchs.png') no-repeat center center;
        }
        &-info {
            padding-right: 40px;
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
        &:nth-child(1) {
            .stat-item-icon {
                background-image: url('./images/zyps.png');
            }
        }
        &:nth-child(2) {
            .stat-item-icon {
                background-image: url('./images/zywj.png');
            }
        }
        &:nth-child(3) {
            .stat-item-icon {
                background-image: url('./images/zdrw.png');
            }
        }
        &:nth-child(4) {
            .stat-item-icon {
                background-image: url('./images/jbsx.png');
            }
        }
        &:nth-child(5) {
            .stat-item-icon {
                background-image: url('./images/dchs.png');
            }
        }
        &:nth-child(6) {
            .stat-item-icon {
                background-image: url('./images/jygl.png');
            }
        }
    }
}
</style>
