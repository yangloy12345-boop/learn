<template>
  <el-dialog
    :title="isEdit ? '编辑文章' : '新增文章'"
    v-model="dialogVisible"
    width="50%"
    @close="handleClose"
    >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入标题" maxlength="200" show-word-limit clearable></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择分类">
          <el-option v-for="item in categories" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要" maxlength="1000" show-word-limit clearable :rows="4"></el-input>
      </el-form-item>
      <el-form-item label="文章标签" prop="tags">
        <el-select v-model="formData.tagArray" placeholder="请输入文章标签，多个标签用逗号隔开" multiple filterable arrow-create width="100%">
          <el-option v-for="item in commonTags" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="封面" prop="content">
        <div class='cover-upload'>
          <el-upload
            class="avatar-uploader"
            action="#"
            :before-upload="beforeUpload"
            :http-request="handleUpload"
            :show-file-list="false"
            accept="image/*"
          >
          <div v-if="!imgUrl" class="cover-placeholder">
            <p>点击上传封面图片</p>
          </div>      
            <el-image v-else class="cover-image" :src="imgUrl" alt="封面图片" />
          </el-upload>
          <div v-if="imgUrl" class='cover-remove'>
            <el-button type="danger" size="mini" @click="removeCover">删除封面</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor 
        placeholder="请输入文章内容"
        v-model="formData.content"
        :maxCharCount ="1000"
        @change="handleCotentChange"
        @created="handleEditCreated"
        min-height="300px"
        />
      </el-form-item>
    </el-form>
    <div v-if="btnPreview">
      <h3>预览</h3>
      <div v-html="formData.content"></div>
    </div>
    <template #footer>
      <el-button  @click="btnPreview=!btnPreview">{{btnPreview?'关闭预览':'预览'}}</el-button>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit()" :loading="loading">{{isEdit?'更新文章':'新增文章'}}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref ,computed,reactive ,nextTick,watch} from 'vue'
import { defineEmits } from 'vue'
import { upLoadFile } from '@/api/admin'
import { fileBaseUrl } from '@/config/index'
import RichTextEditor from '@/components/RichTextEditor.vue'
import { createArticle } from '@/api/admin'
import { updateArticle } from '@/api/admin'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  categories: {
    type: Array,
    default: () => []
  },
  article: {
    type: Object,
    default: null
  }
})
//监听编辑数据变化
watch(() => props.article, (newVal) => {
  if (newVal) {
    nextTick(() => {
      //对象属性的合并
      Object.assign(formData, newVal)
      businessId.value = newVal.id
      imgUrl.value = fileBaseUrl + newVal.coverImage
    })
  }
})

const emit = defineEmits(['update:modelValue','success'])

const dialogVisible = computed({
  get(){
    return props.modelValue
  },
  set(val){
    emit('update:modelValue',val)
  }
})

const isEdit = computed(() => !!props.article?.id)

const formData = reactive({
  "title": "",
  "content": "",
  "coverImage": "",
  "categoryId": 1,
  "summary": "",
  "tags": "",
  "id": ""
})

const rules = reactive({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    {max:200,message:'标题不能超过200个字符',trigger:'blur'}
  ],
  categoryId: [
    { required: true, message: '请选择文章分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    {max:1000,message:'内容不能超过1000个字符',trigger:'blur'}
  ],
})
const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]
const imgUrl = ref('')
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5Mb = file.size / 1024 / 1024 < 5
  if (!isImage) {
    ElMessage.error('上传封面图片只能是 JPG 格式!')
    return false
  }
  if (!isLt5Mb) {
    ElMessage.error('上传封面图片大小不能超过 5MB!')
    return false
  }
  return true
}
const handleClose = () => {
  // 关闭弹窗时，清空数据
  formRef.value.resetFields()
  businessId.value=''
  formData.tagArray=[]
  removeCover()
  emit('update:modelValue',false)
}
const businessId = ref('')
const handleUpload = async ({file}) => {
  businessId.value = crypto.randomUUID()
  const fileres = await upLoadFile(file,{
    businessId: businessId.value,
    })
    console.log(fileres)
    // 上传成功后，将图片路径赋值给 imgUrl 拼接完整路径
    imgUrl.value = `${fileBaseUrl}${fileres.filePath}`
    formData.coverImage = fileres.filePath
}
const removeCover = () => {
  imgUrl.value = ''
  formData.coverImage = ''
}
//富文本内容变化
const handleCotentChange = (data) => {
  formData.content=data.html
}
const editorTnstance = ref(null)
const handleEditCreated = (editor) => {
  editorTnstance.value = editor
  //如果是编辑
  if(formData.content&&editor){
    nextTick(() => {
      editor.setHtml(formData.content)
    })
  }
}
const btnPreview = ref(false)
const formRef = ref()
const loading = ref(false)
const handleSubmit =  () => {
   formRef.value.validate((valid,fields)=>{
    if(valid){
      loading.value =true
    }
    const submitData = {
      ...formData,
      tags: formData.tagArray.join(',')
    }
    delete submitData.tagArray
    if(!isEdit.value){
      submitData.id = businessId.value
      createArticle(submitData).then(res =>{
      loading.value = false
      emit('success')
    })
    }
    else{
      updateArticle(props.article.id,submitData).then(res =>{
        loading.value = false
        emit('success')
      })
    }
  })
  
}
</script>

<style scoped lang="scss">

.cover-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 120px;
  flex-direction: column;
  color: #887c7c;
  background-color: #f5f5f5;
}
.cover-image {
  width: 200px;
  height: 120px;
  display: block;
}
</style>
