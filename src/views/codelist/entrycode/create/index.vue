<template>
  <div class="create-code">
    <div class="create-code-body">
      <el-row :gutter="20">
        <el-col :span="18">
          <div class="create-code-body-title">
            <el-input v-model="codeTitle" placeholder="请输入标题" />
          </div>
          <div class="create-code-body-upload">
            <div v-if="codeImage" class="upload-info">
              <div class="code-img-tips">
                <el-button type="warning" @click="delCodeImg">删除</el-button>
              </div>
              <img :src="codeImage" width="100%" alt="" />
            </div>
            <div v-if="codeVideo" class="upload-info">
              <div class="code-img-tips">
                <el-button type="warning" @click="delCodeVideo">删除</el-button>
              </div>
              <video width="100%" controls :src="codeVideo" />
            </div>
            <div v-if="codeAudio" class="upload-info">
              <div class="code-img-tips">
                <el-button type="warning" @click="delCodeAudio">删除</el-button>
              </div>
              <audio width="100%" controls :src="codeAudio" />
            </div>
            <el-row v-if="!codeImage || !codeVideo || !codeAudio">
              <!-- <el-col :span="6"><p class="upload-tips">重点内容</p></el-col> -->
              <el-col :span="4">
                <el-upload
                  class="upload-demo"
                  action="https://xsdt.xunsheng.org.cn/api/Store/UploadFile"
                  :headers="headers"
                  :on-success="imageUploadSuccess"
                  accept=".jpg,.png"
                  :show-file-list="false"
                  :on-progress="uploadProgress"
                >
                  <el-button size="small" type="primary"
                    >图片<i class="el-icon-upload el-icon--right"
                  /></el-button>
                </el-upload>
              </el-col>
              <el-col :span="4">
                <el-upload
                  class="upload-demo"
                  action="https://xsdt.xunsheng.org.cn/api/Store/UploadFile"
                  :headers="headers"
                  :show-file-list="false"
                  accept=".MPEG,.MP3,.MPEG-4,.MIDI,.WMA"
                  :on-success="audioUploadSuccess"
                  :on-progress="uploadProgress"
                >
                  <el-button size="small" type="primary"
                    >音频<i class="el-icon-upload el-icon--right"
                  /></el-button>
                </el-upload>
              </el-col>
              <el-col :span="4">
                <el-upload
                  class="upload-demo"
                  action="https://xsdt.xunsheng.org.cn/api/Store/UploadFile"
                  :headers="headers"
                  accept=".MPEG,.baiAVI,.nAVI,.ASF,.MOV,.3GP,.mp4"
                  :show-file-list="false"
                  :on-success="videoUploadSuccess"
                  :on-progress="uploadProgress"
                >
                  <el-button size="small" type="primary"
                    >视频<i class="el-icon-upload el-icon--right"
                  /></el-button>
                </el-upload>
              </el-col>
            </el-row>
          </div>
          <div v-show="isCkeditorFlag" class="cheditor-body">
            <div
              :class="isShowDoc ? 'cheditor-mybtn active' : 'cheditor-mybtn'"
              @click="isShowDoc = !isShowDoc"
            >
              <i class="el-icon-document" />
              <p>快速排版</p>
            </div>
            <ckeditor
              v-model="editorData"
              :config="editorConfig"
              @ready="ckeditorReady"
              @namespaceloaded="onNamespaceLoaded"
            />
            <div class="entry-entry-tip">
              <div class="entry-entry-item">
                <i class="el-icon-plus" /> 相关词条
              </div>
            </div>
            <div class="entry-entry-add-body">
              <div style="margin-top: 15px">
                <el-input
                  v-model="entryTipValue"
                  placeholder="请输入词条名"
                  class="input-with-select"
                >
                  <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="remoteMethod"
                  />
                </el-input>
              </div>
              <div v-if="entryTipList" class="entry-tip-list">
                <el-checkbox-group v-model="checkList" @change="checkChange">
                  <div>
                    <el-checkbox
                      v-for="(item, index) in entryTipList"
                      :key="index"
                      :label="item.id"
                      >{{ item.name }}</el-checkbox
                    >
                  </div>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="create-code-img">
            <img
              v-if="!codeSendImg"
              src="@/assets/icon/create-codeno.png"
              alt=""
              srcset=""
            />
            <img v-else :src="codeSendImg" alt="" srcset="" />
            <div v-if="!codeSendImg" class="create-btn">
              <el-button type="primary" @click="publish">生成二维码</el-button>
            </div>
            <div v-else class="create-btn">
              <span
                ><el-link type="primary" @click="togglePopover"
                  >预览</el-link
                ></span
              >
              <span
                ><el-link
                  type="primary"
                  @click="downloadImg(codeSendImg, 'code')"
                  >下载</el-link
                ></span
              >
              <div class="create-btn-yes">
                <el-button type="primary" @click="goback">完成</el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div v-if="isShowDoc" class="add-document-list">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="组合样式" name="first">
            <div class="styleLibTplWrapper" @click="setCheditor($event)">
              <div>
                <section
                  style="
                    font-size: 14px;
                    line-height: 1.4;
                    color: rgba(0, 0, 0, 0.87);
                    font-weight: bold;
                    text-align: center;
                  "
                >
                  <p>产品名称</p>
                </section>
                <section
                  style="
                    font-size: 20px;
                    line-height: 1.4;
                    color: rgba(0, 0, 0, 0.87);
                    font-weight: bold;
                    text-align: center;
                  "
                >
                  <p>产品介绍</p>
                </section>
              </div>
              <div>
                <section
                  class="stylelib-wrapper"
                  contenteditable="false"
                  data-theme-color="#365f93"
                  data-is-vip="undefined"
                  data-change-color="on"
                  data-key="text-tpl72"
                >
                  <section class="x-vipIcon">
                    <section style="display: none" />
                  </section>
                  <section>
                    <section
                      data-stylelib-stylename="background-color"
                      data-opacity-value="1/10"
                      style="
                        position: relative;
                        padding: 16px;
                        background-color: rgba(54, 95, 147, 0.1);
                        color: rgba(0, 0, 0, 0.87);
                        font-size: 14px;
                        line-height: 1.5;
                        overflow: hidden;
                        border-radius: 8px;
                      "
                    >
                      <section contenteditable="undefined">
                        公司莎车西站铁路物流专用线项目新建信号综合楼框架主题混凝土浇筑顺利完成。
                      </section>
                    </section>
                  </section>
                </section>
              </div>
              <div>
                <section>
                  <br />
                </section>
                <section
                  style="
                    font-size: 14px;
                    line-height: 1.4;
                    color: rgba(0, 0, 0, 0.87);
                    font-weight: bold;
                    text-align: center;
                  "
                >
                  <p>产品名称</p>
                </section>
                <section
                  style="
                    font-size: 20px;
                    line-height: 1.4;
                    color: rgba(0, 0, 0, 0.87);
                    font-weight: bold;
                    text-align: center;
                  "
                >
                  <p>产品信息</p>
                </section>
              </div>
              <div>
                <section
                  class="stylelib-wrapper stylelib-list"
                  contenteditable="false"
                  data-theme-color="#365f93"
                  data-is-vip="undefined"
                  data-change-color="on"
                  data-key="text-tpl73"
                >
                  <section class="x-vipIcon">
                    <section style="display: none" />
                  </section>
                  <section>
                    <section
                      class="stylelib-list-item"
                      style="margin-bottom: 8px"
                    >
                      <section
                        data-stylelib-stylename="background-color"
                        data-opacity-value="3/20"
                        style="
                          font-size: 14px;
                          font-weight: bold;
                          padding: 12px 16px;
                          color: rgba(0, 0, 0, 0.87);
                          background-color: rgba(54, 95, 147, 0.15);
                          line-height: 1.25;
                        "
                        contenteditable="undefined"
                      >
                        产品名称
                      </section>
                      <section
                        data-stylelib-stylename="background-color"
                        data-opacity-value="1/20"
                        style="
                          font-size: 13px;
                          padding: 12px 16px;
                          color: rgba(0, 0, 0, 0.87);
                          background-color: rgba(54, 95, 147, 0.05);
                          line-height: 1.25;
                        "
                        contenteditable="undefined"
                      >
                        油漆喷枪
                      </section>
                    </section>
                    <section
                      class="stylelib-list-item"
                      style="margin-bottom: 8px"
                    >
                      <section
                        data-stylelib-stylename="background-color"
                        data-opacity-value="3/20"
                        style="
                          font-size: 14px;
                          font-weight: bold;
                          padding: 12px 16px;
                          color: rgba(0, 0, 0, 0.87);
                          background-color: rgba(54, 95, 147, 0.15);
                          line-height: 1.25;
                        "
                        contenteditable="undefined"
                      >
                        产品品牌
                      </section>
                      <section
                        data-stylelib-stylename="background-color"
                        data-opacity-value="1/20"
                        style="
                          font-size: 13px;
                          padding: 12px 16px;
                          color: rgba(0, 0, 0, 0.87);
                          background-color: rgba(54, 95, 147, 0.05);
                          line-height: 1.25;
                        "
                        contenteditable="undefined"
                      >
                        草料二维码
                      </section>
                    </section>
                    <section
                      class="stylelib-list-item"
                      style="margin-bottom: 8px"
                    >
                      <section
                        data-stylelib-stylename="background-color"
                        data-opacity-value="3/20"
                        style="
                          font-size: 14px;
                          font-weight: bold;
                          padding: 12px 16px;
                          color: rgba(0, 0, 0, 0.87);
                          background-color: rgba(54, 95, 147, 0.15);
                          line-height: 1.25;
                        "
                        contenteditable="undefined"
                      >
                        产品型号
                      </section>
                      <section
                        data-stylelib-stylename="background-color"
                        data-opacity-value="1/20"
                        style="
                          font-size: 13px;
                          padding: 12px 16px;
                          color: rgba(0, 0, 0, 0.87);
                          background-color: rgba(54, 95, 147, 0.05);
                          line-height: 1.25;
                        "
                        contenteditable="undefined"
                      >
                        LUX-101
                      </section>
                    </section>
                  </section>
                </section>
              </div>
              <div>
                <section>
                  <br />
                </section>
                <section
                  style="
                    font-size: 14px;
                    line-height: 1.4;
                    color: rgba(0, 0, 0, 0.87);
                    font-weight: bold;
                    text-align: center;
                  "
                >
                  <p>产品名称</p>
                </section>
                <section
                  style="
                    font-size: 20px;
                    line-height: 1.4;
                    color: rgba(0, 0, 0, 0.87);
                    font-weight: bold;
                    text-align: center;
                  "
                >
                  <p>产品展示</p>
                </section>
              </div>
              <div>
                <section
                  class="stylelib-wrapper"
                  contenteditable="false"
                  data-theme-color="#365f93"
                  data-is-vip="undefined"
                  data-change-color="on"
                  data-key="text-tpl72"
                >
                  <section class="x-vipIcon">
                    <section style="display: none" />
                  </section>
                  <section>
                    <section
                      data-stylelib-stylename="background-color"
                      data-opacity-value="1/10"
                      style="
                        position: relative;
                        padding: 16px;
                        background-color: rgba(54, 95, 147, 0.1);
                        color: rgba(0, 0, 0, 0.87);
                        font-size: 14px;
                        line-height: 1.5;
                        overflow: hidden;
                        border-radius: 8px;
                      "
                    >
                      <section contenteditable="undefined">
                        公司莎车西站铁路物流专用线项目新建信号综合楼框架主题混凝土浇筑顺利完成。
                      </section>
                    </section>
                  </section>
                </section>
              </div>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="标题" name="second" />
          <el-tab-pane label="正文" name="third">角色管理</el-tab-pane>
          <el-tab-pane label="表格" name="fourth">定时任务补偿</el-tab-pane> -->
        </el-tabs>
      </div>
    </div>
    <EntryQuery
      v-if="popoverFlag"
      :infoUrl="'http://xsdth5.xunsheng.org.cn/#/entryinfo?id=' + id"
      :id='id'
      @popoverEven="togglePopover"
    />
  </div>
</template>

<script>
import { downloadIamge } from "@/utils/utils";
import EntryQuery from "@/components/EntryQuery";
import { Loading } from "element-ui";
import { getToken } from "@/utils/auth";
import { postPublish, postEntryList } from "@/api/entrycode";
export default {
  name: "CreateArticle",
  components: {
    EntryQuery,
  },
  data() {
    return {
      activeName: "first",
      id: "",
      headers: { Authorization: "Bearer " + getToken() },
      popoverFlag: false,
      entryTipList: [],
      entryTipValue: "",
      checkList: [],
      loading: false,
      codeTitle: "",
      codeImage: "",
      codeVideo: "",
      codeAudio: "",
      uploadLoading: "",
      isCkeditorFlag: false,
      codeImageFlag: false,
      fullscreenLoading: "",
      codeSendImg: "",
      isShowDoc: false,
      editor: null, // 编辑器实例
      editorData: "",
      editorConfig: {
        image_previewText: "",
        removeDialogTabs: "image:advanced;image:Link",
        filebrowserImageUploadUrl:
          "https://xsdt.xunsheng.org.cn/api/Store/UploadFile",
        filebrowserBrowseUrl:
          "https://xsdt.xunsheng.org.cn/api/Store/UploadFile",
        filebrowserUploadUrl:
          "https://xsdt.xunsheng.org.cn/api/Store/UploadFile",
        extraPlugins: "uploadimage",
        uploadUrl: "https://xsdt.xunsheng.org.cn/api/Store/UploadFile",
        forcePasteAsPlainText: false,
        allowedContent: true,
        removePlugins: "elementspath",
        toolbarGroups: [
          { name: "clipboard", groups: ["clipboard", "undo"] },
          {
            name: "editing",
            groups: ["find", "selection", "spellchecker", "editing"],
          },
          { name: "links", groups: ["links"] },
          { name: "insert", groups: ["insert"] },
          { name: "forms", groups: ["forms"] },
          { name: "tools", groups: ["tools"] },
          { name: "document", groups: ["mode", "document", "doctools"] },
          { name: "others", groups: ["others"] },
          { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
          {
            name: "paragraph",
            groups: ["list", "indent", "blocks", "align", "bidi", "paragraph"],
          },
          { name: "styles", groups: ["styles"] },
          { name: "colors", groups: ["colors"] },
          { name: "about", groups: ["about"] },
        ],
        removeButtons: "Underline,Subscript,Superscript,Source,About",
      },
    };
  },
  created() {
    this.fullscreenLoading = Loading.service({
      target: ".create-code",
      text: "初始化中...",
    });
  },
  methods: {
    togglePopover() {
      this.popoverFlag = !this.popoverFlag;
    },
    downloadImg(img, imgname) {
      downloadIamge(img, imgname);
    },
    checkChange() {
      console.log(this.checkList);
    },
    // 查找相关
    remoteMethod() {
      if (this.entryTipValue !== "") {
        this.loading = true;
        const params = {
          keyword: this.entryTipValue,
          type: 1,
        };
        postEntryList(this.qs.stringify(params)).then((res) => {
          this.entryTipList = res.data.list;
          this.loading = false;
        });
      }
    },
    // 返回
    goback() {
      this.$router.go(-1);
    },
    // 点击上传生成二维码
    publish() {
      const parmas = {
        name: this.codeTitle,
        image: this.codeImage,
        voice_url: this.codeAudio,
        video_url: this.codeVideo,
        content: this.editorData,
        related_ids: this.checkList.toString(),
      };
      const loading = this.$loading();
      postPublish(this.qs.stringify(parmas)).then((res) => {
        this.codeSendImg = res.data.file_path;
        this.id = res.data.id;
        loading.close();
      });
    },
    delCodeImg() {
      this.codeImage = "";
    },
    delCodeVideo() {
      this.codeVideo = "";
    },
    delCodeAudio() {
      this.codeAudio = "";
    },
    imageUploadSuccess(response, file, fileList) {
      this.codeImage = response.data.file_path;
      this.uploadLoading.close();
    },
    audioUploadSuccess(response, file, fileList) {
      this.codeAudio = response.data.file_path;
      this.uploadLoading.close();
    },
    videoUploadSuccess(response, file, fileList) {
      this.codeVideo = response.data.file_path;
      this.uploadLoading.close();
    },
    setCheditor(e) {
      this.editorData = e.target.innerHTML;
    },
    uploadProgress() {
      this.uploadLoading = Loading.service({
        text: "上传中...",
      });
    },
    onNamespaceLoaded(CKEDITOR) {},
    ckeditorReady() {
      this.isCkeditorFlag = true;
      this.fullscreenLoading.close();
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>
<style lang="scss">
.create-code {
  .cke_top {
    padding-left: 75px;
  }
  .el-tabs__content {
    height: 635px;
    overflow-y: scroll;
    background: white;
  }
  .cke_contents {
    height: 440px !important;
  }
}
</style>
<style lang="scss" scoped>
.create-code {
  padding: 20px;
  box-sizing: border-box;
  max-height: 90vh;
  overflow-y: scroll;
  .entry-entry-tip {
    margin-top: 20px;
    .entry-entry-item {
      color: #5387fd;
    }
  }
  .entry-entry-add-body {
    .entry-tip-list {
      margin-top: 15px;
    }
  }
  .create-code-title {
    background: white;
    line-height: 40px;
  }
  .create-code-img {
    width: 100%;
    text-align: center;
    img {
      width: 100%;
    }
    .create-btn {
      margin-top: 10px;
      .create-btn-yes {
        margin-top: 10px;
      }
      span {
        margin: 10px;
      }
    }
  }
  .cheditor-mybtn {
    &.active {
      background: white;
    }
    width: 60px;
    height: 60px;
    border: 1px solid #ccc;
    text-align: center;
    padding-top: 8px;
    box-sizing: border-box;
    position: absolute;
    top: 8px;
    left: 8px;
    cursor: pointer;
    i {
      font-size: 30px;
    }
    p {
      font-size: 12px;
    }
  }
  .cheditor-body {
    position: relative;
  }
  .upload-info {
    position: relative;
  }
  .create-code-body {
    max-width: 1000px;
    margin: auto;
    padding: 20px;
    box-sizing: border-box;
    background: white;
    position: relative;
    .add-document-list {
      width: 320px;
      position: absolute;
      left: -330px;
      top: 0;
      background: white;
      padding: 20px;
      box-sizing: border-box;
      .styleLibTplWrapper {
        div {
          pointer-events: none;
        }
        cursor: pointer;
        &:hover {
          background: #f5f5f5;
        }
      }
    }
    .create-code-body-upload {
      position: relative;
      .code-img-tips {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 100;
      }
      &:hover {
        border-color: #114a78;
      }
      width: 100%;
      padding: 10px 20px;
      box-sizing: border-box;
      border: 2px dotted #dcdfe6;
      margin: 20px 0;
      .upload-tips {
        line-height: 40px;
      }
    }
  }
}
</style>
