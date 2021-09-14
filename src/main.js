import { createApp } from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'

/* 引入Element Plus */
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
// import '/src/styles/element-variables.scss'

import global from '@/utils/global'

/* 引入自己的样式、JS文和组件 */
import '/src/styles/common.scss'
import appIcon from '/src/components/AppIcon/index.vue'

import lang from '/src/lang'

const app = createApp(App)
app.use(ElementPlus).use(lang.i18n).use(router)

// app.use(router).use(ElementPlus,{locale}).use(I18n)
app.component('app-icon', appIcon)
app.config.globalProperties.$store = store
app.config.globalProperties.$global = global
app.mount('#app')

console.log("abcd")
