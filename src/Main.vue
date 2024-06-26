<template>
    <component :is="`${componentName}`" :ref="`${componentName}`" />
</template>

<script>
export default {
    name: 'Main',
    components: {},
    data() {
        return {
            componentName: '',
        }
    },
    props: {},
    created() {
        this.login()
    },
    methods: {
        login() {
            if ( process.env.NODE_ENV == "development" ) {
                // IDM.http.post('/ctrl/login', {
                //   logName: 'JVPpP5/JQbhIw9eUN33oR3hNCCPlWYEYuPORGUMtYAwOm0EUaRJgt1n1IYEjjAmoEC39VDuX6bLo9jvgZCxOgbfXaqOP3+wbWogOeIntRegYCt0VclpumJlY5IrjsE1GiHren3xvWya48UkppcfW+3t08RqF+Q0VzH9bbh40VKQ=',
                //   password: 'g+AL4YxsbVLJvcSRJMx4uoc8k9+I0Wb700vbXDKVuUDLe8LSrh88iVOZGU/aq/WEzstSU04DPkXTvXcGaR7ET2ozUUfMnb4wb228R9B9PZiMcv+qo8C6qsa5rcBMSf1a3WLKdxwzbwJBuNMd27m+SYvzPdd1nWJUB8aCmJ899Mc=',
                //   verifyCode: 1,
                //   // unitId: '1912121746591gjCGWEyAnixZD052E9',
                //   verifyCodeKey: '24062615430528pVpu8MPQVzCGvujGp',
                //   w: '1920',
                //   h: '1032',
                //   decrypt: 'RSA',
                // })
            }
        }
    },
    mounted() {
        //这里需要把属性传递，并且把组件注册到核心框架提供的方法，然后这里接收固定的平台提供的几个方法，从而实现双向绑定刷新
        // alert(`${process.env.CodeVar}`)
        this.componentName = this.$root.componentName
        console.log(this.componentName)
    }
}
</script>

<style lang="scss">
@import './style/flex.scss';
</style>
