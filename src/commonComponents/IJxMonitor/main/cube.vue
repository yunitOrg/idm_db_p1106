<template>
    <div class="data-wrap">
        <Swiper
            :options="{
                autoplay: { delay: 3000 }
            }"
            class="h-full"
        >
            <SwiperSlide v-for="(group, groupIndex) in groups" :key="groupIndex" class="data-list">
                <div v-for="item in group" :key="item.orgId" @click="clickHandle(item)" class="pointer data-item">
                    <div class="data-item-value">
                        <div class="text">在办：{{ item.process }} / 已办结：{{ item.finish }}</div>
                    </div>
                    <div class="data-item-title">
                        {{ item.orgName }}
                    </div>
                </div>
                <div class="data-caption">{{ title }}</div>
            </SwiperSlide>
        </Swiper>
    </div>
</template>
<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        data: {
            type: Array,
            required: true
        }
    },
    components: {
        Swiper,
        SwiperSlide
    },
    data() {
        return {}
    },
    computed: {
        groups() {
            return this.data.map((n, i) => this.data.slice(i * 6, i * 6 + 6)).filter((n) => n.length > 0)
        }
    },
    methods: {
        clickHandle(item) {
            this.$emit('navigate', item)
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
.data-wrap {
    position: relative;
    .data-caption {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -400%);
        font-size: 2.5em;
        z-index: 1;
        color: white;
    }
    .data-list {
        position: relative;
        background: url('./images/data_bg.png') no-repeat center center/100% auto;
        color: white;
    }
    .data-item {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 50%;
        &-title {
            font-size: 1.7em;
            color: white;
        }
        &-value {
            padding: 16px 0;
            background: url('./images/data_value_bg.png') no-repeat center bottom;
            .text {
                font-size: 1.5em;
                color: #ffe000;
                text-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
            }
        }
        &:nth-child(1) {
            left: -9%;
            top: 8%;
        }
        &:nth-child(2) {
            left: -14.5%;
            top: 29%;
        }
        &:nth-child(3) {
            left: -9%;
            top: 51%;
        }
        &:nth-child(4) {
            right: -9%;
            top: 8%;
        }
        &:nth-child(5) {
            right: -14.5%;
            top: 29%;
        }
        &:nth-child(6) {
            right: -9%;
            top: 51%;
        }
    }
}
</style>
