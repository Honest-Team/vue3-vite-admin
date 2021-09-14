// 登录表单校验

import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import {queryByCondition, save, update, deleteByIds} from '@/api/sysRoleService'

let formRef = ref();



const formDataRules = {
    name: [{required: true, message: '用户名不能为空'}],
}

// 查询框
const query = reactive({
    selectValue: "name",
    inputValue: "",
    option: [{
        label: '角色名称',
        value: 'name'
    }]
})
// 表格配置属性
const tableOption = reactive({
    indexNo: false,
    // 表头数据
    columns: [
        {
            label: '角色名称',
            prop: 'name',
            sort: true,
        },
        {
            label: '角色描述',
            prop: 'description',
            sort: true,
        },
        {
            label: '数据权限',
            prop: 'dataScope',
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
            type: 'primary',
            eventName: 'editFn',
            disabled: function (item) {
            },
        },
        {
            label: '删除', //复制
            icon: '',
            type: '',
            eventName: 'deleteFn',
            disabled: function (item) {
                return item.date === '2016-05-03'
            },
        },

    ],
    // 多选功能
    selection: {
        eventName: 'selection',
        data: []
    }

})

const formData = reactive({})

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

let deleteIds = ref([]); // 多选按钮
function handleClose() {
    deleteByIds(formData.id ? [formData.id] : deleteIds.value).then(res => {
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

function getTableData(query) {
    let params = {}
    if (query) {
        params[query.selectValue] = query.inputValue
    }
    queryByCondition(params).then(res => {
        tableOption.getTableData.total = res.data.total
        tableOption.getTableData.data = res.data.data
        tableOption.getTableData.data = res.data.data
    })
}
// 添加框
const dialogVisible = ref(false);
const deletedialog = ref(false);
getTableData(tableOption.getTableData.page)
function deleteFn(scope) {
    deletedialog.value = true;
    if (Array.isArray(scope)) {
        formData.id = null;
    } else {
        formData.id = scope.id;
    }
}
// 打开弹框
function getOptionData() {
    dialogVisible.value = true;
    formData.id = null;
    formData.name = "";
    formData.description = "";
    formData.dataScope = "";
}


function selection(val) {
    deleteIds.value = val.map(ele => {
        return ele.id
    })
}


export default {
    formRef,
    deleteIds,
    formData,
    saveData,
    getTableData,
    handleClose,
    deleteFn,
    formDataRules,
    getOptionData,
    tableOption,
    query,
    dialogVisible,
    deletedialog,
    selection,

}