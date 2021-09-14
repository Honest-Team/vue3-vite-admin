<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script>
import { defineComponent } from 'vue'
import { ElConfigProvider } from 'element-plus'
import lang from './lang'

export default defineComponent({
  components: {
    ElConfigProvider,
  },
  setup() {
    return {
      locale: lang.local,
    };
  },
})
</script>
