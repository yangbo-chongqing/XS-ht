<template>
  <div class="fun-code">
    <div class="back-box" @click="back">
      <i class="el-icon-arrow-left"></i> 返回列表
    </div>
    <div class="fun-table-body">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="产品名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="产品编码">
          <el-input v-model="form.unique" disabled></el-input>
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
            :data="qiToken"
            action="http://upload.qiniup.com"
            :headers="headers"
            accept=".jpg,.png"
            :before-upload="uploadPic"
            v-if="!form.dialogImageUrl"
            :on-success="imageUploadSuccess.bind(null, {})"
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
        <el-form-item label="相关视频" style="width: 800px">
          <template v-for="(item, index) of picList">
            <div v-if="item.is_del != 1" :key="index" class="itemPic">
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
        <div class="itemRich">
          <div class="font">产品说明书</div>
          <ue
            class="ueClass"
            :value="productState"
            :ueConfig="ueConfig"
            v-if="getproductState"
            @input="setProductState"
            :mobHtml="mobHtml"
          ></ue>
        </div>
        <!-- <el-form-item label="产品详情"> -->
        <div class="itemRich">
          <div class="font">产品详情</div>
          <ue
            class="ueClass"
            v-if="getproductDetail"
            :value="productDetail"
            :ueConfig="ueConfig"
            @input="setProductDetail"
            :mobHtml="mobHtml1"
          ></ue>
        </div>
        <!-- 动态生成扩展字段 -->
        <template v-for="(item, index) of addList">
          <div v-if="item.field_type == '文本'" :key="index" class="itemRich">
            <div class="font">{{ item.field_name }}</div>
            <el-input v-model="form1[index]" style="width: 360px"></el-input>
          </div>
          <div v-if="item.field_type == '视频'" :key="index" class="itemRich">
            <div class="font">{{ item.field_name }}</div>
            <div style="display: inline-block">
              <div v-if="form1[index]" class="upload-info" style="width: 320px">
                <div class="code-img-tips">
                  <el-button type="warning" @click="delCodeVideo(index)"
                    >删除</el-button
                  >
                </div>
                <video width="100%" controls :src="form1[index]" />
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
                :on-success="
                  videoUploadSuccess.bind(null, { item, index: index })
                "
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
          </div>
          <div v-if="item.field_type == '图片'" :key="index" class="itemRich">
            <div class="font">{{ item.field_name }}</div>
            <div class="ueClass">
              <el-upload
                class="upload-demo"
                :data="qiToken"
                action="http://upload.qiniup.com"
                :headers="headers"
                accept=".jpg,.png"
                :before-upload="uploadPic"
                v-if="!form1[index]"
                :on-success="imageUploadSuccess.bind(null, { index })"
                :on-progress="uploadProgress"
                :show-file-list="false"
              >
                <div class="upload-box"><i class="el-icon-plus"></i></div>
              </el-upload>
              <div class="upload-box" v-else>
                <img :src="form1[index]" alt="" /><span
                  @click="delCodeVideo(index)"
                  ><i class="el-icon-close"></i
                ></span>
              </div>
            </div>
          </div>
          <div v-if="item.field_type == '富文本'" :key="index" class="itemRich">
            <div class="font">{{ item.field_name }}</div>
            <ue
              class="ueClass"
              :value="form1[index]"
              :ueConfig="ueConfig"
              @input="setProductDetail($event, index)"
            ></ue>
          </div>
        </template>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="back">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="上传" :visible.sync="VisiblePic" width="400px">
      <div style="display: inline-block">
        <div v-if="form2.url" class="upload-info">
          <div class="code-img-tips">
            <el-button type="warning" @click="delCodeVideo">删除</el-button>
          </div>
          <video width="100%" controls :src="form2.url" />
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
import { productEdit, productDetails, expandList } from "@/api/product";
import ue from "@/components/ue";
import { getToken } from "@/utils/auth";
import { Loading } from "element-ui";
export default {
  name: "ProductEdit",
  components: {
    ue,
  },
  data() {
    return {
      headers: { Authorization: "Bearer " + getToken() },
      id: this.$route.query.id,
      addList: [], //扩展字段列表
      form: {
        name: "",
        unique: "",
        dialogImageUrl: "",
        factory: "",
        listed: "",
      },
      dialogVisible: false,
      getproductDetail: "",
      form1: [],
      getproductState: "",
      disabled: false,
      uploadLoading: "",
      qiToken: {},
      VisiblePic: false,
      productState: "", //产品说明书
      productDetail: "", //产品详情
      picList: [],
      form2: {
        //创建单个视频的记录
        name: "",
        url: "",
        id: 0,
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
        UEDITOR_HOME_URL: "/UEditor/",
      },
    };
  },
  created() {
    this.queryDetails();
    this.qiToken = JSON.parse(sessionStorage.qiToken);
    // 显示扩展字段
    // this.geList();
  },
  methods: {
    //查询产品码
    queryDetails() {
      let loading = this.$loading({
        text: "加载中...",
      });
      let params = {
        id: this.id,
      };
      productDetails(this.qs.stringify(params)).then((res) => {
        loading.close();
        this.form.name = res.data.data.name;
        this.form.unique = res.data.data.unique;
        this.form.dialogImageUrl = res.data.data.image;
        this.form.factory = res.data.data.factory;
        this.form.listed = res.data.data.listed;
        this.picList = res.data.data.video;
        for (let i = 0; i < this.picList.length; i++) {
          this.picList[i].url = JSON.parse(
            JSON.stringify(this.picList[i].video_url)
          );
          this.picList[i].name = JSON.parse(
            JSON.stringify(this.picList[i].video_name)
          );
          this.picList[i].is_del = 0;
        }
        this.getproductState = res.data.data.expand.manual;
        this.getproductDetail = res.data.data.expand.details;
        this.productState = JSON.parse(JSON.stringify(this.getproductState));
        this.productDetail = JSON.parse(JSON.stringify(this.getproductDetail));
        this.addList = res.data.data.muse_expand;
        for (let i = 0; i < this.addList.length; i++) {
          this.form1.push(this.addList[i].value);
        }
      });
    },
    onSubmit() {
      // 提交保存
      let expand = [];
      for (let i = 0; i < this.addList.length; i++) {
        // expand[this.addList[i].id] = this.form1[i];
        let a = { id: this.addList[i].id };
        let b = { value: this.form1[i] };
        let c = Object.assign(a, b);
        expand.push(c);
      }
      let loading = this.$loading({
        text: "保存中",
      });
      let params = {
        id: this.id,
        name: this.form.name,
        image: this.form.dialogImageUrl,
        factory: this.form.factory,
        listed: this.form.listed,
        details: this.productDetail,
        manual: this.productState,
        videos: JSON.stringify(this.picList),
        expand: expand,
      };
      setTimeout(() => {}, 5000);
      productEdit(this.qs.stringify(params)).then((res) => {
        loading.close();
        if (res.status == 200) {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.back();
        }
      });
      setTimeout(() => {
        loading.close();
      }, 5000);
    },

    handleRemove(file) {},
    handlePictureCardPreview(file) {
      this.dialogVisible = true;
    },
    handleDownload(file) {},
    uploadProgress() {
      this.uploadLoading = Loading.service({
        text: "上传中...",
      });
    },
    back() {
      this.$router.go(-1);
    },
    uploadPic(file) {
      let newTime = new Date().getTime();
      this.qiToken.key = `${this.qiToken.key}${newTime}.png`;
    },
    setProductState(data) {
      this.productState = data;
    },
    setProductDetail(data, n) {
      if (n) {
        this.form1[n] = data;
      } else {
        this.productDetail = data;
      }
    },
    geList() {
      // 获取扩展字段列表
      expandList().then((res) => {
        this.addList = res.data.list.data;
      });
    },
    addPic() {
      this.picList = this.picList.concat(this.form2);
      this.form2 = {
        name: "",
        url: "",
        id: 0,
      };
      this.VisiblePic = false;
    },
    closeAdd() {
      this.form2 = {
        name: "",
        url: "",
        id: 0,
      };
      this.VisiblePic = false;
    },
    uploadVideo() {
      let newTime = new Date().getTime();
      this.qiToken.key = `${this.qiToken.key}${newTime}.mp4`;
    },
    imageUploadSuccess(obj, res, file) {
      // 图片上传成功
      console.log(obj, res, file);
      if (obj.index) {
        this.form1[obj.index] = `http://voice.xunsheng.org.cn/${res.key}`;
      } else {
        this.form.dialogImageUrl = `http://voice.xunsheng.org.cn/${res.key}`;
      }
      this.uploadLoading.close();
      this.qiToken = JSON.parse(sessionStorage.qiToken);
    },
    videoUploadSuccess(obj, res, file) {
      // 视频上传成功
      console.log(obj, res, file);
      if (obj.index) {
        this.form1[obj.index] = `http://voice.xunsheng.org.cn/${res.key}`;
        this.uploadLoading.close();
      } else {
        this.form2.url = `http://voice.xunsheng.org.cn/${res.key}`;
      }
      this.uploadLoading.close();
      this.qiToken = JSON.parse(sessionStorage.qiToken);
    },
    delCodeVideo(index) {
      // 删除视频
      console.log(this.form1[index]);
      if (index) {
        this.form1.splice(index, 1, "");
      } else {
        this.form2.url = "";
      }
      console.log(this.form1[index]);
    },
    deleTP(n) {
      let img = this.picList[n];
      img.is_del = 1;
      this.picList.splice(n, 1, img);
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
    width: 500px;
    margin-left: 20px;
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
.itemRich {
  display: inline-block;
  width: 900px;
  margin-bottom: 22px;
  .font {
    width: 100px;
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
