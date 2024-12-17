<template>
    <div class="flex flex-col">
        <div class="tabs-wrap">
            <div class="flex items-end tab-scroll">
                <div
                    v-for="tab in items"
                    :key="tab.value"
                    @click="changeHandle(tab)"
                    class="flex items-center tab-item"
                    :class="{
                        active: value == tab.value
                    }"
                >
                    <div class="label">{{ tab.label }}</div>
                    <div class="badge">{{ tab.count }}</div>
                </div>
            </div>
        </div>
        <div class="flex-1 h-0 content">
            <slot></slot>
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
.tabs-wrap {
    position: relative;
    &:before {
        position: absolute;
        content: '';
        inset: 0;
        top: 1rem;
        background-color: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.35);
    }
    .tab-scroll {
        overflow-x: auto;
        overflow-y: hidden;
        width: 100%;
    }
    .tab-item {
        color: white;
        padding: 0 2.58rem;
        position: relative;
        cursor: pointer;
        .label {
            font-size: 2.75rem;
            padding: 0.8rem 0;
            white-space: nowrap;
            position: relative;
        }
        .badge {
            font-size: 2rem;
            padding: 0 0.63rem;
            margin-top: -1.8rem;
            position: relative;
        }
        &:before {
            position: absolute;
            right: 0;
            top: 25%;
            bottom: 25%;
            content: '';
            display: block;
            width: 0.13rem;
            background: rgba(255, 255, 255, 0.3);
        }
        &.active {
            gap: 0.63rem;
            position: relative;
            padding: 1rem 3rem 0;
            .label {
                color: black;
                font-weight: bold;
            }
            .badge {
                background-image: linear-gradient(180deg, #f26a51 2%, #ff3b30 98%);
                border-radius: 5rem 5rem 5rem 0rem;
                color: white;
            }
            &:before {
                position: absolute;
                display: block;
                content: '';
                background-color: white;
                border-radius: 1.25rem 1.25rem 0rem 0rem;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                width: auto;
                z-index: 0;
                transform: perspective(20px) rotateX(5deg);
            }
            &:after {
                position: absolute;
                content: '';
                bottom: 0;
                left: 2.75rem;
                right: 2.75rem;
                height: 0;
                border: 0.44rem solid #0b7eed;
                border-color: transparent transparent #0b7eed transparent;
            }
        }
        &:last-child {
            &:after {
                display: none;
            }
        }
    }
}
.content {
    background-color: white;
    padding: 1.5rem;
    border-radius: 0rem 0rem 1.25rem 1.25rem;
}
</style>
