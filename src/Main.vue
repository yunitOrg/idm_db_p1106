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
                //   logName: 'iX8IHbq4+GjO2DDwqJuunT+JlOIESVcEDeUTOKxIlEnvMj7PXxpbEXQtBsctjhWea2iVq+uhKKmN1x+sJu0hnYlCq9qteFxp/pvSDUU3tT8j4vAYqmMRB5eVktNWB6DycE9zboOYPNaIg4W378vVOBJYBVlGxlKMVO7NmbSLuqs=',
                //   password: 'Re70Rlv5mIXthH3nkJk68nDxr2/oKq2ZUrGI+V1bqjaKYyrooBx6ruXfFmUaqB/0vmvochfIsS0aHVdZqmq4yDk/HrNNym0WqYDuevp1OctPfvuvodmhkFiUhu2NtL9HqkI7aZkFOUIxrh0Q5/mDMMry28/CzD8jjiToeceAh9w=',
                //   verifyCode: 1,
                //   // unitId: '1912121746591gjCGWEyAnixZD052E9',
                //   verifyCodeKey: '240821111259fyLOfQNVtAaZ3LaSRvF',
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

