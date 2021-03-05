<template>
  <div class="fun-code">
    <el-dialog
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="handleClose"
      center
    >
      <el-tabs v-model="activeName" stretch @tab-click="handleClick">
        <el-tab-pane label="样式标签" name="first">
          <div class="first" style="text-align: center">
            <el-input v-model="input" placeholder="请输入标签内容"></el-input>
            <div id="printTest1" class="first-body">
              <div
                style="text-align: center"
                class="first-body-img"
                ref="imageWrapperTag"
              >
                <img :src="codeImg" alt="" />
                <p style="text-align: center" class="" v-if="input">
                  {{ input }}
                </p>
                <p style="text-align: center" v-else>二维码标签内容</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="普通二维码标签" name="second">
          <div
            class="second-body"
            style="text-align: center"
            ref="imageWrapper"
            id="printTest2"
          >
            <div style="text-align: center" class="second-body-img">
              <img :src="codeImg" alt="" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button v-print="`#printTest2`">打 印</el-button>

        <el-button @click="toggle('close')">取 消</el-button>
        <el-button type="primary" @click="toggle('down')">下 载</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import { downloadIamge } from "@/utils/utils";
export default {
  name: "InstructionsCreate",
  props: ["dialogVisible", "codeImg", "titleName"],
  data() {
    return {
      activeName: "second",
      input: "",
    };
  },
  created() {
    // console.log(this.titleName);
    this.input = this.titleName;
  },
  watch: {
    titleName(val) {
      this.input = val;
    },
  },
  methods: {
    handleClose(done) {
      this.$emit("toggleDialog");
      this.activeName = "second";
    },
    handleClick(tab, event) {
      // 动态修改id,保证动态打印
      let a = document.getElementsByClassName("first-body");
      let b = document.getElementsByClassName("second-body");
      if (tab.name == "first") {
        a[0].attributes.id.value = "printTest2";
        b[0].attributes.id.value = "printTest1";
      } else {
        a[0].attributes.id.value = "printTest1";
        b[0].attributes.id.value = "printTest2";
      }
    },
    toggle(type) {
      if (type == "down") {
        if (this.activeName == "second") {
          html2canvas(this.$refs.imageWrapper, {
            allowTaint: true,
            useCORS: true,
          }).then((canvas) => {
            console.log(canvas);
            let dataURL = canvas.toDataURL("image/png");
            this.downloadImg(dataURL, "普通二维码");
          });
        } else {
          if (!this.input) {
            this.$message({
              type: "error",
              message: "请填写标签内容",
            });
            return false;
          }
          console.log(this.$refs.imageWrapperTag);
          html2canvas(this.$refs.imageWrapperTag, {
            allowTaint: true,
            useCORS: true,
          }).then((canvas) => {
            let dataURL = canvas.toDataURL("image/png");
            this.downloadImg(dataURL, "标签二维码");
          });
        }
      }
      this.$emit("toggleDialog");
      this.activeName = "second";
    },
    //二维码下载
    downloadImg(img, imgname) {
      console.log(img, imgname);
      downloadIamge(img, imgname);
    },
  },
};
</script>
<style lang="scss" scoped>
.fun-code {
  .second-body {
    width: 100%;
    .second-body-img {
      img {
        width: 100%;
      }
    }
  }
  .first {
    width: 100%;
    .first-body {
      padding: 10px 30px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-top: 15px;
      text-align: center;
      .first-body-img {
        padding: 20px;
        box-sizing: border-box;
        img {
          width: 100%;
        }
      }
    }
  }
}
</style>
