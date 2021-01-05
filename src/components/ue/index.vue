<template>
  <div>
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
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item"
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
  props: ["value", "mobHtml"],
  mounted: function () {},
  data: function () {
    return {
      id: parseInt(Math.random() * 10000).toString(),
      ueData: "",
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
          update: "一键排版",
          camera: "直播视频地址",
        },
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
      console.log(this.editor.body.innerHTML);
      let richtext = this.editor.body.innerHTML;
      richtext.toString();
      //修改P标签内样式
      const regex = new RegExp(/[ t]*<p style[ t]*=[ t]*("[^"]+")|('[^']+')/gi);
      richtext = richtext.replace(
        regex,
        `<p style="margin: 0;padding: 0; font-size: 100%;font-weight: 400;"`
      );
      //修改h1标签内样式
      const regex1 = new RegExp(
        /[ t]*<h1 style[ t]*=[ t]*("[^"]+")|('[^']+')/gi
      );
      richtext = richtext.replace(
        regex1,
        `<h1 style=" margin: 0; padding: 0; border: 0; font-weight: normal; 
 font-style: normal; font-size: 100%; line-height: 1; font-family: inherit;;"`
      );
      //修改h2标签内样式
      const regex2 = new RegExp(
        /[ t]*<h2 style[ t]*=[ t]*("[^"]+")|('[^']+')/gi
      );
      richtext = richtext.replace(
        regex2,
        `<h2 style=" margin: 0; padding: 0; border: 0; font-weight: normal; 
 font-style: normal; font-size: 100%; line-height: 1; font-family: inherit;;"`
      );
      //修改h3标签内样式
      const regex3 = new RegExp(
        /[ t]*<h3 style[ t]*=[ t]*("[^"]+")|('[^']+')/gi
      );
      richtext = richtext.replace(
        regex3,
        `<h3 style=" margin: 0; padding: 0; border: 0; font-weight: normal; 
 font-style: normal; font-size: 100%; line-height: 1; font-family: inherit;;"`
      );
      //修改h4标签内样式
      const regex4 = new RegExp(
        /[ t]*<h4 style[ t]*=[ t]*("[^"]+")|('[^']+')/gi
      );
      richtext = richtext.replace(
        regex4,
        `<h4 style=" margin: 0; padding: 0; border: 0; font-weight: normal; 
 font-style: normal; font-size: 100%; line-height: 1; font-family: inherit;;"`
      );
      // 修改图片样式
      const regex5 = new RegExp("<img", "gi");
      richtext = richtext.replace(
        regex5,
        `<img style="max-width:100%;height:auto;text-align:center"`
      );
      this.editor.body.innerHTML = richtext;
    },
    //添加联系方式到富文本
    addInformation() {
      let aStr = `y
        <hr/>
				<h4 style="text-align:center">联系电话：023-123456</h4>
				<h4 style="text-align:center">手机号：12345678911</h4>
        <h4 style="text-align:center">公司地址：xxxxxxxxx</h4>
        <hr/>`;
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
            aStr += `<p ><a style="color:#333" href="${item.url}">${item.title}</a></p>`;
            this.editor.execCommand("inserthtml", aStr);
            this.form = [
              {
                title: "",
                url: "",
              },
            ];
            this.contactFlag = false;
          }
        }
      });
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
      if (!this.entrykey) {
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
        aStr = `<a href="http://xs_j1_${this.entrykey.id}">${a.innerText}</a>`;
      } else {
        aStr = `<a href="http://xs_j1_${this.entrykey.id}">${this.entrykey.name}</a>`;
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
</style>