<template>
    <div>
        <el-main>
            <el-form :inline="true" :model="customerModel" size="small">
                <el-form-item>
                    <el-input v-model="customerModel.name" placeholder="请输入客户姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="customerModel.tel" placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="customerModel.idNum" placeholder="请输入身份证号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input-number v-model="customerModel.lowAge" placeholder="年龄低值"></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-input-number v-model="customerModel.highAge" placeholder="年龄高值"></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="customerModel.gender" placeholder="请选择客户性别">
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch" icon="el-icon-search">查询</el-button>
                    <el-button type="warning" @click="resetForm" icon="el-icon-refresh">重置</el-button>
                    <el-button type="success" @click="handleCreate" icon="el-icon-plus">新增</el-button>
                    <el-button type="danger" @click="deleteBatch" icon="el-icon-delete">删除选中</el-button>
                </el-form-item>
            </el-form>
            <el-divider></el-divider>
            <el-table :data="tableData" border stripe style="width: 100%;margin-bottom: 20px;"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="序号" width="60">
                    <template slot-scope="scope">{{ (start - 1) * size + scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column label="客户姓名" prop="name"></el-table-column>
                <el-table-column label="身份证号" prop="idNum"></el-table-column>
                <el-table-column label="客户年龄" prop="age"></el-table-column>
                <el-table-column label="联系电话" prop="tel"></el-table-column>
                <el-table-column label="客户性别" prop="gender">
                    <template slot-scope="scope">{{ scope.row.gender == 1 ? "男" : "女" }}</template>
                </el-table-column>
                <el-table-column label="出生日期" prop="birthday"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="handleUpdate(scope.row)"
                            icon="el-icon-edit">编辑</el-button>
                        <el-button type="danger" size="mini" @click="handleDelete(scope.row)"
                            icon="el-icon-delete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @current-change="search" :current-page="start" :page-size="size"
                layout="total,  prev, pager, next, jumper" :total="total"></el-pagination>
            <!--新增和修改的弹出框------>
            <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
                <el-form :model="saveCustomer" :rules="rules" ref="form" label-width="80px">
                    <el-form-item label="客户姓名" prop="name">
                        <el-input v-model="saveCustomer.name"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="idNum">
                        <el-input v-model="saveCustomer.idNum" @change="setCustomerInfo"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="tel">
                        <el-input v-model="saveCustomer.tel" type="tel"></el-input>
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
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确
                        定</el-button>
                </div>
            </el-dialog>
        </el-main>
    </div>
</template>
<script>
import customerUtil from "@/api/customer"
export default {
    data() {
        return {
            customerModel: {},
            start: 1,
            size: 5,
            total: 0,
            tableData: [],
            titleMap: { create: "新增客户", update: "修改客户" },
            dialogFormVisible: false,
            dialogStatus: "create",
            saveCustomer: {},
            rules: {
                name: [
                    { required: true, message: "请输入客户姓名", trigger: "blur" }
                ],
                idNum: [
                    { required: true, message: "请输入身份证号", trigger: "blur" },
                    { min: 18, max: 18, message: "请输入18位身份证号", trigger: "blur" }
                ],
                tel: [
                    { required: true, message: "请输入联系电话", trigger: "blur" },
                    { min: 11, max: 11, message: "请输入11位手机号", trigger: "blur" },
                    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号", trigger: "blur" }
                ],

            }
        }
    },
    created() {
        this.search()

    },
    methods: {
        async search(start = 1) {
            this.start = start
            let res = await customerUtil.search(this.start, this.size, this.customerModel)
            if (res.code == 200) {
                this.tableData = res.data.records
                this.total = res.data.total
            }
        },
        handleSearch() {
            this.search()
        },
        handleCreate() {
            this.dialogFormVisible = true
            this.dialogStatus = "create"
            this.saveCustomer = {}
            this.$nextTick(() => {
                this.$refs["form"].clearValidate()
            })
        },
        resetForm() {
            this.customerModel = {}
            this.search()
        },
        deleteBatch() {
            if (this.multipleSelection.length > 0) {
                this.$confirm('此操作将永久删除该客户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await customerUtil.delete(this.multipleSelection)
                    if (res.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.search()
                    }
                }).catch(() => {
                });

            } else {
                this.$message({
                    type: 'warning',
                    message: '请选择要删除的客户!'
                });
            }
        },
        handleUpdate(row) {
            this.saveCustomer = Object.assign({}, row)
            this.dialogStatus = 'update'
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs["form"].clearValidate()
            })
        },
        handleDelete(row) {
            this.$confirm("此操作将永久删除该客户, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(async () => {
                    let res = await customerUtil.delete(row.id)
                    if (res.code == 200) {
                        this.$message({
                            type: "success",
                            message: "删除成功"
                        })
                        this.search()
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        handleSelectionChange(val) {
            this.multipleSelection = []
            val.forEach(element => {
                this.multipleSelection.push(element.id)
            });
        },
        createData() {
            this.$refs["form"].validate(async valid => {
                if (valid) {
                    let res = await customerUtil.save(this.saveCustomer)
                    if (res.code == 200) {
                        this.$message({
                            message: "保存成功",
                            type: "success"
                        })
                        this.dialogFormVisible = false
                        this.search()
                    }
                }
            })
        },
        updateData() {
            this.$refs["form"].validate(async valid => {
                if (valid) {
                    let res = await customerUtil.update(this.saveCustomer)
                    if (res.code == 200) {
                        this.$message({
                            message: "修改成功",
                            type: "success"
                        })
                        this.dialogFormVisible = false
                        this.search()
                    }
                }
            })
        },
        setCustomerInfo(val) {
            //220202199911312661
            //处理性别
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
        }
    },
}
</script>
<style></style>