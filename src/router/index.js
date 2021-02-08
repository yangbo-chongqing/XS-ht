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
    meta: { title: '管理', icon: 'dashboard', noCache: true },
    children: [{
      path: 'workbench',
      name: 'Workbench',
      component: () => import('@/views/workbench/index'),
      meta: { title: '工作台', icon: 'dashboard', noCache: true },
    },
    {
      path: 'scancode',
      name: 'ScanCode',
      component: () => import('@/views/scancode/index'),
      meta: { title: '扫码量统计', icon: 'dashboard', noCache: true }
    },
    ]
  },
  {
    path: '/codelist',
    component: Layout,
    name: 'CodeList',
    redirect: '/codelist/homepage',
    meta: { title: '编辑', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'homepage',
        name: 'HomePage',
        component: () => import('@/views/settings/homepage/index'),
        meta: { title: '企业主页', icon: 'table', noCache: true }
      },
      {
        path: 'entrycode',
        name: 'EntryCode',
        component: () => import('@/views/codelist/entrycode/index'),
        meta: { title: '词条', icon: 'el-icon-bank-card', noCache: false, isBack: false }
      },
      {
        path: 'productcode',
        name: 'ProductCode',
        component: () => import('@/views/product/productcode/index'),
        meta: { title: '产品码', icon: 'table', noCache: true },
      },
      {
        path: '/customCode',
        name: 'customCode',
        component: () => import('@/views/product/custom/custom'),
        meta: { title: '扩展属性', noCache: true },
      },
      {
        path: 'productcreate',
        component: () => import('@/views/product/productcode/create'),
        name: 'ProductCreate',
        hidden: true,
        meta: { title: '新增产品码', noCache: true }
      },
      {
        path: 'flowcode',
        component: () => import('@/views/product/flowcode/index'),
        name: 'FlowCode',
        hidden: true,
        meta: { title: '流水码', noCache: true }
      },
      {
        path: 'flowcodecreate',
        component: () => import('@/views/product/flowcode/create'),
        name: 'FlowcodeCreate',
        hidden: true,
        meta: { title: '新增流水码', noCache: true }
      },
      {
        path: 'flowcodeedit',
        component: () => import('@/views/product/flowcode/edit'),
        name: 'flowcodeEdit',
        hidden: true,
        meta: { title: '修改流水码', noCache: true }
      },
      {
        path: 'productedit',
        component: () => import('@/views/product/productcode/edit'),
        name: 'ProductEdit',
        hidden: true,
        meta: { title: '修改产品码', noCache: true }
      },
      // {
      //   path: 'instructions',
      //   name: 'Instructions',
      //   component: () => import('@/views/product/instructions/index'),
      //   meta: { title: '说明书', icon: 'el-icon-bank-card', noCache: true }
      // },
      {
        path: 'instructionscreate',
        component: () => import('@/views/product/instructions/create'),
        name: 'InstructionsCreate',
        hidden: true,
        meta: { title: '新增说明书', noCache: true }
      },
      {
        path: 'instructionsedit',
        component: () => import('@/views/product/instructions/edit'),
        name: 'InstructionsEdit',
        hidden: true,
        meta: { title: '修改说明书', noCache: true }
      },
      // {
      //   path: 'mapping',
      //   name: 'Mapping',
      //   component: () => import('@/views/codelist/entrycode/mapping/index'),
      //   meta: { title: '旅游导图', icon: 'table', noCache: true }
      // },
      // {
      //   path: '/entrytype',
      //   component: () => import('@/views/codelist/entrytype/index'),
      //   name: 'entrytype',
      //   meta: { title: '分馆管理', icon: 'el-icon-menu', noCache: true }
      // },
      {
        path: '/codelist/entrytypeedit',
        component: () => import('@/views/codelist/entrytype/edit/index'),
        name: 'entrytypeedit',
      },
      {
        path: '/entrytypecreate',
        component: () => import('@/views/codelist/entrytype/create/index'),
        name: 'CreateArticle',
        hidden: true,
        meta: { title: '新增词条分类', noCache: true }
      },
      {
        path: 'create',
        component: () => import('@/views/codelist/entrycode/create'),
        name: 'CreateArticle',
        hidden: true,
        meta: { title: '新增二维码', noCache: true }
      },
      {
        path: 'edit',
        component: () => import('@/views/codelist/entrycode/edit'),
        name: 'EntryEdit',
        hidden: true,
        meta: { title: '编辑词条', noCache: true }
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
        meta: { title: '新增功能码', noCache: true }
      },
      {
        path: 'funedit',
        component: () => import('@/views/codelist/funcode/edit'),
        name: 'FunEntryEdit',
        hidden: true,
        meta: { title: '编辑功能码', noCache: true }
      }
    ]
  },
  // {
  //   path: '/product',
  //   component: Layout,
  //   name: 'Product',
  //   redirect: '/product/productcode',
  //   meta: { title: '产品管理', icon: 'el-icon-s-help', noCache: true },
  //   children: [


  //   ]
  // },
  // 工单管理
  {
    path: '/workOrder',
    component: Layout,
    redirect: 'workOrderList',
    name: 'workOrder',
    meta: { title: '工单管理', icon: 'el-icon-s-opportunity', noCache: true },
    children: [
      {
        path: 'workOrderList',
        name: 'workOrderList',
        component: () => import('@/views/workOrder/workOrderList'),
        meta: { title: '工单管理', icon: 'el-icon-s-opportunity', noCache: true },
      },
      {
        path: 'workOrderListDetail',
        name: 'workOrderListDetail',
        hidden: true,
        component: () => import('@/views/workOrder/workOrderListDetail'),
        meta: { title: '工单详情', icon: 'el-icon-s-opportunity', noCache: true },
      },
    ]
  },
  // 广告设置
  {
    path: '/advertising',
    component: Layout,
    redirect: 'Setting',
    name: 'advertising',
    meta: { title: '广告', icon: 'el-icon-s-custom', noCache: true },
    children: [
      {
        path: 'Setting',
        name: 'advertisingSetting',
        component: () => import('@/views/advertising/advertising'),
        meta: { title: '广告设置', icon: 'el-icon-s-custom', noCache: true },
      },
    ]
  },
  {
    path: '/settings',
    component: Layout,
    redirect: '/settings/homepage',
    name: 'Settings',
    meta: { title: '设置', icon: 'el-icon-s-tools' },
    children: [

      {
        path: 'administrator',
        name: 'Administrator',
        component: () => import('@/views/settings/administrator/index'),
        meta: { title: '子管理员', icon: 'el-icon-user', noCache: true }
      },
      {
        path: 'account',
        name: 'Account',
        component: () => import('@/views/settings/account/index'),
        meta: { title: '账户设置', icon: 'el-icon-s-custom', noCache: true }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },

  {
    path: '/help',
    name: 'help',
    meta: { title: '帮助' },
    component: () => import('@/views/workbench/help/help'),
  }
]
export const asyncRoutes = []

const createRouter = () => new Router({
  mode: 'history', // require service support
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

