<template>
  <div class="fun-code">
    <div class="fun-code-head">
      <el-row>
        <el-col :span="14"><div class="entry-title">功能码</div></el-col>
        <el-col :span="10">
          <el-row :gutter="20">
            <el-col :span="18">
              <div class="entry-search">
                <el-input
                  v-model="keyword"
                  type="search"
                  clearable
                  placeholder="搜索表单名称或编号"
                ><i slot="prefix" class="el-input__icon el-icon-search" />
                  <el-button slot="append" @click="onSearch">搜索</el-button>
                </el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="entry-search">
                <el-button
                  type="primary"
                  @click="golinkpage('/codelist/funcreate')"
                >新增功能码</el-button>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="fun-table">
      <div class="fun-table-body">
        <el-row :gutter="20">
          <el-col :span="14">
            <div class="fun-table-info">
              <div class="fun-table-info-title">设备巡检</div>
              <div class="fun-table-info-id">表单编号：D1</div>
              <div class="fun-table-info-tips">
                包含字段：<span>检查结果</span>、<span>巡检情况记录</span>、<span>现场照片</span>、<span>姓名</span>、<span>手机</span>、<span>定位</span>、<span>签名</span>
              </div>
            </div>
          </el-col>
          <el-col :span="5">
            <el-row>
              <el-col :span="8">
                <div class="fun-table-info-num-title">填写数</div>
                <p class="fun-table-info-num-number">0</p>
              </el-col>
              <el-col :span="8">
                <div class="fun-table-info-num-title">关联二维码</div>
                <p class="fun-table-info-num-number">0</p>
              </el-col>
              <el-col :span="8">
                <div class="fun-table-info-num-title">填表人数</div>
                <p class="fun-table-info-num-number">0</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="5">
            <div class="fun-table-info-cz-tips">
              <span><el-link type="primary">详情</el-link></span>
              <span><el-link type="primary">编辑</el-link></span>
              <span><el-link type="primary">设置</el-link></span>
              <span><el-link type="primary">数据导出</el-link></span>
              <span><el-link type="primary">更多></el-link></span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="fun-table-body">
        <el-row :gutter="20">
          <el-col :span="14">
            <div class="fun-table-info">
              <div class="fun-table-info-title">设备巡检</div>
              <div class="fun-table-info-id">表单编号：D1</div>
              <div class="fun-table-info-tips">
                包含字段：<span>检查结果</span>、<span>巡检情况记录</span>、<span>现场照片</span>、<span>姓名</span>、<span>手机</span>、<span>定位</span>、<span>签名</span>
              </div>
            </div>
          </el-col>
          <el-col :span="5">
            <el-row>
              <el-col :span="8">
                <div class="fun-table-info-num-title">填写数</div>
                <p class="fun-table-info-num-number">0</p>
              </el-col>
              <el-col :span="8">
                <div class="fun-table-info-num-title">关联二维码</div>
                <p class="fun-table-info-num-number">0</p>
              </el-col>
              <el-col :span="8">
                <div class="fun-table-info-num-title">填表人数</div>
                <p class="fun-table-info-num-number">0</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="5">
            <div class="fun-table-info-cz-tips">
              <span><el-link type="primary">详情</el-link></span>
              <span><el-link type="primary">编辑</el-link></span>
              <span><el-link type="primary">设置</el-link></span>
              <span><el-link type="primary">数据导出</el-link></span>
              <span><el-link type="primary">更多></el-link></span>
            </div>
          </el-col>
        </el-row>
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
      keyword: '',
      page: 1,
      page_size: 10
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    onSearch() {
      this.page = 1
      this.fetchData()
    },
    golinkpage(page, obj) {
      this.$router.push({
        path: page,
        query: {
          ...obj
        }
      })
    },
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
          const filterVal = ['codeimg', 'codename', 'code_type', 'create_time']
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
  .fun-code-head{
    border-bottom: 1px solid #f5f5f5;
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .fun-table{
    margin-top: 15px;
    .fun-table-body{
      width: 100%;
      height: 100px;
      padding: 10px 20px;
      box-sizing: border-box;
      border-bottom: 1px solid #f5f5f5;
      .fun-table-info-num-title{
        font-size: 13px;
        color: #999;
        margin: 10px 0;
      }
      .fun-table-info-cz-tips{
        padding-top: 20px;
        box-sizing: border-box;
        text-align: right;
        span{
          margin:0 10px;
        }
      }
      .fun-table-info-num-number{
        font-size: 13px;
        color: #409EFF;
      }
      &:hover{
        background: #d7ebff;
      }
      .fun-table-info-title{
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 10px;
      }
      .fun-table-info-id{
        font-size: 13px;
        color: #999;
        margin-bottom: 10px;
      }
      .fun-table-info-tips{
        font-size: 13px;
        color: #999;
      }

    }
  }
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
  .fun-pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
