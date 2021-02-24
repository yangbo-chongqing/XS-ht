<template>
  <div class="AccountInfo-container">
    <div class="AccountInfo-text">账户信息</div>
    <el-row :gutter="20">
      <el-col :span="24"
        ><div class="AccountInfo-item">
          <label>昵称:</label>
          <span v-if="!isShowUserName">{{ userinfo.user_info.nickname }}</span>
          <el-input
            v-else
            v-model="userinfo.user_info.nickname"
            size="small"
            placeholder="请输入昵称"
          />
          <span>
            <el-link
              v-if="!isShowUserName"
              type="primary"
              @click="isShowUserName = true"
              >修改昵称</el-link
            >
            <el-link
              v-else
              type="primary"
              @click="
                accountSettings({ nickname: userinfo.user_info.nickname })
              "
              >保存</el-link
            >
          </span>
        </div></el-col
      >
      <el-col :span="24"
        ><div class="AccountInfo-item">
          <label>用户账号:</label>
          <span v-if="!isShowUserTel">{{ userinfo.user_info.mobile }}</span>
          <el-input
            v-else
            v-model="userinfo.user_info.mobile"
            size="small"
            placeholder="请输入手机号"
          />
          <span>
            <el-link
              v-if="!isShowUserTel"
              type="primary"
              @click="isShowUserTel = true"
              >更换手机号</el-link
            >
            <el-link
              v-else
              type="primary"
              @click="accountSettings({ mobile: userinfo.user_info.mobile })"
              >保存</el-link
            >
          </span>
        </div></el-col
      >
      <el-col :span="24"
        ><div class="AccountInfo-item">
          <label>企业信息:</label> <span>{{ enterpriseInfo.muse_name }}</span>
          <span
            ><el-link type="primary" @click="golinkpage('/settings')"
              >修改</el-link
            ></span
          >
          <!-- <span><el-link type="primary">企业认证</el-link></span> -->
        </div></el-col
      >
      <el-col :span="24"
        ><div class="AccountInfo-item">
          <label>用户密码:</label>
          <!-- <span>*******</span> -->
          <span class="aFont" @click="dialogVisible = true">修改</span>
        </div></el-col
      >
      <el-col :span="24"
        ><div class="AccountInfo-item">
          <label>店铺上架:</label>
          <span
            ><el-switch
              @change="chaangeUP"
              :active-value="2"
              :inactive-value="3"
              v-model="upOrDown"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch
          ></span></div
      ></el-col>
    </el-row>
    <el-dialog
      title="密码修改"
      :visible.sync="dialogVisible"
      width="330px"
      :before-close="closeEdit"
    >
      <div
        style="
          display: block;
          font-size: 14px;
          color: #333;
          line-height: 18px;
          padding-bottom: 10px;
        "
      >
        新密码：
      </div>
      <div>
        <el-input
          placeholder="请输入密码"
          v-model="inputPsd"
          style="width: 100%"
          show-password
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEdit">取 消</el-button>
        <el-button type="primary" @click="edPsd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { postAccountSettings } from "@/api/user";
import Bus from "../bus.js";
import { getGetMuse, changeAdmin, edPD } from "@/api/settings";
import { mapGetters } from "vuex";
export default {
  name: "AccountInfo",
  data() {
    return {
      enterpriseInfo: "",
      isShowUserTel: false,
      isShowUserName: false,
      upOrDown: "",
      dialogVisible: false,
      inputPsd: "",
    };
  },
  computed: {
    ...mapGetters(["userinfo"]),
  },
  created() {
    this.GetMuse();
  },
  methods: {
    edPsd() {
      edPD(this.qs.stringify({ password: this.inputPsd })).then((res) => {
        if (res.status == 200) {
          this.$message({
            message: res.msg,
            type: "success",
          });
        }
      });
      this.dialogVisible = false;
      this.inputPsd = "";
    },
    closeEdit() {
      this.inputPsd = "";
      this.dialogVisible = false;
    },
    chaangeUP(val) {
      changeAdmin(this.qs.stringify({ state: val })).then((res) => {
        console.log(res);
      });
    },
    GetMuse() {
      getGetMuse().then((res) => {
        this.enterpriseInfo = res.data.muse_info;
        this.upOrDown = res.data.muse_info.state;
        Bus.$emit("getisshow", this.enterpriseInfo);
      });
    },
    // 修改用户信息
    accountSettings(obj) {
      const params = {
        ...obj,
      };
      const loading = this.$loading({
        text: "修改中",
      });
      postAccountSettings(this.qs.stringify(params)).then((res) => {
        loading.close();
        this.isShowUserName = false;
        this.isShowUserName = false;
      });
    },
    golinkpage(page, obj) {
      this.$router.push({
        path: page,
        query: {
          ...obj,
        },
      });
    },
  },
};
</script>
<style lang="scss">
.AccountInfo-container {
  .el-input {
    width: auto;
  }
}
</style>
<style lang="scss" scoped>
.AccountInfo-container {
  padding: 20px;
  height: 260px;
  box-sizing: border-box;
  border: 1px solid #f5f5f5;
  box-shadow: 0px 0px 10px #f5f5f5;
  .AccountInfo-text {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .AccountInfo-item {
    margin: 10px 0;
    label {
      font-size: 14px;
    }
    span {
      margin: 0 10px;
      font-size: 13px;
      color: #999;
    }
  }
}
.aFont {
  color: #409eff !important;
  font-weight: 400;
  cursor: pointer;
}
</style>
