<template>
  <div class="entry-code">
    <el-row :gutter="20">
      <el-col :span="14"><div class="entry-title">词条码</div></el-col>
      <el-col :span="10">
        <el-row :gutter="20">
          <el-col :span="18">
            <div class="entry-search">
              <el-input v-model="keyword" type="search" placeholder="请输入"
                ><i slot="prefix" class="el-input__icon el-icon-search" />
                <el-button slot="append" @click="onSearch">搜索</el-button>
              </el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="entry-search">
                <el-button type="primary" @click="createCode">新增二维码</el-button>
            </div>
          </el-col>
        </el-row>
        </el-col
      >
    </el-row>
    <div class="entry-table">
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
              :src="scope.row.mini_code"
              width="30"
              alt=""
              srcset=""
            />
            <span class="code-name">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分类" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.type.type_name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.create_time }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="220">
          <span class="el-link-btn"
            ><el-link type="primary">预览</el-link></span
          >
          <span class="el-link-btn"
            ><el-link type="primary">编辑</el-link></span
          >
          <span class="el-link-btn"
            ><el-link type="primary">删除</el-link></span
          >
        </el-table-column>
      </el-table>
      <div class="entry-pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          layout="prev, pager, next"
          :total="count"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { entryCodeList } from "@/api/entrycode";
export default {
  name: "EntryCode",
  data() {
    return {
      list: null,
      listLoading: true,
      multipleSelection: [],
      downloadLoading: false,
      filename: "",
      page: 1,
      pages: 0,
      count: 0,
      page_size: 10,
      keyword: "",
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    createCode(){
      this.$router.push({ path: '/codelist/create' })
    },
    onSearch() {
      this.page = 1;
      this.fetchData();
    },
    handleSizeChange(size) {
      this.page = size;
      this.fetchData();
    },
    handleCurrentChange(size) {
      this.page = size;
      this.fetchData();
    },
    fetchData() {
      this.listLoading = true;
      let params = {
        page: this.page,
        page_size: this.page_size,
        keyword: this.keyword,
      };
      entryCodeList(this.qs.stringify(params)).then((res) => {
        this.pages = res.data.pages;
        this.count = res.data.count;
        this.list = res.data.relics_list;
        this.listLoading = false;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDownload() {
      if (this.multipleSelection.length) {
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then((excel) => {
          const tHeader = ["二维码", "二维码名称", "分类", "创建时间"];
          const filterVal = [
            {
              title: "二维码",
              key: "mini_code",
              type: "image",
              width: 50,
              height: 50,
            },
            "name",
            "type_name",
            "create_time",
          ];
          const list = this.multipleSelection.map((item, index) => {
            item.type_name = item.type.type_name;
            return item;
          });
          const data = this.formatJson(filterVal, list);
          console.log(list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
          });
          this.$refs.multipleTable.clearSelection();
          this.downloadLoading = false;
        });
      } else {
        this.$message({
          message: "请选择导出的数据",
          type: "warning",
        });
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
  },
};
</script>

<style lang="scss" scoped>
.entry-code {
  background: white;
  padding: 20px;
  box-sizing: border-box;
  .entry-title {
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
  .entry-pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
