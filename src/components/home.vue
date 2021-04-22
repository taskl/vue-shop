<template>
  <div class="home">
    <el-container>
      <el-header>
        <el-button type="success" @click="logout()" size="mini" >退出按钮</el-button>
      </el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from "@/components/HelloWorld.vue";

export default {
  data() {
    return {
      loginObj: {
        username: 'admin3',
        password: '123456'
      }
    }
  },
  name: 'Home',
  components: {
    //HelloWorld
  },
  methods: {
    logout() {
      //清空数据
      window.sessionStorage.clear()
      //跳转到登陆界面
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.el-container{
  height: 100%;
}
.el-header{
  background-color: #b3c0d1;
  line-height: 60px;
  display: flex;
  justify-content: end;
}
.el-aside{
  background-color: #d3dce6;
   line-height: 400px;
}
.el-main{
  background-color: #e9eef3;
 line-height: 400px;
}
</style>