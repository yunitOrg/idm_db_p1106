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
                //   logName: 'd8mMyvUNbJTK9f3+SsUE6bx5mByd70jqdmjAnxWtAxB0A0OIfQ18uJ72n+ltardU63NAHJ2NkSbIibHsIRVrjO0gMul3XhfqW4pI961+m6a2psV1ooyjU0jMKhixnfuTRAhI/bbEai8WjKpObj7O+o1TBymCAaXmlgxKI1187r0=',
                //   password: 'HznUAEfgWb0L9Ax1SEU6WWH+zGjnIcV+9MYTtDs8UEPZpffQ+U/Mn315fDDZwH2vD+MuoNNkfNzImLyeBvBTyUispJZMdZWm1M5U8fJ2W4cjYGHqoLUgfUPcZIIFXjS+Tcce+A0qey+h7aR2jMXZyHntQCBbo2Mlilf/f3SqmMw=',
                //   verifyCode: 1,
                //   // unitId: '1912121746591gjCGWEyAnixZD052E9',
                //   verifyCodeKey: '240627175613UICtaKNHUPqjf6th0Ed',
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
