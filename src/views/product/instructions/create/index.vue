<template>
  <div class="fun-code">
    <div class="back-box" @click="back">
      <i class="el-icon-arrow-left"></i> 返回列表
    </div>
    <div class="fun-table-body">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="关联产品">
          <el-select
            v-model="form.ids"
            multiple
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
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明书">
          <el-upload
            class="upload-demo"
            action="/api/Store/UploadFile"
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
          <!-- <el-upload
            class="upload-demo"
            action="/api/Store/UploadFile"
            :headers="headers"
            v-if="!form.dialogImageUrl"
            :on-success="imageUploadSuccess"
            :on-progress="uploadProgress"
            :show-file-list="false"
          >
            <div class="upload-box"><i class="el-icon-plus"></i></div>
          </el-upload>
          <div class="upload-box" v-else>
            <img :src="form.dialogImageUrl" alt="" /><span
              @click="form.dialogImageUrl = ''"
              ><i class="el-icon-close"></i
            ></span>
          </div> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { productList,manualCreate } from "@/api/product";
import { getToken } from "@/utils/auth";
import { Loading } from "element-ui";
export default {
  name: "InstructionsCreate",
  data() {
    return {
      headers: { Authorization: "Bearer " + getToken() },
      form: {
        ids: [],
        unique: "",
        fileList: [],
      },
      dialogVisible: false,
      disabled: false,
      uploadLoading: "",
      options: [],
      list: [],
      loading: false,
    };
  },
  created() {},
  methods: {
    onSubmit() {
      let loading = this.$loading({
        text: "保存中",
      });
      let params = {
        product_ids: this.form.ids.toString(),
        file: this.form.fileList[0].response.data.file_path,
      };
      manualCreate(this.qs.stringify(params)).then((res) => {
        loading.close();
        if (res.status == 200) {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.back();
        }
      });
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        let parmas = {
          manual: 1,
          keyword: this.query,
        };
        productList(this.qs.stringify(parmas)).then((res) => {
          this.loading = false;
          this.options = res.data.data;
        });
        // setTimeout(() => {
        //   this.loading = false;
        //   this.options = this.list.filter((item) => {
        //     return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
        //   });
        // }, 200);
      } else {
        this.options = [];
      }
    },
    handleRemove(file, fileList) {
      this.form.fileList = "";
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true;
    },
    handleDownload(file) {},
    imageUploadSuccess(response, file, fileList) {
      this.form.fileList = fileList;
      this.uploadLoading.close();
    },
    uploadProgress() {
      this.uploadLoading = Loading.service({
        text: "上传中...",
      });
    },
    back() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
.fun-code {
  background: white;
  .back-box {
    padding: 10px;
    box-sizing: border-box;
    color: #999;
    cursor: pointer;
  }
  .upload-box {
    width: 70px;
    height: 70px;
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
  .fun-table-body {
    width: 500px;
    margin: auto;
    padding: 20px;
    box-sizing: border-box;
  }
  .fun-code-head {
    border-bottom: 1px solid #f5f5f5;
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
    box-sizing: border-box;
  }
}
</style>
