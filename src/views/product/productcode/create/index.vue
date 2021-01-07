<template>
  <div class="fun-code">
    <div class="back-box" @click="back">
      <i class="el-icon-arrow-left"></i> 返回列表
    </div>
    <div class="fun-table-body">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="产品名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="产品编码">
          <el-input v-model="form.unique"></el-input>
        </el-form-item>
        <el-form-item label="上市时间">
          <el-date-picker
            v-model="form.listed"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="厂家">
          <el-input v-model="form.factory"></el-input>
        </el-form-item> -->
        <el-form-item label="产品图标">
          <el-upload
            class="upload-demo"
            action="/api/store/upload"
            :headers="headers"
            accept=".jpg,.png"
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
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { productCreate } from "@/api/product";
import { getToken } from "@/utils/auth";
import { Loading } from "element-ui";
export default {
  name: "ProductCreate",
  data() {
    return {
      headers: { Authorization: "Bearer " + getToken() },
      form: {
        name: "",
        unique: "",
        dialogImageUrl: "",
        factory: "",
        listed: "",
      },
      dialogVisible: false,
      disabled: false,
      uploadLoading: "",
    };
  },
  created() {},
  methods: {
    onSubmit() {
      let loading = this.$loading({
        text: "保存中",
      });
      let params = {
        unique: this.form.unique,
        name: this.form.name,
        image: this.form.dialogImageUrl,
        factory: this.form.factory,
        listed: this.form.listed,
      };
      productCreate(this.qs.stringify(params)).then((res) => {
        loading.close();
        if (res.status == 200) {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.form.unique = "";
          this.form.name = "";
          this.form.dialogImageUrl = "";
          this.form.factory = "";
          this.form.listed = "";
        }
      });
    },
    handleRemove(file) {},
    handlePictureCardPreview(file) {
      this.dialogVisible = true;
    },
    handleDownload(file) {},
    imageUploadSuccess(response, file, fileList) {
      this.form.dialogImageUrl = response.data.file_path;
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
