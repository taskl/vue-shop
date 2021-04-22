import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/home.vue'
import Login from '../components/login.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login',
}, {
    path: '/login',
    component: Login
}, {
    path: '/Home',
    component: Home
}]

const router = new VueRouter({
        routes
    })
    //挂载路由导航守卫
    //to 将要访问的路径
    //from 从哪个路径跳转而来
    // next 表示一个方法
    //直接放行:next（）；强制跳转到某个地址：next("/Login")
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    const tockenstr = window.sessionStorage.getItem('tocken')
        //如果 tocken没值，就表示没登陆
    if (!tockenstr) return next('/login')
    next();
})

export default router