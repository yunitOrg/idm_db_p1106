<template>
    <div ref="chart"></div>
</template>
<script>
import * as echarts from 'echarts'
export default {
    props: {
        option: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            instance: null
        }
    },
    watch: {
        option: {
            handler(option) {
                this.setOption(option)
            },
            deep: true
        }
    },
    mounted() {
        this.instance = echarts.init(this.$refs.chart)
        this.setOption(this.option)
        this.instance.on('click', (e) => this.$emit('click', e))
        const obs = new ResizeObserver((e) => {
            this.instance.resize()
        })
        obs.observe(this.$refs.chart)
    },
    methods: {
        setOption(option) {
            this.instance?.setOption(option)
        }
    }
}
</script>
