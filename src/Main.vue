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
                //   logName: 'ca7QwJXqSujbOiNUJWZqY7jeTBBLXL7UvlQpJzAg9E+J93YOE1VXtn9Qix8NyL1VwEM+jsKlwILqRsueiSwHSZGgw7fmXBZzeU86NiuvtHW2/RQtaMLxgI4MnyjJUXLrqQV/dva9CMCtsd/QOpDcN4uAQO3PJ1uc2gs3Aieix5M=',
                //   password: 'koNBnu6kxJQQC4e2KCFboufWR/1od6m3BEwvavhI95WNvlFwzQv9PWHJ3Mtrr7HXsupvlXPDQ8ZKhm81m5cTnnRbkoviw2kH9n+UZel/oDmtGz/imGF2XTEA7iAKEsGNJNP4KFjvACPTqJtkh9r7qtgT5Nk28iW3FpuJns3v1Qo=',
                //   verifyCode: 1,
                //   // unitId: '1912121746591gjCGWEyAnixZD052E9',
                //   verifyCodeKey: '240720131502MegfFDwBr76iD1nZNb3',
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
