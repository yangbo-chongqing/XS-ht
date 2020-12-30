<template>
  <div class="login-container">
    <div class="login-body">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form
            ref="loginForm"
            :model="loginForm"
            class="login-form"
            auto-complete="on"
            label-position="left"
          >
            <div class="title-container">
              <h3 class="title">寻声地图商户登录</h3>
            </div>
            <el-form-item prop="phone">
              <span class="svg-container">
                <i class="el-icon-mobile" />
              </span>
              <el-input
                ref="phone"
                v-model="loginForm.phone"
                placeholder="手机号"
                name="phone"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>

            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                tabindex="2"
                auto-complete="on"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                />
              </span>
            </el-form-item>

            <el-button
              :loading="loading"
              type="primary"
              style="width: 100%; margin-bottom: 30px"
              @click.native.prevent="handleLogin"
              >登录</el-button
            >
          </el-form>
          <div class="textCenter">
            <input type="checkbox" v-model="checked" />&nbsp;
            <span class="fontB">同意寻声地图</span> &nbsp;<span
              @click="readBook"
              class="fontP"
              >平台登录协议</span
            >
          </div>
          <!-- 协议详情 -->

          <el-dialog
            title="平台登录协议"
            custom-class="dialogStyle"
            :visible.sync="read"
            width="50%"
          >
            <p v-html="readDetail"></p>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="read = false">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
        <el-col :span="8">
          <div class="login-form">
            <div class="title-container">
              <h3 class="title">微信快捷登录</h3>
            </div>
            <div class="code-img">
              <img
                v-if="codeKey"
                :src="
                  'http://testsydt.xunsheng.org.cn/api/store/login/code?key=' +
                  codeKey
                "
                alt=""
                srcset=""
              />
              <div class="code-state" v-if="codeState == 1" @click="refreshCode">二维码过期<i class="el-icon-refresh"></i></div>
              <div class="code-state" v-if="codeState == 2">扫码成功</div>
              <div class="code-state" v-if="codeState == 3">拒绝登录</div>
              <div class="code-state" v-if="codeState == 4">登录成功</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  LoginCredentials,
  GetCodeStatus,
  getDetail,
  LoginQR,
} from "@/api/user";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        phone: "",
        password: "",
      },
      codeKey: "",
      codeState: "",
      loading: false,
      passwordType: "password",
      redirect: undefined,
      otherQuery: {},
      setInt: "",
      checked: "1",
      read: false,
      readDetail: "",
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  created() {
    this.loginCredentials();
  },
  destroyed() {
    clearInterval(this.setInt);
  },
  methods: {
    //过期二维码点击刷新二维码
    refreshCode(){
      this.codeState = 0;
      this.loginCredentials();
    },
    // 获取二维码状态
    getCodeStatus() {
      const params = {
        key: this.codeKey,
      };
      GetCodeStatus(this.qs.stringify(params)).then((res) => {
        this.codeState = res.data.state;
        if(this.codeState == 1){
          clearInterval(this.setInt);
        }
        if (res.data.state == 4) {
          // 二维码扫码完成进行token操作
          this.$store
            .dispatch("user/erLogin", res.data)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    readBook() {
      // 获取协议
      const parmas = {
        id: 9,
      };
      getDetail(this.qs.stringify(parmas)).then((res) => {
        this.readDetail = res.data.data.content;
      });
      this.read = true;
    },
    // 获取登陆二维码凭证
    loginCredentials() {
      LoginCredentials().then((res) => {
        this.codeKey = res.data.key;
        this.setInt = setInterval(() => {
          this.getCodeStatus();
        }, 1500);
      });
    },
    // 显示隐藏密码
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      if (this.checked != 1) {
        this.$message({
          message: "请阅读协议后，完成勾选进行登录",
          type: "warning",
        });
        return;
      }
      this.loading = true;
      this.$store
        .dispatch("user/login", this.loginForm)
        .then(() => {
          this.$router.push({ path: this.redirect || "/" });
          console.log(this.redirect);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-body {
    width: 800px;
    margin: auto;
  }
  .code-wx-text {
    text-align: center;
    margin-top: 10px;
    color: white;
  }
  .code-img {
    width: 180px;
    margin: auto;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .code-state {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      color: #777;
      font-size: 24px;
      cursor: pointer;
    }
  }
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .login-code {
    position: absolute;
    right: 0;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .textCenter {
    text-align: center;
    .fontB {
      color: #889aa4;
    }
    .fontP {
      color: #18c3b1;
      cursor: pointer;
    }
  }
}
</style>
