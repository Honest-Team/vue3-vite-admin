<template>
    <!--按钮+查询条件-->
    <div class="query">
        <div style="display: flex">
            <el-button type="primary" size="small" icon="el-icon-plus" @click="getOptionData()">添加菜单</el-button>
        </div>
        <!--查询条件-->
        <div style="display: flex">
            <el-select class="select" @change="query.inputValue=null" v-model="query.selectValue" placeholder="请选择"
                       size="small">
                <el-option
                        v-for="item in query.option"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-input v-if="query.selectValue === 'name'"
                      class="input" size="small"
                      v-model="query.inputValue"
                      placeholder="请输入"></el-input>
            <el-button type="primary" size="small" icon="el-icon-search" @click="getTableData(query)">查询</el-button>
        </div>
    </div>


    <!--表格-->
    <data-table
            v-bind="tableOption"
            @edit="edit"
            @deleteFn="deleteFn"
            @getTableData="getTableData"
    ></data-table>

    <!--添加/编辑部门弹框-->
    <el-dialog
            title="添加菜单"
            v-model="dialogVisible"
            width="45%"
    >
        <el-form size="small" label-width="80px" :model="formData" :rules="formDataRules" ref="formRef">
            <el-form-item label="菜单类型">
                <el-button-group>
                    <el-button @click="formData.type = 0" :type="formData.type === 0?'primary' :''">目录</el-button>
                    <el-button @click="formData.type = 1" :type="formData.type === 1?'primary' :''">菜单</el-button>
                    <el-button @click="formData.type = 2" :type="formData.type === 2?'primary' :''">按钮</el-button>
                </el-button-group>
            </el-form-item>

            <!--菜单-->
            <div v-if="formData.type === 0">
                <el-form-item label="菜单图标">
                    <el-input v-model="formData.icon"></el-input>
                </el-form-item>
                <div style="display: flex;">
                    <el-form-item label="外链菜单">
                        <el-button-group>
                            <el-button @click="formData.iFrame = 1" :type="formData.iFrame === 1?'primary' :''">是
                            </el-button>
                            <el-button @click="formData.iFrame = 0" :type="formData.iFrame === 0?'primary' :''">否
                            </el-button>
                        </el-button-group>
                    </el-form-item>
                    <el-form-item label="菜单可见">
                        <el-button-group>
                            <el-button @click="formData.hidden = 1" :type="formData.hidden === 1?'primary' :''">否
                            </el-button>
                            <el-button @click="formData.hidden = 0" :type="formData.hidden === 0?'primary' :''">是
                            </el-button>
                        </el-button-group>
                    </el-form-item>
                </div>

                <el-form-item label="菜单标题" prop="title">
                    <el-input v-model="formData.title" placeholder="匹配组件title字段"></el-input>
                </el-form-item>

                <div class="flex-justify-between">
                    <el-form-item label="路由地址" prop="path">
                        <el-input v-model="formData.path" placeholder="匹配组件path字段"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单排序">
                        <el-input-number style="width: 177px" controls-position="right" :min="0"
                                         v-model.number="formData.weight"></el-input-number>
                    </el-form-item>
                </div>


            </div>

            <!--目录-->
            <div v-if="formData.type === 1">
                <el-form-item label="菜单图标">
                    <el-input v-model="formData.icon"></el-input>
                </el-form-item>
                <div style="display: flex;">
                    <el-form-item label="外链菜单">
                        <el-button-group>
                            <el-button @click="formData.iFrame = 1" :type="formData.iFrame === 1?'primary' :''">是
                            </el-button>
                            <el-button @click="formData.iFrame = 0" :type="formData.iFrame === 0?'primary' :''">否
                            </el-button>
                        </el-button-group>
                    </el-form-item>
                    <el-form-item label="菜单可见">
                        <el-button-group>
                            <el-button @click="formData.hidden = 1" :type="formData.hidden === 1?'primary' :''">是
                            </el-button>
                            <el-button @click="formData.hidden = 0" :type="formData.hidden === 0?'primary' :''">否
                            </el-button>
                        </el-button-group>
                    </el-form-item>
                    <el-form-item label="菜单缓存">
                        <el-button-group>
                            <el-button @click="formData.cached = 1" :type="formData.cached === 1?'primary' :''">是
                            </el-button>
                            <el-button @click="formData.cached = 0" :type="formData.cached === 0?'primary' :''">否
                            </el-button>
                        </el-button-group>
                    </el-form-item>
                </div>

                <div class="flex-justify-between">
                    <el-form-item label="菜单标题" prop="title">
                        <el-input v-model="formData.title" placeholder="匹配组件title字段"></el-input>
                    </el-form-item>

                    <el-form-item label="权限标识">
                        <el-input v-model="formData.permission"></el-input>
                    </el-form-item>
                </div>


                <div class="flex-justify-between">
                    <el-form-item label="路由地址" prop="path">
                        <el-input v-model="formData.path" placeholder="匹配组件path字段"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单排序">
                        <el-input-number style="width: 177px" controls-position="right" :min="0"
                                         v-model.number="formData.weight"></el-input-number>
                    </el-form-item>
                </div>

                <div class="flex-justify-between">
                    <el-form-item label="组件名称" prop="name">
                        <el-input v-model="formData.name" placeholder="匹配组件name字段"></el-input>
                    </el-form-item>
                    <el-form-item label="组件路径">
                        <el-input v-model="formData.component" placeholder="匹配组件component字段"></el-input>
                    </el-form-item>
                </div>
            </div>
            <!--按钮-->
            <div v-if="formData.type === 2">
                <el-form-item label="按钮名称" prop="title">
                    <el-input v-model="formData.title" placeholder=""></el-input>
                </el-form-item>
                <div class="flex-justify-between">
                    <el-form-item label="权限标识">
                        <el-input v-model="formData.permission"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单排序">
                        <el-input-number style="width: 177px" controls-position="right" :min="0"
                                         v-model.number="formData.weight"></el-input-number>
                    </el-form-item>
                </div>

            </div>

            <el-form-item label="上级类目" prop="parentId">
                <treeselect v-model="formData.parentId" :options="pidOptions" :normalizer="normalizer"/>
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

</template>

<script>
    import DataTable from '@/components/DataTable/index.vue'
    import {getTreeByCondition, save, update, deleteByIds} from '@/api/sysMenuService'
    import {onMounted, reactive, ref} from 'vue'
    import {getTree} from './menu.js'
    import Treeselect from 'vue3-treeselect'
    import 'vue3-treeselect/dist/vue3-treeselect.css'
    import {ElMessage} from 'element-plus'

    export default {
        components: {DataTable, Treeselect},
        setup() {
            onMounted(() => {
                getTableData();
            })

            // 下拉框
            let pidOptions = ref([]);
            let formRef = ref();

            function normalizer(node) {
                return {
                    label: node.title,
                }
            }

            // 添加框
            const dialogVisible = ref(false);

            // 表格配置属性
            const tableOption = reactive({
                // 表头数据
                border: true,
                columns: [
                    {
                        label: '菜单标题',
                        prop: 'title',
                        width: "200",
                        sort: true,
                    },
                    {
                        label: '类型',
                        prop: 'type',
                        sort: true,
                        type: 'menuType'
                    },
                    {
                        label: '排序',
                        prop: 'weight',
                        sort: true,
                    },
                    {
                        label: '权限标识',
                        prop: 'permission',
                        sort: true,
                    },
                    {
                        label: '组件路径',
                        prop: 'component',
                        sort: true,
                    },
                    {
                        label: '菜单可见',
                        prop: 'hidden',
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
                    data: [],
                },

                buttonGroup: [
                    {
                        label: '编辑', //复制
                        icon: '',
                        type: 'primary',
                        eventName: 'edit',
                        disabled: function (item) {
                        },
                    },
                    {
                        label: '删除', //复制
                        icon: '',
                        type: '',
                        eventName: 'deleteFn',
                        disabled: function (item) {

                        },
                    }],


            })


            // 查询框
            const query = reactive({
                selectValue: "name",
                inputValue: "",
                option: [{
                    label: '菜单标题',
                    value: 'name'
                }]
            })


            const formData = reactive({
                type: 0, // 0 目录、1 菜单、2 按钮
                iFrame: 0, // 0 否、1 是、
                hidden: 1, // 菜单可见 0 否、1 是、
                weight: 0, // 排序
                cached: 0, // 0 否、1 是、
                name: "",
                path: "",
            })

            // 打开弹框
            function getOptionData() {
                dialogVisible.value = true;
                formData.id = null;
                formData.parentId = 0;
                formData.type = 0;
                formData.iFrame = 0;
                formData.hidden = 1;
                formData.weight = 0;
                formData.cached = 0;
                formData.path = "";
                formData.icon = "";
                formData.title = "";
                formData.name = "";
                formData.component = "";
                formData.permission = null;
                getTree(function (data) {
                    pidOptions.value = data;
                })
            }

            const formDataRules = ref({
                path: [
                    {required: true, message: '请输入路由地址', trigger: 'blur'},
                ],
                title: [
                    {required: true, message: '请输入菜单标题', trigger: 'blur'},
                ],
                name: [
                    {required: true, message: '请输入组件名称', trigger: 'blur'},
                ],
                parentId: {required: true, message: '请选择上级类目', trigger: 'change'},
            })

            // 保存数据
            function saveData() {
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

            // 删除
            const deletedialog = ref(false);

            function handleClose() {
                deleteByIds([formData.deptId]).then(res => {
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

            function edit(scope) {
                formData.parentId = scope.parentId; // bug ： https://blog.csdn.net/qq_35473192/article/details/118362562
                formData.type = scope.type;
                formData.id = scope.id;
                formData.iFrame = scope.iFrame;
                formData.hidden = scope.hidden;
                formData.weight = scope.weight;
                formData.cached = scope.cached;
                formData.path = scope.path;
                formData.title = scope.title;
                formData.icon = scope.icon;
                formData.name = scope.name;
                formData.component = scope.component;
                formData.permission = scope.permission;
                getTree(function (data) {
                    pidOptions.value = data;
                })
                dialogVisible.value = true;
            }

            function deleteFn(scope) {
                deletedialog.value = true;
                formData.deptId = scope.id;
            }

            // 获取表格数据
            function getTableData(query) {
                let params = {
                    name: ""
                }
                if (query) {
                    params[query.selectValue] = query.inputValue
                }
                getTreeByCondition(params).then(res => {
                    tableOption.getTableData.data = res.data
                })
            }

            return {
                getOptionData,
                saveData,
                normalizer,
                pidOptions,
                formRef,
                formData,
                formDataRules,
                dialogVisible,
                deletedialog,
                query,
                edit,
                deleteFn,
                handleClose,
                tableOption,
                getTableData
            }
        },
    }
</script>
