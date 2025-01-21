<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="flex flex-col idm-db-IMultipleTabPannel">
        <div class="flex items-center tab-wrap">
            <div class="flex-1 w-0 flex tab-list">
                <div
                    v-for="tab in propData.tabs"
                    :key="tab.key"
                    @click="tabChangeHandle(tab)"
                    class="pointer tab-item"
                    :class="{
                        active: tab.key == activeKey
                    }"
                >
                    <div class="text">{{ tab.text }}</div>
                </div>
            </div>
            <div class="drag_container" idm-ctrl-inner :idm-ctrl-id="moduleObject.id" idm-container-index="extra"></div>
        </div>
        <div v-if="propData.enablePannel" class="flex-1">
            <div v-for="tab in propData.tabs" :key="tab.key" class="drag_container" idm-ctrl-inner :idm-ctrl-id="moduleObject.id" :idm-container-index="tab.key"></div>
        </div>
    </div>
</template>

<script>
import bindStyles from '../mixins/bindStyles'
import bindProp from '../mixins/bindProp'
export default {
    mixins: [
        bindStyles(),
        bindProp({
            tabs: [
                {
                    key: '1',
                    text: '页签1',
                    active: true
                },
                {
                    key: '2',
                    text: '页签2'
                },
                {
                    key: '3',
                    text: '页签3'
                }
            ]
        })
    ],
    data() {
        return {
            activeKey: ''
        }
    },
    mounted() {
        this.init()
    },
    computed: {},
    watch: {
        activeKey: {
            handler(value) {
                this.propData.linkageStart
                    ?.filter((n) => n.actionType == 'tabChange')
                    .forEach((n) => {
                        window.IDM.broadcast?.send({
                            type: n.type == 'custom' ? n.customType : n.type,
                            messageKey: this.propData.ctrlId,
                            rangeModule: n.module?.map((item) => item.moduleId),
                            message: {
                                activeKey: value
                            }
                        })
                    })
            }
        }
    },
    methods: {
        setContextValue(object) {},
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr
            this.init()
        },
        init() {
            this.activeKey = this.propData.tabs.find((n) => n.actived)?.key || ''
            this.initData()
        },
        initData() {},
        tabChangeHandle(tab) {
            this.activeKey = tab.key
        }
    }
}
</script>
<style lang="scss" scoped>
@use '../style/common.scss';
.idm-db-IMultipleTabPannel {
    .tab {
        &-wrap {
            border-bottom: 1px solid #ddd;
        }
        &-list {
            gap: 10px;
        }
        &-item {
            padding: 0 32px;
            position: relative;
            .text {
                font-size: 18px;
                color: #666666;
                padding: 10px 0;
                border-bottom: 1.5px solid transparent;
            }
            &.active {
                .text {
                    color: var(--main-color, #0073ca);
                    border-bottom-color: var(--main-color, #0073ca);
                }
            }
            &:after {
                position: absolute;
                content: '';
                background: #dddddd;
                width: 1px;
                height: 50%;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
            }
            &:first-child {
                padding-left: 0;
            }
            &:last-child {
                padding-right: 0;
                &:after {
                    display: none;
                }
            }
        }
    }
}
</style>
