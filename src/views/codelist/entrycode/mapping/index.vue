<template>
  <div class="entry-code">
    <el-upload
      class="upload-demo"
      :before-upload="beforeUpload"
      :data="qiToken"
      action="http://upload.qiniup.com"
      :headers="headers"
      accept=".png,.jpg"
      :show-file-list="false"
      :on-success="imageUploadSuccess"
      :on-change="uploadProgress"
    >
      <el-button size="small" type="primary">上传导图</el-button>
      <span slot="tip" class="el-upload__tip">格式 png、jpg 750*222</span>
    </el-upload>
    <div class="setmapping">
      <img
        @click="setEntryJump"
        v-if="enterpriseImage"
        :src="enterpriseImage"
        alt=""
      />
      <div class="mapptips">
        <div
          class="mapptip"
          @mousedown="mouseDown($event, index)"
          @mouseleave="mouseLeave($event, index)"
          @mousemove="mouseMove($event, index)"
          @mouseup="mouseUp($event, index)"
          v-for="(item, index) in entryObj"
          :key="index"
          :style="{ left: item.x + 'px', top: item.y + 'px' }"
        >
          <div @click.stop="setTip(index)">{{ item.title }}</div>
          <span></span>
          <i
            @click.stop="closeTip(index)"
            class="close el-icon-circle-close"
          ></i>
        </div>
      </div>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="form.href"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setTipData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { getQiToken } from "@/api/user";
export default {
  name: "EntryCode",
  components: {},
  computed: {},
  data() {
    return {
      headers: { Authorization: "Bearer " + getToken() },
      uploadLoading: "",
      enterpriseImage:
        "http://voice.xunsheng.org.cn/sydt/muse_12/1610344525946.png",
      loadProgress: 0, // 动态显示进度条
      progressFlag: false, // 关闭进度条
      dialogVisible: false,
      qiToken: {
        key: "",
        token: "",
      },
      entryObj: [],
      downFlag: false,
      clickFlag: false,
      firstTime: "",
      lastTime: "",
      sX: 0,
      sY: 0,
      tipIndex: 0,
      form: {
        title: "",
        href: "",
      },
    };
  },

  activated() {},
  created() {
    let qiT = JSON.parse(sessionStorage.qiToken);
    this.qiToken.key = qiT.key;
    this.qiToken.token = qiT.token;
  },
  methods: {
    //设置锚点内容
    setTipData() {
      this.entryObj[this.tipIndex].title = this.form.title;
      this.entryObj[this.tipIndex].href = this.form.href;
      this.dialogVisible = false;
    },
    //点击设置锚点内容弹窗唤起
    setTip(index) {
      if (!this.clickFlag) {
        this.dialogVisible = true;
        this.tipIndex = index;
      }
    },
    //按下按下
    mouseDown(e, index) {
      this.downFlag = true;
      this.sX = e.offsetX;
      this.sY = e.offsetY;
      this.firstTime = new Date().getTime();
    },
    //鼠标移动
    mouseMove(e, index) {
      if (this.downFlag) {
        //提取拖动元素的x，y
        let x = this.entryObj[index].x,
          y = this.entryObj[index].y;
        //计算位置
        let moveX = e.offsetX - this.sX + x;
        let moveY = e.offsetY - this.sY + y;
        //赋值更改元素位置
        this.$set(this.entryObj[index], "x", moveX);
        this.$set(this.entryObj[index], "y", moveY);
      }
    },
    //鼠标松开
    mouseUp(e, index) {
      this.lastTime = new Date().getTime();
      console.log(this.lastTime - this.firstTime);
      if (this.lastTime - this.firstTime > 200) {
        this.clickFlag = true;
      }
      setTimeout(() => {
        this.clickFlag = false;
      }, 200);
      this.downFlag = false;
    },
    //鼠标离开被拖动元素
    mouseLeave(e, index) {
      this.downFlag = false;
    },
    //删除锚点
    closeTip(index) {
      this.entryObj.splice(index, 1);
    },
    //点击提示用户添加锚点
    setEntryJump(e) {
      let x = e.offsetX,
        y = e.offsetY;
      console.log(x, y);
      this.entryObj.push({
        title: "点击编辑",
        href: "",
        x: x,
        y: y,
      });
    },
    beforeUpload(file) {
      let newTime = new Date().getTime();
      this.qiToken.key = `${this.qiToken.key}${newTime}.png`;
      return new Promise((resolve, reject) => {
        // 压缩图片;
        let isLt2M = file.size / 1024 / 1024 < 1; // 判定图片大小是否小于4MB
        if (isLt2M) {
          resolve(file);
          console.log(file); // 压缩到400KB,这里的400就是要压缩的大小,可自定义
        } else {
          console.log(file); // 压缩到400KB,这里的400就是要压缩的大小,可自定义
          console.log(imageConversion);
          imageConversion.compressAccurately(file, 300).then((res) => {
            console.log(res);
            resolve(res);
          });
        }
      });
    },
    imageUploadSuccess(response, file, fileList) {
      let path = `http://voice.xunsheng.org.cn/${response.key}`;
      this.enterpriseImage = path;
    },
    uploadProgress(file, fileList) {
      if (file.status === "ready") {
        this.loadProgress = 0;
        this.progressFlag = true; // 显示进度条
        let intval = setInterval(() => {
          if (this.loadProgress >= 90) {
            clearInterval(intval);
          }
          if (this.loadProgress < 100) {
            this.loadProgress += 1;
          }
        }, 20);
      }
      if (file.status === "success") {
        this.loadProgress = 100;
        setTimeout(() => {
          this.progressFlag = false;
        }, 1000); // 一秒后关闭进度条
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.entry-code {
  background: white;
  padding: 20px 20px 20px 0;
  box-sizing: border-box;
  min-width: 1000px;
  position: relative;
  display: flex;
  .setmapping {
    position: relative;
    .mapptip {
      position: absolute;
      z-index: 100;
      padding: 10px 15px;
      background: white;
      box-shadow: 0px 0px 10px #999;
      border-radius: 10px;
      transform: translate(-50%, -50%);
      cursor: pointer;
      span {
        width: 0;
        height: 0;
        display: block;
        border: 10px solid white;
        border-color: white transparent transparent transparent;
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translate(-50%, 0);
      }
      .close {
        position: absolute;
        top: -5px;
        right: -5px;
        font-size: 20px;
        cursor: pointer;
      }
    }
    img {
      max-width: 1000px;
      cursor: url(~@/assets/icon/addentry.png), auto;
    }
  }
}
</style>
