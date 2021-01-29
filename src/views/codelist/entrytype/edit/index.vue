<template>
  <div class="fun-code">
    <div class="back-box" @click="back">
      <i class="el-icon-arrow-left"></i> 返回列表
    </div>
    <div class="fun-table-body">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="分馆名称">
          <el-input v-model="form.name" placeholder="请输入分馆名称"></el-input>
        </el-form-item>
        <el-form-item label="分馆图片">
          <el-upload
            style="width: 200px; height: 220px"
            :before-upload="beforeAvatarUpload"
            :on-error="uploadToken"
            class="logo-uploader"
            action="/api/store/upload"
            :headers="headers"
            :show-file-list="false"
            :on-success="imageUploadSuccess"
            :on-change="uploadProgress"
          >
            <img v-if="enterpriseLogo" :src="enterpriseLogo" class="logo" />
            <i v-else class="el-icon-plus logo-uploader-icon" />
            <div class="logo-tip">logo</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="排序">
          <el-input
            v-model="form.sort"
            type="number"
            placeholder="值越小排序越靠前"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getDetails, updateDetail } from "@/api/entrycode";
import { getToken } from "@/utils/auth";
import { getQiToken } from "@/api/user";
import { Loading } from "element-ui";
export default {
  name: "InstructionsCreate",
  data() {
    return {
      headers: { Authorization: "Bearer " + getToken() },
      id: "",
      form: {
        name: "",
        sort: 0,
      },
      dialogVisible: false,
      disabled: false,
      uploadLoading: "",
      options: [],
      list: [],
      enterpriseLogo: "",
      loading: false,
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getType();
  },
  methods: {
    uploadProgress(file, fileList) {
      if (file.status === "ready") {
        this.loadProgress = 0;
        this.progressFlag = true; // 显示进度条
        let intval = setInterval(() => {
          if (this.loadProgress >= 99) {
            clearInterval(intval);
          }
          this.loadProgress += 1;
        }, 20);
      }
      if (file.status === "success") {
        this.loadProgress = 100;
      }
      setTimeout(() => {
        this.progressFlag = false;
      }, 1000); // 一秒后关闭进度条
    },
    onSubmit() {
      if (!this.form.name) {
        this.$message({
          message: "请填写分类名称",
          type: "error",
        });
        return false;
      }
      let loading = this.$loading({
        text: "保存中",
      });
      let params = {
        id: this.id,
        name: this.form.name,
        sort: this.form.sort,
        image: this.enterpriseLogo,
      };
      updateDetail(this.qs.stringify(params)).then((res) => {
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
    //查询分类
    getType() {
      let loading = this.$loading({
        text: "加载中",
      });
      let params = {
        id: this.id,
      };
      getDetails(this.qs.stringify(params)).then((res) => {
        loading.close();
        if (res.status == 200) {
          this.form.name = res.data.part.part_name;
          this.form.sort = res.data.part.sort;
          this.enterpriseLogo = res.data.part.image;
        }
      });
    },
    uploadToken(err, file, fileList) {
      // 上传失败处理方式
      console.log(err);
      getQiToken({}).then((res) => {
        let str = res.data.data;
        str.token = JSON.parse(JSON.stringify(str.upToken));
        str.key = JSON.parse(JSON.stringify(str.path));
        delete str.path;
        delete str.upToken;
        sessionStorage.setItem("qiToken", JSON.stringify(str));
      });
      // this.uploadLoading.close();

      this.qiToken = JSON.parse(sessionStorage.qiToken);
      this.$message.error("Token失效，请重新上传");
    },
    imageUploadSuccess(response, file, fileList) {
      //  拿到上传图片地址
      this.enterpriseLogo = response.data.file_path;
    },
    beforeAvatarUpload(file) {
      // 限制图片尺寸大小
      const isSize = new Promise(function (resolve, reject) {
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function () {
          resolve();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return file;
        },
        () => {
          return Promise.reject();
        }
      );
      return isSize;
    },
    back() {
      this.$router.push({ path: "/entrytype" });
    },
    getview(to, from) {
      this.getType();
    },
  },
  watch: {
    $route: {
      handler(newVal, oldVal) {
        if (newVal.name == "entrytypeedit") {
          console.log(newVal);
          this.id = newVal.query.id;
          this.getview(newVal, oldVal);
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.fun-code {
  background: white;
  .el-select {
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
    .logo-uploader {
      position: relative;
      .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
      }
      .logo-tip {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        line-height: 30px;
        background: rgba(0, 0, 0, 0.5);
        z-index: 100;
      }
    }
    .el-upload {
      &:hover {
        border-color: #409eff;
      }
    }
    .logo-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 200px;
      height: 200px;
      line-height: 178px;
      text-align: center;
    }
    .logo {
      width: 200px;
      height: 200px;
      display: block;
    }
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
