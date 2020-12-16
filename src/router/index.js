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
    name: 'CodeList',
    redirect: '/codelist/entrycode',
    meta: { title: '二维码列表', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'entrycode',
        name: 'EntryCode',
        component: () => import('@/views/codelist/entrycode/index'),
        meta: { title: '词条码', icon: 'el-icon-bank-card' }
      },
      {
        path: 'create',
        component: () => import('@/views/codelist/entrycode/create'),
        name: 'CreateArticle',
        hidden: true,
        meta: { title: '新增二维码' }
      },
      {
        path: 'edit',
        component: () => import('@/views/codelist/entrycode/edit'),
        name: 'EntryEdit',
        hidden: true,
        meta: { title: '编辑词条' }
      },
      // {
      //   path: 'funcode',
      //   name: 'FunCode',
      //   component: () => import('@/views/codelist/funcode/index'),
      //   meta: { title: '功能码', icon: 'table' }
      // },
      {
        path: 'funcreate',
        component: () => import('@/views/codelist/funcode/create'),
        name: 'FunCreateArticle',
        hidden: true,
        meta: { title: '新增功能码' }
      },
      {
        path: 'funedit',
        component: () => import('@/views/codelist/funcode/edit'),
        name: 'FunEntryEdit',
        hidden: true,
        meta: { title: '编辑功能码' }
      }
    ]
  },
  // {
  //   path: '/product',
  //   component: Layout,
  //   name: 'Product',
  //   redirect: '/product/productcode',
  //   meta: { title: '产品管理', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'productcode',
  //       name: 'ProductCode',
  //       component: () => import('@/views/product/productcode/index'),
  //       meta: { title: '产品码', icon: 'table' },
  //     },
  //     {
  //       path: 'productcreate',
  //       component: () => import('@/views/product/productcode/create'),
  //       name: 'ProductCreate',
  //       hidden: true,
  //       meta: { title: '新增产品码' }
  //     },
  //     {
  //       path: 'productedit',
  //       component: () => import('@/views/product/productcode/edit'),
  //       name: 'ProductEdit',
  //       hidden: true,
  //       meta: { title: '修改产品码' }
  //     },
  //     {
  //       path: 'instructions',
  //       name: 'Instructions',
  //       component: () => import('@/views/product/instructions/index'),
  //       meta: { title: '说明书', icon: 'el-icon-bank-card' }
  //     },
  //     {
  //       path: 'instructionscreate',
  //       component: () => import('@/views/product/instructions/create'),
  //       name: 'InstructionsCreate',
  //       hidden: true,
  //       meta: { title: '新增说明书' }
  //     },
  //     {
  //       path: 'instructionsedit',
  //       component: () => import('@/views/product/instructions/edit'),
  //       name: 'InstructionsEdit',
  //       hidden: true,
  //       meta: { title: '修改说明书' }
  //     },

  //   ]
  // },
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
        meta: { title: '子管理员', icon: 'el-icon-user' }
      },
      {
        path: 'account',
        name: 'Account',
        component: () => import('@/views/settings/account/index'),
        meta: { title: '账户设置', icon: 'el-icon-s-custom' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
export const asyncRoutes = []

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

