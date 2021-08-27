<template>
    <div style=";padding: 0 20px 20px;background: white">
        <el-table
                ref="dataTable"
                highlight-current-row
                :data="getTableData.data"
                :height="height"
                :border="border"
                :tree-props="treeProps"
                :row-key="rowKey"
                :expand-row-keys="expands"
                style="width: 100%"
                :default-expand-all="expandAll"
                @selection-change="handleSelectionChange"
                @row-click="rowClick"
                :header-cell-style="{background:'#f5f7fa',color:'#002640'}"
        >
            <!--多选-->
            <el-table-column
                    v-if="selection && selection.eventName"
                    type="selection"
                    width="46">
            </el-table-column>
            <!--表格是否排序-->
            <el-table-column
                    type="index"
                    :label="indexLabel"
                    v-if="indexNo"
            ></el-table-column>


            <template v-for="col in columns">


                <!--状态 1 开启 0 停用-->
                <el-table-column
                        v-if="col.type === 'enabled'"
                        :sortable="col.sort"
                        :align="col.align ? col.align : 'center'"
                        :prop="col.prop"
                        :label="col.label"
                        :width="col.width"
                >
                    <template #default="scope">
                        <el-tag v-if="scope.row[col.prop] === 1" type="success">开启</el-tag>
                        <el-tag v-if="scope.row[col.prop] === 0" type="danger">停用</el-tag>
                    </template>
                </el-table-column>

                <!--菜单 2 按钮  1 菜单 0 目录 -->
                <el-table-column
                        v-else-if="col.type === 'menuType'"
                        :sortable="col.sort"
                        :align="col.align ? col.align : 'center'"
                        :prop="col.prop"
                        :label="col.label"
                        :width="col.width"
                >
                    <template #default="scope">
                        <el-tag v-if="scope.row[col.prop] === 0" type="success">目录</el-tag>
                        <el-tag v-if="scope.row[col.prop] === 1" type="danger">菜单</el-tag>
                        <el-tag v-if="scope.row[col.prop] === 2" type="warning">按钮</el-tag>
                    </template>
                </el-table-column>


                <!-- 格式化各种日期 - 名称自定义 type设置为formatTime 时生效-->
                <el-table-column
                        v-else-if="col.type === 'formatTime' ||col.prop ===  'createTime' ||col.prop ===  'updateTime'"
                        :sortable="col.sort"
                        :align="col.align ? col.align : 'center'"
                        :prop="col.prop"
                        :label="col.label"
                        show-overflow-tooltip
                        min-width="170"
                        :width="col.width"
                ></el-table-column>
                <el-table-column
                        v-else
                        :width="col.width"
                        :fixed="col.fixed"
                        :sortable="col.sort"
                        show-overflow-tooltip
                        :align="col.align ? col.align : 'center'"
                        :prop="col.prop"
                        :label="col.label"
                ></el-table-column>
            </template>
            <!--表格按钮操作-->
            <el-table-column label="操作" v-if="buttonGroup.length > 0" :width="tableConfig.buttonWidth" fixed="right"
                             align="center">
                <template #default="scope">
                    <el-button-group>
                        <!-- 控制显示隐藏 -->
                        <template v-for="(item, index) in buttonGroup">
                            <el-button
                                    :key="index"
                                    :icon="item.icon"
                                    :type="item.type"
                                    v-if="!item.hasOwnProperty('dropdownMenu')"
                                    size="mini"
                                    :disabled="item.disabled && item.disabled(scope.row)"
                                    @click="buttonHandler(item.eventName, scope.row)"
                            >
                                {{ item.label }}
                            </el-button>
                            <!--更多按钮 handleCommand()-->
                            <el-dropdown @command="handleCommand" v-if="item.hasOwnProperty('dropdownMenu')">
                                <el-button :type="item.type" :size="item.size ? item.size : 'mini'">
                                    {{ item.label }}
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item
                                                :command="{eventName: dropItem.eventName,scope: scope.row,}"
                                                v-for="(dropItem, index) in item.dropdownMenu"
                                                :disabled="dropItem.disabled && dropItem.disabled(scope.row) "
                                                :key="index"
                                        >
                                            {{ dropItem.label }}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </template>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <!--分页 hide-on-single-page-->
        <el-pagination
                v-if="getTableData.page"
                style="display: flex; justify-content: center;height: 50px;align-items: center;"
                small
                current-page="currentPage"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="getTableData.page.current"
                :page-sizes="[10, 20, 50, 100, 300]"
                :page-size="getTableData.page.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="getTableData.total"
        ></el-pagination>
    </div>
</template>

<script>
    import {ref, toRaw, reactive, onMounted, watch} from 'vue'

    export default {
        name: 'index',
        props: {
            indexLabel: {type: String, default: '序号'}, // 是否展示序号的label
            height: {type: String},
            columns: {type: Array}, //列
            buttonGroup: {type: Array, default: []}, // 操作按钮
            settingsFixed: {type: Boolean, default: false}, //操作按钮是否固定
            getTableData: {},
            buttonConfig: Object,
            default: {
                align: 'center',
                fixed: false,
            },
            selection: {
                eventName: '',           // 多选功能事件
                singleEventName: '',     // 单选点击功能事件

                singleData: '',          // 默认单选选中的功能
                data: []                 // 默认多选的数据
            },
            indexNo: {type: Boolean, default: false}, // 是否展示序号
            border: {type: Boolean, default: false}, // 是否带有纵向边框
            rowKey: {type: String, default: "id"},
            treeProps: {
                type: Object, default: {
                    hasChildren: 'hasChildren',
                    children: 'children'
                }
            },
            expandAll: {type: Boolean, default: false},
            expands: {type: Array},
        },
        setup(props, {emit}) {
            const currentPage = ref(1)
            const dataTable = ref(null)
            const tableConfig = reactive({
                buttonWidth: 210
            })
            onMounted(() => {
                // 操作列的宽度
                if (props.buttonGroup.length === 1) {
                    tableConfig.buttonWidth = 95;
                } else if (props.buttonGroup.length === 2) {
                    tableConfig.buttonWidth = 174;
                } else {

                }
            })
            // 默认多选选中
            if (props.selection) {
                watch(() => props.selection.singleData, (newValue, oldValue) => {
                    const selectionData = toRaw(newValue);
                    dataTable.value.setCurrentRow(selectionData);
                })
                watch(() => props.selection.data, (newValue, oldValue) => {
                    const selectionData = toRaw(newValue);
                    if (selectionData.length > 0) {
                        selectionData.forEach(ele => {
                            dataTable.value.toggleRowSelection(ele);
                        })
                    }
                })
            }

            // 操作按钮
            function buttonHandler(eventName, scope) {
                emit(eventName, {...scope})
            }

            function handleCommand(drop) {
                emit(drop.eventName, {...drop.scope})
            }

            function handleSizeChange(val) {
                console.log(`每页 ${val} 条`)
                props.getTableData.page.size = val
                emit(props.getTableData.eventName, props.getTableData.page)
            }

            function handleCurrentChange(val) {
                console.log(`当前页: ${val}`)
                props.getTableData.page.current = val
                emit(props.getTableData.eventName, props.getTableData.page)
            }

            function rowClick(row, column, event) {
                if (props.selection && props.selection.singleEventName) {
                    emit(props.selection.singleEventName, {...row})
                }
            }

            // 多选
            function handleSelectionChange(val) {
                emit(props.selection.eventName, [...val])
            }

            return {
                dataTable,
                tableConfig,
                currentPage,
                buttonHandler,
                handleCommand,
                handleSizeChange,
                handleCurrentChange,
                handleSelectionChange,
                rowClick,
            }
        },
    }
</script>

<style scoped>
    /*:deep(.el-table thead tr) {*/
    /*    background: #f5f7fa;*/
    /*}*/

    /*/deep/  .el-table thead tr {*/
    /*    background: #f5f7fa;*/
    /*}*/
</style>
