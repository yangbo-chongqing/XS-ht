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
        <el-form-item label="产品编号">
          <el-input v-model="form.unique" style="width: 220px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="上市时间">
          <el-date-picker
            v-model="form.listed"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="产品封面图">
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

        <el-form-item label="相关视频">
          <template v-for="(item, index) of picList">
            <div :key="index" class="itemPic">
              <video height="150px" controls :src="item.url" />
              <span>{{ item.name }}</span>
              <el-button class="detelePic" type="warning" @click="deleTP(index)"
                >删 除</el-button
              >
            </div>
          </template>
          <el-button
            :class="{ marBot: picList.length > 0 }"
            size="small"
            type="primary"
            @click="VisiblePic = true"
            >视频<i class="el-icon-upload el-icon--right"
          /></el-button>
        </el-form-item>
        <!-- <template v-for="(item, index) of addList">
          扩展字段
          <el-form-item :label="item.name" :key="index">
            <el-upload
              v-if="item.type == 3"
              class="upload-demo"
              :before-upload="uploadPic"
              :data="qiToken"
              action="http://upload.qiniup.com"
              :headers="headers"
              :on-success="imageUploadSuccess"
              accept=".jpg,.png"
              :show-file-list="false"
              :on-change="uploadProgress"
            >
              <el-button size="small" type="primary"
                >图片<i class="el-icon-upload el-icon--right"
              /></el-button>
            </el-upload>
            <el-input
              v-if="item.type == 1"
              v-model="inputVal[index]"
            ></el-input>
            <el-upload
              v-if="item.type == 2"
              class="upload-demo"
              action="http://upload.qiniup.com"
              :data="qiToken"
              :before-upload="uploadVideo"
              :headers="headers"
              accept=".MPEG,.baiAVI,.nAVI,.ASF,.MOV,.3GP,.mp4"
              :show-file-list="false"
              :on-success="videoUploadSuccess"
              :on-change="uploadProgress"
            >
              <el-button size="small" type="primary"
                >视频<i class="el-icon-upload el-icon--right"
              /></el-button>
            </el-upload>
          </el-form-item>
        </template> -->
        <div class="itemRich">
          <div class="font">产品说明书</div>
          <ue
            class="ueClass"
            :value="productState"
            :ueConfig="ueConfig"
            @input="setProductState"
            :mobHtml="mobHtml"
          ></ue>
        </div>
        <!-- <el-form-item label="产品详情"> -->
        <div class="itemRich">
          <div class="font">产品详情</div>
          <ue
            class="ueClass"
            :value="productDetail"
            :ueConfig="ueConfig"
            @input="setProductDetail"
            :mobHtml="mobHtml1"
          ></ue>
        </div>
        <!-- </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <!-- <el-popover
            style="margin-left: 20px"
            placement="bottom"
            width="220"
            v-model="visible"
          >
            <div>
              名称:
              <el-input
                class="block"
                size="mini"
                v-model="form1.name"
              ></el-input>
            </div>
            <div>
              类型:
              <el-select
                v-model="form1.type"
                size="mini"
                class="block"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) of options"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="closeEle"
                >取消</el-button
              >
              <el-button type="primary" size="mini" @click="addEle"
                >确定</el-button
              >
            </div>
            <el-button slot="reference">增加自定义</el-button>
          </el-popover> -->
        </el-form-item>
      </el-form>
    </div>
    <!-- 视频上传 -->
    <el-dialog title="上传" :visible.sync="VisiblePic" width="30%">
      <div style="display: inline-block">
        <div v-if="form2.url" class="upload-info">
          <div class="code-img-tips">
            <el-button type="warning" @click="delCodeVideo">删除</el-button>
          </div>
          <video width="100%" height="250px" controls :src="form2.url" />
        </div>
        <el-upload
          v-else
          class="upload-demo"
          action="http://upload.qiniup.com"
          :data="qiToken"
          :before-upload="uploadVideo"
          :headers="headers"
          accept=".MPEG,.baiAVI,.nAVI,.ASF,.MOV,.3GP,.mp4"
          :show-file-list="false"
          :on-success="videoUploadSuccess"
          :on-progress="uploadProgress"
        >
          <el-button
            size="small"
            type="primary"
            style="margin-left: 18px; margin-bottom: 20px"
            >视频上传<i class="el-icon-upload el-icon--right"
          /></el-button>
        </el-upload>
      </div>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="视频名称：">
          <el-input v-model="form2.name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAdd">取 消</el-button>
        <el-button type="primary" @click="addPic">确 定</el-button>
      </span>
    </el-dialog>
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
