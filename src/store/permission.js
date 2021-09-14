import {getCurrentUser as _getCurrentUser} from '/src/api/sysUserService'

const modules = import.meta.glob("../views/**/**.vue")
import constantRoutes from '/src/router/constant-routes'
import {reactive} from 'vue'
import router from '/src/router'
import {getToken} from "../utils/storage";
import Layout from '/src/layout/index.vue'


export const currentUser = reactive({
    token: getToken(),
    name: '',
    avatar: '',
    // 每次页面刷新之后 动态路由 就没了。
    // 所以再每次刷新后要 重新获取 角色并再次生成动态路由
    roles: [],
    routers: [], // 缓存所有的路由
})

/**
 * 获取当前的用户信息这里是用了缓存
 * 拼接动态菜单 双return return 可以用then()接收
 * @returns {Promise<AxiosResponse<any>>}
 */
// 获取用户信息并动态添加路由  use in router/beforeEach()
export function getCurrentUser() {
    if (currentUser.routers.length === 0) {
        _getCurrentUser().then(res => {
            if (res.code === 0) {
                routerPackag(res.data.menus)
                currentUser.routers = res.data.menus;
                return res
            }
        })
    }
}

const routerPackag = routers => {
    routers.filter(itemRouter => {
        // 菜单类型，0 目录、1 菜单、2 按钮
        /**
         * 添加嵌套路由 https://next.router.vuejs.org/zh/guide/advanced/dynamic-routing.html#%E5%88%A0%E9%99%A4%E8%B7%AF%E7%94%B1
         * 支持平级添加路由
         */
        if (itemRouter.type == 1) {
            // 添加当前的路由是寻找父级
            let currentRoute = router.getRoutes().find(ele => {
                return ele.meta.id == itemRouter.parentId
            })
            currentRoute.children.push({
                    path: `${itemRouter.path}`,
                    name: itemRouter.name,
                    component: modules[`../views/${itemRouter.component}`],
                    meta: {
                        id: itemRouter.id,
                        title: itemRouter.title,
                        icon: itemRouter.icon,
                    },
                }
            )
            router.addRoute(currentRoute)
            // 构建左侧菜单
            itemRouter.component = modules[`../views/${itemRouter.component}`];
            itemRouter.hidden = itemRouter.hidden ? false : true;
            itemRouter.meta = {};
            itemRouter.meta.title = itemRouter.title;
            itemRouter.meta.icon = itemRouter.icon;
        } else if (itemRouter.type == 0) {
            // 动态添加路由【目录】
            router.addRoute({
                path: itemRouter.path ? "/" + itemRouter.path : "/",
                name: itemRouter.path,
                redirect: itemRouter.redirect,
                component: Layout,
                meta: {
                    id: itemRouter.id,
                    title: itemRouter.title,
                    icon: itemRouter.icon,
                },
            });
            // 构建左侧菜单
            itemRouter.name = itemRouter.path;
            itemRouter.redirect = itemRouter.redirect;
            itemRouter.path = itemRouter.path ? "/" + itemRouter.path : "/";
            itemRouter.component = Layout;
            itemRouter.hidden = itemRouter.hidden ? false : true;
            itemRouter.meta = {};
            itemRouter.meta.title = itemRouter.title;
            itemRouter.meta.icon = itemRouter.icon;
        }
        // 是否存在子集
        if (itemRouter.children && itemRouter.children.length && itemRouter.type !== 2) {
            routerPackag(itemRouter.children);
        }
        return true;
    });
};






