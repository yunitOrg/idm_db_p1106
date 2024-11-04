<template>
    <div class="task-ul">
        <div class="task-li">
            <div class="task-li-box">
                <div class="task-name" @click="handleShowList">
                    <div class="task-li-title">
                        <span class="task-label">
                            <span class="task-red" v-if="data.timeoutStatusText && data.timeoutStatus != 0">{{ data.timeoutStatusText }}</span>
                            <span
                                :class="{
                                    'task-gray': data.dbStatus == '1',
                                    'task-blue': data.dbStatus == '2',
                                    'task-green': data.dbStatus == '3',
                                    'task-red': data.dbStatus == '4'
                                }"
                                >{{ data.dbStatusText }}</span
                            >
                        </span>
                        <span class="task-center">{{ data['taskDesc'] }}</span>
                    </div>
                    <div class="task-subtitle">
                        <div class="task-subtitle-left">
                            <span>开始日期：{{ data.startDate }}</span>
                            <span>办理期限：{{ data.endDate }}</span>
                            <span>反馈周期：{{ data.feedbackPeriodText }}</span>
                        </div>
                        <div class="task-nameicon" style="font-size: 16px">
                            <img :src="subVisible ? handleJianImg() : handleJiaImg()" alt="" />
                        </div>
                    </div>
                    <div class="task-ban">
                        <div class="task-li-flex">
                            <span class="task-li-flex task-typeicon" v-if="data.hostList && data.hostList.length">
                                <img src="../assets/zhuban.png" alt="" class="task-ban-img" />
                                <span
                                    v-for="(subitem, subindex) in data.hostList"
                                    :key="subindex"
                                    class="task-ban-span"
                                    :class="subitem.dbStatus <= 1 ? 'task-ban-gray' : 'task-ban-blue'"
                                >
                                    {{ subitem.unitName }}
                                </span>
                            </span>
                            <span style="display: flex; align-items: center; padding-left: 30px" class="task-typeicon" v-if="data.assistList && data.assistList.length">
                                <img src="../assets/xieban.png" alt="" class="task-ban-img" />
                                <span
                                    v-for="(subitem, subindex) in data.assistList"
                                    :key="subindex"
                                    class="task-ban-span"
                                    :class="subitem.dbStatus <= 1 ? 'task-ban-gray' : 'task-ban-blue'"
                                >
                                    {{ subitem.unitName }}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="task-action">
                    <a-popover placement="bottomRight" v-if="data.buttonList && data.buttonList.length">
                        <template slot="content">
                            <p v-for="(subitem, index) in data.buttonList" :key="index" @click="handleOptions({ key: subitem.value, value: subitem.value, record: data })">
                                <span>{{ subitem.text }}</span>
                            </p>
                        </template>
                        <!-- <svg-icon icon-class="detail" class="optionSvg"></svg-icon> -->
                        <img src="../assets/more.png" alt="" />
                    </a-popover>
                </div>
            </div>
        </div>
        <div class="pervise-single-wrap" v-if="subVisible">
            <slot :data="data"></slot>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        data: {
            type: Object,
            required: true
        },
        moduleObject: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            subVisible: false
        }
    },
    methods: {
        handleJiaImg() {
            return IDM.url.getModuleAssetsWebPath(require('../assets/jia.png'), this.moduleObject)
        },
        handleJianImg() {
            return IDM.url.getModuleAssetsWebPath(require('../assets/jian.png'), this.moduleObject)
        },
        // 子项展开收缩
        handleShowList() {
            this.subVisible = !this.subVisible
        },
        // 操作项
        handleOptions(obj) {
            this.$emit('handleOptions', obj)
        }
    }
}
</script>

<style lang="scss" scoped>
.task-ul + .task-ul {
    margin-top: 10px;
}
.task-li {
    transition: all 1s ease-in-out;
    border: 1px solid #e8e8e8;
    .task-li-box {
        position: relative;
        display: flex;
        justify-content: space-between;
        background-color: #eeeeee;
        padding: 10px 15px;
        cursor: pointer;
    }
    .task-name {
        display: flex;
        flex-direction: column;
        width: 93%;
    }
    .task-li-title {
        .task-center {
            word-wrap: break-word;
            color: #333333;
            font-weight: bold;
        }
    }
    .task-action {
        width: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        // padding-right: 25px;
    }
    .task-li-flex {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 5px;
    }
    .task-ban {
        margin-top: 5px;
    }
    .task-ban-img {
        width: 16px;
        height: 16px;
    }
    .task-ban-span {
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 14px;
        white-space: nowrap;
    }
    .task-ban-gray {
        color: #666666;
        background-color: rgb(102 102 102 / 10%);
    }
    .task-ban-blue {
        color: #0086d9;
        background-color: rgb(0 134 217 / 10%);
    }
    .task-typeicon {
        background-color: #fff;
        padding: 5px;
        border-radius: 3px;
    }
    .task-subtitle {
        padding-top: 5px;
        display: flex;
        span + span {
            margin-left: 5%;
        }
        .task-subtitle-left {
            width: 100%;
            span {
                color: #666;
            }
        }
        .task-nameicon {
            position: absolute;
            right: 130px;
            top: 50%;
            transform: translateY(-50%);
            img {
                width: 18px;
                height: 18px;
            }
        }
    }
    .task-label {
        span {
            padding: 2px 5px;
            margin-right: 5px;
            border-radius: 3px;
        }
        .task-gray {
            background-color: rgb(204 204 204 / 10%);
            color: #cccccc;
            border: 1px solid #cccccc;
        }
        .task-blue {
            background-color: rgb(0 134 217 / 10%);
            color: #0086d9;
            border: 1px solid #0086d9;
        }
        .task-green {
            background-color: rgb(87 189 106 / 10%);
            color: #57bd6a;
            border: 1px solid #57bd6a;
        }
        .task-red {
            background-color: rgb(227 0 0 / 10%);
            color: #e30000;
            border: 1px solid #e30000;
        }
        .task-cheng {
            background-color: #ffffff;
            color: #ffba00;
            border: 1px solid #ffba00;
        }
    }
}
</style>
