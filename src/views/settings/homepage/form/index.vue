<template>
  <div class="pageform-container">
    <el-row :gutter="20">
      <el-col
        :span="18"
      ><el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="企业名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="经营地址">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="口号">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="企业音频">
          <el-upload
            class="upload-demo"
            :limit="1"
            action=""
            :file-list="audioData"
          >
            <el-button size="small" type="primary">上传音频</el-button>
            <span
              slot="tip"
              class="el-upload__tip"
            >格式 mp3、m4a 小于10M</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="企业视频">
          <el-upload
            class="upload-demo"
            :limit="1"
            action=""
            :file-list="videoData"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <span slot="tip" class="el-upload__tip">格式 mp4 小于20M</span>
          </el-upload>
        </el-form-item>

        <el-form-item label="门头">
          <el-upload
            class="upload-demo"
            :limit="1"
            action=""
            :file-list="videoData"
          >
            <el-button size="small" type="primary">上传门头</el-button>
            <span
              slot="tip"
              class="el-upload__tip"
            >格式 png、jpg 500*500</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="企业介绍">
          <el-button type="primary">去编辑</el-button>
        </el-form-item>
      </el-form></el-col>
      <el-col :span="6">
        <el-upload
          class="logo-uploader"
          action=""
          :show-file-list="false"
        >
          <img v-if="imageUrl" :src="imageUrl" class="logo">
          <i v-else class="el-icon-plus logo-uploader-icon" />
          <div class="logo-tip">logo</div>
        </el-upload>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'HomePageForm',
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      audioData: [],
      videoData: [],
      imageUrl: ''
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {

    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handlelogoSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforelogoUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    }
  }
}
</script>
<style lang="scss">
 .pageform-container{
   .logo-uploader{
     position: relative;
     .el-upload{
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    }
    .logo-tip{
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
      line-height: 30px;
      background:rgba(0, 0, 0, 0.5);
      z-index: 100;
    }
  }
  .el-upload{
    &:hover{
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

}
</style>
