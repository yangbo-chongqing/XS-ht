<template>
  <div class="fun-code">
    <el-dialog
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="handleClose"
      center
    >
      <el-tabs v-model="activeName" stretch>
        <el-tab-pane label="样式标签" name="first">
          <div class="first">
            <el-input v-model="input" placeholder="请输入标签内容"></el-input>
            <div class="first-body" ref="imageWrapperTag">
              <div class="first-body-img">
                <img :src="codeImg" alt="" />
                <p class="" v-if="input">{{ input }}</p>
                <p class="" v-else>二维码标签内容</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="普通二维码标签" name="second">
          <div class="second-body" ref="imageWrapper">
            <div class="second-body-img">
              <img :src="codeImg" alt="" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toggle">取 消</el-button>
        <el-button type="primary" @click="toggle">下 载</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import { downloadIamge } from "@/utils/utils";
export default {
  name: "InstructionsCreate",
  props: ["dialogVisible", "codeImg"],
  data() {
    return {
      activeName: "second",
      input: "",
    };
  },
  created() {},
  watch: {},
  methods: {
    handleClose(done) {
      this.$emit("toggleDialog");
      this.activeName = "second"
    },
    toggle() {
      if (this.activeName == "second") {
        html2canvas(this.$refs.imageWrapper, {
          allowTaint: true,
          useCORS: true,
        }).then((canvas) => {
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
        html2canvas(this.$refs.imageWrapperTag, {
          allowTaint: true,
          useCORS: true,
        }).then((canvas) => {
          let dataURL = canvas.toDataURL("image/png");
          this.downloadImg(dataURL, "标签二维码");
        });
      }
      this.$emit("toggleDialog");
      this.activeName = "second"
    },
    //二维码下载
    downloadImg(img, imgname) {
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
