<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="flex items-stretch idm-db-iStatCard">
        <div
            v-for="column in propData.columns"
            :key="column.key"
            @click="clickHandle(column)"
            class="flex-1 w-0 flex items-center item"
            :style="{
                '--bg-color': column.bgColor?.hex8,
                '--border-color': column.borderColor?.hex8,
                '--accent-color': column.accentColor?.hex8
            }"
        >
            <img :src="iconUrl(column.iconUrl)" class="icon" />
            <div class="flex-1 w-0">
                <div class="label">{{ column.title }}</div>
                <div class="value">{{ data[column.key] }}</div>
            </div>
        </div>
    </div>
</template>
<script>
import bindProp from '../mixins/bindProp'
import bindStyle from '../mixins/bindStyle'
import dataUtil from '../utils/dataUtil'
export default {
    mixins: [
        bindProp({
            columns: []
        }),
        bindStyle({
            _root() {
                return this.propData
            }
        })
    ],
    data() {
        return {
            data: {}
        }
    },
    mounted() {
        this.initData()
    },
    methods: {
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr
        },
        receiveBroadcastMessage(data) {
            if (this.propData.messageRefreshKey && this.propData.messageRefreshKey.length && data.type === 'websocket' && data.message) {
                const messageData = (typeof data.message === 'string' && JSON.parse(data.message)) || data.message
                const arr = this.propData.messageRefreshKey || []
                if (messageData.badgeType && arr.includes(messageData.badgeType)) {
                    this.initData()
                }
            }
        },
        initData() {
            console.log('iStatCard', this.propData)
            dataUtil
                .fetchData({
                    dataSourceType: 'dataSource',
                    dataSource: this.propData.dataSource
                })
                .then((res) => {
                    this.data = res
                })
        },
        clickHandle(item) {
            window.IDM.invokeCustomFunctions.call(this, this.propData.clickFunc, {
                item
            })
        },
        iconUrl(url) {
            return window.IDM.url.getWebPath(url)
        }
    }
}
</script>
<style lang="scss" scoped>
@use '../style/common.scss';
.idm-db-iStatCard {
    .item {
        margin: 0 7px;
        padding: 20px 30px;
        border: 1px solid var(--border-color);
        background-color: var(--bg-color);
        border-radius: 8px;
        line-height: 200%;
        .icon {
            width: 50px;
            height: 50px;
            margin-right: 14px;
        }
        .label {
            font-size: 16px;
        }
        .value {
            font-size: 30px;
            color: var(--accent-color);
        }
    }
}
</style>
