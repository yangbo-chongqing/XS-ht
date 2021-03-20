<template>
  <div class="fun-code">
    <div class="fun-code-head">
      <el-row>
        <el-col :span="18"><div class="entry-title">用户管理</div></el-col>
        <el-col :span="6">
          <el-row :gutter="24">
            <el-col :span="24">
              <div class="entry-search">
                <el-input
                  v-model="keyword"
                  type="search"
                  clearable
                  placeholder="搜索用户"
                  ><i slot="prefix" class="el-input__icon el-icon-search" />
                  <el-button slot="append" @click="onSearch">搜索</el-button>
                </el-input>
              </div>
            </el-col>
            <!-- <el-col :span="5" v-if="userinfo.purview.product.add">
              <div class="entry-search">
                <el-button
                  type="primary"
                  @click="golinkpage('/codelist/productedit', {})"
                  >新增产品码</el-button
                >
              </div>
            </el-col> -->
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="fun-table">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        :height="tableHeight"
        border
        fit
        highlight-current-row
      >
        >
        <el-table-column
          label="用户ID"
          prop="user_id"
          :sortable="'custom'"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column label="用户名称" align="center">
          <template slot-scope="scope">
            <span class="code-name">{{ scope.row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户电话" align="center" prop="mobile">
        </el-table-column>
      </el-table>
      <div class="entry-pagination">
        <el-pagination
          :current-page="page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count"
          :page-size="pageSize"
          :page-sizes="[20, 50, 70, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { userList } from "@/api/myApi";
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
export default {
  name: "ProductCode",

  data() {
    return {
      list: null,
      listLoading: true,
      keyword: "",
      page: 1,
      count: 0,
      options: [],
      value: [],
      loading: false,
      showPage: false,
      headers: { Authorization: "Bearer " + getToken() },
      tableHeight: document.body.clientHeight - 200,
      addInstruFlag: false,
      addinstruFromFlag: false,
      addInspectionFlag: false,
      type: "",
      pageSize: 20,
      order: 1,
      productId: 0,
      form: {
        manual_name: "",
        fileList: [],
      },
      codeDialog: false,
      codeImg: "",
      titleName: "",
    };
  },
  computed: {
    ...mapGetters(["userinfo"]),
  },
  created() {
    console.log(this.$route);
    if (this.$route.params.page) {
      this.page = this.$route.params.page * 1;
    }
    if (sessionStorage.getItem("pageSize") != null) {
      // console.log(sessionStorage.getItem("pageSize"));
      this.pageSize = sessionStorage.getItem("pageSize") * 1;
      this.fetchData();
    } else {
      sessionStorage.setItem("pageSize", 20);
      this.pageSize = 20;
      this.fetchData();
    }
  },
  methods: {
    onSearch() {
      this.page = 1;
      this.fetchData();
    },
    handleSizeChange(size) {
      this.pageSize = size;
      sessionStorage.setItem("pageSize", this.pageSize);

      this.page = 1;
      this.fetchData();
    },

    handleCurrentChange(size) {
      this.page = size;
      console.log(size);
      this.fetchData();
    },
    fetchData() {
      this.listLoading = true;
      let parmas = {
        page: this.page,
        name: this.keyword,
        page_size: this.pageSize,
      };
      userList(this.qs.stringify(parmas)).then((res) => {
        this.count = res.total;
        if (res.data.length > 0) {
          res.data.map((item, index) => {
            item.showFlag = item.show == 1 ? true : false;
          });
        }
        this.list = res.data;
        this.listLoading = false;
        this.showPage = res.data.last_page > 1 ? true : false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.fun-code {
  background: white;
  .fun-code-head {
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .entry-pagination {
    margin: 20px 0 0 0;
    text-align: center;
  }
  .fun-table {
    .fun-table-body {
      width: 100%;
      height: 100px;
      padding: 10px 20px;
      box-sizing: border-box;
      border-bottom: 1px solid #f5f5f5;
      .fun-table-info-num-title {
        font-size: 13px;
        color: #999;
        margin: 10px 0;
      }
      .fun-table-info-cz-tips {
        padding-top: 20px;
        box-sizing: border-box;
        text-align: right;
        span {
          margin: 0 10px;
        }
      }
      .fun-table-info-num-number {
        font-size: 13px;
        color: #409eff;
      }
      &:hover {
        background: #d7ebff;
      }
      .fun-table-info-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 10px;
      }
      .fun-table-info-id {
        font-size: 13px;
        color: #999;
        margin-bottom: 10px;
      }
      .fun-table-info-tips {
        font-size: 13px;
        color: #999;
      }
    }
  }
  .fun-title {
    font-size: 16px;
    font-weight: 600;
  }
  .el-image {
    float: left;
  }
  .code-name {
    // float: left;
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
