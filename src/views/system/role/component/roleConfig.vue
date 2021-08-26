<template>
    <el-button type="primary" size="small" @click="save">保存</el-button>
    <el-tree
            style="margin-top: 10px"
            :data="data"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :default-checked-keys="defaultCheckedKeys"
            :props="{  label: 'title'}"
    >
    </el-tree>
</template>

<script>
    import {ref, watch} from 'vue'
    import {getTreeByCondition} from '@/api/sysMenuService'
    import {update} from '@/api/sysRoleService'
    import {ElMessage} from "element-plus";

    export default {
        name: "roleConfig",
        props: {
            form: Object
        },
        setup: function (props) {
            const tree = ref(null);
            const data = ref([]);
            const defaultCheckedKeys = ref([]);

            watch(() => props.form.menus, (newValue, oldValue) => {
                defaultCheckedKeys.value = newValue;
            })

            getTreeByCondition().then(res => {
                data.value = res.data;
            })

            function save() {
                // const halfCheckedKeys = tree.value.getHalfCheckedKeys();
                const checkedKeys = tree.value.getCheckedKeys();
                // const keys = [...checkedKeys, ...halfCheckedKeys];
                props.form.menus = checkedKeys;
                update(props.form).then(res => {
                    if (res.code === 0) {
                        ElMessage.success({
                            message: '保存成功',
                            type: 'success'
                        });
                    }
                })
            }

            return {
                tree,
                defaultCheckedKeys,
                data,
                save
            }
        }
    }
</script>

<style scoped>

</style>