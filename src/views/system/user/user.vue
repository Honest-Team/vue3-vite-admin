<template>
    <!--按钮+查询条件-->
    <div class="query">
        <div style="display: flex">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="getOptionData">添加用户</el-button>
        </div>
        <!--查询条件-->
        <div style="display: flex">
            <el-select class="select" v-model="query.selectValue" placeholder="请选择" size="small">
                <el-option
                        v-for="item in query.option"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-input class="input" size="small"
                      v-if="query.selectValue === 'username' || query.selectValue === 'nickName'"
                      v-model="query.inputValue"
                      placeholder="请输入"></el-input>
            <el-button type="primary" size="small" icon="el-icon-search" @click="getTableData(query)">查询</el-button>
        </div>
    </div>


    <!--表格-->
    <data-table
            v-bind="tableOption"
            @edit="edit"
            @changePass="changePass"
            @selection="selection"
            @getTableData="getTableData"
            @deleteFn="deleteFn"
    ></data-table>


    <!--添加/编辑角色弹框-->
    <el-dialog
            :title="formData.id ? '编辑用户' : '添加用户'"
            v-model="dialogVisible"
            width="40%"
    >
        <el-form size="small" label-width="80px" :model="formData" :rules="formDataRules" ref="formRef">

            <div class="flex-justify-between">
                <el-form-item label="登录名:" prop="username">
                    <el-input v-model="formData.username" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="电话:" prop="phone">
                    <el-input v-model="formData.phone" placeholder=""></el-input>
                </el-form-item>
            </div>

            <div class="flex-justify-between">
                <el-form-item label="昵称:" prop="nickName">
                    <el-input v-model="formData.nickName" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="邮箱:" prop="email">
                    <el-input v-model="formData.email" placeholder=""></el-input>
                </el-form-item>
            </div>

            <div style="display: flex">
                <el-form-item label="性别:" prop="deptId">
                    <el-select v-model="formData.gender" placeholder="请选择">
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门:" prop="deptId" v-if="dialogVisible" >
                    <treeselect size="small" v-model="formData.deptId" :options="pidOptions" :normalizer="normalizer"/>
                </el-form-item>
            </div>

            <el-form-item label="角色:">
                <el-select style="width: 100%" v-model="formData.roles" multiple placeholder="请选择">
                    <el-option
                            v-for="item in rolesOption"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="激活状态:">
                <el-switch v-model="formData.enabled" :inactive-value="0" :active-value="1" active-color=""
                           inactive-color=""></el-switch>
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                  <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                  <el-button size="small" type="primary" @click="saveData">确 定</el-button>
             </span>
        </template>
    </el-dialog>
    <!--确定删除吗-->
    <el-dialog
            custom-class="deletedialog"
            title="提示"
            v-model="deletedialog"
            width="30%"
    >
        <span>确定删除吗？</span>
        <template #footer>
    <span class="dialog-footer">
      <el-button size="small" @click="deletedialog = false">取 消</el-button>
      <el-button size="small" type="primary" @click="handleClose">确 定</el-button>
    </span>
        </template>
    </el-dialog>

    <!--重置密码-->
    <el-dialog
            title="重置密码"
            v-model="changePassVisible"
            width="35%"
    >
        <el-form size="small" label-width="120px" :model="formData" :rules="formDataRules" ref="formRef">
            <el-form-item label="旧密码:" prop="oldPass">
                <el-input v-model="formData.oldPass" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="新密码:" prop="newPass">
                <el-input v-model="formData.newPass" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="确认密码:" prop="newPass2">
                <el-input v-model="formData.newPass2" placeholder=""></el-input>
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                  <el-button size="small" @click="changePassVisible = false">取 消</el-button>
                  <el-button size="small" type="primary" @click="changePassConfirm">确 定</el-button>
             </span>
        </template>
    </el-dialog>

</template>

<script>
    import DataTable from '@/components/DataTable/index.vue'
    import {queryByCondition, save, update, deleteByIds, getUser, updatePassword} from '@/api/sysUserService'

    import {onMounted, reactive, ref} from 'vue'
    import {ElMessage} from "element-plus";
    import {getTreeByCondition} from '@/api/sysDeptService'
    import {query as getRoleList} from '@/api/sysRoleService'
    import Treeselect from 'vue3-treeselect'
    import 'vue3-treeselect/dist/vue3-treeselect.css'

    export default {
        components: {DataTable, Treeselect},
        setup() {
            onMounted(() => {
                getTableData(tableOption.getTableData.page)
            })

            // 查询框
            const query = reactive({
                selectValue: "username",
                inputValue: "",
                option: [{
                    label: '登录名',
                    value: 'username'
                }, {
                    label: '昵称',
                    value: 'nickName'
                }]
            })

            // 表格配置属性
            const tableOption = reactive({
                // 表头数据
                columns: [
                    {
                        label: '登录名',
                        prop: 'username',
                        fixed: true,
                        width: '180',
                        sort: true,
                    },
                    {
                        label: '昵称',
                        prop: 'nickName',
                        sort: true,
                    },
                    {
                        label: '电话',
                        prop: 'phone',
                        sort: true,
                    },
                    {
                        label: '邮箱地址',
                        prop: 'email',
                        width: "140",
                        sort: true,
                    },
                    {
                        label: '状态',
                        prop: 'enabled',
                        type: "enabled",
                        sort: true,
                    },
                    {
                        label: '创建时间',
                        prop: 'createTime',
                        sort: true,
                    },
                ],
                // 表格内容数据
                getTableData: {
                    eventName: 'getTableData',
                    page: {
                        current: 1,
                        size: 10,
                    },
                    total: 0,
                    data: [],
                },

                buttonGroup: [
                    {
                        label: '编辑', //复制
                        icon: '',
                        type: '',
                        eventName: 'edit',
                        disabled: function (item) {
                        },
                    },
                    {
                        label: '删除',
                        icon: '',
                        type: '',
                        eventName: 'deleteFn',
                        disabled: function (item) {

                        },
                    },
                    {
                        label: '更多',
                        type: 'primary',
                        icon: '',
                        dropdownMenu: [
                            {
                                label: '重置密码',
                                eventName: 'changePass',
                                disabled: function (item) {

                                },
                            },
                            {
                                label: '连接',
                                command: 'connect',
                                disabled: function (item) {
                                },
                            },
                        ],
                    },
                ],
                // 多选功能
                selection: {
                    eventName: 'selection',
                    data: []
                }
            })

            function selection(val) {
                console.log(val);
            }
            function getTableData(query) {
                let params = {};
                if (query) {
                    params[query.selectValue] = query.inputValue
                }
                queryByCondition(params).then(res => {
                    tableOption.getTableData.total = res.data.total
                    tableOption.getTableData.data = res.data.data
                    tableOption.getTableData.data = res.data.data
                })
            }

            const formData = reactive({})
            const dialogVisible = ref(false);
            const deletedialog = ref(false);
            const changePassVisible = ref(false);
            let formRef = ref();

            const validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== formData.newPass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            const formDataRules = {
                username: [
                    {required: true, message: '登录名不能为空'},
                    {min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur'}
                ],
                oldPass: [
                    {required: true, message: '旧密码不能为空'},
                ],
                newPass: [
                    {required: true, message: '新密码不能为空'},
                    {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
                ],
                newPass2: [
                    {required: true, message: '确认密码不能为空'},
                    {validator: validatePass2, trigger: 'blur'},
                    {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
                ],
                nickName: [
                    {required: true, message: '登录名不能为空'},
                    {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
                ],
                phone: [
                    {required: true, message: '电话不能为空'},
                    {pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '请输入正确的电话号码', trigger: ['blur', 'change']}
                ],
                email: [
                    {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                    {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
                ],
                roles: [
                    {required: true, message: '角色不能为空'},
                ],

            }
            let pidOptions = ref([]);
            let rolesOption = ref([]);

            // 打开弹框
            function getOptionData() {
                dialogVisible.value = true;
                formData.id = null;
                formData.username = "";
                formData.nickName = "";
                formData.deptId = null;
                formData.email = "";
                formData.gender = "";
                formData.enabled = 1;
                formData.phone = "";
                formData.roles = [];
                // 查询部门
                getTreeByCondition().then(res => {
                    pidOptions.value = res.data;
                })
                // 查询角色
                getRoleList().then(res => {
                    rolesOption.value = res.data;
                })
            }

            function edit(scope) {
                console.log(scope);
                dialogVisible.value = true;
                formData.id = scope.id;
                formData.deptId = scope.deptId || null;
                formData.username = scope.username;
                formData.nickName = scope.nickName;
                formData.email = scope.email;
                formData.gender = scope.gender;
                formData.enabled = scope.enabled;
                formData.phone = scope.phone;

                // 查询部门
                getTreeByCondition().then(res => {
                    pidOptions.value = res.data;
                })
                // 查询角色
                getRoleList().then(res => {
                    rolesOption.value = res.data;
                })
                // 查询当前用户
                getUser(scope.id).then(res => {
                    formData.roles = res.data.roles;
                })
            }


            function deleteFn(scope) {
                deletedialog.value = true;
                formData.id = scope.id;
            }


            function handleClose() {
                deleteByIds([formData.id]).then(res => {
                    if (res.code === 0) {
                        deletedialog.value = false;
                        getTableData();
                        ElMessage.success({
                            message: '删除成功',
                            type: 'success'
                        });
                    }
                })
            }

            // 保存数据
            function saveData() {
                console.log(formData);
                formRef.value.validate((valid) => {
                    if (valid) {
                        if (formData.id) {
                            update(formData).then(res => {
                                if (res.code === 0) {
                                    dialogVisible.value = false;
                                    ElMessage.success({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    getTableData();
                                }
                            })
                        } else {
                            save(formData).then(res => {
                                if (res.code === 0) {
                                    dialogVisible.value = false;
                                    ElMessage.success({
                                        message: '添加成功',
                                        type: 'success'
                                    });
                                    getTableData();
                                }
                            })
                        }
                    }
                });
            }

            function normalizer(node) {
                return {
                    label: node.name,
                    id: node.deptId,
                }
            }


            function changePass(scope) {
                formData.id = scope.id;
                changePassVisible.value = true;
            }

            // 重置密码
            function changePassConfirm() {
                formRef.value.validate((valid) => {
                    if (valid) {
                        updatePassword(formData).then(res => {
                            if (res.data) {
                                changePassVisible.value = false;
                            }
                        })
                    }
                })
            }

            return {
                normalizer,
                formRef,
                formDataRules,
                changePassVisible,
                dialogVisible,
                deletedialog,
                formData,
                query,
                edit,
                changePass,
                changePassConfirm,
                handleClose,
                deleteFn,
                getTableData,
                saveData,
                getOptionData,
                pidOptions,
                rolesOption,
                tableOption,
                selection,
            }
        },
    }
</script>
