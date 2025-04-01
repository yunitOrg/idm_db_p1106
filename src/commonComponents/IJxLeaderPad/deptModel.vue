<template>
    <div class="flex justify-center items-center mask">
        <div class="flex flex-col dialog">
            <div class="caption">{{ title }}</div>
            <div class="flex-1 h-0 overflow-auto data-list">
                <div v-for="item in data" :key="item.unitId" @click="changeHandle(item)"
                    class="turncate pointer flex items-center justify-center h-full data-item">
                    <span>{{ item.unitName }}</span>
                    <label class="ant-tabs-tab-remind" v-if="item.count && item.count!=0">{{item.count}}</label>
                </div>
            </div>
            <div class="flex justify-center dock">
                <a-button @click="closeHandle" type="primary" size="large">关闭</a-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String
        },
        data: {
            type: Array
        }
    },
    methods: {
        changeHandle(item) {
            this.$emit('change', item)
        },
        closeHandle() {
            this.$emit('close')
        }
    }
}
</script>
<style lang="scss" scoped>
.mask {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 2;
}

.dialog {
    width: 80%;
    height: 60%;
    padding: 0 6.63rem 0;
    box-shadow: 0rem 0.13rem 2.06rem 0rem rgba(0, 0, 0, 0.26);
    border-radius: 1.25rem;
    background: white;

    .caption {
        padding: 3rem;
        font-size: 3rem;
        text-align: center;
    }

    .data-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, 20.25rem);
        grid-auto-rows: 5.88rem;
        align-items: start;
        justify-content: space-between;
        grid-column-gap: 2.55rem;
        grid-row-gap: 4.31rem;

        .data-item {
            background: #f4f4f4;
            border-radius: 0.75rem;
            border: 1px solid transparent;
            color: #333333;
            font-size: 2.13rem;
            position: relative;

            &:hover {
                background: none;
                border-color: #096efe;
                color: #096efe;
            }

            .ant-tabs-tab-remind {
                position: absolute;
                top: 0;
                right: 24px;
                border-radius: 12px;
                padding: 0 5px;
                width: auto;
                height: 18px;
                line-height: 16px;
                text-align: center;
                white-space: nowrap;
                border: 1px solid #fff;
                background-color: #ec4519;
                font-size: 12px;
                color: #fff;
                transform: translate(100%);
                -webkit-transform: translate(100%);
                -moz-transform: translate(100%);
                -webkit-transition: all .2slinear;
                transition: all .2slinear;
            }
        }
    }

    .dock {
        padding: 4.31rem 0;

        :deep(.ant-btn-lg) {
            padding: 1rem 2.7rem;
            font-size: 2.38rem;
            height: auto;
        }
    }
}
</style>
