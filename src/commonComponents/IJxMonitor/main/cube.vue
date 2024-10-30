<template>
    <div class="data-wrap">
        <Swiper
            :options="{
                autoplay: { delay: 3000 }
            }"
            class="h-full"
        >
            <SwiperSlide v-for="(group, groupIndex) in groups" :key="groupIndex" class="data-list">
                <div v-for="item in group" :key="item.orgId" class="data-item">
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
        font-size: 30px;
        z-index: 1;
        color: white;
    }
    .data-list {
        position: relative;
        background: url('./images/data_bg.png') no-repeat center center;
        color: white;
    }
    .data-item {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 300px;
        &-title {
            font-size: 25px;
            color: white;
        }
        &-value {
            padding: 16px 0;
            background: url('./images/data_value_bg.png') no-repeat center bottom;
            .text {
                font-size: 20px;
                @extend .blue-text;
            }
        }
        &:nth-child(1) {
            left: 13%;
            top: 8%;
        }
        &:nth-child(2) {
            left: 9.5%;
            top: 29%;
        }
        &:nth-child(3) {
            left: 13%;
            top: 51%;
        }
        &:nth-child(4) {
            right: 13%;
            top: 8%;
        }
        &:nth-child(5) {
            right: 9.5%;
            top: 29%;
        }
        &:nth-child(6) {
            right: 13%;
            top: 51%;
        }
    }
}
</style>
