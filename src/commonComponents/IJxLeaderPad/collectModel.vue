<template>
    <div class="flex justify-center items-center mask">
        <div class="flex flex-col dialog">
            <div class="caption">关注原因</div>
            <div class="flex-1 data-list">
                <div :class="['item',attentionReason.includes(index+1)?'active':'']" v-for="(el,index) in arr" :key="index" @click="changeHandle(index+1)">{{el}}</div>
            </div>
            <div class="flex justify-between dock">
                <a-button @click="closeHandle" type="" size="large">取消</a-button>
                <a-button @click="queDing" type="primary" size="large">确定</a-button>
            </div>
        </div>
    </div>
</template>
<script>
import { EventBus } from '../../mixins/eventBus.js';
export default {
    props: {
    },
    data() {
        return {
            arr:["亮点","难点","风险点"],
            attentionReason:[]
        }
    },
    methods: {
        changeHandle(index) {
            if (this.attentionReason.includes(index)) {
                this.attentionReason.splice(this.attentionReason.indexOf(index), 1)
            } else {
                this.attentionReason.push(index)
            }
        },
        queDing(){
            //将attentionReason中的数组变成"1,2,3"的格式
            EventBus.$emit('getCollect',this.attentionReason.join(","));
        },
        closeHandle() {
            this.attentionReason=[]
            EventBus.$emit('deleteCollect')
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
    width: 25%;
    height: 50%;
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
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        .item {
            width: 100%;
            height: calc(100%/3 - 1.5rem);
            background: #F4F4F4;
            border-radius: 1rem;
            font-family: PingFangSC-Regular;
            font-size: 3rem;
            color: #333333;
            letter-spacing: 0;
            text-align: center;
            font-weight: 400;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            // &:hover {
            //     background: url(./images/collectbg.png) no-repeat;
            //     background-size: 100% 100%;
            //     color: #096efe;
            //     border-radius: 0;
            // }
            &.active {
                background: url(./images/collectbg.png) no-repeat;
                background-size: 100% 100%;
                color: #096efe;
                border-radius: 0;
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
        :deep(.ant-btn:nth-child(2)){
            background: #096efe;
        }
    }
}
</style>
