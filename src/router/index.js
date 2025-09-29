import { createRouter, createWebHashHistory } from 'vue-router'
import { useIndexStore } from '@/store'

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('../views/Index/index.vue'),
    meta: {
      auth: false,
      title: '首页',
      keepAlive: true,
      headerTheme: 'dark'
    }
  },
  {
    path: '/computing',
    name: 'Computing',
    component: () => import('../views/computing/index.vue'),
    meta: {
      auth: false,
      title: '算力认购',
      keepAlive: true,
      headerTheme: 'light'
    }
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('../views/order/index.vue'),
    meta: {
      auth: false,
      title: '认购订单',
      keepAlive: true,
      headerTheme: 'light'
    }
  },
  {
    path: '/invitation',
    name: 'Invitation',
    component: () => import('../views/invitation/index.vue'),
    meta: {
      auth: false,
      title: '邀请好友',
      keepAlive: true,
      headerTheme: 'light'
    }
  },
  {
    path: '/mine',
    name: 'Mine',
    component: () => import('../views/mine/index.vue'),
    meta: {
      auth: false,
      title: '我的资产',
      keepAlive: true,
      headerTheme: 'light'
    }
  },
  {
    path: '/list',
    name: 'List',
    component: () => import('../views/ranking/index.vue'),
    meta: {
      auth: false,
      title: '排行榜',
      keepAlive: true,
      headerTheme: 'light'
    }
  },
  {
    path: '/transfer',
    name: 'transfer',
    component: () => import('../views/transfer/index.vue'),
    meta: {
      auth: false,
      title: '转账',
      keepAlive: true,
      headerTheme: 'light'
    }
  },
  {
    path: '/exchange',
    name: 'exchange',
    component: () => import('../views/exchange/index.vue'),
    meta: {
      auth: false,
      title: '兑换',
      keepAlive: true,
      headerTheme: 'light'
    }
  },
  {
    path: '/exchangeList',
    name: 'exchangeList',
    component: () => import('../views/exchange/list.vue'),
    meta: {
      auth: false,
      title: '兑换记录',
      keepAlive: true,
      headerTheme: 'light'
    }
  },
  {
    path: '/hashList',
    name: 'hashList',
    component: () => import('../views/hash/index.vue'),
    meta: {
      auth: false,
      title: '算力记录',
      keepAlive: true,
      headerTheme: 'light'
    }
  },
  {
    path: '/withdrawal',
    name: 'withdrawal',
    component: () => import('../views/withdrawal/index.vue'),
    meta: {
      auth: false,
      title: '提现',
      keepAlive: true,
      headerTheme: 'light'
    }
  },
  {
    path: '/incomeList',
    name: 'incomeList',
    component: () => import('../views/income/index.vue'),
    meta: {
      auth: false,
      title: '收益记录',
      keepAlive: true,
      headerTheme: 'light'
    }
  }
]
const modulesFiles = import.meta.glob('./modules/*.js', { eager: true })
//自动引入module包
const moduleRoutes = Object.entries(modulesFiles).reduce((moduleRoutes, [modulePath, value]) => {
  return [...moduleRoutes, ...value.default]
}, [])

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes: [...routes, ...moduleRoutes]
})

// 全局前置守衛：token 為空則跳轉首頁
router.beforeEach((to, from, next) => {
  try {
    const store = useIndexStore()
    if (!store.token && to.path !== '/index') {
      return next({ path: '/index' })
    }
  } catch (e) {
    // 忽略在 Pinia 尚未就緒時的極端情況，直接放行
  }
  next()
})
export default router
