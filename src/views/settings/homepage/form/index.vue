<template>
  <div class="pageform-container">
    <el-row :gutter="20">
      <el-col :span="18"
        ><el-form ref="form" label-width="80px">
          <el-form-item label="企业名称">
            <el-input
              style="width: 220px"
              v-if="isEditFlag == 1"
              v-model="info.muse_name"
              @blur="saveEditEditMuse"
            />
            <p class="pDis" v-else>
              {{ info.muse_name ? info.muse_name : "暂无" }}
            </p>
            <i @click="change(1)" class="el-icon-edit"></i>
          </el-form-item>
          <el-form-item label="经营地址">
            <el-input
              style="width: 220px"
              v-if="isEditFlag == 2"
              @blur="saveEditEditMuse"
              v-model="info.address"
            />
            <p class="pDis" v-else>
              {{ info.address ? info.address : "暂无" }}
            </p>
            <i @click="change(2)" class="el-icon-edit"></i>
          </el-form-item>
          <el-form-item label="口号">
            <el-input
              style="width: 220px"
              @blur="saveEditEditMuse"
              v-if="isEditFlag == 3"
              v-model="info.slogan"
            />
            <p class="pDis" v-else>{{ info.slogan ? info.slogan : "暂无" }}</p>
            <i @click="change(3)" class="el-icon-edit"></i>
          </el-form-item>
          <el-form-item label="企业简介">
            <el-input
              type="textarea"
              @blur="saveEditEditMuse"
              v-if="isEditFlag == 4"
              v-model="info.introduction"
            />
            <p class="pDis" v-else>
              {{ info.introduction ? info.introduction : "暂无" }}
            </p>
            <i @click="change(4)" class="el-icon-edit"></i>
          </el-form-item>
          <el-form-item label="企业音频">
            <audio v-if="enterpriseAudio" controls :src="enterpriseAudio" />
            <el-upload
              class="upload-demo"
              action="/api/store/upload"
              accept=".mp3,.m4a"
              :headers="headers"
              :show-file-list="false"
              :on-success="audioUploadSuccess"
              :on-progress="uploadProgress"
            >
              <el-button size="small" type="primary">上传音频</el-button>
              <span slot="tip" class="el-upload__tip"
                >格式 mp3、m4a 小于10M</span
              >
            </el-upload>
          </el-form-item>
          <el-form-item label="企业视频">
            <video
              v-if="enterpriseVideo"
              width="300px"
              controls
              :src="enterpriseVideo"
            />
            <el-upload
              class="upload-demo"
              action="/api/store/upload"
              accept=".mp4"
              :headers="headers"
              :show-file-list="false"
              :on-success="videoUploadSuccess"
              :on-change="uploadProgress"
            >
              <el-button size="small" type="primary">上传视频</el-button>
              <span slot="tip" class="el-upload__tip">格式 mp4 小于20M</span>
            </el-upload>
          </el-form-item>
          <el-form-item label="门头">
            <img
              v-if="enterpriseImage"
              width="300px"
              :src="enterpriseImage"
              alt=""
            />
            <el-upload
              class="upload-demo"
              :before-upload="beforeUpload"
              action="/api/store/upload"
              :headers="headers"
              accept=".png,.jpg"
              :show-file-list="false"
              :on-success="imageUploadSuccess"
              :on-change="uploadProgress"
            >
              <el-button size="small" type="primary">上传门头</el-button>
              <span slot="tip" class="el-upload__tip"
                >格式 png、jpg 750*222</span
              >
            </el-upload>
          </el-form-item>
          <el-progress
            v-if="progressFlag"
            :percentage="loadProgress"
          ></el-progress> </el-form
      ></el-col>
      <el-col :span="6">
        <!-- <img
          v-if="enterpriseLogo && !isEditFlag"
          :src="enterpriseLogo"
          class="logo"
        /> -->
        <el-upload
          style="width: 200px; height: 200px"
          :before-upload="beforeAvatarUpload"
          class="logo-uploader"
          action="/api/store/upload"
          :headers="headers"
          :show-file-list="false"
          :on-success="logoUploadSuccess"
          :on-change="uploadProgress"
        >
          <img v-if="enterpriseLogo" :src="enterpriseLogo" class="logo" />
          <i v-else class="el-icon-plus logo-uploader-icon" />
          <div class="logo-tip">logo</div>
        </el-upload>
        <div class="home-code">
          <img
            :src="
              'http://xsdt.xunsheng.org.cn/api/web/code?type=2&id=' +
              userinfo.user_info.muse_id +
              '&muse_id=' +
              userinfo.user_info.muse_id
            "
            class="logo"
          />
          <span
            ><el-link type="primary" @click="dialogVisible = true"
              >下载二维码</el-link
            ></span
          >
        </div>
      </el-col>
    </el-row>
    <codedown
      :dialogVisible="dialogVisible"
      :codeImg="
        'http://xsdt.xunsheng.org.cn/api/web/code?type=2&id=' +
        userinfo.user_info.muse_id +
        '&muse_id=' +
        userinfo.user_info.muse_id
      "
      @toggleDialog="toggle"
    />
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { downloadIamge } from "@/utils/utils";
import { editEditMuse } from "@/api/settings";
import { preview } from "@/api/product";
import codedown from "@/components/codeDown/index";
import { mapGetters } from "vuex";
import * as imageConversion from "image-conversion";
export default {
  name: "HomePageForm",
  components: {
    codedown,
  },
  computed: {
    ...mapGetters(["userinfo"]),
  },
  props: {
    info: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      headers: { Authorization: "Bearer " + getToken() },
      uploadLoading: "",
      enterpriseImage: "",
      enterpriseAudio: "",
      enterpriseVideo: "",
      enterpriseLogo: "",
      isEditFlag: false,
      loading: "",
      loadProgress: 0, // 动态显示进度条
      progressFlag: false, // 关闭进度条
      dialogVisible: false,
    };
  },
  created() {
    this.enterpriseImage = this.info.head;
    this.enterpriseAudio = this.info.voice_url;
    this.enterpriseVideo = this.info.video_url;
    this.enterpriseLogo = this.info.logo;
  },
  methods: {
    toggle() {
      this.dialogVisible = !this.dialogVisible;
    },
    downloadImg(img, imgname) {
      downloadIamge(img, imgname);
    },
    beforeAvatarUpload(file) {
      // 限制图片尺寸大小
      const isSize = new Promise(function (resolve, reject) {
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function () {
          let valid = img.width == img.height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          console.log(111);
          return file;
        },
        () => {
          this.$message.error("上传的图片应为正方形图片!");
          return Promise.reject();
        }
      );
      return isSize;
    },
    toggleSave() {
      this.isEditFlag = !this.isEditFlag;
    },
    change(n) {
      this.isEditFlag = n;
    },
    saveEditEditMuse() {
      this.loading = this.$loading({
        text: "保存中",
      });
      const params = {
        muse_name: this.info.muse_name,
        address: this.info.address,
        voice_url: this.enterpriseAudio,
        video_url: this.enterpriseVideo,
        head: this.enterpriseImage,
        logo: this.enterpriseLogo,
        introduction: this.info.introduction,
        slogan: this.info.slogan,
      };
      editEditMuse(this.qs.stringify(params)).then((res) => {
        this.loading.close();
        this.isEditFlag = false;
      });
    },
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        // 压缩图片;
        let isLt2M = file.size / 1024 / 1024 < 1; // 判定图片大小是否小于4MB
        if (isLt2M) {
          resolve(file);
          console.log(file); // 压缩到400KB,这里的400就是要压缩的大小,可自定义
        } else {
          console.log(file); // 压缩到400KB,这里的400就是要压缩的大小,可自定义
          console.log(imageConversion);
          imageConversion.compressAccurately(file, 300).then((res) => {
            console.log(res);
            resolve(res);
          });
        }
      });
    },
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
    logoUploadSuccess(response, file, fileList) {
      this.enterpriseLogo = response.data.file_path;
      this.saveEditEditMuse();
    },
    imageUploadSuccess(response, file, fileList) {
      this.enterpriseImage = response.data.file_path;
      this.saveEditEditMuse();
    },
    audioUploadSuccess(response, file, fileList) {
      this.enterpriseAudio = response.data.file_path;
      this.saveEditEditMuse();
    },
    videoUploadSuccess(response, file, fileList) {
      this.enterpriseVideo = response.data.file_path;
      this.saveEditEditMuse();
    },
  },
};
</script>
<style lang="scss">
.pageform-container {
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
    width: 168px;
    height: 168px;
    line-height: 178px;
    text-align: center;
  }
  .logo {
    width: 168px;
    height: 168px;
    display: block;
  }
}
</style>
<style lang="scss" scoped>
.pageform-container {
  .el-upload__tip {
    margin-left: 5px;
  }
  .pDis {
    display: inline-block;
  }
  .home-code {
    width: 100%;
    span {
      padding-left: 50px;
      box-sizing: border-box;
    }
  }
}
</style>
