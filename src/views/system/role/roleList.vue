<template>
    <div>
        <el-main>
            <!--查询表单-->
            <el-form :model="roleModel" label-width="80px" :inline="true" style="margin: 15px;" size="small">
                <el-form-item label="角色名称">
                    <el-input v-model="roleModel.roleName" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryRoleList" icon="el-icon-search">查询</el-button>
                    <el-button type="warning" @click="resetQuery" icon="el-icon-refresh">重置</el-button>
                    <el-button type="success" @click="addRole" icon="el-icon-plus" v-if="hasPermission('sys:role:add')">新增</el-button>
                    <el-button type="danger" @click="deleteBatchRole" icon="el-icon-delete">删除选中</el-button>
                </el-form-item>
            </el-form>
            <!--表格管理-->
            <el-table :data="roleList" border stripe style="width: 100%;margin-bottom: 15px;" row-key="id"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="序号" width="80">
                    <template slot-scope="scope">{{ (start - 1) * size + scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleCode" label="角色编码"></el-table-column>
                <el-table-column prop="remark" label="角色描述"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="editRole(scope.row)"
                            icon="el-icon-edit">编辑</el-button>
                        <el-button type="danger" size="mini" @click="deleteRole(scope.row)"
                            icon="el-icon-delete">删除</el-button>
                        <el-button type="success" size="mini" @click="handlePermission(scope.row)"
                            icon="el-icon-setting">
                            权限分配
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :current-page="start" background :page-size="size" layout="total,  prev, pager, next, jumper"
                :total="total" @current-change="search"> </el-pagination>
            <!--新增和修改弹出框-->
            <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogVisible">
                <el-form :model="saveRole" ref="form" :rules="rules" label-width="80px" style="margin: 15px;"
                    size="small">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="saveRole.roleName" placeholder="请输入角色名称"></el-input>
                    </el-form-item>
                    <el-form-item label="角色编码" prop="roleCode">
                        <el-input v-model="saveRole.roleCode" placeholder="请输入角色编码"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="remark">
                        <el-input v-model="saveRole.remark" :rows="3" type="textarea" placeholder="请输入角色描述"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确
                        定</el-button>
                </div>
            </el-dialog>
            <!--权限分配对话框-->
            <el-dialog :title="title" :visible.sync="dialogPermissionVisible" width="40%">
                <el-tree :data="treeData" show-checkbox node-key="id" ref="tree" :default-checked-keys="checkedKeys"
                    :props="defaultProps" default-expand-all empty-text="暂无数据" check-strictly>
                </el-tree>
                <div slot="footer" class="dialog-footer">
                        <el-button @click="clearSelect">取 消</el-button>
                        <el-button type="primary" @click="savePermission">确 定</el-button>
                    </div>
            </el-dialog>
        </el-main>
    </div>
</template>
<script>
import roleUtil from '@/api/auth_role';
import hasPermission from '@/api/global_permission';
export default {
    data() {
        return {
            roleModel: {},
            roleList: [],
            start: 1,
            size: 5,
            total: 0,
            titleMap: {
                create: '新增角色',
                update: '编辑角色'
            },
            dialogVisible: false,
            saveRole: {},
            dialogStatus: 'create',
            multipleSelection: [],
            rules: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                ],
                roleCode: [
                    { required: true, message: '请输入角色编码', trigger: 'blur' },
                ]
            },
            title: '',
            dialogPermissionVisible: false,
            treeData: [],
            checkedKeys: [],
            defaultProps: {
                children: 'children',
                label: 'permissionLabel'
            },
            roleId: 0,

        }
    },
    created() {
        this.search();
    },
    methods: {
        async search(start = 1) {
            this.start = start
            //console.log(this.$store.getters.createrId)
            this.roleModel.createrId = this.$store.getters.createrId
            const res = await roleUtil.search(this.start, this.size, this.roleModel);
            if (res.success) {
                this.roleList = res.data.records;
                this.total = res.data.total
            }

        },
        queryRoleList() {
            this.search();
        },
        resetQuery() {
            this.roleList = [];
            this.roleModel = {};
            this.search();
        },
        addRole() {
            this.dialogVisible = true;
            this.dialogStatus = 'create';
            this.saveRole = {}
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
        },
        deleteBatchRole() {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请选择要删除的角色',
                    type: 'warning'
                })
            } else {
                this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    roleUtil.delete(this.multipleSelection).then(res => {
                        if (res.success) {
                            this.$message({
                                type: 'success',
                                message: '已成功删除没有绑定用户的角色!'
                            });
                            this.search();
                        }
                    });
                });
            }
        },
        deleteRole(row) {
            roleUtil.hasUser(row.id).then(res => {
                if (res.message === "有") {
                    this.$message({
                        message: '该角色下有用户，不能删除',
                        type: 'warning'
                    })
                } else {
                    this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        const res = await roleUtil.delete(row.id);
                        if (res.success) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.search();
                        }
                    }).catch(() => { });
                }
            });
        },
        editRole(row) {
            this.dialogVisible = true;
            this.dialogStatus = 'update';
            this.saveRole = row;
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
        },
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach(element => {
                this.multipleSelection.push(element.id);
            })
        },
        createData() {
            this.$refs.form.validate(async valid => {
                if (valid) {
                    this.saveRole.createrId = this.$store.getters.createrId;
                    const res = await roleUtil.save(this.saveRole);
                    if (res.success) {
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.search();
                    }
                }
            })

        },
        updateData() {
            this.$refs.form.validate(async valid => {
                if (valid) {

                    const res = await roleUtil.update(this.saveRole);
                    if (res.success) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.search();
                    }
                }
            })
        },
        //处理分配权限
        handlePermission(row) {
            this.roleId = row.id
            this.title = `${row.roleName}权限分配`
            this.dialogPermissionVisible = true
            let params = { roleId: row.id, userId: this.$store.getters.createrId }
            roleUtil.permissionTree(params).then(res => {
                if (res.success) {
                    console.log(res.data)
                    this.treeData = res.data.permissionList
                    //this.defaultCheckedKeys = res.data.checkedList
                    this.$refs.tree.setCheckedKeys(res.data.checkedList)
                }
            })
        },
        clearSelect() {
           // this.$refs.tree.setCheckedKeys([]);
           this.dialogPermissionVisible = false;
         },
        savePermission() { 
            //获取所有选择的节点key
            let permissionIds=this.$refs.tree.getCheckedKeys();
            roleUtil.assignPermission(this.roleId,permissionIds).then(res=>{
                if(res.success){
                    this.$message({
                        message: '权限分配成功',
                        type: 'success'
                    });
                    this.dialogPermissionVisible = false;
                }
            })
          // console.log("roleId",this.roleId)
            //console.log(permissionIds);
        }

    }
}
</script>
<style></style>