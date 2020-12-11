<template>
  <el-container class="dr-param_item">
    <el-form size="mini" :model="data" label-width="80px" inline style="width: 100%; padding: 0 10px">
      <!-- === start 通用配置项 === -->
      <div>
        <el-divider content-position="left">通用</el-divider>
        <el-form-item label="类型">
          <el-input v-model="data.type" disabled />
        </el-form-item>
        <el-form-item label="ID">
          <el-input v-model="data.key" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="data.name" />
        </el-form-item>
        <el-form-item v-if="Object.keys(data).indexOf('value') >= 0" label="数据键">
          <el-input v-model="data.value" />
        </el-form-item>
        <el-form-item v-if="Object.keys(data).indexOf('size') >= 0" label="尺寸">
          <el-select v-model="data.size" placeholder="请选择尺寸">
            <el-option label="默认" value="" />
            <el-option label="中等" value="medium" />
            <el-option label="小" value="small" />
            <el-option label="迷你" value="mini" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="Object.keys(data).indexOf('placeholder') >= 0" label="提示">
          <el-input v-model="data.placeholder" />
        </el-form-item>
        <el-form-item v-if="Object.keys(data).indexOf('width') >= 0" label="宽度">
          <el-input v-model="data.width" />
        </el-form-item>
        <el-form-item v-if="Object.keys(data).indexOf('labelWidth') >= 0" label="标签宽度">
          <el-input v-model="data.labelWidth" />
        </el-form-item>
        <el-form-item v-if="Object.keys(data).indexOf('disabled') >= 0" label="禁用">
          <el-switch v-model="data.disabled" />
        </el-form-item>
      </div>
      <!-- === end 通用配置项 === -->

      <!-- === start 布局配置项 === -->
      <div v-if="data.type === 'layout'">
        <el-divider content-position="left">布局</el-divider>
        <el-form-item label="间隔">
          <el-input v-model.number="data.gutter" type="number" class="dr-param_item_gutter" />
          <el-button type="primary" @click="data.drag.splice(data.drag.length -1, 0, {span: 8, list:[]})">添加列</el-button>
        </el-form-item>
        <el-form-item v-for="(item,index) in data.drag" :key="index" :label="'列'+(index+1)">
          <el-input v-model.number="item.span" type="number" class="dr-param_item_col" />
          <el-button @click="data.drag.splice(index, 1)">删除</el-button>
        </el-form-item>
      </div>
      <!-- === end 布局配置项 === -->

      <!-- === start 选项配置项 === -->
      <div v-if="Object.keys(data).indexOf('option') >= 0">
        <el-divider content-position="left">选项</el-divider>
        <el-form-item v-for="(item, index) in data.option" :key="index" style="border: 1px solid #bcbbbb" :label="'选项'+(index+1)">
          <el-input v-model="item.label" class="dr-param_option-key" />
          <el-input v-model="item.value" class="dr-param_option-value" />
          <el-form-item style="padding-left: 8px">
            <el-button @click="data.option.splice(index, 1)">删除</el-button>
            <span style="color: #606266;padding: 0 8px 0 20px">禁用</span>
            <el-switch v-model="item.disabled" />
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="data.option.splice(data.option.length+1, 0, {label: '选项' + (data.option.length+1), value: `${data.option.length+1}`})"
          >添加元素</el-button>
        </el-form-item>
      </div>
      <!-- === end 选项配置项 === -->

      <!-- === 其他配置 === -->
      <slot />
    </el-form>
  </el-container>
</template>

<script>
export default {
  name: 'Parameter',
  props: {
    data: {
      validator() {
        return true
      }
    }
  }
}
</script>
