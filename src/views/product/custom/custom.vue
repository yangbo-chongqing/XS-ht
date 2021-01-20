<template>
  <div class="fun-code">
    <div class="back-box" @click="back">
      <i class="el-icon-arrow-left"></i> 返回列表
    </div>
    <div class="fun-table-body">
      <el-form ref="form" :model="form" label-width="80px">
        <!-- <div v-if="addList.length < 1">
          <img
            src="http://voice.xunsheng.org.cn/sydt/muse_12/1611020991059.png"
            alt=""
          />
          <span>暂无数据</span>
        </div> -->
        <template v-for="(item, index) of addList">
          <el-form-item :label="item.name" :key="index">
            <el-upload
              v-if="item.type == 3"
              class="upload-demo"
              :before-upload="uploadPic"
              :data="qiToken"
              action="http://upload.qiniup.com"
              :headers="headers"
              :on-success="imageUploadSuccess"
              accept=".jpg,.png"
              :show-file-list="false"
              :on-change="uploadProgress"
            >
              <el-button size="small" type="primary"
                >图片<i class="el-icon-upload el-icon--right"
              /></el-button>
            </el-upload>
            <el-input
              v-if="item.type == 1"
              v-model="inputVal[index]"
            ></el-input>
            <el-upload
              v-if="item.type == 2"
              class="upload-demo"
              action="http://upload.qiniup.com"
              :data="qiToken"
              :before-upload="uploadVideo"
              :headers="headers"
              accept=".MPEG,.baiAVI,.nAVI,.ASF,.MOV,.3GP,.mp4"
              :show-file-list="false"
              :on-success="videoUploadSuccess"
              :on-change="uploadProgress"
            >
              <el-button size="small" type="primary"
                >视频<i class="el-icon-upload el-icon--right"
              /></el-button>
            </el-upload>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-popover
            style="margin-left: 20px"
            placement="bottom"
            width="220"
            v-model="visible"
          >
            <div>
              名称:
              <el-input
                class="block"
                size="mini"
                v-model="form1.name"
              ></el-input>
            </div>
            <div>
              类型:
              <el-select
                v-model="form1.type"
                size="mini"
                class="block"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) of options"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="closeEle"
                >取消</el-button
              >
              <el-button type="primary" size="mini" @click="addEle"
                >确定</el-button
              >
            </div>
            <el-button slot="reference">增加自定义</el-button>
          </el-popover>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { productCreate, expandList, expandCreate } from "@/api/product";
import { getToken } from "@/utils/auth";
import { Loading } from "element-ui";
export default {
  name: "ProductCreate",
  data() {
    return {
      headers: { Authorization: "Bearer " + getToken() },
      form: {
        name: "",
        unique: "",
        dialogImageUrl: "",
        factory: "",
        listed: "",
      },
      dialogVisible: false,
      disabled: false,
      uploadLoading: "",
      visible: false,
      inputVal: [],
      addList: [],
      form1: {
        name: "",
        type: 1,
      },
      options: [
        { label: "文本", value: 1 },
        { label: "视频", value: 2 },
        { label: "图片", value: 3 },
      ],
    };
  },
  created() {
    this.geList();
  },
  methods: {
    onSubmit() {},
    closeEle() {
      this.visible = false;
      this.form1 = {
        name: "",
        type: 1,
      };
    },
    geList() {
      // 获取扩展字段列表
      expandList().then((res) => {});
    },
    addEle() {
      if (!this.form1.name) {
        this.$message.error("请先完善数据");
        return;
      }
      let params = {
        field_name: this.form1.name,
        field_type: this.form1.type,
      };
      expandCreate(this.qs.stringify(params)).then((res) => {
        this.geList();
      });
      this.addList.push(this.form1);
      console.log(this.addList);
      this.form1 = {
        name: "",
        type: 1,
      };
      this.visible = false;
    },
    back() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
.fun-code {
  background: white;
  .back-box {
    padding: 10px;
    box-sizing: border-box;
    color: #999;
    cursor: pointer;
  }
  .upload-box {
    width: 70px;
    height: 70px;
    display: flex;
    border: 1px solid #ccc;
    position: relative;
    span {
      position: absolute;
      top: 0;
      right: 0;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #999;
      display: flex;
      cursor: pointer;
      i {
        font-size: 15px;
        margin: auto;
        color: white;
      }
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    i {
      color: #ccc;
      margin: auto;
      font-size: 30px;
    }
  }
  .fun-table-body {
    width: 500px;
    margin: auto;
    padding: 20px;
    box-sizing: border-box;
  }
  .fun-code-head {
    border-bottom: 1px solid #f5f5f5;
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
    box-sizing: border-box;
  }
}
.block {
  display: inline-block;
  width: 150px;
  margin-bottom: 10px;
}
</style>
