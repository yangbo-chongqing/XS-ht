<template>
  <div class="fun-code">
    <div class="back-box" @click="back">
      <i class="el-icon-arrow-left"></i> 返回列表
    </div>
    <div class="fun-table-body">
      <el-form ref="form" :model="form" label-width="90px">
        <el-form-item label="流水号">
          <el-input v-model="form.pkid"></el-input>
        </el-form-item>
        <!-- <el-form-item label="颜色">
          <el-input v-model="form.colour"></el-input>
        </el-form-item>
        <el-form-item label="发动机号">
          <el-input v-model="form.engine"></el-input>
        </el-form-item> -->
        <el-form-item label="车架号">
          <el-input v-model="form.clsbdh"></el-input>
        </el-form-item>
        <el-form-item label="合格编号">
          <el-input v-model="form.certificate_id"></el-input>
        </el-form-item>
        <!-- <el-form-item label="合格证证芯">
          <el-input v-model="form.certificate_core"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { floWingCreate } from "@/api/product";
export default {
  name: "ProductCreate",
  data() {
    return {
      id: this.$route.query.id,
      form: {
        pkid: "",
        colour: "",
        engine: "",
        certificate_id: "",
        certificate_core: "",
      },
    };
  },
  created() {},
  methods: {
    onSubmit() {
      let loading = this.$loading({
        text: "保存中",
      });
      let params = {
        product_id: this.id,
        pkid: this.form.pkid,
        colour: this.form.colour,
        engine: this.form.engine,
        certificate_id: this.form.certificate_id,
        clsbdh: this.form.clsbdh,
        certificate_core: this.form.certificate_core,
      };
      floWingCreate(this.qs.stringify(params)).then((res) => {
        loading.close();
        if (res.status == 200) {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.form.pkid = "";
          this.form.colour = "";
          this.form.engine = "";
          this.form.clsbdh = "";
          this.form.certificate_id = "";
          this.form.certificate_core = "";
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
