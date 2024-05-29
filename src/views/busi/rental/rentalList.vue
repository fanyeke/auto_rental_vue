<template>
    <div>
        <el-main>
            <!--查询表单-->
            <el-form :inline="true" :model="infoModel" size="mini">
                <el-form-item>
                    <el-select v-model="infoModel.makerId" placeholder="请选择厂商" @change="handleMakerChange"
                        style="width: 130px;">
                        <el-option v-for="item in makerList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="infoModel.brandId" placeholder="请选择品牌" style="width: 130px;">
                        <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="infoModel.autoNum" placeholder="请输入车牌号码" style="width: 130px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="infoModel.infoType" placeholder="请选择类型" style="width: 130px;">
                        <el-option label="燃油车" value="0"></el-option>
                        <el-option label="电动车" value="1"></el-option>
                        <el-option label="混动车" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input-number v-model="infoModel.lowRent" placeholder="请输入租金下限"
                        style="width: 160px;"></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-input-number v-model="infoModel.highRent" placeholder="请输入租金上限"
                        style="width: 160px;"></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="infoModel.registrationDateVal" type="daterange" align="right" unlink-panels
                        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                        :picker-options="pickerOptions" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch" icon="el-icon-search">查询</el-button>
                    <el-button type="warning" @click="resetForm" icon="el-icon-refresh">重置</el-button>
                </el-form-item>
            </el-form>
            <el-divider></el-divider>
            <!--表格数据 -->
            <el-table :data="tableData" border stripe style="margin-bottom:20px">
                <el-table-column type="index" label="序号" width="80">
                    <template slot-scope="scope">{{ (start - 1) * size + scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column prop="autoNum" label="车牌" width="120"></el-table-column>
                <el-table-column prop="makerName" label="厂商" width="120"></el-table-column>
                <el-table-column prop="brandName" label="品牌" width="120"></el-table-column>
                <el-table-column prop="infoType" label="类型" width="120">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.infoType == 0">燃油车</el-tag>
                        <el-tag v-else-if="scope.row.infoType == 1">电动车</el-tag>
                        <el-tag v-else-if="scope.row.infoType == 2">混动车</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="color" label="颜色" width="120">
                    <template slot-scope="scope">
                        <span
                            :style="{ background: scope.row.color, height: '20px', width: '50px', display: 'inline-block' }"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="displacement" label="排量" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.displacement + scope.row.unit }}
                    </template>
                </el-table-column>
                <el-table-column prop="mileage" label="里程" width="90"></el-table-column>
                <el-table-column prop="rent" label="租金" width="90"></el-table-column>
                <el-table-column prop="deposit" label="押金" width="90"></el-table-column>
                <el-table-column prop="registrationDate" label="上牌日期" width="120"></el-table-column>
                <el-table-column prop="pic" label="图片" width="120">
                    <template slot-scope="scope">
                        <img :src="scope.row.pic" style="width:70px;height:50px;">
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="handleRent(scope.row)" icon="el-icon-bangzhu"
                            size="small">出租</el-button>

                    </template>
                </el-table-column>
            </el-table>
            <!--分页组件-->
            <el-pagination background layout="total,prev, pager, next,jumper" :current-page="start" :page-size="size"
                :total="total" @current-change="search">
            </el-pagination>
            <!--出租车辆弹框-->
            <el-dialog title="车辆信息" :visible.sync="dialogFormVisible" width="30%">
                <el-form :model="saveInfo" :rules="rules" ref="infoForm" label-width="100px">
                    <el-form-item label="所属厂商">
                        <el-input v-model="saveInfo.makerName" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="所属品牌">
                        <el-input v-model="saveInfo.brandName" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="车牌号码">
                        <el-input v-model="saveInfo.autoNum" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="车辆类型">
                        <el-input value="燃油车" v-if="saveInfo.infoType == 0" readonly></el-input>
                        <el-input value="电动车" v-if="saveInfo.infoType == 1" readonly></el-input>
                        <el-input value="混动车" v-if="saveInfo.infoType == 2" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="车辆颜色">
                        <span
                            :style="{ background: saveInfo.color, height: '20px', width: '100px', display: 'inline-block' }"></span>
                    </el-form-item>
                    <el-form-item label="汽车排量">
                        <el-input v-model="saveInfo.displacement" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="排量单位">
                        <el-input v-model="saveInfo.unit" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="上牌日期">
                        <el-input v-model="saveInfo.registrationDate" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="出租类型" prop="typeId">
                        <el-select v-model="saveInfo.typeId" placeholder="请选择">
                            <el-option v-for="item in rentalTypeList" :key="item.id" :label="item.typeName"
                                :value="item.id">
                                <span style="float: left">{{ item.typeName }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">折扣:{{ item.typeDiscount *
                100
                                    }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="行驶里程" prop="mileage">
                        <el-input-number v-model="saveInfo.mileage" placeholder="请输入行驶里程"></el-input-number>
                    </el-form-item>
                    <el-form-item label="日租金额" prop="rent">
                        <el-input-number v-model="saveInfo.rent" placeholder="请输入日租金额"></el-input-number>
                    </el-form-item>
                    <el-form-item label="车辆押金" prop="deposit">
                        <el-input-number v-model="saveInfo.deposit" placeholder="请输入车辆押金"></el-input-number>
                    </el-form-item>
                    <el-form-item label="车辆图片" prop="pic">
                        <el-image style="width: 100px; height: 100px" :src="saveInfo.pic" :preview-src-list="srcList">
                        </el-image>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="doNext()">下一步</el-button>
                </div>
            </el-dialog>
            <!--客户信息弹框-->
            <el-dialog title="客户信息" :visible.sync="dialogCustomerVisible" width="40%">
                <el-form :model="saveCustomer" :rules="rules" ref="customerForm" label-width="80px">
                    <el-form-item label="联系电话" prop="tel">
                        <el-input v-model="saveCustomer.tel" type="tel" @change="selectCustomerByTel"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="idNum">
                        <el-input v-model="saveCustomer.idNum" @change="setCustomerInfo"></el-input>
                    </el-form-item>
                    <el-form-item label="客户姓名" prop="name">
                        <el-input v-model="saveCustomer.name"></el-input>
                    </el-form-item>
                    <el-form-item label="客户年龄" prop="age">
                        <el-input v-model="saveCustomer.age" :readonly="true"></el-input>
                    </el-form-item>
                    <el-form-item label="客户性别" prop="gender">
                        <el-radio-group v-model="saveCustomer.gender">
                            <el-radio-button :label="1" disabled>男</el-radio-button>
                            <el-radio-button :label="0" disabled>女</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="出生日期" prop="birthday">
                        <el-date-picker v-model="saveCustomer.birthday" type="date" placeholder="选择日期"
                            value-format="yyyy-MM-dd" :readonly="true"></el-date-picker>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogCustomerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="createOrder">提交订单</el-button>
                </div>
            </el-dialog>
        </el-main>
    </div>
</template>
<script>
import makerUtil from "@/api/auto_maker"
import brandUtil from "@/api/auto_brand"
import autoInfoUtil from "@/api/auto_info"
import rentalTypeUtil from "@/api/rental_type"
import customerUtil from "@/api/customer"
import orderUtil from "@/api/order"
export default {
    data() {
        return {
            infoModel: {
                status: 0
            },
            makerList: [],
            brandList: [],
            tableData: [],
            start: 1,
            size: 5,
            total: 0,
            dialogFormVisible: false,
            dialogCustomerVisible: false,
            saveInfo: {},
            rentalTypeList: [],//出租类型列表
            srcList: [],
            saveOrder: {},
            saveCustomer: {},
            isSaveCustomer:false,//是否之前保存过的客户
            rules: {
                typeId: [
                    { required: true, message: '请选择出租类型', trigger: 'change' }
                ],
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                tel: [
                    { required: true, message: '请输入电话', trigger: 'blur' },
                    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
                ],
                idNum: [
                    { required: true, message: '请输入身份证', trigger: 'blur' },
                    { min: 18, max: 18, message: '请输入正确的身份证', trigger: 'blur' }
                ],

            },

            //日期控件
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },

        }
    },
    created() {
        this.search()
        this.searchMakerList()
        this.selectRentalType()
    },
    methods: {
        //查询所有未租车辆
        async search(start = 1) {
            this.start = start;
            const res = await autoInfoUtil.search(this.start, this.size, this.infoModel)
            if (res.code == 200) {
                this.tableData = res.data.records;
                this.total = res.data.total;
            }
        },
        //查询所有厂商名称
        searchMakerList() {
            makerUtil.selectAll().then(res => {
                this.makerList = res.data;

            })
        },
        //查询所有出租类型
        async selectRentalType() {
            const res = await rentalTypeUtil.selectAll();
            if (res.code == 200) {
                this.rentalTypeList = res.data;
            }
        },
        //响应查询按钮
        handleSearch() {
            // console.log(this.infoModel.registrationDateVal)
            if (this.infoModel.registrationDateVal != undefined) {
                this.infoModel.lowRegistrationDate = this.infoModel.registrationDateVal[0]
                this.infoModel.highRegistrationDate = this.infoModel.registrationDateVal[1]
            }
            this.search()
        },
        //响应重置按钮
        resetForm() {
            this.infoModel = { status: 0 }

            this.search()
        },
        //当选择车辆厂商时响应
        handleMakerChange(val) {
            brandUtil.selectByMakerId(val).then(res => {
                this.brandList = res.data;
            })
        },
        //响应出租按钮
        handleRent(row) {
            this.dialogFormVisible = true;
            this.saveInfo = Object.assign({}, row)
            this.srcList.push(this.saveInfo.pic)
        },
        //响应下一步按钮
        doNext() {
            this.$refs['infoForm'].validate(valid => {
                if (valid) {
                    this.saveOrder.autoId = this.saveInfo.id
                    this.saveOrder.rent = this.saveInfo.rent
                    this.saveOrder.deposit = this.saveInfo.deposit
                    this.saveOrder.mileage = this.saveInfo.mileage
                    this.saveOrder.typeId = this.saveInfo.typeId
                    this.dialogFormVisible = false
                    this.dialogCustomerVisible = true
                } else {
                    return false;
                }
            })
        },
        //当用户录入电话号码后，查询用户信息
        selectCustomerByTel() {
            customerUtil.selectCustomerByTel(this.saveCustomer).then(res => {
                if (res.data != null) {
                    this.saveCustomer = res.data
                    this.isSaveCustomer=true
                } else {
                    let tel = this.saveCustomer.tel
                    this.saveCustomer = { tel: tel }
                    this.isSaveCustomer=false
                }
            })
        },
        //110101200112092654
        //通过身份证号码，设置用户年龄、出生日期和性别
        setCustomerInfo(val) {
            const sex = val.charAt(val.length - 2)
            this.saveCustomer.gender = sex % 2
            //获取用户身份证上的出生日期
            const birthday = val.substring(6, 14)
            //当前系统时间
            const now = new Date()
            const birthDate = new Date(birthday.substring(0, 4), birthday.substring(4, 6) - 1, birthday.substring(6, 8))
            let timeDiff = Math.abs(now.getTime() - birthDate.getTime())
            if (timeDiff > 0) {
                //计算年龄
                this.saveCustomer.age = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365))
                //计算出生日期
                this.saveCustomer.birthday = birthDate//birthday.substring(0,4)+"-"+birthday.substring(4,6)+"-"+birthday.substring(6,8)
            }
            this.$forceUpdate()
        },
        addOrder(){
            //调用后台保存订单
            orderUtil.save(this.saveOrder).then(res=>{
                if (res.success){
                    this.$message({
                        message: '创建订单成功,请在订单管理中查看',
                        type: 'success'
                    });
                    this.saveOrder={}
                    this.saveCustomer={}
                    this.dialogCustomerVisible=false
                    this.search()
                }
            })
           
        },
        //订单提交按钮
        createOrder() {
            this.$refs['customerForm'].validate(valid=>{
                if (valid){
                    if (!this.isSaveCustomer){
                        //如果为false，就说明客户之前没有添加过，则添加
                        customerUtil.save(this.saveCustomer).then(res=>{
                            if (res.success){
                                this.saveOrder.customerId=res.data
                                this.addOrder()
                            }
                        })
                    }else{
                        this.saveOrder.customerId=this.saveCustomer.id
                        this.addOrder()
                    }
                }else{
                    return false;
                }
            })
        }
    }
}
</script>
<style></style>