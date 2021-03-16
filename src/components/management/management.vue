<template>
  <div class="all">
    <el-dialog :title="title" :visible.sync="dialogTableVisible" width="770px">
      <div>
        <div class="topBtn"><el-button>新 增</el-button></div>
        <div class="content">
          <div class="leftTit">
            <div class="centerFont">
              <div
                :class="{ titleFont: true, ativeTab: index == selectNum }"
                @click="selectTab(index, 1)"
                v-for="(item, index) of 5"
                :key="index"
              >
                最近使用 <span class="miniFont">(51)</span>
              </div>
            </div>
            <div class="bottomFont">新建分组</div>
          </div>
          <div class="rightContent">
            <template v-if="type == 1">
              <!-- 图片类型 -->
              <div class="oneImg" v-for="(item, index) of 20" :key="index">
                <img
                  src="http://voice.xunsheng.org.cn/sydt/muse_12/1615270671150.png"
                  alt=""
                />
              </div>
            </template>
            <template v-if="type == 2">
              <!-- 视频类型 -->
              <div class="oneVideo" v-for="(item, index) of 20" :key="index">
                <div class="videoCl" @click="selectTab(index, 2)">
                  <video
                    style="width: 100%"
                    src="http://voice.xunsheng.org.cn/sydt/muse_12/1614663668981.mp4"
                  />
                  <div v-if="selectClass[index] == 1" class="shadow">
                    <img src="../../assets/icon/success.png" alt="" />
                  </div>
                </div>

                <div class="handleBtn">
                  <el-button
                    type="mini"
                    @click="
                      videoUrl =
                        'http://voice.xunsheng.org.cn/sydt/muse_12/1614663668981.mp4'
                    "
                    >播放</el-button
                  >
                  <el-button type="mini" @click="selectTab(index, 2)"
                    >选择</el-button
                  >
                </div>
              </div>
            </template>
            <template v-if="type == 3">
              <div
                class="templateContent"
                v-for="(item, index) of 10"
                :key="index"
              >
                <div class="imgBlock">
                  <img
                    style="width: 100%; max-height: 120px; object-fit: cover"
                    src="https://voice.xunsheng.org.cn/sydt/muse_12/1615884514205.png"
                    alt=""
                  />
                </div>
                <div class="contentBlock">
                  <div>古代书籍和桃花</div>
                  <div>http://www.baidu.com</div>
                  <div>http://www.baidu.com</div>
                  <div>古代书籍和桃花</div>

                  <div>百度</div>
                  <div>1</div>
                </div>
                <div class="editBlock">
                  <span>选择</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </el-dialog>
    <div v-if="videoUrl" class="videoIndex">
      <div class="el-image-viewer__mask"></div>
      <span
        class="el-image-viewer__btn el-image-viewer__close"
        @click="videoUrl = ''"
      >
        <i class="el-icon-close"></i>
      </span>
      <div class="videoOpen">
        <video controls :src="videoUrl" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "management",
  //   资源管理器
  props: {
    // 图片数据(图片url组成的数组) 通过v-model传递
    type: {
      type: Number,
      default: 3,
    },
    title: {
      tpye: String,
      default: "选择图片",
    },
  },
  data() {
    return {
      dialogTableVisible: true,
      selectNum: 0,
      videoUrl: "",
      selectClass: [],
    };
  },
  methods: {
    selectTab(n, type) {
      //   选择标签
      if (type == 1) {
        // 分类选择
        this.selectNum = n;
      } else if (type == 2) {
        // 视频选择
        if (this.selectClass[n]) {
          this.selectClass[n] = 0;
        } else {
          this.selectClass[n] = 1;
        }
      }
      this.$forceUpdate();
    },
  },
};
</script>
<style lang="scss" >
.all {
  width: 100%;
  .el-dialog__body {
    padding: 0 20px 30px 20px;
    .topBtn {
      text-align: right;
      margin-bottom: 5px;
    }
    .content {
      display: flex;
      .leftTit {
        width: 110px;
        height: 400px;
        // overflow: auto;
        // overflow-x: hidden;
        border-right: 1px solid #c5c5c5;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .centerFont {
          .titleFont {
            color: #1a1b1c;
            cursor: pointer;
            padding-left: 10px;
            line-height: 2.2em;

            margin-right: 5px;
            .miniFont {
              color: #b5b5b5;
            }
          }
        }
        .bottomFont {
          color: #409eff;
          cursor: pointer;
        }
      }
      .rightContent {
        // display: flex;
        // flex-wrap: wrap;
        width: 610px;
        height: 400px;
        overflow: auto;
        overflow-x: hidden;
        .oneImg {
          display: inline-block;
          width: 110px;
          height: 110px;
          margin: 10px 0 0 10px;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .oneVideo {
          display: inline-block;
          // width: 140px;
          // height: 140px;
          margin: 10px 0 0 10px;
          overflow: hidden;
          .videoCl {
            width: 190px;
            position: relative;
            .shadow {
              position: absolute;
              bottom: -1px;
              right: -2px;
              transition: opacity 0.3s;
              color: #fff;
              font-size: 20px;
              line-height: 20px;
              padding: 2px;
              cursor: pointer;
            }
          }
          .handleBtn {
            text-align: right;
          }
        }
        .templateContent {
          display: flex;
          border-bottom: 1px solid #c5c5c5;
          margin-left: 20px;
          padding-top: 10px;

          .imgBlock {
            width: 120px;
            // display: inline-block;
            align-items: center;
            display: flex;
            padding-bottom: 10px;
          }
          .contentBlock {
            // display: inline-block;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            padding-left: 20px;
            padding-bottom: 10px;
          }
          .editBlock {
            // display: inline-block;
            text-align: right;
            padding-bottom: 10px;
            color: #409eff;
            align-items: center;
            display: flex;
            margin-left: auto;
            margin-right: 10px;
            // flex: 1;
            cursor: pointer;
          }
        }
      }
    }
  }
  .videoIndex {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9999;
    .el-image-viewer__mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0.5;
      background: #000;
    }
    .el-image-viewer__close {
      top: 40px;
      right: 40px;
      width: 40px;
      height: 40px;
      font-size: 24px;
      color: #fff;
      background-color: #606266;
    }

    .el-image-viewer__btn {
      position: absolute;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      opacity: 0.8;
      cursor: pointer;
      box-sizing: border-box;
      user-select: none;
    }
    .videoOpen {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      video {
        transform: scale(1) rotate(0deg);
        margin-left: 0px;
        margin-top: 0px;
        max-height: 100%;
        max-width: 100%;
      }
    }
  }
}

.ativeTab {
  background: #f1f1f1;
}
</style>