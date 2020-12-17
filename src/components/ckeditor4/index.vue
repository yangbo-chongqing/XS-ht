<template>
  <div>
    <textarea :id="id"></textarea>
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
export default {
  name: "ckeditor4",
  props: ["value","mobHtml"],
  mounted: function () {
    const self = this;
    // 渲染编辑器
    self.ckeditor = window.CKEDITOR.replace(self.id, {
      image_previewText: " ",
      filebrowserImageUploadUrl: "https://xsdt.xunsheng.org.cn/api/Store/UploadFile",
      filebrowserBrowseUrl: "https://xsdt.xunsheng.org.cn/api/Store/UploadFile",
      filebrowserUploadUrl: "https://xsdt.xunsheng.org.cn/api/Store/UploadFile",
      uploadUrl: "https://xsdt.xunsheng.org.cn/api/Store/UploadFile",
      forcePasteAsPlainText: false,
      allowedContent: true,
      removePlugins: "elementspath",
      extraPlugins: "myplug",
      toolbarGroups: [
        { name: "custome_plugin", groups: ["myplug"] },
        { name: "document", groups: ["mode", "document", "doctools"] },
        { name: "clipboard", groups: ["clipboard", "undo"] },
        {
          name: "editing",
          groups: ["find", "selection", "spellchecker", "editing"],
        },
        { name: "forms", groups: ["forms"] },
        { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
        {
          name: "paragraph",
          groups: ["list", "indent", "blocks", "align", "bidi", "paragraph"],
        },
        { name: "links", groups: ["links"] },
        { name: "insert", groups: ["insert"] },
        { name: "styles", groups: ["styles"] },
        { name: "colors", groups: ["colors"] },
        { name: "tools", groups: ["tools"] },
        { name: "others", groups: ["others"] },
        { name: "about", groups: ["about"] },
      ],
      removeButtons:
        "Source,Save,Templates,NewPage,ExportPdf,Preview,Print,Replace,Find,Scayt,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,About,CopyFormatting,RemoveFormat,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Anchor,Flash,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe",
    });
    
    // 监听内容变更事件
    self.ckeditor.on("change", function () {
      self.$emit("input", self.ckeditor.getData());
    });
    //加载完毕
    self.ckeditor.on("instanceReady", function () {
      // 设置初始内容
    self.ckeditor.setData(self.value);
      let links = document.querySelector(".cke_button__myplug");
      links.removeAttribute("onclick");
      links.addEventListener("click", function () {
        self.entryFlag = true;
        return false;
      });
    });
  },
  data: function () {
    return {
      id: parseInt(Math.random() * 10000).toString(),
      ckeditor: null,
      loading: false,
      options: [],
      entrykey: "",
      entryFlag: false,
    };
  },
  methods: {
    addEntry() {
      if(!this.entrykey){
        this.$message({
          type:'error',
          message:'词条不能为空'
        })
        return false;
      }
      var mySelection = this.ckeditor.getSelection().getSelectedText();
      console.log(mySelection);
      let aStr = '';
      if(mySelection){
        aStr = `<a href="http://xs_j1_${this.entrykey.id}">${mySelection}</a>`
      }else{
        aStr = `<a href="http://xs_j1_${this.entrykey.id}">${this.entrykey.name}</a>`
      }
      this.ckeditor.insertHtml(
        aStr
      );
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
    value: function () {
      if (this.value !== this.ckeditor.getData()) {
        this.ckeditor.setData(this.value);
      }
    },
    mobHtml:function(){
      this.ckeditor.insertHtml(
        this.mobHtml
      );
    }
  },
  // 销毁组件前，销毁编辑器
  beforeDestroy: function () {
    const self = this;
    self.ckeditor.destroy();
  },
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
  z-index: 100;
}
.ck-popover-entry {
  width: 400px;
  height: 200px;
  border-radius: 10px;
  background: white;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 101;
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
