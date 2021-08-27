<template>
    <div class="flex-justify-between">
        <div style="width: 59%">
            <!--按钮+查询条件-->
            <div class="query">
                <div style="display: flex">
                    <el-button type="primary" size="small" icon="el-icon-plus" @click="getOptionData">添加字典类型</el-button>
                    <el-button size="small" type="danger" :disabled="deleteIds.length==0" @click="deleteFn(deleteIds)"
                               icon="el-icon-delete">全部删除
                    </el-button>
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
                              v-if="query.selectValue === 'name' || query.selectValue === 'dictCode'"
                              v-model="query.inputValue"
                              placeholder="请输入"></el-input>
                    <el-button type="primary" size="small" icon="el-icon-search" @click="getTableData(query)">查询
                    </el-button>
                </div>
            </div>
            <!--表格-->
            <data-table
                    v-bind="tableOption"
                    @edit="edit"
                    @singleEvent="singleEvent"
                    @deleteFn="deleteFn"
                    @selection="selection"
                    @getTableData="getTableData"
            ></data-table>
        </div>
        <!--字典详情-->
        <dict-detail :dictId="dictId"></dict-detail>
    </div>


    <!--添加/编辑角色弹框-->
    <el-dialog
            :title="formData.id ? '编辑角色' : '添加角色'"
            v-model="dialogVisible"

            width="30%"
    >
        <el-form size="small" label-width="120px" :model="formData" :rules="formDataRules" ref="formRef">
            <el-form-item label="字典类型名称:" prop="name">
                <el-input v-model="formData.name" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="字典类型编码:" prop="dictCode">
                <el-input v-model="formData.dictCode" placeholder=""></el-input>
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
    import {queryByCondition, save, update, deleteByIds} from '@/api/sysDictService'
    import {onMounted, reactive, ref} from 'vue'
    import {ElMessage} from "element-plus";
    import DictDetail from './dictDetail.vue'

    export default {
        components: {DataTable, DictDetail},
        setup() {
            const dictId = ref("")


            onMounted(() => {
                getTableData(tableOption.getTableData.page)
            })
            // 查询框
            const query = reactive({
                selectValue: "name",
                inputValue: "",
                option: [{
                    label: '字典类型名称',
                    value: 'name'
                }, {
                    label: '字典类型编码',
                    value: 'dictCode'
                }]
            })

            // 表格配置属性
            const tableOption = reactive({

                // 表头数据
                columns: [
                    {
                        label: '字典类型名称',
                        prop: 'name',
                        sort: true,
                    },
                    {
                        label: '字典类型编码',
                        prop: 'dictCode',
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
                // 多选功能
                selection: {
                    eventName: 'selection',
                    singleEventName: 'singleEvent',
                    singleData: [],
                    data: []
                }

            })

            const formData = reactive({})
            const deletedialog = ref(false);
            const dialogVisible = ref(false);
            let formRef = ref();
            const formDataRules = {
                name: [{required: true, message: '字典类型名称不能为空'}],
                dictCode: [{required: true, message: '字典类型编码不能为空'}],
            }

            // 打开弹框
            function getOptionData() {
                dialogVisible.value = true;
                formData.dictId = null;
                formData.name = "";
                formData.dictCode = "";

            }


            // 保存数据
            function saveData() {
                formRef.value.validate((valid) => {
                    if (valid) {
                        if (formData.dictId) {
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
                    formData.dictId = null;
                } else {
                    formData.dictId = scope.dictId;
                }
            }

            function handleClose() {
                deleteByIds(formData.dictId ? [formData.dictId] : deleteIds.value).then(res => {
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

            let deleteIds = ref([]); // 多选按钮
            function selection(val) {
                deleteIds.value = val.map(ele => {
                    return ele.dictId
                })
            }

            function edit(scope) {
                dialogVisible.value = true;
                formData.dictId = scope.dictId;
                formData.name = scope.name;
                formData.dictCode = scope.dictCode;
            }


            function singleEvent(scope) {
                dictId.value = scope.dictId
            }

            function getTableData() {
                let params = {}
                if (query) {
                    params[query.selectValue] = query.inputValue
                }
                queryByCondition(params).then(res => {
                    tableOption.getTableData.total = res.data.total
                    tableOption.getTableData.data = res.data.data
                    tableOption.getTableData.data = res.data.data
                    if (res.data.data.length > 0) {
                        tableOption.selection.singleData = res.data.data[0]
                        dictId.value = res.data.data[0].dictId
                    } else {
                        dictId.value = null;
                    }
                })
            }

            return {
                formRef,
                formDataRules,
                dialogVisible,
                deletedialog,
                formData,
                query,
                deleteIds,
                dictId,
                saveData,
                handleClose,
                deleteFn,
                getOptionData,
                singleEvent,
                edit,
                getTableData,
                tableOption,
                selection,

            }
        },
    }
</script>
