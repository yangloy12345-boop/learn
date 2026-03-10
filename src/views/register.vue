<template>
  <div class="container">
    <div class="title">
      <div class="title-text">
        <h2>创建您的账户</h2>
        <p>填写你的信息</p>
      </div>
    </div>
    <div class="form-container">
      <el-form label-position="top" :model="formData" :rules="rules" ref="submitFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" ></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname" ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="formData.confirmPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn" size="large" type="primary" @click="submitForm(submitFormRef)">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { formItemValidateStates } from 'element-plus';
import { reactive,ref } from 'vue';
import { register } from '@/api/frontend'
import { ElMessage } from 'element-plus';
import {useRouter} from 'vue-router';
import { dataTool } from 'echarts';


const formData = reactive({
  
    "username": "",
    "email": "",
    "nickname": "",
    "phone": "",
    "password": "",
    "confirmPassword": "",
    "gender": 0,
    "userType": 1
})
const rules = reactive({
    "username": [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    "email": [
        { required: true, message: '请输入邮箱', trigger: 'blur' }
    ],
    "password": [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    "confirmPassword": [
        { required: true, message: '请输入确认密码', trigger: 'blur' }
    ],
})
const router= useRouter()
const submitFormRef = ref(null)
const submitForm = async (formRef) => {
  if(!formRef) return
  formRef.validate(async (valid) => {
   register(formData).then(({data})=>{
    console.log(data)
    if(!data){
      ElMessage.success('注册成功')
      router.push('/auth/login')
    }
    if(data.code==='BUSSINESS_ERROR'){
      ElMessage.error(data.message)
    }
      
   })
  })
}

</script>


<style lang='scss' scoped>
.container {
    width: 384px;
    .flex-box {
        display: flex;
        align-items: center;
    }
    .title {
        .title-text {
            text-align: center;
            h2 {
                font-size: 36px;
                margin-bottom: 10px;
            }
            p {
                font-size: 18px;
                color: #6b7280;
            }
        }
    }
    .form-container {
        margin-top: 30px;
        .btn {
            margin-top: 40px;
            width: 100%;
        }
        .footer {
            padding: 30px;
            text-align: center;
        }
    }
}
</style>