import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import swLogin from '@/components/sw/login'
import deLogin from '@/components/de/login'
import Main from '@/components/main'
import swMain from '@/components/sw/main'
import deMain from '@/components/de/main'
import test from '@/components/test'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/sw',
      name: 'swLogin',
      component: swLogin
    },
    {
      path: '/de',
      name: 'deLogin',
      component: deLogin
    },
    {
      path: '/main',
      name: 'Main',
      component: Main
    },
    {
      path: '/sw/main',
      name: 'swMain',
      component: swMain
    },
    {
      path: '/de/main',
      name: 'deMain',
      component: deMain
    },
    {
      path: '/test',
      name: 'test',
      component: test
    }
  ]
})
