<template>

    <div style="width: 40%">
        <!--按钮+查询条件-->
        <div class="query">
            <div>字典项列表</div>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="getOptionData">添加字典项</el-button>
        </div>
        <!--表格-->
        <data-table
                v-bind="tableOption"
                @deleteFn="deleteFn"
                @edit="edit"
                @getTableData="getTableData"
        ></data-table>
    </div>

    <!--添加/编辑角色弹框-->
    <el-dialog
            :title="formData.id ? '编辑角色' : '添加角色'"
            v-model="dialogVisible"
            width="30%"
    >
        <el-form size="small" label-width="120px" :model="formData" :rules="formDataRules" ref="formRef">
            <el-form-item label="字典值名称:" prop="label">
                <el-input v-model="formData.label" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="字典值:" prop="value">
                <el-input v-model="formData.value" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="排序:">
                <el-input v-model.number="formData.dictSort" placeholder=""></el-input>
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
    import {queryByCondition, save, update, deleteByIds} from '@/api/sysDictDetailService'
    import {reactive, ref, watch} from 'vue'
    import {ElMessage} from "element-plus";

    export default {
        components: {DataTable},
        props: {
            dictId: Number
        },
        setup(props) {
            watch(() => props.dictId, (newValue, oldValue) => {
                if (newValue) {
                    getTableData(tableOption.getTableData.page)
                }
            })


            // 表格配置属性
            const tableOption = reactive({
                // 表头数据
                columns: [
                    {
                        label: '字典值名称',
                        prop: 'label',
                        sort: true,
                    },
                    {
                        label: '字典值',
                        prop: 'value',
                        sort: true,
                    },
                    {
                        label: '排序',
                        prop: 'dictSort',
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
                    },
                ],
            });

            const formData = reactive({})
            const deletedialog = ref(false);
            const dialogVisible = ref(false);
            let formRef = ref();
            const formDataRules = {
                label: [{required: true, message: '字典值名称不能为空'}],
                value: [{required: true, message: '字典值不能为空'}],
            }

            // 打开弹框
            function getOptionData() {
                dialogVisible.value = true;
                formData.detailId = null;
                formData.dictId = props.dictId;
                formData.label = "";
                formData.value = "";
            }


            // 保存数据
            function saveData() {
                formRef.value.validate((valid) => {
                    if (valid) {
                        if (formData.detailId) {
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

            function deleteFn(scope) {
                deletedialog.value = true;
                if (Array.isArray(scope)) {
                    formData.detailId = null;
                } else {
                    formData.detailId = scope.detailId;
                }
            }

            function handleClose() {
                deleteByIds([formData.detailId]).then(res => {
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
                dialogVisible.value = true;
                formData.detailId = scope.detailId;
                formData.label = scope.label;
                formData.value = scope.value;
            }


            function getTableData() {
                let params = {
                    dictId: props.dictId,
                    current: 1,
                    page: 100,
                }
                queryByCondition(params).then(res => {
                    tableOption.getTableData.total = res.data.total
                    tableOption.getTableData.data = res.data.data
                    tableOption.getTableData.data = res.data.data
                })
            }

            return {
                formRef,
                formDataRules,
                dialogVisible,
                deletedialog,
                formData,
                tableOption,
                saveData,
                handleClose,
                deleteFn,
                getOptionData,
                edit,
                getTableData,
            }
        },
    }
</script>
