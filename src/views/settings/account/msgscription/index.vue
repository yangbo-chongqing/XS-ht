<template>
  <div class="msgscription-container">
    <div class="msgscription-text">消息通知及订阅</div>
    <p class="msgscription-smal">
      关注寻声扫码公众号，可以在微信中接收推送消息及订阅内容<span
        ><el-link type="primary">点击扫码关注</el-link></span
      >
    </p>
    <el-row :gutter="20">
      <el-col :span="24"
        ><div class="msgscription-item">
          <label>订阅消息通知:</label>
          <el-row :gutter="20">
            <el-col :span="10"
              ><div>
                <p class="msgscript-dy-info">
                  每周扫码量统计（关注后在微信中接收消息）
                </p>
                <div>
                  <p class="msgscript-dy-text">
                    每周一推送上周二维码扫码量情况
                  </p>
                </div>
              </div></el-col
            >
            <el-col :span="6">
              <el-switch
                v-model="dyValue"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="toggleSwitch"
              />
            </el-col>
          </el-row></div
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import { getGetMuse, getWarrant } from "@/api/settings";
import { postAccountSettings } from "@/api/user";
import { mapGetters } from "vuex";
import store from "@/store";
export default {
  name: "Msgscription",
  computed: {
    ...mapGetters(["userinfo"]),
  },
  data() {
    return {
      dyValue: false,
    };
  },
  created() {
    this.dyValue = this.userinfo.user_info.notice == 1;
  },
  methods: {
    toggleSwitch() {
      console.log(this.dyValue);
      if (this.userinfo.user_info.wx_openid) {
        const params = {
          notice: this.dyValue ? 1 : 2,
        };
        postAccountSettings(this.qs.stringify(params)).then((res) => {
          if (this.dyValue) {
            this.$message({
              message: "订阅成功",
              type: "success",
            });
          } else {
            this.$message({
              message: "取消订阅",
              type: "success",
            });
          }
        });
      } else {
        this.dyValue = false;
        getWarrant().then((res) => {
          this.$alert(
            `<div style='text-align:center;'><img src='${res.data.img}' width='200px' /></div>`,
            "订阅提醒",
            {
              dangerouslyUseHTMLString: true,
              center: true,
              beforeClose: async (action, instance, done) => {
                await store.dispatch("user/getInfo");
                done();
              },
            }
          ).catch(() => {});
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.msgscription-container {
  padding: 20px;
  box-sizing: border-box;
  border: 1px solid #f5f5f5;
  margin-top: 10px;
  box-shadow: 0px 0px 10px #f5f5f5;
  .msgscription-smal {
    color: #999;
    font-size: 13px;
  }
  .msgscript-dy-info {
    font-size: 13px;
    margin: 10px 0;
  }
  .msgscript-dy-text {
    font-size: 13px;
    color: #999;
  }
  .msgscription-text {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .msgscription-item {
    margin: 10px 0;
    label {
      font-size: 14px;
    }
    span {
      margin: 0 10px;
      font-size: 13px;
      color: #999;
    }
    .deitioninfo-item-body {
      float: left;
      margin-left: 10px;
      font-size: 13px;
      color: #999;
      p {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
