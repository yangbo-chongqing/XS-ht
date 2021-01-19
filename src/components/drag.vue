/**
 * 图片上传 公共组件
 */
<template>
  <div class="uploadWrapper">
    <vuedraggable
      class="vue-draggable"
      :class="{ single: isSingle, maxHidden: isMaxHidden }"
      v-model="imgList"
      tag="ul"
      draggable=".draggable-item"
      @start="onDragStart"
      @end="onDragEnd"
    >
      <!-- 拖拽元素 -->
      <li
        v-for="(item, index) in imgList"
        :key="item + index"
        class="draggable-item"
        :style="{ width: width + 'px', height: height + 'px' }"
      >
        <el-image :src="item" :preview-src-list="[item]"></el-image>
        <div class="shadow" @click="onRemoveHandler(index)">
          <i class="el-icon-delete"></i>
        </div>
      </li>
      <!-- 上传按钮 -->
      <el-upload
        slot="footer"
        ref="uploadRef"
        :class="{ uploadBox: play == 1 }"
        :style="{ width: width + 'px', height: height + 'px' }"
        :data="qiToken"
        action="http://upload.qiniup.com"
        :headers="headers"
        accept=".jpg,.jpeg,.png,.gif"
        :show-file-list="false"
        :multiple="!isSingle"
        :limit="limit"
        :before-upload="beforeUpload"
        :on-change="uploadProgress"
        :on-success="onSuccessUpload"
        :on-exceed="onExceed"
      >
        <i v-show="play == 1" class="el-icon-plus uploadIcon">
          <span class="uploading" v-show="isUploading">正在上传...</span>
          <span
            v-if="!isUploading && limit && limit !== 99 && !isSingle"
            class="limitTxt"
            >最多{{ limit }}张</span
          >
        </i>
      </el-upload>
    </vuedraggable>
    <el-progress v-if="progressFlag" :percentage="loadProgress"></el-progress>
  </div>
</template>

<script>
import vuedraggable from "vuedraggable";
import { getToken } from "@/utils/auth";
// import { validImgUpload } from "@/utils/validate";

export default {
  name: "ImgUpload",

  props: {
    // 图片数据(图片url组成的数组) 通过v-model传递
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    play: {
      type: String,
      default: "2",
    },
    // 限制上传的图片数量
    limit: {
      type: Number,
      default: 99,
    },
    // 限制上传图片的文件大小(kb)
    size: {
      type: Number,
      default: 500,
    },
    // 是否是单图上传(单图上传就是已传图片和上传按钮重叠)
    isSingle: {
      type: Boolean,
      default: false,
    },
    // 是否使用图片压缩
    useCompress: {
      type: Boolean,
      default: false,
    },
    // 图片显示的宽度(px)
    width: {
      type: Number,
      default: 100,
    },
    // 图片显示的高度(px)
    height: {
      type: Number,
      default: 100,
    },
    picList: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  data() {
    return {
      headers: { Authorization: "Bearer " + getToken() },
      isUploading: false, // 正在上传状态
      isFirstMount: true, // 控制防止重复回显
      qiToken: {},
      loadProgress: 0, // 动态显示进度条
      progressFlag: false, // 关闭进度条
    };
  },

  computed: {
    // 图片数组数据
    imgList: {
      get() {
        return this.value;
      },
      set(val) {
        if (val.length < this.imgList.length) {
          // 判断是删除图片时同步el-upload数据
          this.syncElUpload(val);
        }
        // 同步v-model
        this.$emit("input", val);
      },
    },
    // 控制达到最大限制时隐藏上传按钮
    isMaxHidden() {
      return this.imgList.length >= this.limit;
    },
  },

  watch: {
    value: {
      handler(val) {
        if (this.isFirstMount && this.value.length > 0) {
          this.syncElUpload();
        }
      },
      deep: true,
    },
    picList(val, oldVal) {
      if (val.length == 0) {
        this.imgList.splice(0, this.imgList.length);
      } else {
        this.imgList.splice(0, this.imgList.length);
        for (let i = 0; i < val.length; i++) {
          this.imgList.push(val[i]);
        }
      }
      console.log(val);
      this.$emit("chilX", this.imgList);
      this.$emit("childFn", { url: this.imgList, play: this.play });
    },
  },

  mounted() {
    if (this.value.length > 0) {
      this.syncElUpload();
    }
  },

  methods: {
    // 同步el-upload数据
    syncElUpload(val) {
      const imgList = val || this.imgList;
      this.$refs.uploadRef.uploadFiles = imgList.map((v, i) => {
        return {
          name: "pic" + i,
          url: v,
          status: "success",
        };
      });
      this.isFirstMount = false;
    },
    // 上传图片之前
    beforeUpload(file) {
      let newTime = new Date().getTime();
      this.qiToken.key = `${this.qiToken.key}${newTime}.png`;
      this.isFirstMount = false;
    },
    // 上传完单张图片
    onSuccessUpload(res, file, fileList) {
      // 这里需要根据你自己的接口返回数据格式和层级来自行修改
      if (res.key) {
        // 判断接口上传成功
        if (this.imgList.length < this.limit) {
          // 未超限时，把接口返回的图片url地址添加到imgList
          this.imgList.push(`https://voice.xunsheng.org.cn/${res.key}`);
        }
      } else {
        // 判断接口上传失败
        this.syncElUpload();
        this.$message({ type: "error", message: res.msg });
      }
      this.isUploading = false;
      this.qiToken = JSON.parse(sessionStorage.qiToken);
      this.$emit("childFn", { url: this.imgList, play: this.play });
    },
    // 移除单张图片
    onRemoveHandler(index) {
      this.$confirm("确定删除该图片?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$emit("deleOne", this.imgList[index]);
          this.imgList.splice(index, 1);
          // this.$emit("chilX", this.imgList);
          // this.$emit("childFn", { url: this.imgList, play: this.play });
          console.log(this.imgList);
        })
        .catch(() => {});
    },
    // 超限
    onExceed() {
      this.$refs.uploadRef.abort(); // 取消剩余接口请求
      this.syncElUpload();
      this.$message({
        type: "warning",
        message: `图片超限，最多可上传${this.limit}张图片`,
      });
    },
    onDragStart(e) {
      e.target.classList.add("hideShadow");
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
    onDragEnd(e) {
      e.target.classList.remove("hideShadow");
      let old = this.imgList[e.oldIndex];
      this.imgList.splice(e.oldIndex, 1, this.imgList[e.newIndex]);
      this.imgList.splice(e.newIndex, 1, old);
      this.$emit("chilX", this.imgList);
    },
  },
  created() {
    this.qiToken = JSON.parse(sessionStorage.qiToken);
  },

  components: { vuedraggable },
};
</script>

<style lang="scss" scoped>
.el-upload {
  width: 100%;
  height: 100%;
}

// 上传按钮
.uploadIcon {
  width: 100px;
  height: 100px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #c0ccda;
  background-color: #fbfdff;
  border-radius: 6px;
  font-size: 20px;
  color: #999;

  .limitTxt,
  .uploading {
    position: absolute;
    bottom: 10%;
    left: 0;
    width: 100%;
    font-size: 14px;
    text-align: center;
  }
}

// 拖拽
.vue-draggable {
  display: flex;
  flex-wrap: wrap;

  .draggable-item {
    margin-right: 5px;
    margin-bottom: 5px;
    border: 1px solid #ddd;
    border-radius: 6px;
    position: relative;
    overflow: hidden;

    .el-image {
      width: 100%;
      height: 100%;
    }
    .shadow {
      position: absolute;
      top: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: opacity 0.3s;
      color: #fff;
      font-size: 20px;
      line-height: 20px;
      padding: 2px;
      cursor: pointer;
    }
    &:hover {
      .shadow {
        opacity: 1;
      }
    }
  }
  &.hideShadow {
    .shadow {
      display: none;
    }
  }
  &.single {
    overflow: hidden;
    position: relative;

    .draggable-item {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
    }
  }
  &.maxHidden {
    .uploadBox {
      border: 1px solid #ddd;
      border-radius: 6px;
      text-align: center;
      width: 100%;
    }
  }
}
// el-image
.el-image-viewer__wrapper {
  .el-image-viewer__mask {
    opacity: 0.8;
  }
  .el-icon-circle-close {
    color: #fff;
  }
}
// .uploadBox {
//   border: 1px solid #ddd;
//   border-radius: 6px;
//   text-align: center;
//   width: 100%;
//   cursor: pointer;
//   line-height: 100px;
//   vertical-align: top;
// }
</style>