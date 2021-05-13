<template>
  <div class="home">
    <el-container>
      <el-header>
        <div>
          <img src="../assets/002.png" />
          <span>电子商城管理后台</span>
        </div>
        <el-button type="success" @click="logout()" size="mini">退出按钮</el-button>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse?'64px':'200px'">
          <div class="toggleBtn" @click="toggleCollapse()">
            <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"></i>
          </div>
          <!--左侧菜单区域-->
          <el-menu
            class="el-menu-vertical-demo"
            background-color="#1f334e"
            text-color="#fff"
            active-text-color="#ffd04b"
            :unique-opened="true"
            :collapse="isCollapse"
            :router="true"
            :collapse-transition="false"
            :default-active="activePath"
          >
            <!--一级菜单-->
            <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
              <!-- 一级菜单的模板 -->
              <template slot="title">
                <!-- 菜单图标 -->
                <i :class="iconObj[item.id]"></i>
                <!-- 文本 -->
                <span>{{item.name}}</span>
              </template>

              <!-- 一级菜单下的二级菜单 -->
              <el-menu-item
                :index="subitem.path"
                v-for="subitem in item.child"
                :key="subitem.path"
                @click="saveMenuStatus(subitem.path)"
              >
                <template slot="title">
                  <!-- 二级菜单图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 二级菜单文本 -->
                  <span>{{subitem.name}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
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
      menulist: [],
      iconObj: {
        '1': 'iconfont icon-user',
        '2': 'iconfont icon-tijikongjian',
        '3': 'iconfont icon-shangpin',
        '4': 'iconfont icon-danju',
        '5': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
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
    },
    async getmenus() {
      const res = await this.$http.get('/api/menu')
      console.log(res.data)
      if (!res.status == 'ok') return
      this.menulist = res.data.data
    },
    toggleCollapse() {
      //点击切换让菜单展开或折叠
      this.isCollapse = !this.isCollapse
    },
    saveMenuStatus(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath=activePath;
    }
  },
  created() {
    this.getmenus()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #1f334e;
  color: white;
  height: 80px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header img {
  width: 60px;
  height: 60px;
  padding-right: 6px;
}
.el-aside {
  background-color: #1f334e;
  line-height: 400px;
  text-align: left;
}
.iconfont {
  margin-right: 10px;
}
.el-main {
  background-color: #e9eef3;
}
.el-menu {
  border-right: none;
}
.toggleBtn {
  background-color: #3b4a5e;
  line-height: 24px;
  color: #fff;
  text-align: left;
  font-size: 16px;
  padding-left: 10px;
  cursor: pointer;
}
</style>