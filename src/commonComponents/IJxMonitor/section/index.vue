<template>
    <div class="section-wrap">
        <div class="section-title">
            <div class="section-title-text">{{ title }}</div>
            <slot name="extra"></slot>
        </div>
        <div class="section-content">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        }
    }
}
</script>
<style lang="scss" scoped>
.section {
    &-wrap {
        display: flex;
        flex-direction: column;
    }
    &-title {
        background: linear-gradient(
                -87deg,
                rgba(7, 79, 194, 0) 0%,
                rgba(4, 55, 148, 0.2) 18%,
                rgba(0, 26, 100, 0.69) 42%,
                rgba(0, 121, 203, 0.62) 76%,
                rgba(32, 80, 249, 0.58) 100%
            ),
            url('./images/section_title.png') no-repeat left center/auto 100%;
        display: flex;
        align-items: center;
        &-text {
            flex: 1;
            width: 0;
            font-size: 20px;
            color: white;
            padding: 10px 34px;
        }
    }
    &-content {
        flex: 1;
        height: 0;
        background-image: linear-gradient(180deg, rgba(10, 34, 145, 0) 0%, rgba(9, 52, 107, 0.3) 34%);
        border: 1px solid;
        border-image: linear-gradient(to bottom, #1961d8, #1961d8, rgba(12, 124, 255, 0)) 1;
    }
}
</style>
