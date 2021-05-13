import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/home.vue'
import login from '../components/login.vue'
import welcome from '../components/welcome.vue'
import users from '../components/user/users.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/Home',
    component: Home,
    redirect: '/welcome',
    children:[
      {path:'/welcome',component: welcome},
      {path:'/users',component: users},
    ]
  }
]

const router = new VueRouter({
  routes
})

//挂断路由导航守卫
//to 将要访问的路径
//from 从哪个路径跳转而来
//next 表示一个方法
//直接放行：next () ;强制跳转到某个地址：next("/Login")
router.beforeEach((to,from,next)=>{
  if(to.path==='/login') return next();
  const tockenstr=window.sessionStorage.getItem('tocken')
  //如果 tocken没有值，表示没登陆
  if(!tockenstr) return next('/login')
  next()
})

export default router
