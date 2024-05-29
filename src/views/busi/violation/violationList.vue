<template>
    <div>
        <el-main>
            <el-form :model="violationModel" label-width="80px" :inline="true" size="small">
                <el-form-item>
                    <el-input v-model="violationModel.autoNum" placeholder="车牌号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="violationModel.reason" placeholder="违章事由"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="violationModel.location" placeholder="违章地点"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input-number v-model="violationModel.lowFine" placeholder="罚款下限"></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-input-number v-model="violationModel.highFine" placeholder="罚款上限"></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="violationModel.vtimeVal" type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="violationModel.status" placeholder="请选择">
                        <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                    <el-button type="warning" icon="el-icon-refresh" @click="resetForm">重置</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="handleCreate">新增</el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="deleteBatch">删除选中</el-button>
                </el-form-item>
            </el-form>
            <el-divider></el-divider>
            <el-table :data="violationList" border stripe style="width: 100%;margin-bottom: 20px;"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="序号" width="70">
                    <template slot-scope="scope">{{ (start - 1) * size + scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column prop="autoNum" label="车牌号" width="100"></el-table-column>
                <el-table-column prop="vtime" label="违章时间"></el-table-column>
                <el-table-column prop="reason" label="违章事由"></el-table-column>
                <el-table-column prop="location" label="违章地点"></el-table-column>
                <el-table-column prop="deductPoints" label="扣分点数" width="100"></el-table-column>
                <el-table-column prop="fine" label="罚款金额" width="100"></el-table-column>
                <el-table-column prop="status" label="处理状态" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 0" type="danger">未处理</el-tag>
                        <el-tag v-else type="success">已处理</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="250">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @current-change="search" :current-page="start" :page-size="size"
                layout="total,  prev, pager, next, jumper" :total="total">
            </el-pagination>
            <!--新增修改弹窗-->
            <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%">
                <el-form :model="saveViolation" label-width="80px" :rules="rules" ref="form" size="small">
                    <el-form-item label="车牌号码" prop="autoNum">
                        <el-input v-model="saveViolation.autoNum" placeholder="请输入车牌号" @blur="checkAutoNum"></el-input>
                    </el-form-item>
                    <el-form-item label="违章时间" prop="vtime">
                        <el-date-picker v-model="saveViolation.vtime" type="datetime" placeholder="选择日期"
                            value-format="yyyy-MM-dd HH:mm:ss" />
                    </el-form-item>
                    <el-form-item label="违章事由" prop="reason">
                        <el-input v-model="saveViolation.reason" placeholder="请输入违章事由"></el-input>
                    </el-form-item>
                    <el-form-item label="违章地点" prop="location">
                        <el-input v-model="saveViolation.location" placeholder="请输入违章地点"></el-input>
                    </el-form-item>
                    <el-form-item label="扣分点数" prop="deductPoints">
                        <el-input-number v-model="saveViolation.deductPoints" placeholder="请输入扣分点数"></el-input-number>
                    </el-form-item>
                    <el-form-item label="罚款金额" prop="fine">
                        <el-input-number v-model="saveViolation.fine" placeholder="请输入罚款金额"></el-input-number>
                    </el-form-item>
                    <el-form-item label="处理状态">
                        <el-radio-group v-model="saveViolation.status" placeholder="请选择">
                            <el-radio-button :label="0">未处理</el-radio-button>
                            <el-radio-button :label="1">已处理</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" :disabled="isDisabled"
                        @click="dialogStatus === 'create' ? createData() : updateData()">确
                        定</el-button>
                </div>
            </el-dialog>
        </el-main>
    </div>
</template>
<script>
import violationUtil from "@/api/violation"
import autoInfoUtil from "@/api/auto_info"
export default {
    data() {
        return {
            isDisabled: false,
            violationModel: {},
            statusList: [
                {
                    value: '0',
                    label: '未处理'
                },
                {
                    value: '1',
                    label: '已处理'
                },
            ],
            violationList: [],
            titleMap: {
                update: '修改',
                create: '新增'
            },
            dialogStatus: '',
            dialogFormVisible: false,
            saveViolation: {},
            start: 1,
            size: 5,
            total: 0,
            rules: {
                autoNum: [
                    { required: true, message: '请输入车牌号', trigger: 'blur' }
                ],
                vtime: [
                    { required: true, message: '请选择日期', trigger: 'change' }
                ],
                location: [
                    { required: true, message: '请输入地点', trigger: 'blur' }
                ],
                reason: [
                    { required: true, message: '请输入事由', trigger: 'blur' }
                ],
            },
            //日期时间插件
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
    },
    methods: {
        async search(start = 1) {
            this.start = start
            const res = await violationUtil.search(this.start, this.size, this.violationModel);
            if (res.code == 200) {
                this.violationList = res.data.records;
                this.total = res.data.total;
            }
        },
        handleCreate() {
            this.saveViolation = { status: 0 }
            this.dialogFormVisible = true
            this.dialogStatus = 'create'
            this.$nextTick(() => {
                this.$refs['form'].clearValidate()
            })
        },
        handleSearch() {
            if (this.violationModel.vtimeVal != undefined) {
                this.violationModel.lowVtime = this.violationModel.vtimeVal[0]
                this.violationModel.highVtime = this.violationModel.vtimeVal[1]
            }
            console.log(this.violationModel.vtimeVal)
            console.log(this.violationModel.lowVtime)
            console.log(this.violationModel.highVtime)
            this.search()
        },
        resetForm() {
            this.violationModel = {}
            this.search()
        },
        deleteBatch() {
            if (this.multipleSelection.length > 0) {
                this.$confirm('确认删除选中记录吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    violationUtil.delete(this.multipleSelection).then(res => {
                        if (res.code == 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            })
                            this.search()
                        }
                    })
                })
            } else {
                this.$message({
                    message: '请选择一条记录',
                    type: 'warning'
                })
            }
        },

        handleSelectionChange(val) {
            this.multipleSelection = []
            val.forEach(element => {
                this.multipleSelection.push(element.id)
            });
        },
        handleUpdate(row) {
            this.saveViolation = Object.assign({}, row);
            this.dialogFormVisible = true;
            this.dialogStatus = 'update';
            this.$nextTick(() => {
                this.$refs['form'].clearValidate()
            })
        },
        handleDelete(row) {
            this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                violationUtil.delete(row.id).then((res) => {
                    if (res.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.search();
                    }
                })
            })

        },
        createData() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    violationUtil.save(this.saveViolation).then(res => {
                        if (res.code == 200) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            this.dialogFormVisible = false;
                            this.search();
                        }
                    })
                }
            })
        },
        updateData() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    violationUtil.update(this.saveViolation).then(res => {
                        if (res.code == 200) {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.dialogFormVisible = false;
                            this.search();
                        }
                    })
                }
            })
        },
        checkAutoNum() {
            autoInfoUtil.exist(this.saveViolation).then(res => {
                if (res.success) {
                    if (res.message == "none") {
                        this.$message({
                            message: '车牌号不存在',
                            type: 'error'
                        });
                        //控制确定按钮不可用
                        this.isDisabled = true
                    } else {
                        this.isDisabled = false
                    }
                }
            })
        }
    },
}
</script>
<style></style>