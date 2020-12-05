<template>
  <div class="fun-code">
    <el-row :gutter="20">
      <el-col :span="18"><div class="fun-title">功能码</div></el-col>
      <el-col
        :span="6"
      ><div class="fun-search">
        <el-input
          v-model="searchInput"
          type="search"
          placeholder="请输入"
        ><i slot="prefix" class="el-input__icon el-icon-search" /></el-input></div></el-col>
    </el-row>
    <div class="fun-table">
      <el-button
        :loading="downloadLoading"
        style="margin-bottom: 20px"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
      >
        下载二维码
      </el-button>
      <el-button
        :loading="downloadLoading"
        style="margin-bottom: 20px"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
      >
        导出
      </el-button>
      <el-button
        :loading="downloadLoading"
        style="margin-bottom: 20px"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
      >
        删除
      </el-button>
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column label="二维码名称">
          <template slot-scope="scope">
            <img
              class="code-img"
              :src="scope.row.codeimg"
              width="30"
              alt=""
              srcset=""
            >
            <span class="code-name">{{ scope.row.codename }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分类" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.code_type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.create_time }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="220">
          <span
            class="el-link-btn"
          ><el-link type="primary">预览</el-link></span>
          <span
            class="el-link-btn"
          ><el-link type="primary">编辑</el-link></span>
          <span
            class="el-link-btn"
          ><el-link type="primary">删除</el-link></span>
        </el-table-column>
      </el-table>
      <div class="fun-pagination">
        <el-pagination background layout="prev, pager, next" :total="1000" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FunCode',
  data() {
    return {
      list: null,
      listLoading: true,
      multipleSelection: [],
      downloadLoading: false,
      filename: '',
      searchInput: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.list = [
        {
          id: 1,
          codeimg:
            'https://voice.xunsheng.org.cn/sydt_mini/0dba4ee49138234a7c3265c74b2c490f.png',
          codename: '某某二维码',
          code_type: '分类',
          create_time: '2006-11-22 02:57:31'
        },
        {
          id: 1,
          codeimg:
            'https://voice.xunsheng.org.cn/sydt_mini/0dba4ee49138234a7c3265c74b2c490f.png',
          codename: '某某二维码',
          code_type: '分类',
          create_time: '2006-11-22 02:57:31'
        },
        {
          id: 1,
          codeimg:
            'https://voice.xunsheng.org.cn/sydt_mini/0dba4ee49138234a7c3265c74b2c490f.png',
          codename: '某某二维码',
          code_type: '分类',
          create_time: '2006-11-22 02:57:31'
        },
        {
          id: 1,
          codeimg:
            'https://voice.xunsheng.org.cn/sydt_mini/0dba4ee49138234a7c3265c74b2c490f.png',
          codename: '某某二维码',
          code_type: '分类',
          create_time: '2006-11-22 02:57:31'
        },
        {
          id: 1,
          codeimg:
            'https://voice.xunsheng.org.cn/sydt_mini/0dba4ee49138234a7c3265c74b2c490f.png',
          codename: '某某二维码',
          code_type: '分类',
          create_time: '2006-11-22 02:57:31'
        },
        {
          id: 1,
          codeimg:
            'https://voice.xunsheng.org.cn/sydt_mini/0dba4ee49138234a7c3265c74b2c490f.png',
          codename: '某某二维码',
          code_type: '分类',
          create_time: '2006-11-22 02:57:31'
        }
      ]
      this.listLoading = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDownload() {
      if (this.multipleSelection.length) {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then((excel) => {
          const tHeader = ['二维码', '二维码名称', '分类', '创建时间']
          const filterVal = [
            'codeimg',
            'codename',
            'code_type',
            'create_time'
          ]
          const list = this.multipleSelection
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename
          })
          this.$refs.multipleTable.clearSelection()
          this.downloadLoading = false
        })
      } else {
        this.$message({
          message: '请选择导出的数据',
          type: 'warning'
        })
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    }
  }
}
</script>

<style lang="scss" scoped>
.fun-code {
  background: white;
  padding: 20px;
  box-sizing: border-box;
  .fun-title {
    font-size: 16px;
    font-weight: 600;
  }
  .code-img {
    float: left;
  }
  .code-name {
    float: left;
    line-height: 30px;
    margin-left: 5px;
  }
  .el-link-btn {
    margin: 0 5px;
  }
  .fun-pagination{
    margin-top: 20px;
    text-align: right;
  }
}
</style>
