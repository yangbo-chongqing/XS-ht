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
      <!-- <span slot="tip" class="el-upload__tip">格式 png、jpg 750*222</span> -->
    </el-upload>
    <div>
      <el-progress v-if="progressFlag" :percentage="loadProgress"></el-progress>
    </div>
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
            @mouseup.stop="
              'false';

            "
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
          <el-select
            v-model="form.href"
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
import { mapEdit, mapDetails } from "@/api/mapping";
import { RelicsList } from "@/api/entrycode";
export default {
  name: "EntryCode",
  components: {},
  computed: {},
  data() {
    return {
      headers: { Authorization: "Bearer " + getToken() },
      uploadLoading: "",
      enterpriseImage: "",
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
      loading: false,
      options: [],
      entrykey: "",
    };
  },

  activated() {},
  created() {
    let qiT = JSON.parse(sessionStorage.qiToken);
    this.qiToken.key = qiT.key;
    this.qiToken.token = qiT.token;
    this.getMapDetails();
  },
  methods: {
    //查看旅游导图详情
    getMapDetails() {
      mapDetails().then((res) => {
        this.enterpriseImage = res.data.info.map_img;
        this.entryObj = res.data.info.map_coordinate;
      });
    },
    //搜索词条
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
    //保存设置
    saveMapping() {
      let params = {
        map_img: this.enterpriseImage,
        map_coordinate: JSON.stringify(this.entryObj),
      };
      mapEdit(this.qs.stringify(params)).then((res) => {});
    },
    //设置锚点内容
    setTipData() {
      if (this.form.title == "" || this.form.href === "") {
        this.$message({
          type: "error",
          message: "请填写内容",
        });
        return false;
      }
      this.entryObj[this.tipIndex].title = this.form.title;
      this.entryObj[this.tipIndex].content = this.options[this.form.href];
      this.entryObj[this.tipIndex].href = `http://xs_j1_${
        this.options[this.form.href].id
      }`;
      this.dialogVisible = false;
      this.form.title = "";
      this.form.href = "";
      this.saveMapping();
    },
    //点击设置锚点内容弹窗唤起
    setTip(index) {
      if (!this.clickFlag) {
        this.dialogVisible = true;
        this.tipIndex = index;
        if (this.entryObj[index].href != "") {
          this.form.title = this.entryObj[index].title;
          this.options = [this.entryObj[index].content];
          this.form.href = 0;
        }
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
      if (this.lastTime - this.firstTime > 200) {
        this.clickFlag = true;
      }
      setTimeout(() => {
        this.clickFlag = false;
      }, 200);
      this.downFlag = false;
      if (this.clickFlag) {
        this.saveMapping();
      }
    },
    //鼠标离开被拖动元素
    mouseLeave(e, index) {
      this.downFlag = false;
    },
    //删除锚点
    closeTip(index) {
      this.entryObj.splice(index, 1);
      this.saveMapping();
      return false;
    },
    //点击提示用户添加锚点
    setEntryJump(e) {
      let x = e.offsetX,
        y = e.offsetY;
      this.entryObj.push({
        title: "点击编辑",
        content: "",
        href: "",
        x: x,
        y: y,
      });
      this.saveMapping();
    },
    beforeUpload(file) {
      let newTime = new Date().getTime();
      this.qiToken.key = `${this.qiToken.key}${newTime}.png`;
    },
    imageUploadSuccess(response, file, fileList) {
      let path = `http://voice.xunsheng.org.cn/${response.key}`;
      this.enterpriseImage = path;
      this.saveMapping();
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

  .setmapping {
    position: relative;
    width: 1000px;
    margin: auto;
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
