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
            "bold", //加粗
            "indent", //首行缩进
            "italic", //斜体
            "underline", //下划线
            "strikethrough", //删除线
            "subscript", //下标
            "fontborder", //字符边框
            "superscript", //上标
            "formatmatch", //格式刷
            "blockquote", //引用
            "pasteplain", //纯文本粘贴模式
            "selectall", //全选
            "preview", //预览
            "horizontal", //分隔线
            "removeformat", //清除格式
            "time", //时间
            "date", //日期
            "unlink", //取消链接
            "cleardoc", //清空文档
            "simpleupload",//单图上传
            "insertimage", //图上传
            "link", //超链接
            "entry", //词条
            "justifyleft", //居左对齐
            "justifyright", //居右对齐
            "justifycenter", //居中对齐
            "justifyjustify", //两端对齐
            "rowspacingtop", //段前距
            "rowspacingbottom", //段后距
            "lineheight", //行间距
            "letterspacing", //字间距
            "forecolor", //字体颜色
            "backcolor", //背景色
            "insertorderedlist", //有序列表
            "insertunorderedlist", //无序列表
            "fullscreen", //全屏
            "directionalityltr", //从左向右输入
            "directionalityrtl", //从右向左输入
            "imagenone", //默认
            "imageleft", //左浮动
            "imageright", //右浮动
            "imagecenter", //居中
            "inserttable", //插入表格
            "customstyle", //自定义标题
            "fontfamily", //字体
            "fontsize", //字号
            "paragraph", //段落格式
          ],
        ],
        labelMap: {
          entry: "添加词条链接",
        },
        catchRemoteImageEnable:true,
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
    };
  },
  methods: {
    ready(editorInstance) {
      this.ueData = this.value;
      this.editor = editorInstance;
      let entry = document.querySelector(".edui-for-entry");
      entry.addEventListener("click", () => {
        this.entryFlag = true;
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
          this.options = res.data.relics_list;
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