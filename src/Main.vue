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
                //   logName: 'KaBxKir1Q2X1CXRYsEuK/0c0Hs4Q3TwgK5141reMz5MgX60waQZcoqZW6igp16XUy9nQJTyf4ghCyWUUN+zrezQ6HLIouu5nbJklWrKJ7TRTlfcqAvQh9STjbTVoAf0B3l7B7zq7tIzlWY5VKQehQ3tSHIsEWpDuVNTGs6U381c=',
                //   password: 'ORL9LtvVJnx+7Q+SnftnLE/2dmbif1Onfqso3P1YvyZQXx5LJtFFN1FUMJlrWnxe6mXG6yVOgrqxC7TtpNnAhjuVgA0wxLSwes3fWKy0PaHlyyLZ/4cP8VtThWD0ypW7WHX54+/FTCHO9efLC0lqdzWOpFPzg3WJsArd5yIfXHI=',
                //   verifyCode: 1,
                //   // unitId: '1912121746591gjCGWEyAnixZD052E9',
                //   verifyCodeKey: '240624182507YuJUaanV6OXUbm87MHF',
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
