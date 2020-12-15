<template>
  <div class="entry-query">
    <div class="entry-popover" @click="toggleShow" />
    <div class="entry-query-body">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="entry-query-phone">
            <div class="entry-query-phone-top">
              <img
                class="entry-query-img"
                src="@/assets/icon/noback_top_black.png"
                alt=""
              />
            </div>
            <div class="entry-query-phone-center">
              <div class="entry-query-phone-body">
                <iframe class="query-iframe" :src="infoUrl" frameborder="0" />
              </div>
            </div>
            <div class="entry-query-phone-bottom">
              <img
                class="entry-query-img"
                src="@/assets/icon/noback_bottom_black.png"
                alt=""
              />
            </div>
          </div>
        </el-col>
        <el-col :offset="2" :span="8">
          <el-tabs>
            <el-tab-pane label="小程序二维码" name="first">
              <div class="qrcode-body">
                <div class="qrcode" ref="qrCodeUrl"></div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="网页二维码" name="second">
              <div class="qrcode-body">
                <div class="qrcode" ref="qrCodeUrl"></div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { postEntryList, postGetRelics, postEdit } from "@/api/entrycode";
import QRCode from "qrcodejs2";
export default {
  name: "EntryQuery",
  props: {
    infoUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      codeImage: "",
    };
  },
  mounted() {
    this.creatQrCode();
  },
  methods: {
    toggleShow() {
      this.$emit("popoverEven");
    },
    creatQrCode() {
      var qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text: this.infoUrl,
        width: 150,
        height: 150,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.entry-query {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .qrcode-body {
    width: 100%;
    text-align: center;
    p {
      line-height: 40px;
    }
  }
  .qrcode {
    display: inline-block;
    img {
      width: 150px;
      height: 150px;
      background-color: #fff; //设置白色背景色
      padding: 6px; // 利用padding的特性，挤出白边
      box-sizing: border-box;
    }
  }
  .entry-query-body {
    width: 800px;
    height: 700px;
    background: white;
    border-radius: 10px;
    overflow: hidden;
    position: absolute;
    padding: 20px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 101;
    .entry-query-phone {
      background: white;
      width: 100%;
      .entry-query-img {
        width: 100%;
      }
      .entry-query-phone-center {
        width: 100%;
        height: 520px;
        padding: 10px;
        box-sizing: border-box;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnQAAAACCAYAAADRjUE6AAAAAXNSR0IArs4c6QAAAFhJREFUWAnt1jEKADEIRFGzCDbe/6Q2grAJ2QtMucWf+tu8yvWembiZse6+dWYu8YwMAQQQQAABBBBAQBCoqvuXRYS5u3DxJY9cEiKAAAIIIIAAAgj8UmADZT0OAIE1hvcAAAAASUVORK5CYII=);
        background-size: 100% calc(100% - 80px);
        background-position: 0 40px;
        margin-top: -3px;
        text-align: center;
        overflow: hidden;
        .entry-query-phone-body {
          width: 100%;
          height: 100%;
          .query-iframe {
            width: 100%;
            height: 100%;
            border: 0;
            &::-webkit-scrollbar {
              width: 0;
              height: 0;
            }
          }
        }
      }
    }
  }
  .entry-popover {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 100;
  }
}
</style>
