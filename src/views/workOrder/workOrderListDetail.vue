<template>
  <div class="body">
    <div class="top">
      <div class="topFont">
        <span class="leftError">问题：{{ question.title }}</span>
        <span class="rightStatus" v-if="question.state == 0"
          >状态：<span class="noup">未回复</span>
        </span>
        <span class="rightStatus" v-if="question.state == 1"
          ><span class="okup">已回复</span>
        </span>
        <span class="rightStatus" v-if="question.state == 2"
          ><span class="closeup">已解决</span>
        </span>
      </div>
    </div>
    <div class="centerbody">
      <div class="content">
        <!-- <div class="contentDetail">
          <div class="leftCon">
            <div class="contentTit">{{ contentList[0].create_time }} 客户</div>
            <div class="leftContent">
              <el-image
                v-for="(item, index) of contentList[0].image"
                :key="index"
                style="width: 180px; height: 170px; margin-right: 10px"
                :src="item"
                :preview-src-list="[item]"
              >
              </el-image>
            </div>
          </div>
        </div> -->
        <div class="contentDetail">
          <div class="leftCon">
            <div class="contentTit">{{ contentList[0].create_time }} 客户</div>
            <div class="leftContent">
              <el-image
                v-for="(item, index) of contentList[0].image"
                :key="index"
                style="width: 180px; height: 170px; margin-right: 10px"
                fit="cover"
                :src="item"
                :preview-src-list="contentList[0].image"
              >
              </el-image>
              <p>产品名称：{{ question.product_name }}</p>
              <p>车架号：{{ question.frame_number }}</p>
              <p>产品编号：{{ question.product_number }}</p>
              <p>产品类型：{{ question.problem_type }}</p>
              <p>问题描述：{{ question.problem_content }}</p>
              <p>手机号：{{ question.phone }}</p>
            </div>
          </div>
        </div>
        <div
          class="contentDetail"
          v-for="(item, index) of contentList"
          :key="index"
        >
          <div class="leftCon" v-if="item.type == 0 && index != 0">
            <div class="contentTit">{{ item.create_time }} 客户</div>
            <div class="rightContent" v-if="item.content || item.image.length">
              {{ item.content }}
            </div>
            <div v-if="item.image.length">
              <el-image
                style="width: 180px; height: 170px; margin-right: 10px"
                fit="cover"
                :src="item.image[0]"
                :preview-src-list="item.image[0]"
              >
              </el-image>
            </div>
            <div v-if="index + 1 == contentList.length" id="bottom"></div>
          </div>
          <div class="rightCon" v-if="item.type == 1 && index != 0">
            <div class="contentTit" v-if="item.content || item.image.length">
              {{ item.create_time }} 客服
            </div>
            <div v-if="item.image.length">
              <el-image
                style="width: 180px; height: 170px; margin-right: 10px"
                fit="cover"
                :src="item.image[0]"
                :preview-src-list="item.image[0]"
              >
              </el-image>
            </div>
            <div v-if="item.content" class="rightContent">
              {{ item.content }}
            </div>
            <div v-if="index + 1 == contentList.length" id="bottom"></div>
          </div>
        </div>
      </div>
      <div class="bottomInput">
        <div class="picIcon">
          <el-upload
            class="upload-demo"
            :data="qiToken"
            action="http://upload.qiniup.com"
            :headers="headers"
            accept=".jpg,.png"
            :on-error="uploadToken"
            :before-upload="uploadPic"
            :on-success="imageUploadSuccess.bind(null, {})"
            :show-file-list="false"
          >
            <i class="el-icon-picture"></i>
          </el-upload>
        </div>
        <div class="send-box">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            class="resizeNone"
            v-model="textarea"
            @keyup.enter.native="add()"
          >
          </el-input>
        </div>
        <div style="text-align: right">
          <el-button
            type="primary"
            style="margin: 8px 5px 0 0"
            size="mini"
            @click="add()"
            >发 送</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getQiToken } from "@/api/user";
import { getToken } from "@/utils/auth";
import { workorderDetails, workorderReply } from "@/api/myApi";
export default {
  data() {
    return {
      headers: { Authorization: "Bearer " + getToken() },
      textarea: "",
      qiToken: {},
      id: this.$route.query.id,
      contentList: [],
      question: {},
    };
  },
  methods: {
    add() {
      let parasm = {
        workorder_id: this.id,
        content: this.textarea,
      };
      workorderReply(this.qs.stringify(parasm)).then((res) => {
        this.getDetail();
      });
      this.textarea = "";
      document.getElementById("bottom").scrollIntoView();
    },
    imageUploadSuccess(obj, res, file) {
      // 图片上传成功
      let img = `http://voice.xunsheng.org.cn/${res.key}`;
      let parasm = {
        workorder_id: this.id,
        content: this.textarea,
        image: JSON.stringify([img]),
      };
      workorderReply(this.qs.stringify(parasm)).then((res) => {
        this.getDetail();
      });
      this.qiToken = JSON.parse(sessionStorage.qiToken);
    },
    uploadToken(err, file, fileList) {
      console.log(err);
      getQiToken({}).then((res) => {
        let str = res.data.data;
        str.token = JSON.parse(JSON.stringify(str.upToken));
        str.key = JSON.parse(JSON.stringify(str.path));
        delete str.path;
        delete str.upToken;
        sessionStorage.setItem("qiToken", JSON.stringify(str));
      });
      this.qiToken = JSON.parse(sessionStorage.qiToken);
      this.$message.error("Token失效，请重新上传");
    },
    uploadPic(file) {
      let newTime = new Date().getTime();
      this.qiToken.key = `${this.qiToken.key}${newTime}.png`;
    },
    getDetail() {
      let params = {
        workorder_id: this.id,
      };
      workorderDetails(this.qs.stringify(params)).then((res) => {
        this.question = res.data.info;
        this.contentList = res.data.list.data;
      });
    },
  },
  created() {
    this.qiToken = JSON.parse(sessionStorage.qiToken);
    this.getDetail();
  },
};
</script>
<style lang="scss" scoped>
.body {
  width: 800px;
  height: 660px;
  margin: 0 auto;
  .top {
    width: 100%;
    height: 60px;
    background-color: #f1e9e9;
    .topFont {
      box-sizing: border-box;
      margin-left: 10px;
      color: #343036;
      display: flex;
      justify-content: space-between;
      .leftError {
        padding-right: 60px;
        line-height: 60px;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .rightStatus {
        padding-right: 10px;
        line-height: 60px;
        .noup {
          color: #eb5648;
        }
        .okup {
          color: #4caf50;
        }
        .closeup {
          color: #a79999;
        }
      }
    }
  }
  .centerbody {
    position: relative;
    border-top: 1px solid #e7e7e7;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #fff;
    padding: 5px;
    .content {
      position: relative;
      user-select: text;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 100%;
      height: 460px;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 20px;
      background-color: #fff;
      .contentDetail {
        .leftCon {
          float: left;
          width: 420px;
          .contentTit {
            font-size: 14px;
            padding-left: 10px;
            color: #a1a6af;
            padding-bottom: 5px;
          }
          .leftContent {
            // min-width: 160px;
            max-width: 420px;
            float: left;
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 5px;
            text-align: justify;
            word-break: break-all;
            border: 1px solid #2f2f2f;
            &::after {
              clear: both;
              content: " ";
            }
          }
          &::after {
            display: table;
            content: " ";
          }
        }
        .rightCon {
          width: 420px;
          float: right;
          text-align: right;
          .contentTit {
            font-size: 14px;
            padding-right: 10px;
            text-align: right;
            color: #a1a6af;
            padding-bottom: 5px;
          }
          .rightContent {
            margin-bottom: 10px;
            text-align: justify;
            float: right;
            padding: 10px;
            border-radius: 5px;
            word-break: break-all;
            // min-width: 160px;
            max-width: 420px;
            border: 1px solid #2f2f2f;
            &::after {
              clear: both;
              content: "";
            }
          }
          &::after {
            clear: both;
            content: "";
          }
        }
      }
    }
    .bottomInput {
      box-sizing: border-box;
      position: relative;
      width: 100%;
      //   padding-bottom: 10px;
      background-color: #fff;
      border-top: 1px solid #e7e7e7;
      .picIcon {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        height: 32px;
        margin-bottom: 5px;
        padding-top: 12px;
        padding-left: 20px;
        width: 100%;
        .el-icon-picture {
          font-size: 22px;
          cursor: pointer;
          &:hover {
            color: #409fff;
          }
        }
      }
      .send-box {
        box-sizing: border-box;
        margin-top: 10px;
        width: 100%;
      }
    }
  }
}
</style>
<style lang="scss" >
.resizeNone {
  .el-textarea__inner {
    //el_input中的隐藏属性 取消文本域可拖动大小
    resize: none !important; //主要是这个样式
  }
}
</style>