<template>
    <div class="flex items-center status" :data-value="value">
        <div class="icon"></div>
        <div v-if="showLabel" class="label">{{ label }}</div>
    </div>
</template>
<script>
export default {
    props: {
        value: {
            type: Number,
            required: true
        },
        showLabel: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        label() {
            switch (this.value) {
                case 4:
                    return '超期'
                case 3:
                    return '临期'
                case 2:
                    return '预警'
                case 1:
                    return '正常'
            }
            return ''
        }
    }
}
</script>
<style lang="scss" scoped>
.status {
    gap: 1rem;
    .icon {
        width: 2rem;
        height: 2rem;
        border-radius: 50em;
    }
    .label {
        font-size: 2.38rem;
        color: #333333;
    }
    &[data-value='4'] .icon {
        background-image: radial-gradient(circle at 50% 50%, #ff8d8d 0%, #ca0000 50%);
    }
    &[data-value='3'] .icon {
        background-image: radial-gradient(circle at 50% 50%, #f3ab23 0%, #e56403 50%);
    }
    &[data-value='2'] .icon {
        background-image: radial-gradient(circle at 50% 51%, #fff497 0%, #ffd837 49%);
    }
    &[data-value='1'] .icon {
        background-image: radial-gradient(circle at 50% 50%, #c8ff8d 0%, #1eca00 50%);
    }
}
</style>
