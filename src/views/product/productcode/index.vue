<template>
  <div class="fun-code">
    <div class="fun-code-head">
      <el-row>
        <el-col :span="14"><div class="entry-title">产品码</div></el-col>
        <el-col :span="10">
          <el-row :gutter="20">
            <el-col :span="18">
              <div class="entry-search">
                <el-input
                  v-model="pageList.keyword"
                  type="search"
                  clearable
                  placeholder="搜索产品码"
                  ><i slot="prefix" class="el-input__icon el-icon-search" />
                  <el-button slot="append" @click="onSearch">搜索</el-button>
                </el-input>
              </div>
            </el-col>

            <!-- <el-col :span="6">
              <div class="entry-search">
                <el-button type="primary" @click="golinkpage('/customCode')"
                  >新增扩展字段</el-button
                >
              </div>
            </el-col> -->
            <el-col :span="5" v-if="userinfo.purview.product.add">
              <div class="entry-search">
                <el-button
                  type="primary"
                  @click="golinkpage('/codelist/productedit', {})"
                  >新增产品码</el-button
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
        element-loading-text="拼命加载中"
        :height="tableHeight"
        border
        fit
        highlight-current-row
        @sort-change="changeTableSort"
      >
        >
        <el-table-column
          label="产品编号"
          prop="unique"
          :sortable="'custom'"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column label="产品名称" align="center">
          <template slot-scope="scope">
            <span class="code-name">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品状态" align="center">
          <template slot-scope="scope">
            <span class="code-name">{{
              scope.row.show ? "开启" : "关闭"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品码统计" align="center">
          <template slot-scope="scope">
            <div
              style="
                text-align: center;
                overflow: hidden;
                display: inline-block;
              "
            >
              订阅人数:{{ scope.row.subscribe_number }}; 扫码人数:{{
                scope.row.scan_code_number
              }}; 浏览次数:{{ scope.row.watch_number }};
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="320">
          <template slot-scope="scope">
            <!-- <span class="el-link-btn"
              ><el-link
                type="primary"
                @click="
                  openPopover(
                    'http://xsdt.xunsheng.org.cn/api/web/code?type=4&id=' +
                      scope.row.id
                  )
                "
                >下载二维码</el-link
              ></span
            > -->
            <span class="el-link-btn" v-if="userinfo.purview.flowing.select"
              ><el-link
                type="primary"
                @click="
                  golinkpage('/codelist/flowcode', {
                    id: scope.row.id,
                    page: page,
                  })
                "
                >查看流水码</el-link
              ></span
            >
            <span class="el-link-btn"
              ><el-link
                type="primary"
                @click="
                  openPopover(
                    'http://xsdt.xunsheng.org.cn/api/web/code?type=4&id=' +
                      scope.row.id +
                      '&muse_id=' +
                      userinfo.user_info.muse_id,
                    scope.row.name
                  )
                "
                >下载二维码</el-link
              ></span
            >
            <span class="el-link-btn" v-if="userinfo.purview.product.edit"
              ><el-link
                type="primary"
                @click="
                  golinkpage('/codelist/productedit', {
                    id: scope.row.id,
                    page: page,
                  })
                "
                >编辑</el-link
              ></span
            >
            <span class="el-link-btn" v-if="userinfo.purview.product.del">
              <el-link type="primary" @click="dele(scope.row)">删除</el-link>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="entry-pagination">
        <el-pagination
          :current-page="pageList.page * 1"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count"
          :page-size="pageList.page_size * 1"
          :page-sizes="[20, 50, 70, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <codedown
        :titleName="titleName"
        :dialogVisible="codeDialog"
        :codeImg="codeImg"
        @toggleDialog="toggle"
      />
    </div>
  </div>
</template>

<script>
import {
  productList,
  productEdit,
  preview,
  manualList,
  manualCreate,
  productDel,
} from "@/api/product";
import { downloadIamge } from "@/utils/utils";
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import { getQiToken } from "@/api/user";
import codedown from "@/components/codeDown/index";
export default {
  name: "ProductCode",
  components: {
    codedown,
  },

  data() {
    return {
      list: null,
      listLoading: true,
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
      order: 1,
      productId: 0,
      form: {
        manual_name: "",
        fileList: [],
      },
      codeDialog: false,
      codeImg: "",
      titleName: "",
      pageList: {
        keyword: this.$route.query.keyword || "",
        page: this.$route.query.page || 1,
        order: this.$route.query.order || 1,
        page_size: this.$route.query.page_size || 20,
      },
    };
  },
  computed: {
    ...mapGetters(["userinfo"]),
  },
  created() {
    this.fetchData();

    // 获取七牛token
    getQiToken().then((res) => {
      let str = res.data.data;
      str.token = JSON.parse(JSON.stringify(str.upToken));
      str.key = JSON.parse(JSON.stringify(str.path));
      delete str.path;
      delete str.upToken;
      sessionStorage.setItem("qiToken", JSON.stringify(str));
    });
    console.log(this.userinfo);
  },
  methods: {
    dele(id) {
      // 删除产品码
      console.log(id);
      productDel(this.qs.stringify({ id: id.id })).then((res) => {
        if (res.status == 200) {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.fetchData();
        }
      });
    },
    changeTableSort(column) {
      if (column.order == "ascending") {
        this.pageList.order = 0;
      } else {
        this.pageList.order = 1;
      }
      this.fetchData();
    },
    toggle() {
      this.codeDialog = !this.codeDialog;
      this.codeImg = "";
    },
    openPopover(code, name) {
      this.codeImg = code;
      this.titleName = name;
      this.codeDialog = true;
    },
    handleRemove(file, fileList) {
      this.form.fileList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true;
    },
    handleDownload(file) {},
    imageUploadSuccess(response, file, fileList) {
      this.form.fileList = fileList;
    },
    uploadProgress() {},
    downloadImg(id, name) {
      let params = {
        type: 0,
        id: id,
      };
      preview(this.qs.stringify(params)).then((res) => {
        if (res.status == 200) {
          downloadIamge(res.data.img, name);
        }
      });
    },
    onSearch() {
      this.pageList.page = 1;
      this.fetchData();
    },
    golinkpage(page, obj) {
      console.log(obj);
      this.$router.push({
        path: page,
        query: {
          ...obj,
        },
      });
    },
    handleSizeChange(size) {
      this.pageList.page_size = size;
      sessionStorage.setItem("pageSize", this.pageList.page_size * 1);

      this.pageList.page = 1;
      this.fetchData();
    },
    handleCurrentChange(size) {
      this.pageList.page = size;
      this.fetchData();
    },
    //是否上架
    toggleShow(id, flag) {
      let loading = this.$loading({
        text: "修改中...",
      });
      let parmas = {
        id: id,
        show: flag ? 1 : 0,
      };
      productEdit(this.qs.stringify(parmas)).then((res) => {
        loading.close();
        if (res.status == 200) {
          this.$message({
            message: res.message,
            type: "success",
          });
        }
      });
    },
    fetchData() {
      this.listLoading = true;
      productList(this.qs.stringify(this.pageList)).then((res) => {
        this.count = res.data.total;
        if (res.data.data.length > 0) {
          res.data.data.map((item, index) => {
            item.showFlag = item.show == 1;
          });
        }
        this.list = res.data.data;
        this.listLoading = false;
        this.showPage = res.data.last_page > 1;
        this.$router.push({ path: "productcode", query: this.pageList });
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
