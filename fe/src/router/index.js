import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Dashboard from '@/components/Dashboard'
import WardList from '@/components/WardList'
import WardListWithMembers from '@/components/WardListWithMembers'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/WardList',
      name: 'WardList',
      component: WardList
    },
    {
      path: '/WardListWithMembers',
      name: 'WardListWithMembers',
      component: WardListWithMembers
    },
  ]
})
