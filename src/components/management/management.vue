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
                @click="selectTab(index)"
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
              <div class="oneImg" v-for="(item, index) of 20" :key="index">
                <img
                  src="http://voice.xunsheng.org.cn/sydt/muse_12/1615270671150.png"
                  alt=""
                />
              </div>
            </template>
            <template v-if="type == 2">
              <div class="oneVideo" v-for="(item, index) of 20" :key="index">
                <video
                  controls
                  src="http://voice.xunsheng.org.cn/sydt/muse_12/1614663668981.mp4"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </el-dialog>
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
      default: 2,
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
    };
  },
  methods: {
    selectTab(n) {
      //   选择标签
      this.selectNum = n;
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
          width: 140px;
          height: 140px;
          margin: 10px 0 0 10px;
          overflow: hidden;
          video {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
.ativeTab {
  background: #f1f1f1;
}
</style>