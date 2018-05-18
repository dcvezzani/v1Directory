import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import WardList from '@/components/WardList'
import WardListWithMembers from '@/components/WardListWithMembers'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'WardList',
      component: WardList
    },
    {
      path: '/members',
      name: 'WardListWithMembers',
      component: WardListWithMembers
    },
  ]
})
