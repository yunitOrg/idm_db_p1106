<template>
    <div class="flex items-center top-bar">
        <div class="logo"></div>
        <div class="flex-1 w-0 truncate name">领导工作台：{{ leaderInfo.name }}</div>
        <div @click="exitHandle" class="pointer exit"></div>
    </div>
</template>
<script>
export default {
    props: {
        params: {
            type: Object
        },
        leaderInfo: {
            type: Object
        },
    },
    methods: {
        exitHandle() {
            // window.close()
            const url = IDM.url.getWebPath('/ctrl/logout?loginFrom=ctrl/login');
            window.open(url,"_self")
        }
    }
}
</script>
<style lang="scss" scoped>
.top-bar {
    padding: 1.56rem 6.25rem;
    gap: 1.75rem;
    background: rgba(0, 0, 0, 0.22);
    .logo {
        width: 5.93rem;
        height: 6.25rem;
        background: url('./images/logo-big.png') no-repeat;
        background-size: contain;
    }
    .name {
        font-size: 4rem;
        color: white;
    }
    .exit {
        width: 4rem;
        height: 4rem;
        background: url('./images/icon_exit.png') no-repeat;
        background-size: contain;
    }
}
</style>
