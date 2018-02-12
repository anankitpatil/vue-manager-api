import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Manager from '@/components/Manager'
import Login from '@/components/Login'
import auth from '@/auth'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/manager',
      name: 'Manager',
      component: Manager,
      beforeEnter: requireAuth
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

function requireAuth(to, from, next) {
  auth.checkAuth()
  if (!auth.user.authenticated) {
    next({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    })
  } else {
    next()
  }
}
