<template>
  <div class="AccountInfo-container">
    <div class="AccountInfo-text">联系方式</div>
    <el-row :gutter="20">
      <el-col :span="24"
        ><div class="AccountInfo-item" style="height: 88px">
          <label>客服二维码:</label>
          <span style="display: inline-block">
            <el-image
              style="width: 80px; height: 80px; vertical-align: middle"
              :src="imgOrIphone.image"
              :preview-src-list="[imgOrIphone.image]"
            >
            </el-image
          ></span>
          <el-upload
            class="upload-demo"
            :data="qiToken"
            action="http://upload.qiniup.com"
            :headers="headers"
            accept=".jpg,.png"
            :on-error="uploadToken"
            :before-upload="uploadPic"
            :on-success="imageUploadSuccess.bind(null, {})"
            :on-progress="uploadProgress"
            :show-file-list="false"
          >
            <el-link type="primary">修改二维码</el-link>
          </el-upload>
        </div></el-col
      >
      <el-col :span="24"
        ><div class="AccountInfo-item">
          <label>移动电话:</label>
          <span v-if="!isShowUserTel">{{ imgOrIphone.phone1 }}</span>
          <el-input
            v-else
            v-model="imgOrIphone.phone1"
            size="small"
            placeholder="请输入手机号"
          />
          <span>
            <el-link
              v-if="!isShowUserTel"
              type="primary"
              @click="isShowUserTel = true"
              >更换手机号</el-link
            >
            <el-link
              v-else
              type="primary"
              @click="accountSettings({ phone1: imgOrIphone.phone1 })"
              >保存</el-link
            >
          </span>
        </div></el-col
      >
      <el-col :span="24"
        ><div class="AccountInfo-item">
          <label>固定电话:</label>
          <span v-if="!isShowTelephone">{{ imgOrIphone.phone2 }}</span>
          <el-input
            v-else
            v-model="imgOrIphone.phone2"
            size="small"
            placeholder="请输入电话号码"
          />
          <span>
            <el-link
              v-if="!isShowTelephone"
              type="primary"
              @click="isShowTelephone = true"
              >更换电话号码</el-link
            >
            <el-link
              v-else
              type="primary"
              @click="accountSettings({ phone2: imgOrIphone.phone2 })"
              >保存</el-link
            >
          </span>
        </div></el-col
      >
    </el-row>
  </div>
</template>

<script>
import { postAccountSettings } from "@/api/user";
import Bus from "../bus.js";
import { getToken } from "@/utils/auth";

import { mapGetters } from "vuex";
export default {
  name: "AccountInfo",
  data() {
    return {
      enterpriseInfo: "",
      isShowUserTel: false,
      headers: { Authorization: "Bearer " + getToken() },
      qiToken: {},
      upOrDown: "",
      isShowTelephone: false,
      inputPsd: "",
      imgOrIphone: { image: "", phone1: "", phone2: "" },
    };
  },
  computed: {
    ...mapGetters(["userinfo"]),
  },
  created() {
    Bus.$on("getisshow", (data) => {
      //同级组件传递的参数
      this.imgOrIphone = data.contact;
    });
    this.qiToken = JSON.parse(sessionStorage.qiToken);
  },
  methods: {
    accountSettings() {
      console.log(this.imgOrIphone);
      const params = {
        contact: this.imgOrIphone,
        save_type: 1,
      };
      const loading = this.$loading({
        text: "修改中",
      });
      postAccountSettings(this.qs.stringify(params)).then((res) => {
        if (res.status == 200) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
        }
        loading.close();
        this.isShowUserTel = false;
        this.isShowUserTel = false;
      });
    },
    uploadToken(err, file, fileList) {
      getQiToken({}).then((res) => {
        let str = res.data.data;
        str.token = JSON.parse(JSON.stringify(str.upToken));
        str.key = JSON.parse(JSON.stringify(str.path));
        delete str.path;
        delete str.upToken;
        sessionStorage.setItem("qiToken", JSON.stringify(str));
        this.qiToken = str;
      });
      this.uploadLoading.close();

      this.qiToken = JSON.parse(sessionStorage.qiToken);
      this.$message.error("Token失效，请重新上传");
    },
    uploadProgress() {
      this.uploadLoading = Loading.service({
        text: "上传中...",
      });
    },
    imageUploadSuccess(obj, res, file) {
      // 图片上传成功
      if (obj.index || obj.index === 0) {
        this.form1[obj.index] = `http://voice.xunsheng.org.cn/${res.key}`;
      } else if (obj.type == "activity") {
        this.form3.image = `http://voice.xunsheng.org.cn/${res.key}`;
      } else {
        this.imgOrIphone.image = `http://voice.xunsheng.org.cn/${res.key}`;
        this.accountSettings();
      }
      this.uploadLoading.close();
      this.qiToken = JSON.parse(sessionStorage.qiToken);
    },
    uploadPic(file) {
      let newTime = new Date().getTime();
      this.qiToken.key = `${this.qiToken.key}${newTime}.png`;
    },
  },
};
</script>
<style lang="scss">
.AccountInfo-container {
  .el-input {
    width: auto;
  }
}
</style>
<style lang="scss" scoped>
.AccountInfo-container {
  padding: 20px;
  height: 240px;
  box-sizing: border-box;
  border: 1px solid #f5f5f5;
  box-shadow: 0px 0px 10px #f5f5f5;
  .AccountInfo-text {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .AccountInfo-item {
    margin: 10px 0;
    label {
      font-size: 14px;
    }
    span {
      margin: 0 10px;
      font-size: 13px;
      color: #999;
    }
  }
}
.aFont {
  color: #409eff !important;
  font-weight: 400;
  cursor: pointer;
}
.upload-demo {
  display: inline-block !important;
}
</style>
