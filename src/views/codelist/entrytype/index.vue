<template>
  <div class="entry-code">
    <el-row :gutter="20">
      <el-col :span="14"><div class="entry-title">分馆管理</div></el-col>
      <el-col :span="10">
        <el-row :gutter="20">
          <!-- <el-col :span="18">
            <div class="entry-search">
              <el-input
                v-model="keyword"
                type="search"
                placeholder="请输入"
              ><i slot="prefix" class="el-input__icon el-icon-search" />
                <el-button slot="append" @click="onSearch">搜索</el-button>
              </el-input>
            </div>
          </el-col> -->
          <el-col :offset="18" :span="6">
            <div class="entry-search">
              <el-button
                type="primary"
                @click="golinkpage('/codelist/entrytypecreate')"
                >新增分馆</el-button
              >
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div class="entry-table">
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
        <el-table-column label="分馆名称">
          <template slot-scope="scope">
            <span class="code-name">{{ scope.row.part_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.create_time | getLocalTime }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <span class="el-link-btn"
              ><el-link
                type="primary"
                @click="
                  golinkpage('/codelist/entrytypeedit', { id: scope.row.id })
                "
                >编辑</el-link
              ></span
            >
            <span class="el-link-btn"
              ><el-link type="primary" @click="delType(scope.row.id, scope)"
                >删除</el-link
              ></span
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="entry-pagination">
        <el-pagination
          background
          :current-page.sync="page"
          layout="prev, pager, next"
          :total="count"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <EntryQuery
      v-if="popoverFlag"
      :infoUrl="'http://xsdth5.xunsheng.org.cn/#/entryinfo?id=' + id"
      :id="id"
      @popoverEven="togglePopover"
    />
  </div>
</template>
<script>
import { downloadIamge } from "@/utils/utils";
import table2excel from "js-table2excel";
import {
  postTypeList,
  postDelRelics,
  postTypeDel,
  getList,
  deteleOne,
} from "@/api/entrycode";
import EntryQuery from "@/components/EntryQuery";
export default {
  name: "EntryCode",
  components: {
    EntryQuery,
  },
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
      popoverFlag: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    togglePopover(id) {
      this.id = id;
      this.popoverFlag = !this.popoverFlag;
    },
    downloadImg(img, imgname) {
      downloadIamge(img, imgname);
    },
    // 删除分馆
    delType(id, item) {
      this.$confirm("此操作将删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const parmas = {
            id: id,
          };
          deteleOne(this.qs.stringify(parmas)).then((res) => {
            if (res.status == 200) {
              this.list.splice(item.$index, 1);
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    golinkpage(page, obj) {
      this.$router.push({
        path: page,
        query: {
          ...obj,
        },
      });
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
      const params = {
        page: this.page,
        keyword: this.keyword,
      };
      getList(this.qs.stringify(params)).then((res) => {
        this.pages = res.data.list.last_page;
        this.count = res.data.list.total;
        this.list = res.data.list.data;
        this.listLoading = false;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
  },
  filters: {
    getLocalTime: function (value) {
      return new Date(parseInt(value) * 1000)
        .toLocaleString()
        .replace(/:\d{1,2}$/, " ");
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
  .entry-table {
    margin-top: 20px;
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
