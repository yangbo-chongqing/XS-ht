import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/workbench',
    children: [{
      path: 'workbench',
      name: 'Workbench',
      component: () => import('@/views/workbench/index'),
      meta: { title: '工作台', icon: 'dashboard' }
    }]
  },
  {
    path: '/codelist',
    component: Layout,
    redirect: '/codelist/entrycode',
    name: 'CodeList',
    meta: { title: '二维码列表', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'entrycode',
        name: 'EntryCode',
        component: () => import('@/views/codelist/entrycode/index'),
        meta: { title: '词条码', icon: 'el-icon-bank-card' },
      },
      {
        path: 'create',
        component: () => import('@/views/codelist/entrycode/create'),
        name: 'CreateArticle',
        hidden: true,
        meta: { title: '新增二维码'}
      },
      {
        path: 'funcode',
        name: 'FunCode',
        component: () => import('@/views/codelist/funcode/index'),
        meta: { title: '功能码', icon: 'table' }
      }
    ]
  },
  {
    path: '/scancode',
    component: Layout,
    children: [{
      path: 'scancode',
      name: 'ScanCode',
      component: () => import('@/views/scancode/index'),
      meta: { title: '扫码量统计', icon: 'dashboard' }
    }]
  },
  {
    path: '/settings',
    component: Layout,
    redirect: '/settings/homepage',
    name: 'Settings',
    meta: { title: '设置', icon: 'el-icon-s-tools' },
    children: [
      {
        path: 'homepage',
        name: 'HomePage',
        component: () => import('@/views/settings/homepage/index'),
        meta: { title: '企业主页', icon: 'table' }
      },
      {
        path: 'administrator',
        name: 'Administrator',
        component: () => import('@/views/settings/administrator/index'),
        meta: { title: '子管理员', icon: 'table' }
      },
      {
        path: 'account',
        name: 'Account',
        component: () => import('@/views/settings/account/index'),
        meta: { title: '账户设置', icon: 'table' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
