<template>
  <div class="home">
    home组件
    <el-button type="success" @click="logout()">退出按钮</el-button>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from "@/components/HelloWorld.vue";

export default {
  data() {
    return {
      loginObj: {
        username: "admin3",
        password: "123456"
      }
    };
  },
  name: "Home",
  components: {
    //HelloWorld
  },
  methods: {
    logout () {
      //清空数据
      window.sessionStorage.clear();
      //跳转到登陆界面
      this.$router.push("/login")
    }
   
  }
};
</script>