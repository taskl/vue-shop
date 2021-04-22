<template>
  <div class="login">
    <div class="loginBox">
      <div class="avatarBox">
        <img src="../assets/002.png" />
      </div>
      <el-form
        ref="loginFormRef"
        :model="formdata"
        :rules="rules"
        label-width="70px"
        class="loginForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formdata.username"
            placeholder="请输入您的用户名"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item label="密 码" prop="password">
          <el-input
            placeholder="请输入您的密码"
            v-model="formdata.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="buttons">
          <el-button type="primary" @click="login()">确定</el-button>
          <el-button type="info" @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          //required 必填
          //message 信息提示
          //trigger 鼠标失去焦点时触发
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    resetForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if(!valid) return;
        //通过验证，在这里写登陆的逻辑
         //async/ await来发送异步请求，从服务端获取数据，代码很简洁，同时async/await 已经被标准化。    
        const res = await this.$http.get("/api/login", { params: this.formdata });
        if(res.data.code!=0){
          return this.$message.error('登陆失败！');         
        }
        this.$message.success('登陆成功！')
        window.sessionStorage.setItem('tocken',res.data.tocken)
        this.$router.push('/home')
        //console.log(res.data);  
      });
    }
  }
};
</script>

<style scoped>
.login {
  background-color: darkslategray;
  height: 100%;
}
.loginBox {
  width: 450px;
  height: 320px;
  background-color: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
}
.avatarBox {
  height: 60px;
  width: 60px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 5px;
  box-shadow: 0 0 10px #dddddd;
  position: absolute;
  transform: translate(-15%, -15%);
  background-color: #ffffff;
}
.avatarBox img {
  height: 60px;
  width: 60px;
  border-radius: 50%;
  background-color: #eee;
}
.buttons {
  display: flex;
  justify-content: end;
}
.loginForm {
  position: absolute;
  bottom: 30px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>