<template>
    <div class="flex justify-center nav-wrap">
        <div
            v-for="nav in items"
            :key="nav.value"
            @click="changeHandle(nav)"
            class="pointer nav-item"
            :class="{
                active: value == nav.value
            }"
        >
            {{ nav.label }}
        </div>
    </div>
</template>
<script>
export default {
    props: {
        value: {
            type: [Number, String],
            required: true
        },
        items: {
            type: Array,
            default() {
                return []
            }
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
.nav-wrap {
    padding: 2.5rem;
    gap: 7.77rem;
    .nav-item {
        background: url('./images/nav_item.png') no-repeat;
        background-size: 100% 100%;
        width: 18.75rem;
        height: 7.19rem;
        color: #6a6a6a;
        font-size: 2.75rem;
        text-align: center;
        line-height: 5.5rem;
        &.active {
            background-image: url('./images/nav_item_active.png');
            color: #096efe;
        }
    }
}
</style>
