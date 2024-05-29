<template>
    <div>
        <el-main>
            <el-form :inline="true" :model="orderModel" size="small">
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
                <el-table-column prop="autoNum" label="车牌号码"></el-table-column>
                <el-table-column prop="customerName" label="客户姓名"></el-table-column>
                <el-table-column prop="rentalTime" label="出租时间" width="200"></el-table-column>
                <el-table-column prop="returnTime" label="归还时间" width="200"></el-table-column>
                <el-table-column prop="typeName" label="出租类型"></el-table-column>
                <el-table-column prop="deposit" label="车辆押金"></el-table-column>
                <el-table-column prop="mileage" label="起租里程"></el-table-column>
                <el-table-column prop="returnMileage" label="归还里程"></el-table-column>
                <el-table-column prop="rentPayable" label="应付费用"></el-table-column>
                <el-table-column prop="rentActual" label="实付费用"></el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-search" size="small" type="success"
                            @click="handleDetail(scope.row)">详情</el-button>
                        <el-button icon="el-icon-picture-outline-round" size="small" type="danger"
                            @click="handleReturnDeposit(scope.row)" v-if="scope.row.depositReturn==0">押金返还</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页组件-->
            <el-pagination background layout="total,prev, pager, next,jumper" :current-page="start" :page-size="size"
                :total="total" @current-change="search">
            </el-pagination>
            <!--订单详情抽屉-->
            <el-drawer title="订单详情" :visible.sync="drawer" :direction="direction">
                <div class="infoItem">
                    订单编号:<span>{{ orderInfo.orderNum }}</span>
                </div>
                <div class="infoItem">
                    车牌号码:<span>{{ orderInfo.autoNum }}</span>
                </div>
                <div class="infoItem">
                    客户姓名:<span>{{ orderInfo.customerName }}</span>
                </div>
                <div class="infoItem">
                    客户电话:<span>{{ orderInfo.customerTel }}</span>
                </div>
                <div class="infoItem">
                    出租时间:<span>{{ orderInfo.rentalTime }}</span>
                </div>
                <div class="infoItem">
                    出租类型:<span>{{ orderInfo.typeName }}</span>
                </div>
                <div class="infoItem">
                    享受折扣:<span>{{ orderInfo.typeDiscount }}</span>
                </div>
                <div class="infoItem">
                    日租金额:<span>{{ orderInfo.rent }}</span>
                </div>
                <div class="infoItem">
                    车辆押金:<span>{{ orderInfo.deposit }}</span>
                </div>
                <div class="infoItem">
                    起租里程:<span>{{ orderInfo.mileage }}</span>
                </div>
                <div class="infoItem">
                    归还时间:<span>{{ orderInfo.returnTime }}</span>
                </div>
                <div class="infoItem">
                    归还里程:<span>{{ orderInfo.returnMileage }}</span>
                </div>
                <div class="infoItem">
                    应付金额:<span>{{ orderInfo.rentPayable }}</span>
                </div>
                <div class="infoItem">
                    实付金额:<span>{{ orderInfo.rentActual }}</span>
                </div>
                <div class="infoItem">
                    押金返还:<span>{{ orderInfo.depositReturn == 0 ? '未返还' : '已返还' }}</span>
                </div>
                <div>
                    <el-button type="primary" icon="el-icon-sunny" @click="drawer = false"
                        style="margin: 10px;">关闭</el-button>
                </div>
            </el-drawer>
        </el-main>
    </div>
</template>
<script>
import orderUtil from '@/api/order'
export default {
    data() {
        return {
            orderModel: {},
            orderInfo: {},
            tableData: [],
            start: 1,
            size: 5,
            total: 0,
            drawer: false,
            direction: 'rtl'
        }
    },
    created() {
        this.search()
    },
    methods: {
        async search(start = 1) {
            this.start = start
            const res = await orderUtil.search(this.start, this.size, this.orderModel);
            if (res.success) {
                this.tableData = res.data.records;
                this.total = res.data.total;
            }
        },
        handleSearch() {
            this.search()
        },
        resetForm() {
            this.orderModel = {}
            this.search()
        },
        handleDetail(row) {
            this.orderInfo = Object.assign({}, row)
            this.drawer = true
        },
        handleReturnDeposit(row) {
            orderUtil.countViolation(row.autoId).then(res => {
                if (res.success) {
                    let c = res.data
                    const h = this.$createElement;
                    if (c > 0) {
                        this.$notify({
                            title: '无法退还',
                            message: h('i', { style: 'color: red' }, '该订单有未处理违章记录,请前往违章管理处理'),
                            duration: 3000
                        });
                    } else {
                        this.$notify({
                            title: '可以退还',
                            message: h('i', { style: 'color: teal' }, '该订单可以正常退还押金'),
                            duration: 3000
                        });
                         //将当前记录押金返还状态更新为1
                        orderUtil.doReturnDeposit(row.id).then(res => {
                            if (res.success) {
                                this.$message({
                                    message: "押金返还完成",
                                    type: 'success'
                                })
                                this.search()
                            }

                        })
                       

                    }
                }
            })
        }

    }
}
</script>
<style scoped>
.infoItem {
    padding-left: 20px;
    line-height: 40px;
    color: #777;
    border-bottom: 1px dotted #cdcdcd;
}

.infoItem span {
    margin-left: 15px;
    color: tomato
}
</style>