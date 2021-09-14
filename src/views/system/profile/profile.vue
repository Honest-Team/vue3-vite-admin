<template>

    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span>卡片名称</span>
                <el-button class="button" type="primary">保存</el-button>
            </div>
        </template>
<!--        <div v-for="o in 4" :key="o" class="text item">{{'列表内容 ' + o }}</div>-->
    </el-card>


</template>

<script>
export default {
  name: 'index',
}
</script>

<style scoped>
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

</style>
