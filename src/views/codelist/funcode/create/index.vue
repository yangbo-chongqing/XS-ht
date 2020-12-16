<template>
  <div class="fun-create-code">
    <designer  @activeChange="activeChange">
      <!-- 可根据实际场景设计属性配置项 -->
      <template v-slot="d">
        <parameter v-if="d.config" :data="d.config">
        </parameter>
      </template>
    </designer>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { postConfig } from '@/api/funcode'
import designer from '@/components/designer'
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
