<template>
    <div class="cube-wrap">
        <div class="flex">
            <div class="flex-1 w-0 cube-year">{{ year }}年</div>
            <div
                class="w-0 flex items-center justify-center swip-control"
                :style="{
                    flex: 2
                }"
            >
                <div @click="prevHandle" class="btn-prev"></div>
                <div class="name">{{ current?.name }}</div>
                <div @click="nextHandle" class="btn-next"></div>
            </div>
            <div class="flex-1 w-0"></div>
        </div>
        <div class="flex flex-wrap stat-list">
            <div v-for="stat in stats" :key="stat.key" @click="clickHandle(stat)" class="flex items-center pointer stat-item">
                <div class="stat-item-label">{{ stat.label }}</div>
                <div class="stat-item-value">
                    <div class="text">{{ stat.value }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        year: {
            type: String,
            required: true
        },
        value: {
            type: Number,
            required: true,
            default: 0
        },
        data: {
            type: Array,
            required: true
        },
        stats: {
            type: Array
        }
    },
    computed: {
        current() {
            return this.data[this.value]
        }
    },
    methods: {
        prevHandle() {
            if (this.value > 0) {
                this.$emit('input', this.value - 1)
                return
            }
            this.$emit('input', this.data.length - 1)
        },
        nextHandle() {
            if (this.value < this.data.length - 1) {
                this.$emit('input', this.value + 1)
                return
            }
            this.$emit('input', 0)
        },
        clickHandle(item) {
            this.$emit('navigate', {
                type: item.id,
                ...this.current
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.blue-text {
    background: linear-gradient(to bottom, #ffffff, #09a2e3);
    color: transparent;
    background-clip: text;
}
.cube-wrap {
    padding: 12px 30px;
    border: 1px solid rgba(46, 195, 200, 1);
    box-shadow: inset 0px 1px 18px 10px rgba(52, 103, 219, 0.46);
    border-radius: 10px;
    .cube-year {
        @extend .blue-text;
        font-size: 48px;
    }
}

.swip-control {
    color: white;
    gap: 30px;
    .name {
        font-size: 28px;
    }
    .btn-prev,
    .btn-next {
        background: url('./images/swiper_btn_prev.png') no-repeat center/100% 100%;
        width: 30px;
        height: 30px;
        cursor: pointer;
    }
    .btn-next {
        transform: rotate(180deg);
    }
}
.stat-list {
    .stat-item {
        padding: 0 40px 20px 0;
        &-label {
            color: white;
            font-size: 24px;
            &:after {
                content: '：';
            }
        }
        &-value {
            font-size: 34px;
            color: #32c5ff;
        }
    }
}
</style>
