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
    path: '/icons',
    component: Layout,
    redirect: '/icons/index',
    children: [
      {
        path: 'index',
        name: 'Icons',
        component: () => import('/src/views/icons/index.vue'),
        meta: { title: '图标展示', icon: 'el-icon-shopping-cart-full' },
      },
    ],
  },
  {
    path: '/system',
    component: Layout,
    // redirect: '/system/menu',
    meta: { title: '系统设置', icon: 'el-icon-s-order' },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('/src/views/system/user/user.vue'),
        meta: { title: '用户管理', icon: '' },
      },
      {
        path: 'addUser',
        name: 'addUser',
        hidden: true,
        component: () => import('/src/views/system/user/addUser.vue'),
        meta: { title: '添加用户', icon: '' },
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('/src/views/system/role/role.vue'),
        meta: { title: '角色管理', icon: '' },
      },
      {
        path: 'editRole',
        name: 'editRole',
        hidden: true,
        component: () => import('/src/views/system/role/component/editRole.vue'),
        meta: {title: '编辑角色'},
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('/src/views/system/menu/menu.vue'),
        meta: { title: '菜单管理', icon: '' },
      },
      {
        path: 'dept',
        name: 'dept',
        component: () => import('/src/views/system/dept/dept.vue'),
        meta: { title: '部门管理', icon: '' },
      },

      {
        path: 'dict',
        name: 'dict',
        component: () => import('/src/views/system/dict/dict.vue'),
        meta: { title: '字典管理', icon: '' },
      },
    ],
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    children: [
      {
        path: 'index',
        name: 'Profile',
        component: () => import('/src/views/profile/index.vue'),
        meta: { title: '个人中心' },
      },
    ],
  },
  // TODO 添加留言板页面
  // {},
  /** 示例功能 当页面的name和组件的name重复时，会引发栈溢出ERROR */
  {
    path: '/example',
    component: Layout,
    redirect: '/example/file-upload',
    meta: { title: '功能示例', icon: 'el-icon-copy-document' },
    children: [
      {
        path: 'file-upload',
        component: () => import('/src/views/example/file-upload/index.vue'),
        name: 'FileUpload',
        meta: { title: '文件上传', icon: 'el-icon-upload2' },
      },
      {
        path: 'file-download',
        component: () => import('/src/views/example/file-download/index.vue'),
        name: 'FileDownload',
        meta: { title: '文件下载', icon: 'el-icon-download' },
      },
      {
        path: 'emotion-demo',
        component: () => import('/src/views/example/emotion-demo/index.vue'),
        name: 'EmotionDemo',
        meta: { title: '输入框表情', icon: 'el-icon-box' },
      },
      {
        path: 'compare-demo',
        component: () => import('/src/views/example/compare-demo/index.vue'),
        name: 'CompareDemo',
        meta: { title: '图片对比', icon: 'el-icon-picture-outline' },
      },
      {
        path: 'text-editor',
        component: () => import('/src/views/error-page/404.vue'),
        name: 'TextEditor',
        meta: { title: '文本编辑器', icon: 'el-icon-edit' },
      },
      {
        path: 'image-cropper',
        component: () => import('/src/views/error-page/404.vue'),
        name: 'ImageCropper',
        meta: { title: '图片裁剪', icon: 'el-icon-picture-outline-round' },
      },
      {
        path: 'silk-ribbon',
        component: () => import('/src/views/error-page/404.vue'),
        name: 'SilkRibbon',
        meta: { title: '缎带组件', icon: 'el-icon-collection-tag' },
      },
    ],
  },
  /** 示例页面  */
  {
    path: '/example-page',
    component: Layout,
    redirect: '/example-page/404',
    meta: { title: '页面示例', icon: 'el-icon-document' },
    children: [
      {
        path: '404',
        component: () => import('/src/views/error-page/404.vue'),
        name: '404',
        meta: { title: '404页面', icon: 'el-icon-close' },
      },
      {
        path: '401',
        component: () => import('/src/views/error-page/401.vue'),
        name: '401',
        meta: { title: '401页面', icon: 'el-icon-close' },
      },
      {
        path: 'scroll-page',
        component: () => import('/src/views/example-page/scroll-page.vue'),
        name: 'ScrollPage',
        meta: { title: '滚动页面', icon: 'el-icon-d-caret' },
      },
      {
        path: 'example-table',
        name: 'ExampleTable',
        component: () => import('/src/views/error-page/404.vue'),
        meta: { title: '表格 Table', icon: 'el-icon-date' },
      },
      {
        path: 'example-echarts',
        name: 'ExampleEcharts',
        component: () => import('/src/views/error-page/404.vue'),
        meta: { title: '图表 Echarts', icon: 'el-icon-pie-chart' },
      },
      {
        path: 'example-drag',
        name: 'ExampleDrag',
        component: () => import('/src/views/error-page/404.vue'),
        meta: { title: '拖拽 Drag', icon: 'el-icon-thumb' },
      },
      {
        path: 'online-chat',
        name: 'OnlineChat',
        component: () => import('/src/views/error-page/404.vue'),
        meta: { title: '即时通讯聊天', icon: 'el-icon-microphone' },
      },
    ],
  },
]
