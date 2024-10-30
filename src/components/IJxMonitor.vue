<template>
    <div
        class="h-full flex items-stretch wrap"
        :style="{
            padding: '20px 40px',
            gap: propData.gap,
            width: '3840px',
            height: '1235px'
        }"
    >
        <div
            class="flex-1 w-0 flex flex-col"
            :style="{
                gap: propData.gap
            }"
        >
            <div
                class="flex items-stretch"
                :style="{
                    height: '455px',
                    gap: propData.gap
                }"
            >
                <Trend :year="year" class="flex-1 w-0" />
                <Dash :year="year" class="flex-1 w-0" />
            </div>
            <Under
                :year="year"
                :style="{
                    flex: 2
                }"
            />
        </div>
        <Main :year="year" class="flex-1 w-0 flex flex-col" />
        <div
            class="flex-1 w-0 flex flex-col"
            :style="{
                gap: propData.gap
            }"
        >
            <div
                class="flex items-stretch"
                :style="{
                    height: '550px',
                    gap: propData.gap
                }"
            >
                <Focus :year="year" class="flex-1 w-0" />
                <Times :year="year" class="flex-1 w-0" />
            </div>
            <Oversee
                :year="year"
                :style="{
                    flex: 2
                }"
            />
        </div>
    </div>
</template>
<script>
import Times from '../commonComponents/IJxMonitor/times/index.vue'
import Trend from '../commonComponents/IJxMonitor/trend/index.vue'
import Dash from '../commonComponents/IJxMonitor/dash/index.vue'
import Oversee from '../commonComponents/IJxMonitor/oversee/index.vue'
import Focus from '../commonComponents/IJxMonitor/focus/index.vue'
import Main from '../commonComponents/IJxMonitor/main/index.vue'
import Under from '../commonComponents/IJxMonitor/under/index.vue'
export default {
    components: {
        Trend,
        Times,
        Dash,
        Oversee,
        Focus,
        Main,
        Under
    },
    data() {
        return {
            year: '2024',
            propData: {
                gap: '30px'
            }
        }
    }
}
</script>
<style lang="scss">
.flex {
    display: flex;
}
.flex-col {
    flex-direction: column;
}
.flex-1 {
    flex: 1;
}
.flex-wrap {
    flex-wrap: wrap;
}
.justify-center {
    justify-content: center;
}
.justify-between {
    justify-content: space-between;
}
.justify-around {
    justify-content: space-around;
}
.items-center {
    align-items: center;
}
.items-stretch {
    align-items: stretch;
}
.items-end {
    align-items: flex-end;
}
.h-full {
    height: 100%;
}
.w-full {
    width: 100%;
}
.w-0 {
    width: 0;
}
.h-0 {
    height: 0;
}
</style>
<style lang="scss" scoped>
.wrap {
    background: #020e29;
}
</style>
