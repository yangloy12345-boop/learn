<template>
  <el-form ref="ruleformRef" :model="formData">
    <el-row :gutter="24">
    <template v-for="item in computedFormItem" :key="item.prop">
      <el-col v-bind="item.col">
        <el-form-item :label="item.label" :prop="item.prop">
         <component v-model="formData[item.prop]" :is="isComp(item.comp)">
           <template v-if="item.comp === 'select'">
            <el-option
            v-for="opt in item.options"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </template>
        </component>
       </el-form-item> 
      </el-col>
    </template>
    </el-row>
    <el-button type="primary" @click="handleSearch">搜索</el-button>
    <el-button type="primary" @click="handleReset(ruleformRef)" >重置</el-button>
  </el-form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  formItem: {
    type: Array,
    default: () => []
  }
})

const computedFormItem = computed(()=>{
  const {formItem} = props 
  formItem.forEach(item => {
    item.col={ xs: 24, sm: 12 ,md: 8,lg: 6}
  });
  return formItem
})

const emit = defineEmits(['search', 'reset'])
const ruleformRef = ref()
const formData = reactive({})

const isComp = (comp) => {
  return {
    input: 'el-input',
    select: 'el-select'
  }[comp]
}
// const isComp = (item) => {
//   if (item.comp === 'input') {
//     return 'elInput'
//   } else if (item.comp === 'select') {
//     return 'elSelect'
//   }
// }

const handleSearch = () => {
  emit('search', formData)
}

const handleReset = (formEl) => {
  //先重置
  if(!formEl) return
  formEl.resetFields()
 // 后查询
  emit('reset', formData)
}
</script>

<style lang="scss" scoped>
.table-search {
  margin-bottom: 20px;
}
</style>