<template>
    <div>
        <el-main>
            <!--查询表单-->
            <el-form :inline="true" class="demo-form-inline" size="small" v-model="infoModel">
                <el-form-item label="厂商名称">
                    <el-select v-model="infoModel.makerId" placeholder="请选择" @change="handleMakerChange">
                        <el-option v-for="item in makerList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌名称">
                    <el-select v-model="infoModel.brandId" placeholder="请选择">
                        <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="车牌号码">
                    <el-input v-model="infoModel.autoNum" placeholder="请输入车牌号码"></el-input>
                </el-form-item>
                <el-form-item label="车辆类型">
                    <el-select v-model="infoModel.infoType" placeholder="请选择">
                        <el-option label="燃油车" value="0"></el-option>
                        <el-option label="电动车" value="1"></el-option>
                        <el-option label="混动车" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="车辆状态">
                    <el-select v-model="infoModel.status" placeholder="请选择">
                        <el-option label="未租" value="0"></el-option>
                        <el-option label="已租" value="1"></el-option>
                        <el-option label="维保" value="2"></el-option>
                        <el-option label="自用" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="租金下限">
                    <el-input v-model="infoModel.lowRent" placeholder="请输入租金下限"></el-input>
                </el-form-item>
                <el-form-item label="租金上限">
                    <el-input v-model="infoModel.highRent" placeholder="请输入租金上限"></el-input>
                </el-form-item>
                <el-form-item label="上牌日期">
                    <el-date-picker v-model="infoModel.registrationDateVal" type="daterange" align="right" unlink-panels
                        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                        :picker-options="pickerOptions" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch" icon="el-icon-search">查询</el-button>
                    <el-button type="warning" @click="resetForm" icon="el-icon-refresh">重置</el-button>
                    <el-button type="success" @click="handleAdd" icon="el-icon-plus">新增</el-button>
                    <el-button type="danger" @click="handleDeleteBatch" icon="el-icon-delete">批量删除</el-button>
                </el-form-item>
            </el-form>
            <el-divider />
            <!--表格数据 -->
            <el-table :data="tableData" border stripe @selection-change="handleSelectionChange"
                style="margin-bottom:20px">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column type="index" label="序号" width="50">
                    <template slot-scope="scope">{{ (start - 1) * size + scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column prop="autoNum" label="车牌" width="100"></el-table-column>
                <el-table-column prop="makerName" label="厂商" width="110"></el-table-column>
                <el-table-column prop="brandName" label="品牌" width="110"></el-table-column>
                <el-table-column prop="infoType" label="类型" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.infoType == 0">燃油车</el-tag>
                        <el-tag v-else-if="scope.row.infoType == 1">电动车</el-tag>
                        <el-tag v-else-if="scope.row.infoType == 2">混动车</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="color" label="颜色" width="100">
                    <template slot-scope="scope">
                        <span
                            :style="{ background: scope.row.color, height: '20px', width: '50px', display: 'inline-block' }"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="displacement" label="排量" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.displacement + scope.row.unit }}
                    </template>
                </el-table-column>
                <el-table-column prop="mileage" label="里程" width="100"></el-table-column>
                <el-table-column prop="rent" label="租金" width="100"></el-table-column>
                <el-table-column prop="registrationDate" label="上牌日期" width="100"></el-table-column>
                <el-table-column prop="pic" label="图片" width="100">
                    <template slot-scope="scope">
                        <img :src="scope.row.pic" style="width:70px;height:50px;">
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 0">未租</el-tag>
                        <el-tag v-else-if="scope.row.status == 1">已租</el-tag>
                        <el-tag v-else-if="scope.row.status == 2">维保</el-tag>
                        <el-tag v-else-if="scope.row.status == 3">自用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="handleUpdate(scope.row)" icon="el-icon-edit">修改</el-button>
                        <el-button type="danger" @click="handleDelete(scope.row)" icon="el-icon-delete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页组件-->
            <el-pagination background layout="total,prev, pager, next,jumper" :current-page="start" :page-size="size"
                :total="total" @current-change="search">
            </el-pagination>
            <!--新增和修改的弹出框---->
            <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
                <el-form :model="saveInfo" :rules="rules" ref="form" label-width="100px">
                    <el-form-item label="所属厂商" prop="makerId">
                        <el-select v-model="saveInfo.makerId" placeholder="请选择" @change="selectMaker">
                            <el-option v-for="item in makerList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属品牌" prop="brandId">
                        <el-select v-model="saveInfo.brandId" placeholder="请选择">
                            <el-option v-for="item in saveBrandList" :key="item.id" :label="item.brandName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="车牌号码" prop="autoNum">
                        <el-input v-model="saveInfo.autoNum" placeholder="请输入车牌号码"></el-input>
                    </el-form-item>
                    <el-form-item label="车辆类型" prop="infoType">
                        <el-radio-group v-model="saveInfo.infoType">
                            <el-radio-button label="0">燃油车</el-radio-button>
                            <el-radio-button label="1">电动车</el-radio-button>
                            <el-radio-button label="2">混动车</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="车辆颜色" prop="color">
                        <el-color-picker v-model="saveInfo.color"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="汽车排量" prop="displacement">
                        <el-input-number v-model="saveInfo.displacement" :step="0.1" :min="0"></el-input-number>
                    </el-form-item>
                    <el-form-item label="排量单位" prop="unit">
                        <el-radio-group v-model="saveInfo.unit">
                            <el-radio-button label="L">L</el-radio-button>
                            <el-radio-button label="T">T</el-radio-button>
                        </el-radio-group>
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
                    <el-form-item label="上牌日期" prop="registrationDate">
                        <el-date-picker v-model="saveInfo.registrationDate" type="date"
                            placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="车辆状态" prop="status">
                        <el-radio-group v-model="saveInfo.status">
                            <el-radio-button label="0">未租</el-radio-button>
                            <el-radio-button label="1">已租</el-radio-button>
                            <el-radio-button label="2">维保</el-radio-button>
                            <el-radio-button label="3">自用</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="车辆图片" prop="pic">
                        <el-upload class="avatar-uploader" :action="uploadPath"
                            :show-file-list="false" :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload" :data="uploadToken">
                            <img v-if="saveInfo.pic" :src="saveInfo.pic" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确 定</el-button>
                </div>
            </el-dialog>
        </el-main>
    </div>
</template>
<script>
import infoUtil from '@/api/auto_info'
import makerUtil from '@/api/auto_maker'
import brandUtil from '@/api/auto_brand'
import { getToken } from '@/utils/auth'
export default {
    data() {
        return {
            infoModel: {},
            makerList: [],
            brandList: [],
            saveBrandList:[],
            tableData: [],
            start: 1,
            size: 5,
            total: 0,
            multipleSelection: [],
            uploadPath: process.env.VUE_APP_BASE_API + 'rental/oss/upload',
            uploadToken: { token: getToken() },
            titleMap: {
                update: '修改',
                create: '新增'
            },
            dialogStatus: 'create',
            dialogFormVisible: false,
            saveInfo:{},
            rules: {
                makerId: [{ required: true, message: '请选择厂商', trigger: 'blur' }],
                brandId: [{ required: true, message: '请选择品牌', trigger: 'blur' }],
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
        this.search();
        this.searchMakerList();
    },
    methods: {
        async search(start = 1) {
            this.start = start;
            const res = await infoUtil.search(this.start, this.size, this.infoModel);
            if (res.success) {
                this.tableData = res.data.records;
                this.total = res.data.total;
            }
        },
        searchMakerList() {
            makerUtil.selectAll().then(res => {
                this.makerList = res.data;
            })
        },
        handleMakerChange(val) {
            //console.log(val)
            brandUtil.selectByMakerId(val).then(res => {
                this.brandList = res.data;
            })
        },
        handleSearch() {
            //console.log(this.infoModel.registrationDateVal)
            if (this.infoModel.registrationDateVal != undefined) {
                this.infoModel.lowRegistrationDate = this.infoModel.registrationDateVal[0]
                this.infoModel.highRegistrationDate = this.infoModel.registrationDateVal[1]
            }
            this.search();
        },
        resetForm() {
            this.tableData = [];
            this.infoModel = {};
            this.search();
        },
        handleAdd() {
            this.saveInfo={}
            this.dialogFormVisible = true;
            this.dialogStatus='create'
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
         },
        handleDeleteBatch() { 
            if(this.multipleSelection.length==0){
                this.$message({
                    message: '请选择要删除的数据',
                    type: 'warning'
                });
                return;
            }else{
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    infoUtil.delete(this.multipleSelection).then(res => {
                        if(res.success){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.search();
                        }
                    });
                });
            }
        },
        handleUpdate(row) { 
            this.saveInfo=row
            brandUtil.selectByMakerId(row.makerId).then(res=>{
                this.saveBrandList=res.data
            })
            this.dialogFormVisible = true;
            this.dialogStatus='update'
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
        },
        handleDelete(row) { 
            this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                infoUtil.delete(row.id).then(res => {
                    if(res.success) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.search();
                    }
                });
            });
        },
        handleSelectionChange(val) { 
            this.multipleSelection = [];
            val.forEach(item => {
                this.multipleSelection.push(item.id);
            });
        },
        createData() {
            this.$refs['form'].validate(async valid => {
                if (!valid){
                    return false;
                }else{
                    const res=await infoUtil.save(this.saveInfo)
                    if (res.success){
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        this.dialogFormVisible = false;
                        this.search();
                    }
                }
            });
        },
        updateData() {
            this.$refs['form'].validate(async valid => {
                if (!valid){
                    return false;
                }else{
                    const res=await infoUtil.update(this.saveInfo)
                    if (res.success){
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.dialogFormVisible = false;
                        this.search();
                    }
                }
            });

        },
        //上传头像响应事件
        handleAvatarSuccess(res, file) {
            this.saveInfo.pic = res.data
            this.$forceUpdate()
        },
        //上传头像之前的验证
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        selectMaker(val){
            brandUtil.selectByMakerId(val).then(res=>{
                this.saveBrandList = res.data;
                
            })
            
        }
    },
}
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}</style>