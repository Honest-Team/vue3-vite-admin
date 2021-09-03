<template>
    <!--按钮+查询条件-->
    <div class="query">
        <div style="display: flex">
            <el-button type="primary" size="small" icon="el-icon-plus" @click="getOptionData">添加角色</el-button>
            <el-button size="small" type="danger" icon="el-icon-delete" :disabled="deleteIds.length==0"
                       @click="deleteFn(deleteIds)">全部删除
            </el-button>
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
            <el-input class="input" size="small"
                      v-if="query.selectValue === 'name'"
                      v-model="query.inputValue"
                      placeholder="请输入"></el-input>
            <el-button type="primary" size="small" icon="el-icon-search" @click="getTableData(query)">查询</el-button>
        </div>
    </div>

    <!--表格-->
    <data-table
            v-bind="tableOption"
            @editFn="editFn"
            @deleteFn="deleteFn"
            @selection="selection"
            @getTableData="getTableData"
            @test="test"
    ></data-table>

    <!--添加/编辑角色弹框-->
    <el-dialog
            :title="formData.id ? '编辑角色' : '添加角色'"
            v-model="dialogVisible"
            width="30%"
    >
        <el-form size="small" label-width="80px" :model="formData" :rules="formDataRules" ref="formRef">

            <!--按钮-->
            <el-form-item label="角色名称" prop="name">
                <el-input v-model="formData.name" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="数据权限">
                <el-input v-model="formData.dataScope" placeholder=""></el-input>
            </el-form-item>

            <el-form-item label="角色描述">
                <el-input type="textarea" v-model="formData.description" placeholder=""></el-input>
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
    import role from './role'
    import router from '@/router'

    export default {
        components: {DataTable},
        setup: function () {
            // 编辑角色页面
            function editFn(scope) {
                router.push({
                    name: "editRole",
                    query: {
                        id: scope.id
                    }
                })
            }

            return {
                ...role,
                editFn,
            }
        },
    }
</script>
