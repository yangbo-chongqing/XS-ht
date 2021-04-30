<template>
  <div class="all">
    <el-dialog :title="title" :visible.sync="dialogTableVisible" width="770px">
      <!-- 整体弹窗 -->
      <div>
        <div class="topBtn">
          <el-button @click="addDetail(1)">新 增</el-button>
        </div>
        <div class="content">
          <div class="leftTit">
            <div class="centerFont">
              <div
                :class="{ titleFont: true, ativeTab: item.id == selectNum.id }"
                @click="selectTab(item, 1)"
                v-for="(item, index) of typeList"
                :key="index"
              >
                {{ item.name }}
                <span class="miniFont">({{ item.count }})</span>
              </div>
            </div>
            <div class="bottomFont">
              <span @click="addNewState(1)">新增分组</span>
              <el-dropdown @command="handleCommand">
                <span
                  class="el-dropdown-link"
                  style="color: #409eff; margin-left: 15px"
                >
                  编辑
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="delete">删除</el-dropdown-item>
                  <el-dropdown-item command="rename">重命名</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="rightContent">
            <template v-if="type == 1">
              <!-- 图片类型 -->
              <div
                @click="selectTab(index, 2, item)"
                class="oneImg"
                v-for="(item, index) of detailList"
                :key="index"
              >
                <img :src="item.file_path" alt="" />
                <div v-if="selectClass[index] == 1" class="shadow">
                  <img src="../../assets/icon/success.png" alt="" />
                </div>
              </div>
            </template>
            <template v-else-if="type == 2">
              <!-- 视频类型 -->
              <div
                class="oneVideo"
                v-for="(item, index) of detailList"
                :key="index"
              >
                <div class="videoCl" @click="selectTab(index, 2, item)">
                  <video style="width: 100%" :src="item.file_path" />
                  <div v-if="selectClass[index] == 1" class="shadow">
                    <img src="../../assets/icon/success.png" alt="" />
                  </div>
                  <span class="nameFloat">
                    {{ item.name }}
                    <!-- 111212121 -->
                  </span>
                </div>

                <div class="handleBtn">
                  <el-button type="mini" @click="videoUrl = item.file_path"
                    >播放</el-button
                  >
                  <el-button type="mini" @click="selectTab(index, 2, item)"
                    >选择</el-button
                  >
                </div>
              </div>
            </template>
            <template v-else>
              <div
                class="templateContent"
                v-for="(item, index) of detailList"
                :key="index"
              >
                <div class="imgBlock">
                  <img
                    style="width: 100%; max-height: 120px; object-fit: cover"
                    :src="JSON.parse(item.expand).parasm.image"
                    alt=""
                  />
                </div>
                <div class="contentBlock">
                  <div>{{ JSON.parse(item.expand).parasm.title }}</div>
                  <div v-if="JSON.parse(item.expand).parasm.jump_url">
                    {{ JSON.parse(item.expand).parasm.jump_url }}
                  </div>
                  <div v-if="JSON.parse(item.expand).parasm.summary">
                    {{ JSON.parse(item.expand).parasm.summary }}
                  </div>
                  <div v-if="JSON.parse(item.expand).parasm.source">
                    {{ JSON.parse(item.expand).parasm.source }}
                  </div>
                  <div v-if="JSON.parse(item.expand).parasm.sort">
                    {{ JSON.parse(item.expand).parasm.sort }}
                  </div>
                </div>
                <div class="editBlock">
                  <span @click="addDetail(3, JSON.parse(item.expand).parasm)"
                    >编辑</span
                  >
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <span style="float: left; color: #b1b2b3; font-size: 14px"
          >已选择{{ selectDetail.length }}/50</span
        >
        <el-button @click="Visible = false">取 消</el-button>
        <el-button type="primary" @click="addDetail(2)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="titleBar" :visible.sync="stateDialog" width="300px">
      <span>{{ titleName }}</span>
      <el-input
        placeholder="请输入"
        style="margin-top: 20px"
        v-model="newState"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addState">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择分类" :visible.sync="stateTit" width="250px">
      <el-select
        style="margin-top: 20px"
        v-model="stateNum"
        placeholder="请选择"
      >
        <el-option
          v-for="item in typeList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <div style="padding-top: 10px; color: #f56c6c">
        注：如不存入素材库，则不需选择分类
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stateTit = false">取 消</el-button>
        <el-button type="primary" @click="addDetail()">确 定</el-button>
      </span>
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
import {
  createType,
  TypeList,
  delType,
  editType,
  materList,
} from "@/api/myApi";
export default {
  name: "management",
  //   资源管理器
  props: {
    // 图片数据(图片url组成的数组) 通过v-model传递
    type: {
      type: Number,
      default: 999,
    },
    title: {
      tpye: String,
      default: "选择图片",
    },
    dialogTableVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      Visible: false,
      selectNum: {},
      videoUrl: "",
      selectClass: [],
      typeList: [],
      newState: "",
      stateDialog: false,
      titleName: "",
      titleBar: "",
      stateTit: false,
      stateNum: "",
      detailList: [],
      selectDetail: [],
    };
  },
  methods: {
    selectTab(n, type, item) {
      //   选择标签

      if (type == 1) {
        // 分类选择
        this.selectNum = n;
        this.selectClass = [];
        materList(
          this.qs.stringify({
            type: this.selectNum.id,
            page_size: 50,
            page: 1,
          })
        ).then((res) => {
          this.detailList = res.data.data.data;
        });
      } else if (type == 2) {
        // 视频选择
        if (this.selectClass[n]) {
          this.selectClass[n] = 0;
          let m = this.selectDetail.indexOf(item);
          this.selectDetail.splice(m, 1);
          console.log(this.selectDetail);
          console.log(0);
          console.log(this.selectClass);
          console.log(n);
        } else {
          this.selectClass[n] = 1;
          this.selectDetail = this.selectDetail.concat(item);
          console.log(item);
          console.log(this.selectDetail);
          console.log(this.selectClass);
          console.log(n);
        }
      }
      this.$forceUpdate();
    },
    handleCommand(command) {
      // 类型编辑
      if (command == "delete") {
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            if (this.selectNum == null) {
              this.$message({
                message: "请先选择删除项",
                type: "warning",
              });
              return;
            }
            delType(
              this.qs.stringify({
                id: this.selectNum.id,
              })
            ).then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "删除成功",
                  type: "success",
                });
                this.getStateList();
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      } else if (command == "rename") {
        this.addNewState(2);
      }
    },
    getStateList() {
      // 获取分类列表
      TypeList(
        this.qs.stringify({
          species: this.type,
        })
      ).then((res) => {
        this.typeList = res.data.type_list;
        this.selectNum = res.data.type_list[0];
        if (!this.typeList.length) {
          this.detailList = [];
          return;
        }
        materList(
          this.qs.stringify({
            type: this.selectNum.id,
            page_size: 50,
            page: 1,
          })
        ).then((res) => {
          this.detailList = res.data.data.data;
        });
      });
    },
    addNewState(index) {
      // 打开新增分类
      if (index == 1) {
        this.titleBar = "添加分类";
        this.titleName = "类型名";
        this.newState = "";
      } else {
        this.titleName = "类型名";
        this.titleBar = "分类重命名";
        this.newState = this.selectNum.name;
      }
      this.stateDialog = true;
    },
    addState() {
      if (this.titleBar == "添加分类") {
        // 创建分类
        let parasm = {
          name: this.newState,
          species: this.type,
        };
        createType(this.qs.stringify(parasm)).then((res) => {
          if (res.status == 200) {
            this.getStateList();
            this.stateDialog = false;
          }
        });
      } else if (this.titleBar == "分类重命名") {
        editType(
          this.qs.stringify({
            id: this.selectNum.id,
            species: this.selectNum.species,
            name: this.newState,
          })
        ).then((res) => {
          if (res.status == 200) {
            this.getStateList();
            this.stateDialog = false;
          }
        });
      }
    },
    addDetail(index, item) {
      if (this.type == 1 && index == 1) {
        // 新增图片或者视频
        this.stateTit = true;
      } else if (this.type == 2 && index == 1) {
        this.$emit("getClassify", [this.typeList]);
        this.stateTit = false;
        this.Visible = false;
      } else if (index == 2) {
        // 确认提交
        this.$emit("getEvent", [this.selectDetail, this.type]);
        // console.log(this.selectDetail, this.type);
        this.stateTit = false;
        this.Visible = false;
      } else if (index == 3) {
        this.$emit("getform", [item, this.type]);
        this.stateTit = false;
        this.Visible = false;
      } else {
        // 新增组合内容
        this.stateTit = false;
        this.$emit("addEvent", [this.title, this.type, this.stateNum]);
        this.Visible = false;
      }
      this.stateNum = "";
      this.selectDetail = [];
      this.selectNum = {};
      this.detailList = [];
      this.selectClass = [];
    },
  },
  created() {},
  updated() {
    this.Visible = this.dialogTableVisible;
  },
  watch: {
    Visible: function (newVal, oldVal) {
      this.$emit("event1", newVal);
      if (newVal) {
        this.getStateList();
      } else {
        this.detailList = [];
      }
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
          width: 140px;
          height: 140px;
          margin: 10px 0 0 10px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .shadow {
            position: absolute;
            bottom: -5px;
            right: -2px;
            transition: opacity 0.3s;
            color: #fff;
            font-size: 20px;
            line-height: 20px;
            padding: 2px;
            cursor: pointer;
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
            .nameFloat {
              bottom: 5px;
              left: 0px;
              position: absolute;
              z-index: 222;
              width: 100%;
              padding: 0.16rem 0.26667rem;
              background-color: rgba(0, 0, 0, 0.5);
              font-size: 16px;
              color: #ffffff;
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