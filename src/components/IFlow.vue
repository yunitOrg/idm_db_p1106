<template>
    <div ref="container" idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id"></div>
</template>
<script>
import LogicFlow from '@logicflow/core'
import { bindStyle, bindProp } from '../mixins'
export default {
    mixins: [bindProp({}), bindStyle()],
    data() {
        return {
            data: {
                // 节点
                nodes: [
                    {
                        id: '50',
                        type: 'circle',
                        x: 100,
                        y: 100,
                        text: '圆形节点',
                        properties: {
                            style: {
                                fill: '#3b91f7'
                            }
                        }
                    },
                    {
                        id: '21',
                        type: 'html',
                        x: 300,
                        y: 100,
                        text: '矩形节点',
                        properties: {
                            radius: 100,
                            style: {
                                stroke: '#3b91f7'
                            }
                        }
                    }
                ],
                // 边
                edges: [
                    {
                        type: 'line',
                        sourceNodeId: '50',
                        targetNodeId: '21'
                    }
                ]
            }
        }
    },
    watch: {
        data: {
            handler(data) {
                this.setOptions(data)
            }
        }
    },
    mounted() {
        this.setOptions(this.data)
    },
    methods: {
        setOptions(data) {
            // 渲染画布
            const lf = new LogicFlow({
                container: this.$refs.container,
                width: 700,
                height: 600,
                isSilentMode: true,
                stopMoveGraph: true,
                stopZoomGraph: true,
                stopScrollGraph: true,
                disabledTools: ['multipleSelect', 'textEdit']
            })
            lf.render(data)
        }
    }
}
</script>
