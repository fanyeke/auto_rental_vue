<template>
    <div>
        <el-main>
            <el-button type="primary" @click="handleAdd" icon="el-icon-plus" style="margin-bottom: 20px;">新增</el-button>
            <!--显示表格-->
            <el-table :data="tableData" style="width: 100%" border stripe default-expand-all row-key="id"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :height="height">
                <el-table-column prop="permissionLabel" label="菜单名称"></el-table-column>
                <!--  <el-table-column prop="parentLabel" label="上级菜单"></el-table-column> -->
                <el-table-column prop="permissionType" label="菜单类型">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.permissionType === 0" type="warning">根目录</el-tag>
                        <el-tag v-else-if="scope.row.permissionType === 1" type="success">菜单</el-tag>
                        <el-tag v-else>按钮</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="routeName" label="路由名称"></el-table-column>
                <el-table-column prop="routePath" label="路由地址"></el-table-column>
                <el-table-column prop="routeUrl" label="组件路径"></el-table-column>
                <el-table-column prop="icon" label="菜单图标">
                    <template slot-scope="scope">
                        <i :class="scope.row.icon" v-if="scope.row.icon.indexOf('el-icon') != -1"></i>
                        <svg-icon :icon-class="scope.row.icon" v-else></svg-icon>

                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit"
                            @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete"
                            @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--添加修改弹出框-->
            <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible">
                <el-form :model="savePermission" :rules="rules" ref="form" label-width="80px">
                    <el-form-item label="上级菜单" prop="parentLabel">
                        <el-input v-model="savePermission.parentLabel" :readonly="true" ref="parentLable"
                            @click.native="openParentSelect"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单名称" prop="permissionLabel">
                        <el-input v-model="savePermission.permissionLabel" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单类型" prop="permissionType">
                        <el-radio-group v-model="savePermission.permissionType">
                            <el-radio-button :label="0">根目录</el-radio-button>
                            <el-radio-button :label="1">菜单</el-radio-button>
                            <el-radio-button :label="2">按钮</el-radio-button>
                            <!--  <el-radio v-for="(item, index) in typeList" :key="index" :label="item.value">{{ item.label
                                }}</el-radio>  -->
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="权限标识" prop="permissionCode">
                        <el-input v-model="savePermission.permissionCode"></el-input>
                    </el-form-item>
                    <el-form-item label="组件路径" prop="routeUrl" v-if="savePermission.permissionType != 2">
                        <el-input v-model="savePermission.routeUrl"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单图标" prop="icon">
                        <el-select v-model="savePermission.icon" placeholder="请选择图标">
                            <el-option v-for="item in icons" :key="item.value" :label="item.label" :value="item.value">
                                <span style="float: left">{{ item.label }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                            </el-option>
                        </el-select>
                        <!-- icon-picker v-model="savePermission.icon" /> -->
                        <!-- <el-input v-model="savePermission.icon"></el-input> -->
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确
                        定</el-button>
                </div>
            </el-dialog>
            <!--选择上级菜单对话框-->
            <el-dialog title="选择上级菜单" :visible.sync="dialogPermissionVisible" width="30%">
                <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" node-key="id" ref="tree"
                    :default-expand-all="true" highlight-current empty-text="未获取菜单数据"></el-tree>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeTree">取消</el-button>
                    <el-button type="primary" @click="handleTreeConfirm">确定</el-button>
                </div>
            </el-dialog>
        </el-main>
    </div>
</template>
<script>
import permissionUtil from '@/api/permission'
export default {
    data() {
        return {
            tableData: [],
            height: 0,
            titleMap: {
                create: '新增菜单',
                update: '修改菜单'
            },
            dialogStatus: 'create',
            dialogFormVisible: false,
            savePermission: {},
            dialogPermissionVisible: false,
            treeData: [],
            defaultProps: {
                label: 'permissionLabel',
                children: 'children'
            },
            typeList: [{
                value: '0',
                label: '根目录'
            }, {
                value: '1',
                label: '菜单'
            }, {
                value: '2',
                label: '按钮'
            }],
            rules: {
                permissionLabel: [
                    { required: true, message: '请输入菜单名称', trigger: 'blur' },
                ],
                parentLabel: [
                    { required: true, message: '请选择上级菜单', trigger: 'blur' },
                ],
                permissionType: [
                    { required: true, message: '请选择菜单类型', trigger: 'blur' },
                ],
                routeUrl: [
                    { required: true, message: '请输入组件路径', trigger: 'blur' },
                ],
                permissionCode: [
                    { required: true, message: '请输入权限标识', trigger: 'blur' },
                ],
            },
            icons: [{
                value: 'component',
                label: '根目录'
            }, {
                value: 'guide',
                label: '菜单'
            }, {
                value: 'el-icon-plus',
                label: '新增'
            }, {
                value: 'el-icon-delete',
                label: '删除'
            }, {
                value: 'el-icon-edit',
                label: '修改'
            }, {
                value: 'el-icon-search',
                label: '查询'
            }],
        }
    },
    created() {
        this.search();
    },
    mounted() {
        this.$nextTick(() => {
            this.height = window.innerHeight - 200;
        })
    },
    methods: {
        async search() {
            const res = await permissionUtil.search();
            if (res.success) {
                this.tableData = res.data;
            }
        },
        handleAdd() {
            this.dialogFormVisible = true;
            this.savePermission = {}
            this.dialogStatus = 'create';
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
        },
        handleEdit(row) {
            this.dialogFormVisible = true;
            this.savePermission = row;
            this.dialogStatus = 'update';
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
        },
        createData() {
            this.$refs['form'].validate(async valid => {
                if (!valid) {
                    return false
                } else {
                    permissionUtil.save(this.savePermission).then(res => {
                        if (res.success) {
                            this.$message({
                                type: 'success',
                                message: '新增成功!'
                            });
                            //将当前对话框关闭]
                            this.dialogFormVisible = false;
                            this.search();
                        }
                    })
                }
            })
        },
        updateData() {
            this.$refs['form'].validate(async valid => {
                if (!valid) {
                    return false
                } else {
                    permissionUtil.update(this.savePermission).then(res => {
                        if (res.success) {
                            this.$message({
                                type: 'success',
                                message: '更新成功!'
                            });
                            //将当前对话框关闭]
                            this.dialogFormVisible = false;
                            this.search();
                        }
                    })
                }
            })
        },
        openParentSelect() {
            this.dialogPermissionVisible = true;
            permissionUtil.tree().then(res => {
                if (res.success) {
                    this.treeData = res.data;
                }
            })

        },
        closeTree() {
            this.dialogPermissionVisible = false;
            this.savePermission.pid = -1;
            this.savePermission.parentLabel = "";
        },
        handleTreeConfirm() {
            this.dialogPermissionVisible = false;
            this.$refs.form.clearValidate("parentLabel");
        },
        handleNodeClick(data) {
            this.savePermission.pid = data.id;
            this.savePermission.parentLabel = data.permissionLabel;
        },
        handleDelete(row) {
            permissionUtil.hasChildren(row.id).then(res => {
                if (res.message === "有") {
                    this.$message({
                        type: 'warning',
                        message: '该菜单下有子菜单，不能删除!'
                    });
                } else {
                    this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        const res = await permissionUtil.delete(row.id);
                        if (res.success) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.search();
                        }
                    }).catch(() => { })
                }
            })
        }
    },
}
</script>
<style></style>