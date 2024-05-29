<template>
    <div>
        <el-container :style="{ height: containerHeight + 'px' }">
            <!-- 左侧导航栏  部门树-->
            <el-aside width="220px" class="el-aside">
                <el-tree :data="treeData" :props="defaultProps" node-key="id" empty-text="暂无数据"
                    :default-expand-all="true" :expand-on-click-node="false" :highlight-current="true"
                    @node-click="handleNodeClick"></el-tree>
            </el-aside>
            <!--表格及查询表单-->
            <el-main>
                <el-form :inline="true" :model="userModel" size="small" style="margin: 5px;">
                    <el-form-item>
                        <el-input v-model="userModel.username" placeholder="用户账号" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="userModel.realname" placeholder="真实姓名" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="userModel.nickname" placeholder="用户昵称" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="userModel.phone" placeholder="联系电话" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="userModel.email" placeholder="电子邮箱" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch" icon="el-icon-search">查询</el-button>
                        <el-button type="danger" @click="handleReset" icon="el-icon-refresh">重置</el-button>
                        <el-button type="success" @click="handleAdd" icon="el-icon-plus">新增</el-button>
                        <el-button type="warning" @click="handleDeleteBatch" icon="el-icon-delete">删除选中</el-button>
                    </el-form-item>
                </el-form>
                <!--表格数据 -->
                <el-table :data="tableData" border stripe style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="35"></el-table-column>
                    <el-table-column label="序号" width="50">
                        <template slot-scope="scope">{{ (start - 1) * size + scope.$index + 1 }}</template>
                    </el-table-column>
                    <el-table-column prop="username" label="用户账号" width="90"></el-table-column>
                    <el-table-column prop="realname" label="真实姓名" width="90"></el-table-column>
                    <el-table-column prop="nickname" label="用户昵称" width="100"></el-table-column>
                    <el-table-column prop="phone" label="用户电话" width="120"></el-table-column>
                    <el-table-column prop="gender" label="用户性别" width="80">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.gender === 1" type="success">男</el-tag>
                            <el-tag v-else type="danger">女</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column prop="deptName" label="所在部门" width="150"></el-table-column>
                    <el-table-column prop="email" label="电子邮箱" width="150"></el-table-column>
                    <el-table-column prop="avatar" label="用户头像" width="90">
                        <template slot-scope="scope">
                            <a :href="scope.row.avatar" target="_blank">
                                <img :src="scope.row.avatar" style="width: 30px;height: 30px;">
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini"
                                @click="handleEdit(scope.row)">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                @click="handleDelete(scope.row)">删除</el-button>
                            <el-button type="success" icon="el-icon-s-custom" size="mini"
                                @click="handleRole(scope.row)">绑定角色</el-button>

                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination :current-page="start" :page-size="size" layout="total,  prev, pager, next, jumper"
                    :total="total" @current-change="search"></el-pagination>
                <!--新增和修改用户弹出框-->
                <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogVisible" width="40%">
                    <el-form :model="saveUser" :rules="rules" ref="form" label-width="80px" :inline="true">
                        <el-form-item label="所在部门" prop="deptName">
                            <el-input v-model="saveUser.deptName" :readonly="true" ref="deptName"
                                @click.native="openDeptSelect"></el-input>
                        </el-form-item>
                        <el-form-item label="用户账号" prop="username">
                            <el-input v-model="saveUser.username" placeholder="请输入用户账号"></el-input>
                        </el-form-item>
                        <el-form-item label="用户密码" prop="password" v-if="dialogStatus === 'create'">
                            <el-input v-model="saveUser.password" type="password" placeholder="请输入用户密码"></el-input>
                        </el-form-item>
                        <el-form-item label="真实姓名" prop="realname">
                            <el-input v-model="saveUser.realname" placeholder="请输入真实姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="用户昵称" prop="nickname">
                            <el-input v-model="saveUser.nickname" placeholder="请输入用户昵称"></el-input>
                        </el-form-item>
                        <el-form-item label="用户电话" prop="phone">
                            <el-input v-model="saveUser.phone" placeholder="请输入用户电话"></el-input>
                        </el-form-item>
                        <el-form-item label="电子邮箱" prop="email">
                            <el-input v-model="saveUser.email" placeholder="请输入电子邮箱"></el-input>
                        </el-form-item>
                        <el-form-item label="用户性别" prop="gender">
                            <el-radio-group v-model="saveUser.gender">
                                <el-radio-button label="1">男</el-radio-button>
                                <el-radio-button label="2">女</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="用户头像" prop="avatar">
                            <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
                                :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
                                :data="uploadToken">
                                <img v-if="saveUser.avatar" :src="saveUser.avatar" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary"
                            @click="dialogStatus === 'create' ? createData() : updateData()">确定</el-button>
                    </div>
                </el-dialog>
                <!--选择部门树-->
                <el-dialog title="选择部门" :visible.sync="dialogDeptVisible" width="30%">
                    <el-tree :data="treeData" :props="defaultProps" node-key="id" ref="tree" empty-text="暂无数据"
                        :default-expand-all="true" :expand-on-click-node="false"
                        @node-click="handleDeptSelect"></el-tree>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="clearSelect">取消</el-button>
                        <el-button type="primary" @click="handleDeptConfirm">确定</el-button>
                    </div>
                </el-dialog>
                <!--角色绑定弹出对话框-->
                <el-dialog title="角色绑定" :visible.sync="dialogRoleVisible">
                    <el-checkbox-group v-model="roleIds" >
                        <el-checkbox v-for="item in roleList" :label="item.id" :key="item.id">{{item.roleName}}</el-checkbox>
                    </el-checkbox-group>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="clearBind">取消</el-button>
                        <el-button type="primary" @click="handleBindRole">确定</el-button>
                    </div>
                </el-dialog>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import deptUtil from "@/api/dept"
import userUtil from "@/api/auth_user"
import { getToken } from '@/utils/auth'
import roleUtil from "@/api/auth_role"
export default {
    data() {
        return {
            treeData: [],
            defaultProps: {
                children: 'children',
                label: 'deptName'
            },
            containerHeight: 0,
            userModel: {},
            tableData: [],
            start: 1,
            size: 5,
            total: 0,
            titleMap: {
                update: '修改用户',
                create: '新增用户'
            },
            saveUser: {
            },
            dialogVisible: false,
            dialogStatus: 'create',
            dialogDeptVisible: false,
            dialogRoleVisible:false, // 角色选择
            treeData: [],
            defaultProps: {
                children: 'children',
                label: 'deptName'
            },
            multipleSelection:[],
            uploadPath: process.env.VUE_APP_BASE_API + 'rental/oss/upload',
            uploadToken: { token: getToken() },
            roleIds:[],//选中角色id
            roleList:[],//所有角色列表
            userId:0,//要绑定角色的用户id
            rules: {
                deptName: [
                    { required: true, message: '请选择部门', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '请输入用户账号', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入用户密码', trigger: 'blur' }
                ],
                realname: [
                    { required: true, message: '请输入真实姓名', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入用户电话', trigger: 'blur' }
                ],
                gender: [
                    { required: true, message: '请选择性别', trigger: 'blur' }
                ]
            }

        }
    },
    created() {
        this.getTreeData()
        this.search()
    },
    mounted() {
        this.containerHeight = window.innerHeight - 85
    },
    methods: {
        async getTreeData() {
            let res = await deptUtil.selectTree()
            if (res.success) {
                this.treeData = res.data
            }
        },
        //查询
        async search(start = 1) {
            this.start = start
            let res = await userUtil.search(this.start, this.size, this.userModel)
            if (res.success) {
                this.tableData = res.data.records
                this.total = res.data.total
            }

        },
        handleNodeClick(data) {
            this.userModel.deptId = data.id
            this.search()
        },
        //查询按钮响应事件
        handleSearch() {
            this.search()
        },
        //重置按钮响应事件
        handleReset() {
            this.userModel = {}
            this.tableData = []
            this.search()
        },
        //新增按钮响应事件
        handleAdd() {
            this.dialogStatus = 'create'
            this.dialogVisible = true
            this.saveUser = {}
            this.$nextTick(() => {
                this.$refs['form'].clearValidate()
            })
        },
        //删除选中按钮响应事件
        handleDeleteBatch() {
            if (this.multipleSelection.length>0){
                this.$confirm('此操作将永久删除选中记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    userUtil.delete(this.multipleSelection).then(res=>{
                        if(res.code==200){
                            this.$message({
                                type: 'success',
                                message: '已删除非超级管理员角色!'
                            });
                            this.search();
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    })
                })
                
            }else{
                this.$message({
                    message: '请选择要删除的行',
                    type: 'warning'
                });
            }
        },
        //表格复选框选中响应事件
        handleSelectionChange(val) { 
            this.multipleSelection=[];
            val.forEach(item=>{
                this.multipleSelection.push(item.id);
            })
        },
        //编辑按钮响应事件
        handleEdit(row) {
            this.dialogStatus = 'update'
            this.dialogVisible = true
            this.saveUser = row
            this.$nextTick(() => {
                this.$refs['form'].clearValidate()
            })
        },
        //删除按钮响应事件
        handleDelete(row) {
            if (row.isAdmin == 1) {
                this.$message({
                    message: '超级管理员不能删除',
                    type: 'warning'
                })
            } else {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    userUtil.delete(row.id).then(res => {
                        if (res.success) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.search()
                        }
                    })
                })
            }
        },
        //绑定角色按钮响应事件
        handleRole(row) { 
            this.userId=row.id
            this.dialogRoleVisible=true
            //获取所有角色列表
            roleUtil.list().then(res => {
                if (res.success){
                    this.roleList = res.data
                }
            })
            //获取用户绑定过的角色
            userUtil.selectRoleIdByUserId(row.id).then(res => {
                if (res.success){
                    this.roleIds = res.data
                }
            })
        },
        //打开部门选择框
        openDeptSelect() {
            this.dialogDeptVisible = true
            deptUtil.selectTree().then(res => {
                if (res.success) {
                    this.treeData = res.data
                }
            })
        },
        //新增用户响应事件
        createData() {
            this.$refs['form'].validate(async valid => {
                if (valid) {
                    let res = await userUtil.save(this.saveUser)
                    if (res.success) {
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        })
                        this.dialogVisible = false
                        this.search()
                    }
                }
            })
        },
        //修改用户响应事件
        updateData() {
            this.$refs['form'].validate(async valid => {
                if (valid) {
                    let res = await userUtil.update(this.saveUser)
                    if (res.success) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        })
                        this.dialogVisible = false
                        this.search()
                    }
                }
            })
        },
        //选择部门响应事件
        handleDeptSelect(data) {
            this.saveUser.deptId = data.id
            this.saveUser.deptName = data.deptName
        },
        //确认选择部门
        handleDeptConfirm() {
            this.dialogDeptVisible = false
            this.$refs.form.clearValidate("deptName")
        },
        //取消选择部门
        clearSelect() {
            this.dialogDeptVisible = false
            this.saveUser.deptId = null
            this.saveUser.deptName = null
        },
        //上传头像响应事件
        handleAvatarSuccess(res, file) {
            this.saveUser.avatar = res.data
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
        clearBind(){
            this.dialogRoleVisible = false;
            userUtil.selectRoleIdByUserId(row.id).then(res => {
                if (res.success){
                    this.roleIds = res.data
                }
            })
        },
        handleBindRole(){
            userUtil.bindRole(this.userId,this.roleIds).then(res => {
                if (res.success){
                    this.$message({
                        message: '绑定成功',
                        type: 'success'
                    });
                }
                this.dialogRoleVisible=false;
                this.search();
            })
        }
    }

}
</script>
<style>
.el-aside {
    background-color: #fff;
    border-right: 2px solid #e6e6e6;
    border-top: 2px solid #e6e6e6;
}

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
}
</style>