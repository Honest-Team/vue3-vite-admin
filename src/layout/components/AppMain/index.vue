<template>
    <div class="app-main" :style="{ width: 'calc(100vw - '+ sidebarWidth + ')'}">
<!--        <router-view v-slot="{ Component }">-->
<!--            <component :is="Component"/>-->

<!--&lt;!&ndash;            <transition name="fade-transform" mode="out-in">&ndash;&gt;-->
<!--&lt;!&ndash;                <keep-alive :include="cachedViewNames">&ndash;&gt;-->
<!--&lt;!&ndash;                    <component :is="Component"/>&ndash;&gt;-->
<!--&lt;!&ndash;                </keep-alive>&ndash;&gt;-->
<!--&lt;!&ndash;            </transition>&ndash;&gt;-->
<!--        </router-view>-->
<!--        <transition  :key="$route.path">-->
            <router-view />
<!--        </transition>-->

    </div>
</template>

<script>
    /**
     * 被缓存页面的name属性要和routes中的name属性一致
     * https://panjiachen.gitee.io/vue-element-admin-site/zh/guide/essentials/tags-view.html
     * https://v3.cn.vuejs.org/api/built-in-components.html#keep-alive
     * https://next.router.vuejs.org/zh/guide/migration/index.html#router-view-%E3%80%81-keep-alive-%E5%92%8C-transition
     * https://next.router.vuejs.org/zh/api/#router-view-props
     * <router-view>、<keep-alive> 和 <transition> 变化：https://github.com/vuejs/rfcs/blob/master/active-rfcs/0034-router-view-keep-alive-transitions.md
     *
     * 这里是第二层 <router-view>
     */
    import useLayout from '../useLayout'
    import {toRef} from 'vue'

    export default {
        name: 'AppMain',
        setup() {
            const {state, sidebarWidth} = useLayout()
            console.log(toRef(state, 'cachedViews'));
            return {
                cachedViewNames: toRef(state, 'cachedViews'),
                sidebarWidth,
            }
        },
    }
</script>

<style lang="scss" scoped>
    .app-main {
        position: relative;
        padding: 15px;
        background-color: #f1f2f3;
        height: calc(100vh - #{$navbar-height + $tabBar-height});
        overflow: auto;
    }

    /*
     fade-transform 会被transition在恰当时机添加/删除CSS类名
     https://v3.cn.vuejs.org/api/built-in-components.html#component
     https://v3.cn.vuejs.org/guide/transitions-enterleave.html#%E8%BF%87%E6%B8%A1class
     enter/leave-active:进入过渡/离开过度生效时的状态,这个类可以被用来定义进入/离开过渡的过程时间，延迟和曲线函数。
    */
    .fade-transform-enter-active,
    .fade-transform-leave-active {
        transition: all 0.4s;
    }

    /* 定义元素离开的动画效果 */
    .fade-transform-leave-to {
        opacity: 0;
        transform: translateX(24px);
    }
</style>
