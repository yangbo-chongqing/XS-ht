<template>
  <div class="fun-code editor-scroll">
    <div class="back-box" @click="back">
      <i class="el-icon-arrow-left"></i> 返回列表
    </div>
    <div class="fun-table-body">
      <el-form ref="form" :model="form" label-width="130px">
        <el-form-item label="产品名称">
          <el-input v-model="form.name" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="产品编码">
          <el-input v-model="form.unique" style="width: 220px"></el-input>
        </el-form-item>

        <el-form-item label="产品图标">
          <div></div>
          <el-upload
            class="upload-demo"
            :before-upload="uploadPic"
            :data="qiToken"
            action="http://upload.qiniup.com"
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
import ue from "@/components/ue";
import { publicPath } from "@/main";
export default {
  name: "ProductCreate",
  components: {
    ue,
  },
  data() {
    return {
      headers: { Authorization: "Bearer " + getToken() },
      qiToken: {},
      VisiblePic: false,
      productState: "", //产品说明书
      productDetail: "", //产品详情
      picList: [],
      form2: {
        //创建单个视频的记录
        name: "",
        url: "",
      },
      form: {
        name: "",
        unique: "",
        dialogImageUrl: "",
        factory: "",
        listed: "",
      },
      editorData: "",
      mobHtml: "",
      mobHtml1: "",
      ueConfig: {
        toolbars: [
          [
            "undo", //撤销
            "redo", //重做
            "removeformat", //清除格式
            "|",
            "fontsize", //字号
            "fontfamily", //字体
            "|",
            "forecolor", //字体颜色
            "backcolor", //背景色
            "bold", //加粗
            "italic", //斜体
            "underline", //下划线
            "strikethrough", //删除线
            "link", //超链接
            "|",
            "blockquote", //引用
            "horizontal", //分隔线
            "|",
            "indent", //首行缩进
            "justifyleft", //居左对齐
            "justifyright", //居右对齐
            "justifycenter", //居中对齐
            "justifyjustify", //两端对齐
            "|",
            "rowspacingtop", //段前距
            "rowspacingbottom", //段后距
            "lineheight", //行间距
            "letterspacing", //字间距
            "insertorderedlist", //有序列表
            "|",
            "simpleupload", //单图上传
            "insertimage", //图上传
            "attachment", //附件上传
            "music",
            "insertvideo",
          ],
        ],
        compressSide: 0,
        maxImageSideLength: 500,
        catchRemoteImageEnable: true,
        // 初始容器高度
        initialFrameHeight: 500,
        // 初始容器宽度
        initialFrameWidth: "100%",
        enableAutoSave: false,
        elementPathEnable: false,
        wordCount: false,
        serverUrl: "/api/store/ueditor/config",
        // UEDITOR_HOME_URL: "//xsdtcentercdn.xunsheng.org.cn/UEditor/",
        UEDITOR_HOME_URL: publicPath + "UEditor/",
      },
      dialogVisible: false,
      disabled: false,
      uploadLoading: "",
      visible: false,
      inputVal: [],
      addList: [],
      form1: {
        name: "",
        type: 1,
      },
      options: [
        { label: "文本", value: 1 },
        { label: "视频", value: 2 },
        { label: "图片", value: 3 },
      ],
    };
  },
  created() {
    this.qiToken = JSON.parse(sessionStorage.qiToken);
  },
  methods: {
    // 上传前处理
    uploadPic(file) {
      let newTime = new Date().getTime();
      this.qiToken.key = `${this.qiToken.key}${newTime}.png`;
    },
    setProductState(data) {
      this.productState = data;
    },
    setProductDetail(data) {
      this.productDetail = data;
    },
    addPic() {
      this.picList = this.picList.concat(this.form2);
      this.form2 = {
        name: "",
        url: "",
      };
      this.VisiblePic = false;
    },
    closeAdd() {
      this.form2 = {
        name: "",
        url: "",
      };
      this.VisiblePic = false;
    },
    onSubmit() {
      console.log(this.inputVal);
      let loading = this.$loading({
        text: "保存中",
      });
      let params = {
        unique: this.form.unique,
        name: this.form.name,
        image: this.form.dialogImageUrl,
        factory: this.form.factory,
        listed: this.form.listed,
        details: this.productDetail,
        manual: this.productState,
        videos: JSON.stringify(this.picList),
      };
      productCreate(this.qs.stringify(params), { meta: 1 }).then((res) => {
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
          this.productDetail = "";
          this.productState = "";
          this.$router.go(-1);
        }
      });
    },
    // closeEle() {
    //   this.visible = false;
    //   this.form1 = {
    //     name: "",
    //     type: 1,
    //   };
    // },
    uploadVideo() {
      let newTime = new Date().getTime();
      this.qiToken.key = `${this.qiToken.key}${newTime}.mp4`;
    },
    // 添加自定义
    // addEle() {
    //   if (!this.form1.name) {
    //     this.$message.error("请先完善数据");
    //     return;
    //   }
    //   this.addList.push(this.form1);
    //   console.log(this.addList);
    //   this.form1 = {
    //     name: "",
    //     type: 1,
    //   };
    //   this.visible = false;
    // },

    imageUploadSuccess(response, file, fileList) {
      this.form.dialogImageUrl = `http://voice.xunsheng.org.cn/${response.key}`;
      this.uploadLoading.close();
      this.qiToken = JSON.parse(sessionStorage.qiToken);
    },
    videoUploadSuccess(response, file, fileList) {
      this.form2.url = `http://voice.xunsheng.org.cn/${response.key}`;
      this.uploadLoading.close();
      this.qiToken = JSON.parse(sessionStorage.qiToken);
    },
    delCodeVideo() {
      this.form2.url = "";
    },
    deleTP(n) {
      this.picList.splice(n, 1);
    },
    uploadProgress() {
      this.uploadLoading = Loading.service({
        text: "上传中...",
      });
      setTimeout(() => {
        this.uploadLoading.close();
      }, 60000);
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
  .fun-table-body {
    width: 770px;
    margin-left: 10px;
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
.block {
  display: inline-block;
  width: 150px;
  margin-bottom: 10px;
}
.itemRich {
  display: inline-block;
  width: 900px;
  margin-bottom: 22px;
  .font {
    width: 130px;
    text-align: right;
    padding: 0 12px 0 0;
    font-size: 14px;
    color: #606266;
    display: inline-block;
    vertical-align: top;
    font-weight: 700;
  }
  .ueClass {
    width: 713px;
    display: inline-block;
  }
}
.upload-info {
  position: relative;
  margin-bottom: 10px;
  .code-img-tips {
    position: absolute;
    right: 0px;
    z-index: 888;
  }
}
.itemPic {
  height: 180px;
  overflow: hidden;
  display: inline-block;
  line-height: 20px;
  position: relative;
  margin-right: 10px;
  span {
    display: block;
    height: 20px;
    text-align: center;
    overflow: hidden;
    word-break: break-all;
    font-family: "微软雅黑", Tahoma, Geneva, Arial, Helvetica;
    font-size: 14px;
    font-weight: normal;
  }
  .detelePic {
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px;
  }
}
.marBot {
  margin-bottom: 10px;
}
</style>
