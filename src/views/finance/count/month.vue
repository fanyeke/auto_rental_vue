<template>
    <div>
        <el-card>
            <div>
                当月应收金额: <el-tag type="success">{{countRentPayable}}</el-tag>
                当月实收金额: <el-tag type="warning">{{countRentActual}}</el-tag>
                当月收到押金: <el-tag type="danger">{{countDeposit}}</el-tag>
            </div>
        </el-card>
        <el-card>
            <div ref="rentalchart" :style="{ width: '90%', height: '400px' }"></div>
        </el-card>
        <el-card>
            <div ref="returnchart" :style="{ width: '90%', height: '400px' }"></div>
        </el-card>
    </div>
</template>
<script>
import * as echarts from "echarts";
import financeUtil from "@/api/finance"
export default {
    data() {
        return {
            rentalchart: null,
            returnchart: null,
            dayRental: [],
            dayReturn: [],
            rentalNum: [],
            returnNum: [],
            countRentPayable:100,
            countRentActual:100,
            countDeposit:100
        }

    },
    created() {
        this.getCost()
    },
    methods: {
        getCost(){
            financeUtil.countMonthCost().then(res => {
                if (res.success){
                    this.countRentPayable=res.data.countRentPayable
                    this.countRentActual=res.data.countRentActual
                    this.countDeposit=res.data.countDeposit
                }
            })
        },
        getData() {
            //访问后台接口获取数据 
            financeUtil.countMonthRental().then(res => {
                if (res.success) {
                    this.dayRental = res.data[0];
                    this.rentalNum = res.data[1];
                    this.updateRentalChart();
                }

            })
            financeUtil.countMonthReturn().then(res => {
                if (res.success) {
                    this.dayReturn = res.data[0];
                    this.returnNum = res.data[1];
                    this.updateReturnChart();
                }
            })

        },
        updateRentalChart() {
            this.rentalchart.setOption({
                xAxis: {
                    data: this.dayRental
                },
                series: [
                    {
                        data: this.rentalNum
                    },
                ]
            })
        },
        updateReturnChart() {
            this.returnchart.setOption({
                xAxis: {
                    data: this.dayReturn
                },
                series: [
                    {
                        data: this.returnNum
                    },
                ]
            })
        },
        initRentalchart() {
            this.rentalchart = echarts.init(this.$refs.rentalchart);
            this.rentalchart.setOption({
                title: {
                    text: '月报出租数据统计',
                    subtext: new Date().toLocaleDateString(),
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['出租数量']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        mark: { show: true },
                        dataView: { readOnly: false, show: true },
                        magicType: { type: ['line', 'bar'], show: true },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisTick: { show: false },
                    data: this.dayRental
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '出租数量',
                        type: 'line',
                        barGap: 0,
                        emphasis: {
                            focus: 'series'
                        },
                        data: this.rentalNum
                    },
                ]
            })
        },
        initReturnchart() {
            this.returnchart = echarts.init(this.$refs.returnchart);
            this.returnchart.setOption({
                title: {
                    text: '月报归还数据统计',
                    subtext: new Date().toLocaleDateString(),
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['归还数量']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        mark: { show: true },
                        dataView: { readOnly: false, show: true },
                        magicType: { type: ['line', 'bar'], show: true },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisTick: { show: false },
                    data: this.dayReturn
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '归还数量',
                        type: 'line',
                        barGap: 0,
                        emphasis: {
                            focus: 'series'
                        },
                        data: this.returnNum
                    },
                ]
            })
        },
    },
    mounted() {
        this.initRentalchart();
        this.initReturnchart();
        this.getData();
    },
}
</script>
<style></style>