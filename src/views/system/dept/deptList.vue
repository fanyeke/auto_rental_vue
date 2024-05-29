<template>
    <div>
        <el-main>
            <!--查询表单-->
            <el-form :inline="true" :model="deptModel" size="small" label-width="80px">
                <el-form-item label="部门名称">
                    <el-input v-model="deptModel.deptName" placeholder="请输入部门名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                    <el-button type="warning" @click="resetForm">清空</el-button>
                    <el-button type="success" @click="handleCreate">新增</el-button>
                </el-form-item>
            </el-form>
            <!--表格部分-->
            <el-table :data="tableData" border stripe style="width: 100%" row-key="id"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" default-expand-all>
                <el-table-column label="部门名称" prop="deptName"></el-table-column>
                <el-table-column prop="parentName" label="上级部门"></el-table-column>
                <el-table-column prop="phone" label="部门电话"></el-table-column>
                <el-table-column prop="address" label="部门地址"></el-table-column>
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit"
                            @click="handleUpdate(scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete"
                            @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--新增修改对话框-->
            <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible">
                <el-form :model="saveDept" :rules="rules" ref="form" label-width="80px" size="small">
                    <el-form-item label="上级部门" prop="parentName">
                        <el-input v-model="saveDept.parentName" placeholder="请输入上级部门" :readonly="true"
                            @click.native="selectDept"></el-input>
                    </el-form-item>
                    <el-form-item label="部门名称" prop="deptName">
                        <el-input v-model="saveDept.deptName" placeholder="请输入部门名称"></el-input>
                    </el-form-item>
                    <el-form-item label="部门电话" prop="phone">
                        <el-input v-model="saveDept.phone" placeholder="请输入部门电话"></el-input>
                    </el-form-item>
                    <el-form-item label="部门地址" prop="address">
                        <el-input v-model="saveDept.address" placeholder="请输入部门地址"></el-input>
                    </el-form-item>
                    <el-form-item label="部门排序" prop="orderNum">
                        <el-input-number v-model="saveDept.orderNum" placeholder="请输入部门排序">
                        </el-input-number>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确
                        定</el-button>
                </div>
            </el-dialog>
            <!--部门树对话框-->
            <el-dialog title="选择上级部门" :visible.sync="dialogTreeVisible" width="30%">
                <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" default-expand-all
                    empty-text="未获取部门数据" :highlight-current="true">
                </el-tree>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeTree">取 消</el-button>
                    <el-button type="primary" @click="handleTreeConfirm">确 定</el-button>
                </div>
            </el-dialog>
        </el-main>
    </div>
</template>
<script>
import deptUtil from '@/api/dept'
export default {
    data() {
        return {
            deptModel: {},
            tableData: [],
            titleMap: {
                create: '新增部门',
                update: '修改部门'
            },
            dialogStatus: 'create',
            dialogFormVisible: false,
            saveDept: {},
            rules: {
                parentName: [
                    { required: true, message: '请输入上级部门', trigger: 'blur' },
                ],
                deptName: [
                    { required: true, message: '请输入部门名称', trigger: 'blur' },
                ],
            },
            dialogTreeVisible: false,
            treeData: [],
            defaultProps: {
                label: 'deptName',
                children: 'children'
            }

        }
    },
    created() {
        this.search()
    },
    methods: {
        async search() {
            const res = await deptUtil.search(this.deptModel);
            if (res.success) {
                this.tableData = res.data
            }

        },
        onSubmit() {
            this.search()
        },
        resetForm() {
            this.deptModel = {}
            this.tableData = []
            this.search()
        },
        handleCreate() {
            this.dialogStatus = 'create';
            this.dialogFormVisible = true;
            this.saveDept = {}
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
        },
        handleUpdate(row) {
            this.saveDept = row;
            this.dialogFormVisible = true;
            this.dialogStatus = 'update';
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
        },
        async handleDelete(row) {
            //先做校验，判断当前部门下是否有子部门
            let res = await deptUtil.hasChildren(row.id);
            if (res.message === "有") {
                this.$message({
                    type: 'warning',
                    message: '该部门下有子部门，不能删除!'
                });
            } else {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res = await deptUtil.delete(row.id);
                    if (res.success) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.search();
                    }
                }).catch(() => { })

            }
        },
        createData() {
            this.$refs['form'].validate(async valid => {
                if (!valid) {
                    return false
                } else {
                    const res = await deptUtil.save(this.saveDept);
                    if (res.success) {
                        this.$message({
                            type: 'success',
                            message: '新增成功!'
                        });
                        //将当前对话框关闭]
                        this.dialogFormVisible = false;
                        this.search();
                    }
                }
            });
        },
        updateData() {
            this.$refs['form'].validate(async valid => {
                if (!valid) {
                    return false
                } else {
                    const res = await deptUtil.update(this.saveDept);
                    if (res.success) {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        //将当前对话框关闭]
                        this.dialogFormVisible = false;
                        this.search();
                    }
                }
            });
        },
        handleNodeClick(data) {
            this.saveDept.pid = data.id;
            this.saveDept.parentName = data.deptName;
        },
        closeTree() {
            this.dialogTreeVisible = false;
            this.saveDept.pid = -1
            this.saveDept.parentName = ""
        },
        handleTreeConfirm() {
            this.dialogTreeVisible = false;
            this.$refs.form.clearValidate("parentName");
        },
        selectDept() {
            //将树形结构从接口端查询到的数据，赋值给treeData
            this.dialogTreeVisible = true;
            deptUtil.selectTree().then(res => {
                if (res.success) {
                    this.treeData = res.data;
                }
            })
        }
    }
}
</script>
<style></style>