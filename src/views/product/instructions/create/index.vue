<template>
  <div class="fun-code">
    <div class="back-box" @click="back">
      <i class="el-icon-arrow-left"></i> 返回列表
    </div>
    <div class="fun-table-body">
      <el-form ref="form" :model="form" label-width="90px">
        <el-form-item label="说明书名称">
          <el-input v-model="form.manual_name" placeholder="请输入说明书名称"></el-input>
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
        manual_name: '',
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
      if(!this.form.manual_name){
        this.$message({
            message: '请填写说明说名称',
            type: "error",
          });
          return false;
      }
      if(this.form.fileList.length==0){
        this.$message({
            message: '请上传说明书',
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
          this.$message({
            message: res.message,
            type: "success",
          });
          this.form.manual_name = '';
          this.form.fileList = [];
          this.options = [];
        }
      });
    },
    remoteMethod(query) {
      if (query !== "") {
        console.log(query);
        this.loading = true;
        let parmas = {
          manual: 1,
          keyword: query,
        };
        productList(this.qs.stringify(parmas)).then((res) => {
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
      this.uploadLoading.close();
    },
    uploadProgress() {
      this.uploadLoading = Loading.service({
        target:'.fun-code',
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
  .el-select{
    display: block;
  }
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
