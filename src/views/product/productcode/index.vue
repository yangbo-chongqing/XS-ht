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
                  v-model="keyword"
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
            <el-col :span="1">
              <div class="entry-search">
                <el-button
                  type="primary"
                  @click="golinkpage('/workOrder/workOrderList')"
                  >1</el-button
                >
              </div>
            </el-col>
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
      >
        <el-table-column label="产品编号" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.unique }}
          </template>
        </el-table-column>
        <el-table-column label="产品名称" align="center">
          <template slot-scope="scope">
            <span class="code-name">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品封面图片" align="center">
          <template slot-scope="scope">
            <div
              style="
                text-align: center;
                overflow: hidden;
                display: inline-block;
              "
            >
              <el-image
                style="width: 60px; height: 60px"
                :src="scope.row.image"
                :preview-src-list="[scope.row.image]"
              >
              </el-image>
            </div>
          </template>
        </el-table-column>
        <!--       <el-table-column label="装潢视频" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" v-if="scope.row.video"
              >点击查看</el-button
            >
            <el-button
              type="danger"
              @click="addInspection(scope.row.id, 'video')"
              size="mini"
              v-else
              plain
              >添加装潢视频</el-button
            >
          </template>
        </el-table-column>
            <el-table-column label="质检报告" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" v-if="scope.row.inspection"
              >点击查看</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="addInspection(scope.row.id, 'inspect')"
              v-else
              plain
              >添加质检报告</el-button
            >
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="说明书" width="220" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.manual">{{
              scope.row.manual.manual_name
            }}</el-tag>
            <el-button
              type="danger"
              size="mini"
              @click="addManual(scope.row.id)"
              v-else
              plain
              >关联说明书</el-button
            >
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="上市时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.listed }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="是否上架" width="120" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.showFlag"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="toggleShow(scope.row.id, scope.row.showFlag)"
            >
            </el-switch>
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <span class="el-link-btn" v-if="userinfo.purview.flowing.select"
              ><el-link
                type="primary"
                @click="golinkpage('/codelist/flowcode', { id: scope.row.id })"
                >查看流水码</el-link
              ></span
            >
            <!-- <span class="el-link-btn"
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
            > -->
            <span class="el-link-btn" v-if="userinfo.purview.product.edit"
              ><el-link
                type="primary"
                @click="
                  golinkpage('/codelist/productedit', { id: scope.row.id })
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
      <!-- <el-dialog
        :title="addinstruFromFlag ? '新增说明书' : '关联说明书'"
        :visible.sync="addInstruFlag"
        width="30%"
      >
        <div>
          {{ addinstruFromFlag ? "已有说明书,点击" : "没有说明书？点击"
          }}<el-button
            @click="addinstruFromFlag = !addinstruFromFlag"
            type="text"
            >{{ addinstruFromFlag ? "关联" : "新增" }}</el-button
          >
        </div>
        <el-form
          ref="form"
          :model="form"
          label-width="90px"
          v-if="addinstruFromFlag"
        >
          <el-form-item label="说明书名称">
            <el-input
              v-model="form.manual_name"
              placeholder="请输入说明书名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="说明书">
            <el-upload
              class="upload-demo"
              action="/api/store/upload"
              :headers="headers"
              accept=".pdf"
              :limit="1"
              :on-success="imageUploadSuccess"
              :on-progress="uploadProgress"
              :on-remove="handleRemove"
              :file-list="form.fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传PDF文件</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <el-form ref="form" :model="form" label-width="90px" v-else>
          <el-form-item label="说明书名称">
             <el-input
              v-model="form.manual_name"
              placeholder="请输入说明书名称"
            ></el-input> 
            <el-select
              v-model="value"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.manual_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" v-if="addinstruFromFlag">
          <el-button @click="addInstruFlag = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </span>
        <span slot="footer" class="dialog-footer" v-else>
          <el-button @click="addInstruFlag = false">取 消</el-button>
          <el-button type="primary" @click="onEdit(value)">立即关联</el-button>
        </span>
      </el-dialog> -->
      <!-- <el-dialog
        :title="type == 'video' ? '添加装潢视频' : '添加质检报告'"
        :visible.sync="addInspectionFlag"
        width="30%"
      >
        <el-form ref="form" :model="form" label-width="90px">
          <el-form-item :label="type == 'video' ? '装潢视频' : '质检报告'">
            <el-upload
              class="upload-demo"
              action="/api/store/upload"
              :headers="headers"
              :limit="1"
              :on-success="imageUploadSuccess"
              :on-progress="uploadProgress"
              :on-remove="handleRemove"
              :file-list="form.fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
               <div slot="tip" class="el-upload__tip">只能上传PDF文件</div> 
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addInspectionFlag = false">取 消</el-button>
          <el-button type="primary" @click="inspectionCreate"
            >立即创建</el-button
          >
        </span>
      </el-dialog> -->
      <codedown
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
      keyword: "",
      page: 1,
      count: 0,
      options: [],
      value: [],
      loading: false,
      showPage: false,
      headers: { Authorization: "Bearer " + getToken() },
      tableHeight: document.body.clientHeight - 230,
      addInstruFlag: false,
      addinstruFromFlag: false,
      addInspectionFlag: false,
      type: "",
      productId: 0,
      form: {
        manual_name: "",
        fileList: [],
      },
      codeDialog: false,
      codeImg: "",
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
    toggle() {
      this.codeDialog = !this.codeDialog;
      this.codeImg = "";
    },
    openPopover(code) {
      this.codeImg = code;
      this.codeDialog = true;
    },
    //添加质检报告
    inspectionCreate() {
      let parmas = {
        id: this.productId,
      };
      if (this.type == "video") {
        if (this.form.fileList.length == 0) {
          this.$message({
            message: "请上装潢视频",
            type: "error",
          });
          return false;
        }
        parmas.video = this.form.fileList[0].response.data.file_path;
      } else {
        if (this.form.fileList.length == 0) {
          this.$message({
            message: "请上质检报告",
            type: "error",
          });
          return false;
        }
        parmas.inspection = this.form.fileList[0].response.data.file_path;
      }
      let loading = this.$loading({
        text: "关联中...",
      });
      productEdit(this.qs.stringify(parmas)).then((res) => {
        loading.close();
        if (res.status == 200) {
          this.fetchData();
          this.$message({
            message: "关联成功",
            type: "success",
          });
          this.form.manual_name = "";
          this.form.fileList = [];
          this.options = [];
          this.addInspectionFlag = false;
        }
      });
    },
    //显示质检报告模态窗
    addInspection(id, type) {
      this.type = type;
      this.addInspectionFlag = true;
      this.productId = id;
    },
    //关联说明书
    onEdit(id) {
      if (id == "") {
        this.$message({
          message: "请选择关联的说明书",
          type: "error",
        });
        return false;
      }
      let loading = this.$loading({
        text: "修改中...",
      });
      let parmas = {
        id: this.productId,
        manual_id: id,
      };
      productEdit(this.qs.stringify(parmas)).then((res) => {
        loading.close();
        if (res.status == 200) {
          this.fetchData();
          this.$message({
            message: "关联成功",
            type: "success",
          });
          this.form.manual_name = "";
          this.form.fileList = [];
          this.options = [];
          this.addInstruFlag = false;
        }
      });
    },
    //修改说明书
    editManual(id) {
      this.editInstruFlag = true;
      this.productId = id;
    },
    //新增说明书
    addManual(id) {
      this.addInstruFlag = true;
      this.productId = id;
    },
    onSubmit() {
      if (!this.form.manual_name) {
        this.$message({
          message: "请填写说明说名称",
          type: "error",
        });
        return false;
      }
      if (this.form.fileList.length == 0) {
        this.$message({
          message: "请上传说明书",
          type: "error",
        });
        return false;
      }
      let loading = this.$loading({
        text: "保存中",
      });
      let params = {
        manual_name: this.form.manual_name,
        file: this.form.fileList[0].response.data.file_path,
      };
      manualCreate(this.qs.stringify(params)).then((res) => {
        loading.close();
        if (res.status == 200) {
          this.onEdit(res.data.manual_id);
        }
      });
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        let parmas = {
          keyword: query,
        };
        manualList(this.qs.stringify(parmas)).then((res) => {
          this.loading = false;
          this.options = res.data.data;
        });
      } else {
        this.options = [];
      }
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
      let parmas = {
        page: this.page,
        keyword: this.keyword,
      };
      productList(this.qs.stringify(parmas)).then((res) => {
        this.count = res.data.total;
        if (res.data.data.length > 0) {
          res.data.data.map((item, index) => {
            item.showFlag = item.show == 1 ? true : false;
          });
        }
        this.list = res.data.data;
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
