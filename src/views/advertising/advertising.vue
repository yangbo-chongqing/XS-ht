<template>
  <div class="fun-code">
    <div class="fun-code-head">
      <el-row>
        <el-col :span="14"><div class="entry-title">广告</div></el-col>
        <div style="text-align: right">
          <el-button type="primary" @click="edit">新增广告</el-button>
        </div>
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
        <!-- <el-table-column label="广告编号" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.unique }}
          </template>
        </el-table-column> -->
        <el-table-column label="广告标题" align="center">
          <template slot-scope="scope">
            <span class="code-name">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="广告图片" align="center">
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
        <el-table-column label="是否显示" align="center">
          <template slot-scope="scope">
            <span class="code-name" v-if="scope.row.state == 1">显示</span>
            <span class="code-name" v-else>不显示</span>
          </template>
        </el-table-column>
        <el-table-column label="弹出频率" align="center">
          <template slot-scope="scope">
            <span class="code-name" v-if="scope.row.method == 1"
              >每次弹出
            </span>
            <span class="code-name" v-if="scope.row.method == 2"
              >当日只弹一次
            </span>
          </template>
        </el-table-column>
        <el-table-column label="跳转地址" align="center">
          <template slot-scope="scope">
            <span class="code-name">{{ scope.row.url }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <span class="el-link-btn"
              ><el-link type="primary" @click="edit(scope.row)"
                >编辑</el-link
              ></span
            >
            <span class="el-link-btn"
              ><el-link type="primary" @click="deteleAdvertis(scope.row)"
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
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
      width="550px"
    >
      <el-form :model="form">
        <el-form-item label="广告标题：" :label-width="formLabelWidth">
          <el-input
            style="width: 200px"
            v-model="form.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="广告图片：">
          <div></div>
          <el-upload
            class="upload-demo"
            :before-upload="uploadPic"
            :data="qiToken"
            action="http://upload.qiniup.com"
            :headers="headers"
            accept=".jpg,.png"
            v-if="!form.image"
            :on-success="imageUploadSuccess"
            :on-progress="uploadProgress"
            :show-file-list="false"
          >
            <div class="upload-box"><i class="el-icon-plus"></i></div>
          </el-upload>
          <div class="upload-box" v-else>
            <img :src="form.image" alt="" /><span @click="form.image = ''"
              ><i class="el-icon-close"></i
            ></span>
          </div>
        </el-form-item>
        <el-form-item label="跳转链接：" :label-width="formLabelWidth">
          <el-input
            style="width: 280px"
            v-model="form.url"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否显示：" :label-width="formLabelWidth">
          <el-select v-model="form.state" placeholder="请选择是否显示">
            <el-option label="显示" :value="1"></el-option>
            <el-option label="不显示" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="弹出频率：" :label-width="formLabelWidth">
          <el-select v-model="form.method" placeholder="请选择弹出频率">
            <el-option label="每次弹出" :value="1"></el-option>
            <el-option label="当天仅弹一次" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeOrAdd(0)">取 消</el-button>
        <el-button type="primary" @click="closeOrAdd(1)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  advertisingList,
  advertisingCreate,
  advertisingDel,
  advertisingEdit,
} from "@/api/myApi";
import { getToken } from "@/utils/auth";
import { getQiToken } from "@/api/user";
import { Loading } from "element-ui";
export default {
  data() {
    return {
      list: [],
      page: 1,
      form: {},
      count: 0,
      formLabelWidth: "120px",

      tableHeight: document.body.clientHeight - 230,
      title: "",
      listLoading: false,
      headers: { Authorization: "Bearer " + getToken() },
      showPage: false,
      dialogFormVisible: false,
      qiToken: {},
    };
  },
  methods: {
    getList() {
      //   获取广告列表;
      advertisingList(this.qs.stringify({ page: this.page })).then((res) => {
        this.list = res.data.list.data;
        this.count = res.data.list.total;
        if (this.count > 10) {
          this.showPage = true;
        }
      });
    },
    edit(data) {
      if (data.id) {
        this.dialogFormVisible = true;
        this.title = "编辑广告";
        this.form = JSON.parse(JSON.stringify(data));
        console.log(this.form);
      } else {
        this.dialogFormVisible = true;
        this.title = "新增广告";
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    deteleAdvertis(id) {
      // console.log(id);
      advertisingDel(this.qs.stringify({ id: id.id })).then((res) => {
        if (res.status == 200) {
          this.$message({
            message: res.msg,
            type: "success",
          });
          this.getList();
        }
      });
    },
    closeOrAdd(n) {
      if (n == 0) {
        this.dialogFormVisible = false;
        this.form = {};
      } else {
        if (this.title == "编辑广告") {
          console.log(this.form);

          if (!this.form.name || !this.form.image || !this.form.url) {
            this.$message({
              message: "数据不完整，请完善后提交",
              type: "warning",
            });
            return;
          }
          let parasm = {
            name: this.form.name,
            image: this.form.image,
            url: this.form.url,
            method: this.form.method,
            state: this.form.state,
            id: this.form.id,
          };
          advertisingEdit(this.qs.stringify(parasm)).then((res) => {
            if (res.status == 200) {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.form = {};
            }
            this.dialogFormVisible = false;
            this.getList();
          });
        } else {
          if (!this.form.name || !this.form.image || !this.form.url) {
            console.log(this.form);
            this.$message({
              message: "数据不完整，请完善后提交",
              type: "warning",
            });
            return;
          }
          let parasm = {
            name: this.form.name,
            image: this.form.image,
            url: this.form.url,
            method: this.form.method,
            state: this.form.state,
          };
          advertisingCreate(this.qs.stringify(parasm)).then((res) => {
            if (res.status == 200) {
              this.$message({
                message: "添加成功",
                type: "success",
              });
              this.form = {};
            }
            this.dialogFormVisible = false;
            this.getList();
          });
        }
      }
    },
    handleClose(done) {
      this.form = {};
      done();
    },
    // 上传前处理
    uploadPic(file) {
      let newTime = new Date().getTime();
      this.qiToken.key = `${this.qiToken.key}${newTime}.png`;
    },
    imageUploadSuccess(response, file, fileList) {
      this.form.image = `http://voice.xunsheng.org.cn/${response.key}`;
      this.uploadLoading.close();
      this.qiToken = JSON.parse(sessionStorage.qiToken);
    },
    uploadProgress() {
      this.uploadLoading = Loading.service({
        text: "上传中...",
      });
      setTimeout(() => {
        this.uploadLoading.close();
      }, 15000);
    },
  },
  created() {
    this.getList();
    getQiToken({}).then((res) => {
      let str = res.data.data;
      str.token = JSON.parse(JSON.stringify(str.upToken));
      str.key = JSON.parse(JSON.stringify(str.path));
      delete str.path;
      delete str.upToken;
      sessionStorage.setItem("qiToken", JSON.stringify(str));
    });
    this.qiToken = JSON.parse(sessionStorage.qiToken);
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
.upload-box {
  width: 170px;
  height: 170px;
  display: flex;
  border: 1px solid #ccc;
  position: relative;
  span {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #999;
    display: flex;
    cursor: pointer;
    i {
      font-size: 15px;
      margin: auto;
      color: white;
    }
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  i {
    color: #ccc;
    margin: auto;
    font-size: 30px;
  }
}
</style>