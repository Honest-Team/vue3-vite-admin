import Layout from '/src/layout/index.vue'
import Login from '/src/views/login/login.vue'
import Redirect from '/src/views/redirect/index.vue'

/**
 * 通用路由表，不需要动态获取的默认路由
 * 所有被展示到sidebar的路由都要有唯一的name属性
 */

const User = {
  template: `
    <div class="user">
      <h2>User {{ $route.params.id }}</h2>
      <router-view></router-view>
    </div>
  `,
}

export default [
  {
    path: '/redirect',
    component: Layout,
    redirect: '/',
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'redirect',
        component: Redirect,
        meta: { noCache: true },
      },
    ],
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('/src/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'el-icon-info' },
      },
    ],
  },
  {
    path: '/login',
    hidden: true,
    component: Login,
    meta: { noCache: true, title: '' },
  },
  {
    path: '/404',
    component: () => import('/src/views/error-page/404.vue'),
    hidden: true,
  },
  {
    path: '/401',
    component: () => import('/src/views/error-page/401.vue'),
    hidden: true,
  },
  {
    path: '/icon',
    component: Layout,
    redirect: '/icon/index',
    children: [
      {
        path: 'index',
        name: 'Icons',
        component: () => import('/src/views/icons/index.vue'),
        meta: { title: '图标展示', icon: 'el-icon-shopping-cart-full' },
      },
    ],
  },
  // {
  //   path: '/system',
  //   component: Layout,
  //   // redirect: '/system/menu',
  //   meta: { title: '系统设置', icon: 'el-icon-s-order' },
  //   children: [
  //     {
  //       path: 'user',
  //       name: 'user',
  //       component: () => import('/src/views/system/user/user.vue'),
  //       meta: { title: '用户管理', icon: '' },
  //     },
  //     {
  //       path: 'role',
  //       name: 'role',
  //       component: () => import('/src/views/system/role/role.vue'),
  //       meta: { title: '角色管理', icon: '' },
  //     },
  //     {
  //       path: 'editRole',
  //       name: 'editRole',
  //       hidden: true,
  //       component: () => import('/src/views/system/role/component/editRole.vue'),
  //       meta: {title: '编辑角色'},
  //     },
  //     {
  //       path: 'menu',
  //       name: 'menu',
  //       component: () => import('/src/views/system/menu/menu.vue'),
  //       meta: { title: '菜单管理', icon: '' },
  //     },
  //     {
  //       path: 'dept',
  //       name: 'dept',
  //       component: () => import('/src/views/system/dept/dept.vue'),
  //       meta: { title: '部门管理', icon: '' },
  //     },
  //
  //     {
  //       path: 'dict',
  //       name: 'dict',
  //       component: () => import('/src/views/system/dict/dict.vue'),
  //       meta: { title: '字典管理', icon: '' },
  //     },
  //   ],
  // },


]
