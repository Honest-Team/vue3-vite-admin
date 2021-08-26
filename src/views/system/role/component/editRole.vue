<template>
    <div class="nest-box">
        <el-page-header @back="goBack" title="返回" content="详情页面"></el-page-header>
        <el-form style="margin-top: 20px;display: flex" :model="form" ref="formRef" label-width="80px" :rules="formDataRules" >
            <el-form-item label="角色名称" prop="name">
                <el-input  v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
                <el-input style="width: 400px"  v-model="form.description"></el-input>
            </el-form-item>
        </el-form>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="基础配置" name="first">
                <role-config :form="form"></role-config>
            </el-tab-pane>
            <el-tab-pane label="我的工作台" name="second">
                <home-config></home-config>
            </el-tab-pane>

        </el-tabs>
    </div>
</template>

<script>

    import router from '/src/router'
    import { useRoute } from 'vue-router'
    import {reactive, ref, onMounted} from 'vue'
    import RoleConfig from './roleConfig.vue'
    import HomeConfig from './homeConfig.vue'
    import {query} from '@/api/sysRoleService'
    import role from '../role'
    export default {
        name: "editRole",
        components: {
            RoleConfig,
            HomeConfig,
        },

        setup() {
            const activeName = ref("first")
            const form = reactive({

            })
            const goBack = () => {
                router.push({
                    name: "role",
                    menus: [],
                })
            };

            query(useRoute().query.id).then(res => {
                form.id = res.data.id;
                form.name = res.data.name;
                form.description = res.data.description;
                form.menus = res.data.menus;
            })

            return {
                ...role,
                form,
                activeName,
                goBack
            }
        }
    }
</script>

<style scoped>

</style>