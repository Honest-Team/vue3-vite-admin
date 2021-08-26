<template>
    <!--按钮+查询条件-->
    <div class="query">
        <div style="display: flex">
            <el-button type="primary" size="small" icon="el-icon-plus" @click="getOptionData()">添加部门</el-button>
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
            <!--todo 做成从字典表获取-->
            <el-select clearable class="input" v-if="query.selectValue === 'enabled'" v-model="query.inputValue"
                       size="small"
                       placeholder="请选择">
                <el-option
                        label="开启"
                        value="1">
                </el-option>
                <el-option
                        label="停用"
                        value="0">
                </el-option>
            </el-select>

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
            :title="formData.deptId ? '编辑部门' : '添加部门'"
            v-model="dialogVisible"
            width="30%"
    >
        <el-form size="small" label-width="80px" :model="formData" :rules="formDataRules" ref="formRef">
            <el-form-item label="部门名称" prop="name">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="排序">
                <el-input v-model="formData.deptSort"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-radio-group v-model="formData.enabled">
                    <el-radio label="1">启用</el-radio>
                    <el-radio label="0">停用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="上级部门" prop="pid" v-if="dialogVisible">
                <treeselect v-model="formData.pid" :options="pidOptions" :normalizer="normalizer"/>
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
    import {getTreeByCondition, save, update, deleteByIds} from '@/api/sysDeptService'
    import {onMounted, reactive, ref} from 'vue'
    import {getDeptTree} from './dept.js'
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
                    label: node.name,
                    id: node.deptId,
                }
            }

            // 添加框
            const dialogVisible = ref(false);

            // 表格配置属性
            const tableOption = reactive({
                // 表头数据
                border: true,
                rowKey: "deptId",
                columns: [
                    {
                        label: '部门名称',
                        prop: 'name',
                        width: "200",
                        sort: true,
                    },
                    {
                        label: '排序',
                        prop: 'deptSort',
                        sort: true,
                    },
                    {
                        label: '状态',
                        prop: 'enabled',
                        sort: true,
                        type: "enabled"
                    },
                    {
                        label: '创建人',
                        prop: 'createBy',
                        sort: true,
                    },
                    {
                        label: '创建时间',
                        prop: 'createTime',
                        sort: true,
                    },
                    {
                        label: '更新时间',
                        prop: 'updateTime',
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
                    label: '部门名称',
                    value: 'name'
                }, {
                    label: '状态',
                    value: 'enabled'
                }]
            })


            const formData = reactive({
                deptId: "",
                name: "",
                deptSort: "",
                pid: 0,
                enabled: "",
            })

            // 打开弹框
            function getOptionData() {
                dialogVisible.value = true;
                formData.deptId = null;
                formData.name = "";
                formData.deptSort = "";
                formData.enabled = "1";
                formData.pid = 0;
                getDeptTree(function (data) {
                    pidOptions.value = data;
                })
            }


            const formDataRules = ref({
                name: [
                    {required: true, message: '请输入部门名称', trigger: 'blur'},
                ],
                pid: {required: true, message: '请选择上级部门', trigger: 'change'},
            })

            // 保存数据
            function saveData() {
                formRef.value.validate((valid) => {
                    if (valid) {
                        if (formData.deptId) {
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
                formData.pid = scope.pid; // bug 直接传入数值可以，scope.pid = 31 不行： https://blog.csdn.net/qq_35473192/article/details/118362562
                formData.deptId = scope.deptId;
                formData.name = scope.name;
                formData.deptSort = scope.deptSort;
                formData.enabled = scope.enabled + "";
                getDeptTree(function (data) {
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
