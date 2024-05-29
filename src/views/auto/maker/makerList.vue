<template>
    <div>
        <el-main>
            <!--查询表单-->
            <el-form :inline="true" :model="makerModel" size="small" label-width="100px">
                <el-form-item label="厂商名称">
                    <el-input v-model="makerModel.name" placeholder="厂商名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
                    <el-button type="warning" icon="el-icon-refresh" @click="resetForm">重置</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="handleCreate">新增</el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="deleteBatch">删除选中</el-button>
                </el-form-item>
            </el-form>
            <!--查询表单结束-->
            <!--数据表格-->
            <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" border stripe
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="序号" width="80">
                    <template slot-scope="scope">{{ (start - 1) * size + scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column prop="name" label="厂商名称">
                </el-table-column>
                <el-table-column prop="orderLetter" label="排序字母">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit"
                            @click="handleUpdate(scope.row)">修改</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete"
                            @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--数据表格结束-->
            <!--分页组件-->
            <el-pagination background layout="total,prev, pager, next,jumper" :current-page="start" :page-size="size"
                :total="total" @current-change="search">
            </el-pagination>
            <!--分页组件结束 -->
            <!--对话框-->
            <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible">
                <el-form :model="saveMaker" ref="form" :rules="rules" label-width="100px">
                    <el-form-item label="厂商名称" prop="name">
                        <el-input v-model="saveMaker.name"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <!--因为新增和删除用的是同一个对话框，所以要区分-->
                    <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确
                        定</el-button>
                </div>
            </el-dialog>

            <!--对话框结束-->
        </el-main>
    </div>
</template>
<script>
//导入auto_maker.js
import makerApi from '@/api/auto_maker.js'
export default {
    name: 'makerList',
    //数据 
    data() {
        return {
            makerModel: {},//表示是一个对象  用来查询封装的对象
            start: 1,
            size: 5,
            total: 0,
            tableData: [],//表示是一个集合， 用来保存查询出来的数据
            multipleSelection: [],//记录选中项的id
            dialogFormVisible: false,//控制当前对话框是否显示的标识
            saveMaker: {},//保存maker对象
            dialogStatus: '',//表示当前是修改还是新增
            titleMap: {
                create: '新增厂商',
                update: '修改厂商'
            },
            rules: {
                name: [
                    { required: true, message: '请输入厂商名称', trigger: 'blur' },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
            }
        }
    },
    //初始化会自动调用的方法
    created() {
        this.search();
    },
    //写相关函数的地方
    methods: {
        //查询数据 
        async search(start = 1) {
            this.start = start;
            const res = await makerApi.search(this.start, this.size, this.makerModel);
            if (res.success) {
                this.tableData = res.data.records;
                this.total = res.data.total;
            }

        },
        //执行查询的方法
        onSubmit() {
            this.search();
        },
        //执行清空方法
        resetForm() {
            this.tableData = [];
            this.makerModel = {};
            this.search();
        },
        //响应新增按钮
        handleCreate() {
            this.dialogStatus = 'create';
            this.dialogFormVisible = true;
            this.saveMaker = {};
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
        },
        //响应删除选中按钮
        deleteBatch() {
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
                    makerApi.delete(this.multipleSelection).then(res => {
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
        //响应修改按钮
        handleUpdate(row) {
            this.saveMaker = row
            this.dialogStatus = 'update';
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });

        },
        //响应删除按钮
        handleDelete(row) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                makerApi.delete(row.id).then(res => {
                    if (res.success) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.search();
                    }
                })
            }).catch(() => {
            })
        },
        //响应选中项
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach(element => {
                this.multipleSelection.push(element.id);
            });
        },
        //响应对话框的保存按钮
        createData() {
            this.$refs['form'].validate(async valid => {
                if (!valid) {
                    return false;
                } else {
                    makerApi.save(this.saveMaker).then(res => {
                        if (res.success) {
                            this.$message({
                                type: 'success',
                                message: '新增成功!'
                            });
                            //将当前对话框关闭
                            this.dialogFormVisible = false;
                            this.search();
                        }
                    })
                }
            });
        },
        //响应对话框的修改按钮
        updateData() {
            this.$refs['form'].validate(async valid => {
                if (!valid) {
                    return false
                } else {
                    const res = await makerApi.update(this.saveMaker);
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