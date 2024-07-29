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
                //   logName: 'hunsr/ChedTDU4Y5FhebQq9EXXZZa0AIw6wtTZSzI3dvR2nRL3BlOWsqeeyxi6IgW5O3uyTRsE33airrCeS1i96bU2fLz5GIbbIXB1Zd19FPuPhvak9g9eoSnw7Kim+ASejHgWKkrrXlKtLSSLu5g9eIOw/SQL7AvBGcrKwll04=',
                //   password: 'WLFk6u3Wh6F2MxRFErzeiVn5av6FkusZNlvEleo7sNaZmEvkqco86DURrYheuV3VAQ/K0XsuR+4CzbsQno72PukUT/j0+KVXJSdsNbyyy0s5bOzHN+kwqfEi6S2Il+AY+U/Kl1PJsO5UTgjZrcSkmRpXjm28RL/Cz0XqCBcaqKo=',
                //   verifyCode: 1,
                //   // unitId: '1912121746591gjCGWEyAnixZD052E9',
                //   verifyCodeKey: '240729161924EdAKR7WkULtAJVnP6KR',
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
