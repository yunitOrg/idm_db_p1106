<template>
    <div class="flex tabs-wrap">
        <div
            v-for="tab in tabs"
            :key="tab.value"
            @click="changeHandle(tab)"
            class="tab-item"
            :class="{
                active: value == tab.value
            }"
        >
            {{ tab.label }}
        </div>
    </div>
</template>
<script>
export default {
    props: {
        value: {
            type: [String, Number],
            required: true
        },
        tabs: {
            type: Array,
            required: true
        }
    },
    methods: {
        changeHandle(tab) {
            this.$emit('input', tab.value)
        }
    }
}
</script>
<style lang="scss" scoped>
.tabs-wrap {
    .tab-item {
        width: 88px;
        text-align: center;
        padding: 6px 0;
        font-size: 18px;
        color: white;
        cursor: pointer;
        background: #000321;
        border: 1px solid rgba(0, 108, 154, 1);
        box-shadow: inset 0px 0px 10px 4px rgba(0, 188, 212, 0.3);
        &.active {
            color: #3effff;
            background: #051d43;
            border: 1px solid rgba(9, 162, 227, 1);
            box-shadow: inset 0px 0px 10px 4px rgba(0, 103, 247, 0.5);
        }
    }
}
</style>
