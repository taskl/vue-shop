<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区-->
    <el-card class="box-card">
      <!-- gutter="20" 列与列之间的间隔
      :span="8"  具体列的所占有的宽度（24为整个屏幕宽度）-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            :clearable="true"
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户列表表格-->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column label="序号" type="index" width="80"></el-table-column>
        <el-table-column label="用户名" prop="UserName"></el-table-column>
        <el-table-column label="手机" prop="Mobile"></el-table-column>
        <el-table-column label="邮箱" prop="Email"></el-table-column>
        <el-table-column label="角色" prop="RoleName"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.MgState"
              active-color="#13ce66"
              @change="userStateChanged(scope.row)"
              inactive-color="#ddd"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="updateUserDialog(scope.row)">修改</el-button>
            <el-button type="info" size="mini" @click="deleteUser(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!--添加用户对话框-->
    <el-dialog
      title="添加用户信息"
      :visible.sync="addUserDialogVisible"
      width="40%"
      @close="addDialogClosed"
    >
      <el-form ref="addFormRef" :rules="addFormRules" :model="addForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>

        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改用户信息对话框-->
    <el-dialog
      title="修改用户信息"
      :visible.sync="updateUserDialogVisible"
      width="40%"
      @close="updateDialogClosed"
    >
      <el-form ref="updateFormRef" :rules="addFormRules" :model="updateForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="updateForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="updateForm.password" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateForm.email"></el-input>
        </el-form-item>

        <el-form-item label="电话" prop="mobile">
          <el-input v-model="updateForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //自定义验证邮箱规则
    var checkEmail = (rule, value, callback) => {
      //正则表达式-邮箱
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (regEmail.test(value)) {
        //合法邮箱
        callback()
      }
      callback(new Error('请输入合法的邮箱地址！'))
    }
    //自定义验证手机号码规则
    var checkMobile = (rule, value, callback) => {
      //正则表达式-手机
      const regMobile = /^1[3456789]\d{9}$/
      if (regMobile.test(value)) {
        //合法手机
        callback()
      }
      callback(new Error('请输入合法的手机号码！'))
    }
    return {
      queryInfo: { query: '', pagenum: 1, pagesize: 3 },
      userList: [],
      total: 0,
      addUserDialogVisible: false,
      updateUserDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      updateForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          //required 必填
          //message 信息提示
          //trigger 鼠标失去焦点时触发
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getUserList() {
      const res = await this.$http.get('/api/users', {
        params: this.queryInfo
      })
      this.userList = res.data.data
      this.total = res.data.total
      //console.log(red)
    },
    //switch 状态发生变化时的回调函数
    async userStateChanged(userinfo) {
      const res = await this.$http.get('/api/userupdate', { params: userinfo })
      if (res.data.count <= 0) return
      this.$message.success(
        res.data.count +
          '个状态信息已经修改成功！目前的状态的值为：' +
          res.data.newState
      )

      //真实开发环境下修改用户信息2
      // const d = await this.$http.put('user', userInfo)
      // if (d <= 0) return
      // this.$message.success('修改用户状态成功')
      //console.log(res.data)
    },
    //添加用户
    addUser() {
      //往addForm添加一些属性
      var query = 'query'
      var queryVal = this.queryInfo.query
      this.addForm[query] = queryVal

      var pagenum = 'pagenum'
      var pagenumVal = this.queryInfo.pagenum
      this.addForm[pagenum] = pagenumVal

      var pagesize = 'pagesize'
      var pagesizeVal = this.queryInfo.pagesize
      this.addForm[pagesize] = pagesizeVal

      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const res = await this.$http.get('/api/adduser', {
            params: this.addForm
          })

          //真实开发环境下添加用户的接口的写法
          // const d = await this.$http.post('user/Add', this.addForm)
          // if (d <= 0) return
          // this.$message.success('添加用户成功')

          //console.log(res.data)
          this.userList = res.data.data
          this.total = res.data.total
          this.addUserDialogVisible = false
        }
      })
    },
    updateUserDialog(userInfo) {
      this.updateUserDialogVisible = true
      this.updateForm.id = userInfo.id
      this.updateForm.username = userInfo.UserName
      this.updateForm.password = userInfo.Password
      this.updateForm.email = userInfo.Email
      this.updateForm.mobile = userInfo.Mobile
      //console.log(this.updateForm)
      //console.log(this.userInfo)
    },
    updateUser() {
      //往updateForm添加一些属性
      var query = 'query'
      var queryVal = this.queryInfo.query
      this.updateForm[query] = queryVal

      var pagenum = 'pagenum'
      var pagenumVal = this.queryInfo.pagenum
      this.updateForm[pagenum] = pagenumVal

      var pagesize = 'pagesize'
      var pagesizeVal = this.queryInfo.pagesize
      this.updateForm[pagesize] = pagesizeVal

      this.$refs.updateFormRef.validate(async valid => {
        if (valid) {
          const res = await this.$http.get('/api/updateuser', {
            params: this.updateForm
          })

          //真实开发环境下调用修改用户的接口的写法
          // const d = await this.$http.put('/api/updateuser', this.updateForm)
          // if (d <= 0) {
          //   return this.$message.error('修改用户信息失败')
          // }
          // this.$message.success('修改用户信息成功')
          // this.getUserList()

          //console.log(res.data)
          this.userList = res.data.data
          this.total = res.data.total
          this.updateUserDialogVisible = false
        }
      })
    },
    async deleteUser(id) {
      var idInt = 'id'
      var idVal = id
      this.queryInfo[idInt] = idVal
      //console.log(this.queryInfo)
      var res = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => {
        return err
      })
      //console.log(res)
      if (res != 'confirm') return this.$message.info('删除用户已取消')
      const resData = await this.$http.get('/api/deleteuser', {
        params: this.queryInfo
      })

      //真实开发环境下删除用户的接口调用
      // const d = await this.$http.delete('user/' + id)
      // if (d <= 0) return this.$message.error('删除用户失败')     
      // this.$message.success('删除用户成功')

      this.getUserList()
      this.$message.info('删除用户成功')
      this.userList = resData.data.data
      this.total = resData.data.total
    },
    //监听修改用户对话框关闭事件
    updateDialogClosed() {
      this.$refs.updateFormRef.resetFields()
    },
    //监听pagesize改变的事件
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },
    //监听PageNume改变的事件
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    //监听添加用户的对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style scoped>
.el-table {
  margin-top: 10px;
}
.el-pagination {
  margin-top: 5px;
  text-align: left;
}
</style>