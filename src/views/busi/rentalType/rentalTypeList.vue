<template>
    <div>
        <el-main>
            <el-form :inline="true" v-model="rentalTypeModel" size="small">
                <el-form-item label="出租类型">
                    <el-input v-model="rentalTypeModel.typeName" placeholder="请输入出租类型"></el-input>
                </el-form-item>
                <el-form-item label="最低折扣">
                    <el-input-number :min="0" :max="1" :step="0.01" v-model="rentalTypeModel.lowDiscount"
                        placeholder="请输入最低折扣"></el-input-number>
                </el-form-item>
                <el-form-item label="最高折扣">
                    <el-input-number :min="0" :max="1" :step="0.01" v-model="rentalTypeModel.highDiscount"
                        placeholder="请输入最高折扣"></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch" icon="el-icon-search">查询</el-button>
                    <el-button type="warning" @click="resetForm" icon="el-icon-refresh">重置</el-button>
                    <el-button type="success" @click="handleAdd" icon="el-icon-plus">新增</el-button>
                    <el-button type="danger" @click="handleDeleteBatch" icon="el-icon-delete">删除选中</el-button>
                </el-form-item>
            </el-form>
            <!--表格处理-->
            <el-table border :data="tableData" style="width: 100%;margin-bottom:20px ;" stripe
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="序号" width="80">
                    <template slot-scope="scope">{{ (start - 1) * size + scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column label="类型名称" prop="typeName"></el-table-column>
                <el-table-column label="类型折扣" prop="typeDiscount"></el-table-column>
                <el-table-column label="备注" prop="remark"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit"
                            @click="handleUpdate(scope.row)">修改</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete"
                            @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页组件-->
            <el-pagination background layout="total,prev, pager, next,jumper" :current-page="start" :page-size="size"
                :total="total" @current-change="search">
            </el-pagination>
            <!--新增和修改的弹出框-->
            <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible">
                <el-form :model="saveRentalTypeModel" :rules="rules" ref="form" label-width="100px">
                    <el-form-item label="类型名称" prop="typeName">
                        <el-input v-model="saveRentalTypeModel.typeName" placeholder="请输入类型名称"></el-input>
                    </el-form-item>
                    <el-form-item label="类型折扣" prop="typeDiscount">
                        <el-input-number :min="0" :max="1" :step="0.01"
                         v-model="saveRentalTypeModel.typeDiscount" placeholder="请输入类型折扣"></el-input-number>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="saveRentalTypeModel.remark" placeholder="请输入备注" type="textarea"></el-input>
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
import rentalTypeUtil from "@/api/rental_type"
export default {
    data() {
        return {
            rentalTypeModel: {
                lowDiscount: 0,
                highDiscount: 1
            },
            start: 1,
            size: 5,
            total: 0,
            tableData: [],
            multipleSelection: [],
            titleMap: {
                create: '新增',
                update: '修改'
            },
            dialogStatus: 'create',
            dialogFormVisible: false,
            saveRentalTypeModel: {},
            rules: {
                typeName: [
                    { required: true, message: '请输入类型名称', trigger: 'blur' }
                ],
                typeDiscount: [
                    { required: true, message: '请输入类型折扣', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.search();
    },
    methods: {
        async search(start = 1) {
            this.start = start;
            const res = await rentalTypeUtil.search(this.start, this.size, this.rentalTypeModel);
            if (res.success) {
                this.tableData = res.data.records;
                this.total = res.data.total;
            }
        },
        handleSearch() {
            this.search();
        },
        resetForm() {
            this.tableData = [];
            this.rentalTypeModel = {
                lowDiscount: 0,
                highDiscount: 1
            };
            this.search();
        },
        handleAdd() {
            this.dialogStatus = 'create';
            this.dialogFormVisible = true;
            this.saveRentalTypeModel = {typeDiscount:1}
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
         },
        handleDeleteBatch() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    type: 'warning',
                    message: '请选择要删除的数据!'
                });
                return;
            } else {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    rentalTypeUtil.delete(this.multipleSelection).then(res => {
                        if (res.success) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.search();
                        }
                    })
                }).catch(() => { })
            }

        },
        handleSelectionChange(val) {
            this.multipleSelection = []
            val.forEach(element => {
                this.multipleSelection.push(element.id);
            });
        },
        handleUpdate(row) {
            this.saveRentalTypeModel = row;
            this.dialogStatus = 'update';
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
         },
        handleDelete(row) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                rentalTypeUtil.delete(row.id).then(res => {
                    if (res.success) {
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
            this.$refs['form'].validate(async valid => {
                if (!valid) {
                    return false;
                } else {
                    const res = await rentalTypeUtil.save(this.saveRentalTypeModel);
                    if (res.success) {
                        this.$message({
                            type: 'success',
                            message: '新增成功!'
                        });
                        //将当前对话框关闭
                        this.dialogFormVisible = false;
                       this.search();
                    }
                }
            });
        },
        updateData() { 
            this.$refs['form'].validate(async valid => {
                if (!valid) {
                    return false;
                } else {
                    const res = await rentalTypeUtil.update(this.saveRentalTypeModel);
                    if (res.success) {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        //将当前对话框关闭
                        this.dialogFormVisible = false;
                       this.search();
                    }
                }
            });
        },
    },
}
</script>
<style></style>