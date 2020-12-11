<template>
  <div class="fun-create-code">
    <!-- <div class="fun-create-code-body">
      <div class="fun-create-code-form-tips">
            <div class="fun-create-code-form-tips-title">基础表单类</div>
            <div class="fun-create-code-form-tips-body">
              <draggable
                v-if="formitemlist"
                :list="formitemlist"
                class="board-column-content"
                :options="{group:{name: 'group',pull:'clone'}, sort: false}"
              >
                <div v-for="(element) in formitemlist" :key="element.id" class="fun-create-code-form-tips-item">
                  {{ element.label }}
                </div>
              </draggable>
            </div>
          </div>
          <div class="fun-create-code-form-mb">
            <div class="fun-create-code-form-mb-body">
                <div contenteditable>
                  请输入表单标题
                </div>
                <draggable
                  v-if="formmblist"
                  :list="formmblist"
                  animation='200'
                  draggable="el-form"
                  :options="{group:{name: 'group'}}"
                  class="board-column-content el-form"
                >
                  <div v-for="(element,index) in formmblist" :key="element.id" class="fun-create-code-form-tips-item">
                   <div :class="selIndex == index?'el-active':''" class="draw-item-box" @click="setElVal(index,element.id)">
                     <div  class="draw-item-form-el">
                       <div class="draw-item-body">
                         <div class="draw-el-title">{{element.label}}</div>
                        <div v-if="element.component == 'text'">
                          <span class="draw-el-input">{{element.label}}</span>
                        </div>
                       </div>

                     </div>
                  </div>
                  </div>
                </draggable>
            </div>
          </div>
          <div class="fun-create-code-form-btn">
            <div class="fun-create-code-form-btn-item"><el-button type="primary" size="medium">保存</el-button></div>
          </div>
    </div> -->
    <designer :data="data" @activeChange="activeChange">
      <!-- 可根据实际场景设计属性配置项 -->
      <template v-slot="d">
        <parameter v-if="d.config" :data="d.config">
          <div v-if="d.config.type === 'table'">
            <el-divider content-position="left">表格</el-divider>
            <el-form-item label="选择列">
              <el-select v-model="index" clearable placeholder="请选择" @change="change(d.config.column)">
                <el-option
                  v-for="(item, index) in d.config.column"
                  :key="index"
                  :label="item.label"
                  :value="index"
                />
              </el-select>
            </el-form-item>
            <div class="table_item_param">
              <el-form-item label="固定">
                <el-select v-model="column.field" placeholder="请选择">
                  <el-option label="Left" value="left" />
                  <el-option label="Right" value="right" />
                </el-select>
              </el-form-item>
              <el-form-item label="列名">
                <el-input v-model="column.label" />
              </el-form-item>
              <el-form-item label="宽度">
                <el-input v-model="column.width" />
              </el-form-item>
              <el-form-item label="字段名">
                <el-input v-model="column.prop" style="width: 110px" />
                <el-button v-if="index !== ''" type="info" size="mini" @click="del(d.config.column)">删除</el-button>
              </el-form-item>
            </div>
            <el-form-item v-if="index === ''" style="float: right">
              <el-button type="primary" size="mini" @click="add(d.config.column)">添加</el-button>
            </el-form-item>
          </div>
        </parameter>
      </template>
    </designer>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { postConfig } from '@/api/funcode'
import designer from '@/components/designer'
import demo from '@/examples/demo1'
import parameter from '@/components/parameter'
export default {
  name: 'CreateArticle',
  components: {
    parameter,
    designer
  },
  data() {
    return {
      headers: { Authorization: 'Bearer ' + getToken() },
      group: 'group',
      selIndex: '',
      formitemlist: [],
      formmblist: [],
      data: demo,
      index: '',
      column: {}
    }
  },
  created() {
    this.formConfig()
  },
  methods: {
    activeChange() {
      this.index = ''
      this.column = {}
    },
    change(val) {
      if (this.index === '') {
        this.column = {}
      } else {
        this.column = val[this.index]
      }
    },
    del(val) {
      if (this.index !== '') {
        val.splice(this.index, 1)
        this.index = ''
      }
    },
    add(val) {
      console.log(this.column, val[val.length - 1])
      const data = {
        fixed: this.column.field || '',
        label: this.column.label || '',
        width: this.column.width || '',
        prop: this.column.prop || ''
      }
      val.splice(val.length, 0, data)
      this.column = {}
    },
    setElVal(index, id) {
      this.selIndex = index
    },
    // 查找表单配置列表
    formConfig() {
      if (this.entryTipValue !== '') {
        const loading = this.$loading()
        postConfig().then((res) => {
          this.formitemlist = res.data.form
          loading.close()
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.fun-create-code {
  width: 1000px;
  margin: auto;
  height: auto;
  padding: 20px;

}
</style>
