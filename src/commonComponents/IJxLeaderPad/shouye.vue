<template>
    <div class="h-full shouye-warp">
       <div class="top">
            <div class="title">事项分类</div>
            <div class="content">
                <div class="item" @click="onHomeType('事项分类',index+1,sxflData)" v-for="(el,index) in sxflData" :key="index">
                    <!-- <img :src="require(`./images/sxfl${index+1}.png`)" alt=""> -->
                    <!-- <img :src="IDM.url.getModuleAssetsWebPath(require(`./images/sxfl${index+1}.png`))" alt=""> -->
                    <div class="img"></div>
                    <div class="num">{{el.num}}</div>
                    <div class="text">{{el.text}}</div>
                </div>
            </div>
       </div>
       <div class="bottom">
            <div class="cbdw">
                <div class="title">承办单位</div>
                <div class="content">
                    <div class="item" @click="onHomeType('承办单位',index+1,cbdwData)" v-for="(el,index,) in cbdwData" :key="index">
                        <div class="left">
                            <div class="icon"></div>
                            <div class="text">{{el.text}}</div>
                        </div>
                        <div class="right">{{el.num}}</div>
                    </div>
                </div>
            </div>
            <div class="tbgz">
                <div class="title">特别关注</div>
                <div class="content">
                    <div v-for="(el,index) in tbgzData" :key="index">
                        <div class="icon">{{el.text}}</div>
                        <div>
                            <div class="num" @click="onHomeType('特别关注',index+1,tbgzData)">{{el.num}}</div>
                            <div class="text" @click="onHomeType('特别关注',index+1,tbgzData)">点击查看></div>
                        </div>
                    </div>
                </div>
            </div>
       </div>
    </div>
</template>
<script>
export default {
    props: {
        params: {
            type: Object
        },
        data: {
            type: Object
        }
    },
    data() {
        return {
           sxflData:[ 
                // {
                //     num:"119",
                //     text:"重点批示"
                // },
                // {
                //     num:"180",
                //     text:"重要文件"
                // },
                // {
                //     num:"219",
                //     text:"重要任务"
                // },
                // {
                //     num:"98",
                //     text:"交办事项"
                // },
                // {
                //     num:"219",
                //     text:"调查核实"
                // },
                // {
                //     num:"219",
                //     text:"提案建议"
                // },
           ],
           cbdwData:[
                // {
                //     text:"省政府部门",
                //     num:"8,000"
                // },
                // {
                //     text:"设区市政府",
                //     num:"1,000"
                // }
           ],
           tbgzData:[
                // {
                //     text:"亮点",
                //     num:"8,000",
                // },
                // {
                //     text:"难点",
                //     num:"133",
                // },
                // {
                //     text:"风险点",
                //     num:"8",
                // }
           ],
           a: ""
        }
    },
    computed: {
        query() {
            return {
                ...this.params,
                orgId: ""
            }
        }
    },
    methods: {
        // 获取首页数据信息
        fetchData() {
            window.IDM.http
                .post(
                    this.a+'ctrl/dbWorkbench/getLeaderPadNoticeStatisticsData',
                    {
                        ...this.query,
                        pageNo: 1,
                        pageSize: 9999,
                        bt:"",
                        startTime:"",
                        endTime:""
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(({ data }) => {
                    this.sxflData=data.data.sxflData
                    this.cbdwData=data.data.cbdwData
                    this.tbgzData=data.data.tbgzData
                })
                .finally(() => {
                })
        },
        onHomeType(type,value,el){
            this.$emit('onHomeType',{type,value:el[0].text=='分管部门'?3:value,el})
        }
    },
    mounted() {
        this.fetchData()
    }
}
</script>
<style lang="scss" scoped>
.shouye-warp {
    border-radius: 1.25rem;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .top{
        width: 100%;
        height: 42%;
        background: #fff;
        background: #FFFFFF;
        border-radius: 1.67rem;
        padding: 1rem 2rem 1.5rem 2rem;
        display: flex;
        flex-direction: column;
        .title{
            display: block;
            font-family: PingFangSC-Medium;
            font-size: 4rem;
            color: #333333;
            font-weight: 500;
            margin-bottom: 1rem;
        }
        .content{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 100%;
            .item{
                height: 100%;
                width: 28.33rem;
                border-radius: 1.67rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center ;
                cursor: pointer;
                .img{
                    width: 9.17rem;
                    height: 9.17rem;
                }
                .num{
                    margin-top: 1rem;
                }
                .text{
                    font-family: PingFangSC-Regular;
                    font-size: 3.17rem;
                    color: #8F8F8F;
                    letter-spacing: 0;
                    text-align: center;
                    line-height: 2.87rem;
                    font-weight: 400;
                    margin-top: 1.5rem;
                }
            }
            &>div:nth-child(1){
                background-image: linear-gradient(180deg, rgba(218,239,255,0.80) 0%, rgba(242,249,255,0.80) 100%);
                border: 0.17rem solid rgba(208,223,255,1);
                .img{
                    background: url(./images/sxfl1.png) no-repeat;
                    background-size: 100% 100%;
                }
                .num{
                    font-family: Helvetica-Bold;
                    font-size: 5rem;
                    color: #2B72EE;
                    letter-spacing: 0;
                    text-align: center;
                    line-height: 3.85rem;
                    font-weight: 700;
                }
            }
            &>div:nth-child(2){
                background-image: linear-gradient(180deg, rgba(255,232,218,0.80) 0%, rgba(255,249,242,0.80) 100%);
                border: 0.17rem solid rgba(253,225,205,1);
                font-family: Helvetica-Bold;
                .img{
                    background: url(./images/sxfl2.png) no-repeat;
                    background-size: 100% 100%;
                }
               .num{
                    font-size: 5rem;
                    color: #F89947;
                    letter-spacing: 0;
                    text-align: center;
                    line-height: 3.85rem;
                    font-weight: 700;
               }
            }
            &>div:nth-child(3){
                background-image: linear-gradient(180deg, rgba(230,194,194,0.80) 0%, rgba(255,250,250,0.80) 99%);
                border: 0.17rem solid rgba(223,181,181,1);
                .img{
                    background: url(./images/sxfl3.png) no-repeat;
                    background-size: 100% 100%;
                }
                .num{
                    font-family: Helvetica-Bold;
                    font-size: 5rem;
                    color: #B75151;
                    letter-spacing: 0;
                    text-align: center;
                    line-height: 3.85rem;
                    font-weight: 700;
                }
            }
            &>div:nth-child(4){
                background-image: linear-gradient(180deg, rgba(194,230,208,0.80) 0%, rgba(250,255,252,0.80) 100%);
                border: 0.17rem solid rgba(181,223,196,1);
                .img{
                    background: url(./images/sxfl4.png) no-repeat;
                    background-size: 100% 100%;
                }
                .num{
                    font-family: Helvetica-Bold;
                    font-size: 5rem;
                    color: #51B78E;
                    letter-spacing: 0;
                    text-align: center;
                    line-height: 3.85rem;
                    font-weight: 700;
                }
            }
            &>div:nth-child(5){
                background-image: linear-gradient(180deg, rgba(229,218,255,0.80) 1%, rgba(246,242,255,0.80) 100%);
                border: 0.17rem solid rgba(231,205,253,1);
                .img{
                    background: url(./images/sxfl5.png) no-repeat;
                    background-size: 100% 100%;
                }
                .num{
                    font-family: Helvetica-Bold;
                    font-size: 5rem;
                    color: #7D53FB;
                    letter-spacing: 0;
                    text-align: center;
                    line-height: 3.85rem;
                    font-weight: 700;
                }
            }
            &>div:nth-child(6){
                background-image: linear-gradient(180deg, rgba(218,239,255,0.80) 0%, rgba(242,249,255,0.80) 100%);
                border: 0.17rem solid rgba(208,223,255,1);
                .img{
                    background: url(./images/sxfl6.png) no-repeat;
                    background-size: 100% 100%;
                }
                .num{
                    font-family: Helvetica-Bold;
                    font-size: 5rem;
                    color: #2B72EE;
                    letter-spacing: 0;
                    text-align: center;
                    line-height: 3.85rem;
                    font-weight: 700;
                }
            }
        }
    }
    .bottom{
        width: 100%;
        height: 55%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .cbdw{
            height: 100%;
            width: 39%;
            background: #FFFFFF;
            border-radius: 1.67rem;
            padding: 1rem 2rem 1.5rem 2rem;
            .title{
                display: block;
                font-family: PingFangSC-Medium;
                font-size: 4rem;
                color: #333333;
                font-weight: 500;
                margin-bottom: 1rem;
            }
            .content{
                width: 100%;
                height: 80%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .item{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 3rem;
                    cursor: pointer;
                    .left{
                        display: flex;
                        align-items: center;
                        .text{
                            font-family: PingFangSC-Medium;
                            font-size: 3.17rem;
                            color: #333333;
                            letter-spacing: 0;
                            line-height: 2.87rem;
                            font-weight: 500;
                            margin-left: 3rem;
                        }
                    }
                    .right{
                        margin-right: 7rem;
                    }
                }
                &>div:nth-child(1){
                    width: 100%;
                    height: 45%;
                    background:url(./images/cbdw1.png) no-repeat;
                    background-size: 100% 100%;
                    border-radius: 0.98rem;
                    .icon{
                        width: 10rem;
                        height: 10rem;
                        background: url(./images/cbdw-icon1.png) no-repeat;
                        background-size: 100% 100%;
                    }
                    .right{
                        font-family: Helvetica-Bold;
                        font-size: 5rem;
                        color: #2B72EE;
                        letter-spacing: 0;
                        text-align: right;
                        line-height: 5rem;
                        font-weight: 700;
                    }
                }
                &>div:nth-child(2){
                    width: 100%;
                    height: 45%;
                    background:url(./images/cbdw2.png) no-repeat;
                    background-size: 100% 100%;
                    border-radius: 0.98rem;
                    .icon{
                        width: 10rem;
                        height: 10rem;
                        background: url(./images/cbdw-icon2.png) no-repeat;
                        background-size: 100% 100%;
                    }
                    .right{
                        font-family: Helvetica-Bold;
                        font-size: 5rem;
                        color: #51B78E;
                        letter-spacing: 0;
                        text-align: right;
                        line-height: 5rem;
                        font-weight: 700;
                    }
                }
            }
        }
        .tbgz{
            height: 100%;
            width: 59%;
            background: url(./images/tbgzbg.png)no-repeat;
            background-size: 100% 100%;
            border-radius: 1.67rem;
            padding: 1rem 2rem 1.5rem 2rem;
            .title{
                display: block;
                font-family: PingFangSC-Medium;
                font-size: 4rem;
                color: #333333;
                font-weight: 500;
                margin-bottom: 1rem;
            }
            .content{
                width: 100%;
                height: 80%;
                background: rgba(255, 255, 255,0.7);
                box-shadow: inset 0rem 0.08rem 1rem 0rem rgba(71,163,255,0.53);
                border-radius: 3.08rem;
                padding: 4rem 6rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                &>div{
                    width: 30%;
                    height: 100%;
                    background: rgba(255,255,255,0.65);
                    border-radius: 1.33rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    .icon{
                        width: 80%;
                        height: 6rem;
                        background: url(./images/tbgz-icon1.png) no-repeat;
                        background-size: 100% 100%;
                        font-family: PingFangSC-Medium;
                        font-size: 3.17rem;
                        color: #333333;
                        letter-spacing: 0;
                        line-height: 2.87rem;
                        font-weight: 500;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    &>div:nth-child(2){
                        width: 100%;
                        height: calc(100% - 6rem);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        .num{
                            font-family: Helvetica-Bold;
                            font-size: 5rem;
                            color: #2B72EE;
                            letter-spacing: 0;
                            text-align: center;
                            line-height: 5rem;
                            font-weight: 700;
                            cursor: pointer;
                        }
                        .text{
                            font-family: PingFangSC-Regular;
                            font-size: 2.33rem;
                            color: #BDBDBD;
                            letter-spacing: 0;
                            text-align: center;
                            line-height: 2.33rem;
                            font-weight: 400;
                            margin-top: 4.65rem;
                            cursor: pointer;
                        }
                    }
                }
                &>div:nth-child(2){
                    .icon{
                        background: url(./images/tbgz-icon2.png) no-repeat;
                        background-size: 100% 100%;
                    }
                    &>div:nth-child(2){

                        .num{
                            color: #B75151;
                        }
                    }
                }
                &>div:nth-child(3){
                    .icon{
                        background: url(./images/tbgz-icon3.png) no-repeat;
                        background-size: 100% 100%;
                    }
                    &>div:nth-child(2){

                        .num{
                            color: #7451B7;
                        }
                    }
                }
            }
        }
    }
}
</style>
