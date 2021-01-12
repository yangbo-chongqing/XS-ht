<template>
  <div ref="ue">
    <vue-ueditor-wrap
      @ready="ready"
      v-model="ueData"
      :config="ueConfig"
    ></vue-ueditor-wrap>
    <div class="ck-popover" v-if="entryFlag" @click="entryFlag = false"></div>
    <div class="ck-popover-entry" v-if="entryFlag">
      <div class="ck-popover-title">添加词条</div>
      <div class="ck-popover-body">
        <el-select
          v-model="entrykey"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词搜索"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="(item, index) of options"
            :key="index"
            :label="item.name"
            :value="index"
          >
          </el-option>
        </el-select>
      </div>
      <div class="entry-btn">
        <el-button type="primary" @click="addEntry">添加</el-button>
      </div>
    </div>
    <!-- 相关链接 -->
    <el-dialog
      width="500px"
      title="相关链接"
      :visible.sync="contactFlag"
      label-position="top"
    >
      <el-form ref="form" :inline="true" size="mini">
        <div v-for="(item, index) in form" :key="index + 'item'">
          <h3 style="margin-bottom: 15px">链接{{ index + 1 }}</h3>
          <el-form-item label="标题" label-width="30px">
            <el-input v-model="item.title" placeholder="例如名称"></el-input>
          </el-form-item>
          <el-form-item label="链接" label-width="30px">
            <el-input
              v-model="item.url"
              placeholder="url:http://或者/https://"
            ></el-input>
          </el-form-item>
          <span v-if="index > 0"
            ><el-button
              size="mini"
              @click="delFromItem(index)"
              icon="el-icon-minus"
              circle
            ></el-button
          ></span>
        </div>
        <div>
          <el-button
            @click="addFromItem"
            type="primary"
            icon="el-icon-plus"
            circle
          ></el-button>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="contactFlag = false">取 消</el-button>
        <el-button type="primary" @click="addXurl">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 直播视频添加 -->
    <el-dialog
      width="500px"
      title="直播地址"
      :visible.sync="cameraFlag"
      label-position="top"
    >
      <el-form ref="form" :inline="true" size="mini">
        <div v-for="(item, index) in form" :key="index + 'item'">
          <h3 style="margin-bottom: 15px">链接{{ index + 1 }}</h3>
          <el-form-item label="标题" label-width="30px">
            <el-input v-model="item.title" placeholder="例如名称"></el-input>
          </el-form-item>
          <el-form-item label="链接" label-width="30px">
            <el-input
              v-model="item.url"
              placeholder="url:http://或者/https://"
            ></el-input>
          </el-form-item>
          <span v-if="index > 0"
            ><el-button
              size="mini"
              @click="delFromItem(index)"
              icon="el-icon-minus"
              circle
            ></el-button
          ></span>
        </div>
        <div>
          <el-button
            @click="addFromItem"
            type="primary"
            icon="el-icon-plus"
            circle
          ></el-button>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cameraFlag = false">取 消</el-button>
        <el-button type="primary" @click="addXurl">确 定</el-button>
      </div>
    </el-dialog>
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
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { RelicsList } from "@/api/entrycode";
import VueUeditorWrap from "vue-ueditor-wrap";
export default {
  name: "UE",
  components: {
    VueUeditorWrap,
  },
  props: ["value"],
  mounted: function () {
    this.$nextTick(()=>{
      let _this = this;
      let scroll_box = document.querySelector('.create-code');
      scroll_box.addEventListener('scroll',function(){
        let edui1_toolbarbox = document.querySelector('#edui1_toolbarbox');
        let ue_box = _this.$refs.ue.getBoundingClientRect().top;
        if(ue_box<=0){
          edui1_toolbarbox.classList.add('setFixed')
        }else{
          edui1_toolbarbox.classList.remove('setFixed')
        }
      },false)
    })
  },
  data: function () {
    return {
      id: parseInt(Math.random() * 10000).toString(),
      ueData: "",
      isShowDoc: false,
      activeName: "first",
      mobHtml: "",

      ueConfig: {
        toolbars: [
          [
            "undo", //撤销
            "redo", //重做
            "autotypeset", //自动排版'
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
            "entry", //词条
            "|",
            "blockquote", //引用
            "horizontal", //分隔线
            "|",
            "information", //联系方式
            // "camera", //摄像头
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
            // "insertunorderedlist", //无序列表
            "|",
            // "subscript", //下标
            // "fontborder", //字符边框
            // "superscript", //上标
            // "formatmatch", //格式刷
            // "pasteplain", //纯文本粘贴模式
            // "selectall", //全选
            // "preview", //预览
            // "time", //时间
            // "date", //日期
            // "unlink", //取消链接
            // "cleardoc", //清空文档
            "simpleupload", //单图上传
            "insertimage", //图上传
            "attachment", //附件上传
            "music",
            "insertvideo",

            // "fullscreen", //全屏
            // "directionalityltr", //从左向右输入
            // "directionalityrtl", //从右向左输入
            // "imagenone", //默认
            // "imageleft", //左浮动
            // "imageright", //右浮动
            // "imagecenter", //居中
            // "inserttable", //插入表格
            // "customstyle", //自定义标题
            // "paragraph", //段落格式
            "contact", //相关链接
            "update", //一键排版
          ],
        ],
        labelMap: {
          entry: "添加词条链接",
          contact: "添加相关链接",
          information: "添加联系方式",
          update: "快速排版",
          camera: "直播视频地址",
        },
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
      editor: null,
      loading: false,
      options: [],
      entrykey: "",
      entryFlag: false,
      contactFlag: false,
      cameraFlag: false,
      form: [
        {
          title: "",
          url: "",
        },
      ],
    };
  },
  methods: {
    addUpdate() {
      //一键排版
      this.isShowDoc = !this.isShowDoc;
    },
    //添加联系方式到富文本
    addInformation() {
      let aStr = `
        <ul style='background: #f5f5f5;width:100%;border-radius: 10px;padding: 10px;box-sizing: border-box;'>
          <li style="text-align:center"><span style='font-size:18px;font-weight: bold;'>基本信息</span></li>
          <li style="text-align:center;color:#333"><span style='color:#999;margin-right:20px'>联系电话：</span>023-123456</li>
          <li style="text-align:center;color:#333"><span style='color:#999;margin-right:20px'>联系手机：</span>12345678911</li>
          <li style="text-align:center;color:#333"><span style='color:#999;margin-right:20px'>联系地址：</span>某某市某某区某某街道</li>
        </ul>`;
      this.editor.execCommand("inserthtml", aStr);
    },
    //添加相关链接到富文本
    addXurl() {
      let aStr = "";
      this.form.map((item, index) => {
        if (item.url == "" || item.title == "") {
          this.$message({
            type: "error",
            message: "请填写完整链接信息",
          });
          return false;
        } else {
          if (
            !item.url.match(
              /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
            )
          ) {
            this.$message({
              type: "error",
              message: "存在异常链接已自动剔除",
            });
            return false;
          } else {
            aStr += `<p><a style="color:#333;text-decoration: none;" href="${
              item.url
            }">${index + 1}、${
              item.title
            }</a><img class="a-href-icon" width='13px' style='margin-left:5px' src='https://voice.xunsheng.org.cn/sydt/muse_0/63b9127961b3bede237e8dd3267514c9.png' /></p>`;
          }
        }
      });
      this.editor.execCommand("inserthtml", aStr);
      this.form = [
        {
          title: "",
          url: "",
        },
      ];
      this.contactFlag = false;
    },
    //删除相关链接
    delFromItem(index) {
      this.form.splice(index, 1);
    },
    //添加相关链接
    addFromItem() {
      this.form.push({
        title: "",
        url: "",
      });
    },
    setCheditor(e) {
      this.mobHtml = e.target.innerHTML;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    ready(editorInstance) {
      this.ueData = this.value;
      this.editor = editorInstance;
      let entry = document.querySelector(".edui-for-entry");
      let contact = document.querySelector(".edui-for-contact");
      let information = document.querySelector(".edui-for-information");
      let update = document.querySelector(".edui-for-update");
      // let camera = document.querySelector(".edui-for-camera");
      entry.addEventListener("click", () => {
        this.entryFlag = true;
      });
      contact.addEventListener("click", () => {
        this.contactFlag = true;
      });
      // camera.addEventListener("click", () => {
      //   this.cameraFlag = true;
      // });
      information.addEventListener("click", () => {
        this.addInformation();
      });
      update.addEventListener("click", () => {
        this.addUpdate();
      });
    },
    addEntry() {
      console.log(this.entrykey);
      if (!this.entrykey && this.entrykey != 0) {
        this.$message({
          type: "error",
          message: "词条不能为空",
        });
        return false;
      }
      var mySelection = this.editor.selection.getRange().cloneContents();
      console.log(mySelection);
      let aStr = "";
      if (mySelection) {
        let a = document.createElement("a");
        a.appendChild(mySelection);

        aStr = `<a href="http://xs_j1_${this.options[this.entrykey].id}">${
          a.innerHTML
        }</a>`;
      } else {
        aStr = `<a href="http://xs_j1_${this.options[this.entrykey].id}">${
          this.options[this.entrykey].name
        }</a>`;
      }
      this.editor.execCommand("inserthtml", aStr);
      this.entryFlag = false;
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        let parmas = {
          keyword: query,
        };
        RelicsList(this.qs.stringify(parmas)).then((res) => {
          this.loading = false;
          this.options = res.data.relics_list.data;
        });
      } else {
        this.options = [];
      }
    },
  },
  watch: {
    // 监听prop的变化，更新ckeditor中的值
    ueData: function () {
      this.$emit("input", this.ueData);
    },
    mobHtml: function (val) {
      this.editor.execCommand("inserthtml", val);
    },
  },
  // 销毁组件前，销毁编辑器
  beforeDestroy: function () {},
};
</script>
<style lang="scss">
  .setFixed{
    position: fixed !important;
    top: 70px;
    z-index: 1001;
    width: 37.2% !important; 

  }
</style>
<style lang="scss" scoped>
.ck-popover {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1002;
}
.ck-popover-entry {
  width: 400px;
  height: 200px;
  border-radius: 10px;
  background: white;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1003;
  transform: translate(-50%, -50%);
  text-align: center;
  .ck-popover-title {
    line-height: 40px;
    text-align: center;
  }
  .ck-popover-body {
    padding-top: 30px;
  }
  .entry-btn {
    margin-top: 20px;
    text-align: center;
  }
}
.create-code {
  max-height: 90vh;
  overflow-y: scroll;
  .table-header {
    display: flex;
    justify-content: space-between;
  }
  .back-box {
    padding: 10px 0;
    box-sizing: border-box;
    color: #999;
    cursor: pointer;
  }
  .entry-toggle {
    .red {
      color: #5387fd;
    }
    i {
      font-size: 20px;
      color: #999;
    }
  }
  .multipleSelection-body {
    width: 100%;
    margin-top: 15px;
    display: flex;
    flex-wrap: wrap;
    span {
      flex-shrink: 0;
      background: #ccc;
      color: #ffffff;
      padding: 2px 5px;
      margin-right: 10px;
      margin-top: 10px;
      border-radius: 5px;
      font-size: 14px;
      i {
        cursor: pointer;
      }
    }
  }
  .scope-body {
    display: flex;
    justify-content: space-between;
    .code-name {
      width: 100%;
    }
  }
  .select-entry-body {
    width: 500px;
    height: 800px;
    background: white;
    border-radius: 10px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1021;
    padding: 20px;
    box-sizing: border-box;
    .popover-table {
      margin-top: 15px;
    }
    .entry-popover-btn-body {
      text-align: center;
      margin-top: 15px;
    }
  }
  .select-entry-popover {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1020;
  }
  .entry-entry-tip {
    margin-top: 20px;
    .entry-entry-item {
      color: #5387fd;
    }
  }
  .create-code-body-title {
    margin-bottom: 20px;
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
    position: fixed;
    top: 120px;
    width: 100%;
    width: 200px;
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
    top: 61px;
    left: 8px;
    z-index: 1000;
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
    .cheditor-title {
      vertical-align: middle;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 0 10px;
      box-sizing: border-box;
      font-weight: 700;
    }
  }
  .upload-info {
    .upload-info-img {
      width: 100%;
      max-height: 250px;
      overflow: hidden;
    }
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
      position: fixed;
      left: 230px;
      top: 70px;
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
      .upload-tips {
        line-height: 40px;
      }
    }
  }
}
</style>