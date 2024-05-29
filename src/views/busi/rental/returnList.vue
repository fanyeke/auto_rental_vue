<template>
    <div>
        <el-main>
            <el-form :model="orderModel" :inline="true" label-width="80px" size="small">
                <el-form-item label="订单编号">
                    <el-input v-model="orderModel.orderNum" placeholder="请输入订单号"></el-input>
                </el-form-item>
                <el-form-item label="车牌号码">
                    <el-input v-model="orderModel.autoNum" placeholder="请输入车牌号码"></el-input>
                </el-form-item>
                <el-form-item label="客户姓名">
                    <el-input v-model="orderModel.customerName" placeholder="请输入客户姓名"></el-input>
                </el-form-item>
                <el-form-item label="客户电话">
                    <el-input v-model="orderModel.customerTel" placeholder="请输入客户电话"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch" icon="el-icon-search">查询</el-button>
                    <el-button type="warning" @click="resetForm" icon="el-icon-refresh">重置</el-button>
                </el-form-item>
            </el-form>
            <el-divider></el-divider>
            <!--表格数据-->
            <el-table :data="tableData" border stripe style="margin-bottom: 20px;">
                <el-table-column label="序号" width="50">
                    <template slot-scope="scope">
                        {{ (start - 1) * size + scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="orderNum" label="订单编号" width="200"></el-table-column>
                <el-table-column prop="autoNum" label="车牌号码"></el-table-column>
                <el-table-column prop="customerName" label="客户姓名"></el-table-column>
                <el-table-column prop="customerTel" label="客户电话"></el-table-column>
                <el-table-column prop="rentalTime" label="出租时间" width="200"></el-table-column>
                <el-table-column prop="typeName" label="出租类型"></el-table-column>
                <el-table-column prop="typeDiscount" label="享受折扣"></el-table-column>
                <el-table-column prop="rent" label="日租金额"></el-table-column>
                <el-table-column prop="deposit" label="车辆押金"></el-table-column>
                <el-table-column prop="mileage" label="行驶里程"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-search" size="small" type="success" @click="handleReturn(scope.row)">归还</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页组件-->
            <el-pagination background layout="total,prev, pager, next,jumper" :current-page="start" :page-size="size"
                :total="total" @current-change="search">
            </el-pagination>
            <!--归还弹窗-->
            <el-dialog title="车辆归还" :visible.sync="dialogVisible" width="50%">
                <el-form :model="saveOrder" :rules="rules" ref="form" label-width="100px" :inline="true">
                    <el-form-item label="订单编号">
                        <el-input v-model="saveOrder.orderNum" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="车牌号码">
                        <el-input v-model="saveOrder.autoNum" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="客户姓名">
                        <el-input v-model="saveOrder.customerName" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="客户电话">
                        <el-input v-model="saveOrder.customerTel" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="起租里程">
                        <el-input v-model="saveOrder.mileage" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="出租时间" >
                        <el-input v-model="saveOrder.rentalTime" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="出租类型" >
                        <el-input v-model="saveOrder.typeName" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="享受折扣" >
                        <el-input v-model="saveOrder.typeDiscount" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="日租金额">
                        <el-input v-model="saveOrder.rent" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="车辆押金">
                        <el-input v-model="saveOrder.deposit"readonly></el-input>
                    </el-form-item>
                    <el-form-item label="归还里程" prop="returnMileage">
                        <el-input v-model="saveOrder.returnMileage" @change="handleCheck"></el-input>
                    </el-form-item>
                    <el-form-item label="归还时间" prop="returnTime">
                        <el-date-picker v-model="saveOrder.returnTime" type="datetime" @change="handleChange"
                        placeholder="请选择归还时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-form-item>
                   
                    <el-form-item label="应付金额">
                        <el-input v-model="saveOrder.rentPayable" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="实付金额" >
                        <el-input v-model="saveOrder.rentActual" readonly></el-input>
                    </el-form-item>
                   
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button :disabled="isDisabled" type="primary" @click="doReturn()">归还</el-button>
                </div>
            </el-dialog>
        </el-main>
    </div>
</template>
<script>
import orderUtil from "@/api/order"
export default {
    data() {
        return {
            orderModel: {},
            start: 1,
            size: 5,
            total: 0,
            tableData: [],
            saveOrder:{},
            dialogVisible:false,
            isDisabled:false,
            rules:{
                returnMileage:[
                    {required:true,message:'请输入还车里程',trigger:'blur'}
                ],
                returnTime:[
                    {required:true,message:'请输入还车时间',trigger:'blur'}
                ]
            }
        }
    },
    created() {

        this.search()
       
    },
    methods: {
        async search(start=1){
            this.start=start
            let res=await orderUtil.searchUnfinished(this.start,this.size,this.orderModel)
            if (res.success){
                this.tableData=res.data.records;
                this.total=res.data.total
            }
        },
        handleSearch() { 
            this.search()
        },
        handleCheck(){
            if (this.saveOrder.returnMileage<=this.saveOrder.mileage){
                this.$message({
                    message:'还车里程必须大于起租里程',
                    type:'error'
                })
                this.isDisabled=true
            }else{
                this.isDisabled=false
            }
        },
        resetForm() {
            this.orderModel={}
            this.search()
         },
        handleReturn(row) { 
            this.saveOrder=Object.assign({},row)
            this.dialogVisible=true
            this.saveOrder.returnTime=this.getDateTime();
            this.countRent()
        },
        getDateTime(){
            let d=new Date();
            let year=d.getFullYear();
            let month=this.k2(d.getMonth()+1);
            let day=this.k2(d.getDate());
            let hour=this.k2(d.getHours());
            let minute=this.k2(d.getMinutes());
            let second=this.k2(d.getSeconds());
            return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second
         },
        k2(v){
            return v>=10?v:"0"+v;
        },
        //响应点击归还时间事件
        handleChange(){
            this.countRent()
        },
        countRent(){
            const rentalTime=new Date(this.saveOrder.rentalTime)
            const returnTime=new Date(this.saveOrder.returnTime)
            let timeDiff = Math.abs(rentalTime.getTime() - returnTime.getTime())
            let days= Math.ceil(timeDiff / (1000 * 60 * 60 * 24 ))
            let c1=days*this.saveOrder.rent;
            let c2=parseInt(c1*this.saveOrder.typeDiscount)
            this.saveOrder.rentPayable=c1;
            this.saveOrder.rentActual=c2;
        },
        doReturn(){
            this.$refs['form'].validate(valid=>{
                if (valid){
                    orderUtil.update(this.saveOrder).then(res=>{
                        if (res.success){
                            this.$message({
                                message:"车辆归还成功，请在订单详情中查看",
                                type:'success'
                            })
                            this.dialogVisible=false
                            this.search();
                        }
                    })
                }
            })
        }
    },
}
</script>
<style scoped></style>