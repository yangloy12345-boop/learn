<template>
  <div class="backend-layout" >
    <el-container class="container">
      <Sidebar/>
      <el-container>
        <el-header>
          <Navbar/>
        </el-header>
        <el-main class="content">
          <router-view class="main-content"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'





</script>
<style lang="scss" scoped>
.backend-layout {
  height: 100vh;
  .el-header {
    height: 74px!important;
  }
}
.container {
  height: 100%;
}
.main-content {
  padding: 20px;
  background-color: #fff;
  min-height: calc(100vh - 74px);
}
</style>

