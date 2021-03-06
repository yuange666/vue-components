import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: '/html5Drag',
    children:[
      {
        path:'/html5Drag',
        name:'/html5Drag',
        component:()=>import('../components/Html5Drag.vue')
      },
      {
        path:'/jsDrag',
        name:'/jsDrag',
        component:()=>import('../components/JsDrag.vue')
      },
      {
        path:'/vueQuillEditor',
        name:'vueQuillEditor',
        component:()=>import('../components/VueQuillEditor.vue')
      }
    ]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/404',
    name:'404',
    component: ()=>import('../views/404.vue')
  },
  {
    path: '*',
    redirect:'/404'
  }
]

const router = new VueRouter({
  routes
})

export default router
