<template>
    <div>
        <el-main>
            <el-form :model="brandModel" :rules="rules" :inline="true" size="small" label-width="80px">
                <el-form-item label="厂商名称">
                    <el-select v-model="brandModel.mid" placeholder="请选择">
                        <el-option v-for="item in makerList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌名称">
                    <el-input v-model="brandModel.brandName" placeholder="请输入品牌名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
                    <el-button type="warning" icon="el-icon-refresh" @click="resetForm">重置</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="handleCreate">新增</el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="deleteBatch">删除选中</el-button>
                    <el-button type="primary" icon="el-icon-delete" @click="exportExcel">导出</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData" border style="width: 100%;margin-bottom: 20px;" stripe
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="序号" width="80">
                    <template slot-scope="scope">{{ (start - 1) * size + scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column label="厂商名称" prop="makerName"></el-table-column>
                <el-table-column label="品牌名称" prop="brandName"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit"
                            @click="handleUpdate(scope.row)">修改</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete"
                            @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <!--分页组件-->
        <el-pagination background layout="total,prev, pager, next,jumper" :current-page="start" :page-size="size"
            :total="total" @current-change="search" style="text-align:center">
        </el-pagination>
        <!--分页组件结束 -->
        <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="saveBrand" ref="form" :rules="rules" size="small" label-width="80px">
                <el-form-item label="厂商名称" prop="mid">
                    <el-select v-model="saveBrand.mid" placeholder="请选择">
                        <el-option v-for="item in makerList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌名称" prop="brandName">
                    <el-input v-model="saveBrand.brandName" placeholder="请输入品牌名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import brandApi from '@/api/auto_brand.js'
import makerApi from '@/api/auto_maker.js'
import { getToken } from '@/utils/auth'
export default {
    data() {
        return {
            brandModel: {},
            makerList: [],
            total: 0,
            start: 1,
            size: 5,
            multipleSelection: [],
            tableData: [],
            dialogStatus: 'create',
            titleMap: {
                create: '新增品牌',
                update: '修改品牌'
            },
            dialogFormVisible: false,
            saveBrand: {},
            rules: {
                 mid: [
                     { required: true, message: '请输入厂商名称', trigger: 'change' },
                 ], 
                 brandName: [
                     { required: true, message: '请输入品牌名称', trigger: 'blur' },
                 ]
            }
        }
    },
    created() {
        this.search();
        this.selectMaker();
    },
    methods: {
        async search(start = 1) {
            this.start = start;
            const res = await brandApi.search(this.start, this.size, this.brandModel);
            if (res.success) {
                this.tableData = res.data.records;
                this.total = res.data.total;
            }
        },
        async selectMaker() {
            const res = await makerApi.selectAll();
            if (res.success) {
                this.makerList = res.data;
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = []
            val.forEach(element => {
                this.multipleSelection.push(element.id);
            });
        },
        onSubmit() {
            this.search();
        },
        resetForm() {
            this.tableData = [];
            this.brandModel = {};
            this.search();
        },
        handleCreate() { 
            this.dialogStatus = 'create';
            this.dialogFormVisible = true;
            this.saveBrand = {};
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
        },
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
                    brandApi.delete(this.multipleSelection).then(res => {
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
        handleUpdate(row) { 
            this.saveBrand=row;
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
                brandApi.delete(row.id).then(res => {
                    if (res.success) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.search();
                    }
                })
            }).catch(() => { })
        },
        createData(){
            this.$refs['form'].validate(async valid => {
                if (!valid){
                    return false;
                }else{
                    const res=await brandApi.save(this.saveBrand);
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
                    return false
                } else {
                    const res = await brandApi.update(this.saveBrand);
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
        exportExcel(){
            let url=`${process.env.VUE_APP_BASE_API}rental/autoBrand/exportExcel?token=${getToken()}`
            window.open(url)
        }
    },
}
</script>