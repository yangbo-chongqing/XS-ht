<template>
  <div class="fun-code">
    <div class="fun-code-head">
      <el-row>
        <el-col :span="14"
          ><div class="entry-title" @click="back">
            <i class="el-icon-arrow-left"></i>返回产品码
          </div></el-col
        >
        <el-col :span="10">
          <el-row :gutter="20">
            <el-col :span="20">
              <div class="entry-search">
                <el-input
                  v-model="keyword"
                  type="search"
                  @keyup.enter.native="onSearch"
                  placeholder="请输入唯一码"
                  clearable
                  ><i slot="prefix" class="el-input__icon el-icon-search" />
                  <el-button slot="append" @click="onSearch">搜索</el-button>
                </el-input>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="entry-search">
                <el-button
                  type="primary"
                  @click="golinkpage('/product/flowcodecreate', { id: id })"
                  >新增流程码</el-button
                >
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="fun-table">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="list"
        :height="tableHeight"
        element-loading-text="拼命加载中"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="唯一编号">
          <template slot-scope="scope">
            <span class="code-name">{{ scope.row.pkid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="颜色">
          <template slot-scope="scope">
            <span class="code-name">{{ scope.row.colour }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发动机号">
          <template slot-scope="scope">
            <span class="code-name">{{ scope.row.engine }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合格证编号">
          <template slot-scope="scope">
            <span class="code-name">{{ scope.row.certificate_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合格证证芯">
          <template slot-scope="scope">
            <span class="code-name">{{ scope.row.certificate_core }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <span class="el-link-btn"
              ><el-link
                type="primary"
                @click="
                  openPopover(
                    'http://xsdt.xunsheng.org.cn/api/web/code?type=3&id=' +
                      scope.row.id +
                      '&muse_id=' +
                      userinfo.user_info.muse_id
                  )
                "
                >下载二维码</el-link
              ></span
            >
            <span class="el-link-btn"
              ><el-link
                type="primary"
                @click="
                  golinkpage('/product/flowcodeedit', { id: scope.row.id })
                "
                >编辑</el-link
              ></span
            >
            <span class="el-link-btn"
              ><el-link type="primary" @click="delFow(scope.row.id, scope)"
                >删除</el-link
              ></span
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="entry-pagination" v-if="showPage">
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
    <codedown
      :dialogVisible="codeDialog"
      :codeImg="codeImg"
      @toggleDialog="toggle"
    />
  </div>
</template>

<script>
import { floWingList, floWingDel } from "@/api/product";
import codedown from "@/components/codeDown/index";
import { mapGetters } from "vuex";

export default {
  components: {
    codedown,
  },
  name: "FlowCode",
  data() {
    return {
      id: this.$route.query.id,
      list: null,
      listLoading: true,
      keyword: "",
      page: 1,
      count: 0,
      showPage: false,
      tableHeight: document.body.clientHeight - 220,
      codeDialog: false,
      codeImg: "",
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    openPopover(code) {
      // 打开二维码
      this.codeImg = code;
      this.codeDialog = true;
    },
    toggle() {
      this.codeDialog = !this.codeDialog;
      this.codeImg = "";
    },
    //删除
    delFow(id, item) {
      this.$confirm("此操作将删除该流程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const parmas = {
            id: id,
          };
          floWingDel(this.qs.stringify(parmas)).then((res) => {
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
    onSearch() {
      this.page = 1;
      this.fetchData();
    },
    golinkpage(page, obj) {
      this.$router.push({
        path: page,
        query: {
          ...obj,
        },
      });
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
      let parmas = {
        product_id: this.id,
        page: this.page,
        keyword: this.keyword,
      };
      floWingList(this.qs.stringify(parmas)).then((res) => {
        this.count = res.data.data.total;
        this.list = res.data.data.data;
        this.listLoading = false;
        this.showPage = res.data.data.last_page > 1 ? true : false;
      });
    },
    back() {
      this.$router.go(-1);
    },
  },
  computed: {
    ...mapGetters(["userinfo"]),
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
    margin: 20px 0;
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
