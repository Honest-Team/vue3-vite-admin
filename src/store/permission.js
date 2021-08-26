import {getCurrentUser as _getCurrentUser} from '/src/api/sysUserService'
import constantRoutes from '/src/router/constant-routes'
import {reactive} from 'vue'
import router from '/src/router'
import {getToken} from "../utils/storage";

export const currentUser = reactive({
    token: getToken(),
    name: '',
    avatar: '',
    // 每次页面刷新之后 动态路由 就没了。
    // 所以再每次刷新后要 重新获取 角色并再次生成动态路由
    roles: [],
    // 存放一级路由的集合
    addRoutes: null,
})



// 获取用户信息并动态添加路由  use in router/beforeEach()
export function getCurrentUser() {
    return _getCurrentUser().then(res => {
        return res
    })

}