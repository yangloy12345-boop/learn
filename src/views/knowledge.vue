<template>
  <div>
    <Pagehead title="知识文章">
      <template #buttons>
        <el-button type="primary" @click="handleEdit({})">新增</el-button>
      </template>
    </Pagehead>
    <TableSearch :formItem="formItem" @search="handleSearch" />
    <el-table :data="tableData" style="width: 100%; margin-top :25px">
      <el-table-column label="文章标题" fixed="left">
          <template #default="scope">
            <div style="display: flex;align-items: center;">
              <el-icon><Clock /></el-icon>
              <span>{{scope.row.title}}</span>
            </div>
          </template>
      </el-table-column>
      <el-table-column label="分类" width="200">
          <template #default="scope">
            <div style="display: flex;align-items: center;">
              <el-icon><Clock /></el-icon>
              <span>{{categoryMap[scope.row.categoryId]}}</span>
            </div>
          </template>
      </el-table-column>
      <el-table-column prop='authorName' label="作者" width="150"/>
      <el-table-column prop='readCount' label="阅读量" width="150"/>
      <el-table-column prop='updatedAt' label="发布时间" width="150"/>
      <el-table-column label="操作" width="240" fixed="right">
          <template #default="scope">
            <el-button text type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button @click="handlePublish(scope.row)" v-if="scope.row.status === 0||scope.row.status === 2" type="success" text>发布</el-button>
            <el-button @click="handleUnpublish(scope.row)" v-if="scope.row.status === 1" type="warning" text>下线</el-button>
            <el-button @click="handleDelete(scope.row)" v-if="scope.row.status === 0||scope.row.status === 2" type="danger" text>删除</el-button>
          </template>
      </el-table-column>
    </el-table>
    <el-pagination
     style="margin-top: 25px;"
      :page-size="pagination.size"
      layout="prev, pager, next"
      :total="pagination.total"
      @change="handlePageChange"
    />
    <ArticleDialog v-model:modelValue="DialogVisible" :categories="categories" :article="currentArticle" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import Pagehead from '@/components/Pagehead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { Clock } from '@element-plus/icons-vue'
import { categoryTree } from '@/api/admin'
import { airticlePage } from '@/api/admin'
import ArticleDialog from '@/components/ArticleDialog.vue'
import { getarticleDetail } from '@/api/admin'
import { ElMessageBox ,ElMessage } from 'element-plus'
import { changeArticleStatus } from '@/api/admin'
import { deleteArticle } from '@/api/admin'



const formItem = [
  {
    label: '标题',
    prop: 'title',
    comp: 'input',
    placeholder: '请输入标题'
  },
  {
    label: '分类',
    prop: 'category',
    comp: 'select',
    
  },
  {
    comp:'select',
    prop:'status',
    label:'状态',
    options:[
      {
        label:'下线',
        value:'2'
      },
      {
        label:'已发布',
        value:'1'
      },
      {
        label:'草稿',
        value:'0'
      }
    ]
  }
]
// 分类映射
const categoryMap = reactive({
})
const categories = ref([])

const tableData = ref([])

onMounted(async ()=>{
  const data = await categoryTree()
   categories.value=data.map(item =>{
      categoryMap[item.id] = item.categoryName
      return{
        label: item.categoryName,
        value: item.id
      }
    }
  )
  formItem[1].options = categories.value

  //获取列表
  handleSearch()
})
//分页参数
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0
})
const handleSearch =async (formData)=>{
  const params = {
    ...pagination,
    ...formData
  }
  const data = await airticlePage(params)
  console.log(data)
  tableData.value = data.records
  pagination.total = data.total
}

const handlePageChange = (page) => {
  pagination.currentPage = page
  handleSearch()
}
// 文章详情弹窗
const DialogVisible = ref(false)
const handleSuccess = () => {
  DialogVisible.value = false // 1. 确保关闭弹窗
  handleSearch()               // 2. 重新获取列表数据
  console.log('数据提交成功，已刷新列表')
}
// 编辑文章
const currentArticle = ref(null) 
const handleEdit = (row) => {
  if(!row.id) {
    currentArticle.value = null
    DialogVisible.value = true
  }else{
    //获取文章详情
  getarticleDetail(row.id).then(res =>{
    currentArticle.value = res
    DialogVisible.value = true
  })
  }
}
//发布文章
const handlePublish = (row) => {
  ElMessageBox.confirm(`确认发布文章${row.title}吗？`, '提示',{
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
      changeArticleStatus(row.id,{status:1}).then(res =>{
        ElMessage.success('发布成功')
        handleSearch()
      })
    })
}
//下线文章
const handleUnpublish = (row) => {
  ElMessageBox.confirm(`确认下线文章${row.title}吗？`, '提示',{
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
      changeArticleStatus(row.id,{status:2}).then(res =>{
          ElMessage.success('下线成功')
          handleSearch()
      })
    })
}
// 删除文章
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除文章${row.title}吗？`, '提示',{
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger'
  }).then(() => {
     deleteArticle(row.id).then(res =>{
          ElMessage.success('删除成功')
          handleSearch()
      })
    })
}


</script> 