<template>
  <el-aside :width="isCollapse ? '64px' : '264px'">
    <el-menu
      :collapse="isCollapse"
      :collapse-transition="false"
      default-active="2"
      @open="handleOpen"
      @close="handleClose"
      class="menu-style"
    >
    <div class="brand">
      <el-image style="width: 50px; height: 50px;margin-right: 10px;" :src="iconurl" alt="logo" class="brand-image" />
      <div v-show="!isCollapse">
        <h1 class="brand-title">心理健康AI助手</h1>
        <p class="brand-subtitle">管理后台</p>
      </div>
    </div>
      <el-menu-item @click="selectmenu" v-for="item in router.options.routes[0].children" :key="item.path" :index="item.path">
        <el-icon>
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import useAdminStore from '@/stores/admin.js'
import { computed } from 'vue'

const iconurl = new URL('/src/assets/机器人.png', import.meta.url).href

const isCollapse = computed(() => useAdminStore().isCollapse)

const router = useRouter()
const handleOpen = (key) => {
  console.log(key)
}
const handleClose = (key) => {
  console.log(key)
}
const selectmenu = (key) => {
  const currentRoute = router.options.routes[0]
   const newRoute = `${currentRoute.path}/${key.index}`
   router.push(newRoute)
}

</script>


<style lang="scss" scoped>
  .brand {
   display: flex;
   align-items: center;
   justify-content: center;
   padding: 10px;
   background-color: white;
   border-bottom: 1px solid #e4e7ed;
  }
  .brand-subtitle {
    font-size: 14px;
    font-weight: bold;
    color: #909399;
    
  }
  .brand-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 5px;
    color: #303133;
  }
  .menu-style {
    height: 100%;
  }
</style>