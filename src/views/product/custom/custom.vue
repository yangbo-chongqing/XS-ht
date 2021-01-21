<template>
  <div class="fun-code">
    <div class="back-box" @click="back">
      <i class="el-icon-arrow-left"></i> 返回列表
    </div>
    <el-button
      style="margin-left: 20px; margin-top: 10px"
      type="primary"
      slot="reference"
      @click="addMe"
      >增加自定义</el-button
    >
    <el-dialog title="添加自定义字段" :visible.sync="visible" width="300px">
      <div class="fontClass">
        名称：
        <el-input style="width: 180px" v-model="form1.field_name"></el-input>
      </div>
      <div class="fontClass">
        类型：
        <el-select
          style="width: 180px"
          v-model="form1.field_type"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) of options"
            :key="index"
            :label="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="closeEle">取消</el-button>
        <el-button type="primary" @click="addEle">确定</el-button>
      </span>
    </el-dialog>
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
          <el-form-item class="addItem" :key="index">
            <!-- <el-input
              style="width: 220px"
              v-if="isEditFlag == 1"
              v-model="item.field_name"
              @blur="saveEditEditMuse(item)"
            /> -->
            <el-input
              v-model="item.field_name"
              v-if="showId == index"
              style="width: 160px"
              @blur="save(item)"
            ></el-input>
            <p
              v-else
              class="pDis"
              style="text-align: right; margin-right: 10px"
            >
              {{ item.field_name }}
            </p>
            <i
              class="el-icon-edit disBlock"
              @click="updateTit(index, 'left')"
            ></i>
            ：

            <el-select
              style="width: 180px"
              v-if="showValue == index"
              v-model="item.field_type"
              @change="save(item)"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) of options"
                :key="index"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
            <span class="pDis" v-else> {{ item.field_type }}类型 </span>
            <i
              class="el-icon-edit disBlock"
              style="margin-right: 10px"
              @click="updateTit(index, 'right')"
            ></i>

            <i @click="delet(item)" class="el-icon-delete disBlock"></i>
          </el-form-item>
        </template>
        <el-form-item>
          <!-- <el-button type="primary" @click="onSubmit">确认修改</el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  productCreate,
  expandList,
  expandCreate,
  expandDel,
  expandEdit,
} from "@/api/product";
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
      showId: "d3232",
      showValue: "dsadasd",
      inputVal: [],
      addList: [],
      form1: {
        field_name: "",
        field_type: "文本",
      },
      options: [
        { label: "文本" },
        { label: "视频" },
        { label: "图片" },
        { label: "富文本" },
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
        field_name: "",
        field_type: "文本",
      };
    },
    save(a) {
      let params = {
        field_name: a.field_name,
        field_type: a.field_type,
        id: a.id,
      };
      expandEdit(this.qs.stringify(params)).then((res) => {
        this.geList();
        // 重定义，只要非空就行
        this.showId = "d3232";
        this.showValue = "dsadasd";
      });
    },
    addMe() {
      this.visible = true;
    },
    updateTit(index, Tit) {
      // 修改字段名或值
      if (Tit == "left") {
        this.showId = index;
      } else {
        this.showValue = index;
      }
    },
    geList() {
      // 获取扩展字段列表
      expandList().then((res) => {
        this.addList = res.data.list.data;
        console.log(this.addList);
      });
    },
    delet(n) {
      // 删除该条数据
      expandDel(this.qs.stringify({ id: n.id })).then((res) => {
        if (res) {
          if (res.status == 200) {
            this.$message({
              message: res.message,
              type: "success",
            });
            this.geList();
          }
        }
        // 重定义，只要非空就行
        this.showId = "d3232";
        this.showValue = "dsadasd";
      });
    },
    addEle() {
      if (!this.form1.field_name) {
        this.$message.error("请先完善数据");
        return;
      }
      let params = {
        field_name: this.form1.field_name,
        field_type: this.form1.field_type,
      };
      expandCreate(this.qs.stringify(params)).then((res) => {
        this.geList();
      });
      this.addList.push(this.form1);
      console.log(this.addList);
      this.form1 = {
        field_name: "",
        field_type: "文本",
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
    width: 600px;
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
.fontClass {
  font-size: 16px;
  margin-bottom: 10px;
}
.pDis {
  display: inline-block;
  font-size: 17px;
  font-weight: 500;
  width: 120px;
}
.disBlock {
  display: none;
}
.addItem {
  cursor: pointer;
}
.addItem :hover .disBlock {
  display: inline-block;
}
</style>
