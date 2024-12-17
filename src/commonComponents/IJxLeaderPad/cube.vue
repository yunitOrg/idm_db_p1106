<template>
    <div class="h-full flex flex-col cube-wrap" style="gap: 2.5rem">
        <div class="flex items-center justify-between">
            <div class="caption">办理效能分析</div>
            <div class="seg-warp">
                <div class="seg-item">省政府各部门</div>
            </div>
        </div>
        <div class="flex-1 h-0 flex items-stretch">
            <div class="flex-1 w-0"></div>
            <div class="flex flex-col">
                <div class="pannel"></div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.cube-wrap {
    background-color: white;
    padding: 1.5rem 3.75rem;
    border-radius: 1.25rem;
}
.caption {
    font-size: 3rem;
    color: #333;
}
.seg-warp {
    background: #f4f4f4;
    border-radius: 0.9rem;
    padding: 0.72rem 1.02rem;
    .seg-item {
        background: #ffffff;
        border-radius: 0.75rem;
        color: #096efe;
        font-size: 2.13rem;
        padding: 0.3rem 0.75rem;
    }
}
.pannel {
    background: #ffffff;
    border: 0.06rem solid rgba(225, 225, 225, 1);
    box-shadow: 0rem 0.13rem 0.75rem 0rem rgba(0, 0, 0, 0.1);
    border-radius: 1.25rem;
}
</style>
