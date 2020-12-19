<template>
  <div class="fun-code">
    <div class="back-box" @click="back">
      <i class="el-icon-arrow-left"></i> 返回列表
    </div>
    <div class="fun-table-body">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.sort" type="number" placeholder="值越小排序越靠前"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { postTypeCreate } from "@/api/entrycode";
import { getToken } from "@/utils/auth";
import { Loading } from "element-ui";
export default {
  name: "InstructionsCreate",
  data() {
    return {
      headers: { Authorization: "Bearer " + getToken() },
      form: {
        name: '',
        sort: 0,
      },
      dialogVisible: false,
      disabled: false,
      uploadLoading: "",
      options: [],
      list: [],
      loading: false,
    };
  },
  created() {},
  methods: {
    onSubmit() {
      if(!this.form.name){
        this.$message({
            message: '请填写分类名称',
            type: "error",
          });
          return false;
      }
      let loading = this.$loading({
        text: "保存中",
      });
      let params = {
        name: this.form.name,
        sort: this.form.sort,
      };
      postTypeCreate(this.qs.stringify(params)).then((res) => {
        loading.close();
        if (res.status == 200) {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.form.name = '';
          this.form.sort = 0;
        }
      });
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
  .el-select{
    display: block;
  }
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
</style>
