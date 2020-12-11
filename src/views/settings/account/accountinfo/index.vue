<template>
  <div class="AccountInfo-container">
    <div class="AccountInfo-text">账户信息</div>
    <el-row :gutter="20">
      <el-col
        :span="24"
      ><div class="AccountInfo-item">
        <label>用户名:</label>
        <span v-if="!isShowUserName">{{ userinfo.user_info.nickname }}</span>
        <el-input
          v-else
          v-model="userinfo.user_info.nickname"
          size="small"
          placeholder="请输入用户名"
        />
        <span>
          <el-link
            v-if="!isShowUserName"
            type="primary"
            @click="isShowUserName = true"
          >修改用户名</el-link>
          <el-link
            v-else
            type="primary"
            @click="
              accountSettings({ nickname: userinfo.user_info.nickname })
            "
          >保存</el-link>
        </span>
      </div></el-col>
      <el-col
        :span="24"
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
          >更换手机号</el-link>
          <el-link
            v-else
            type="primary"
            @click="
              accountSettings({ mobile: userinfo.user_info.mobile })
            "
          >保存</el-link>
        </span>
      </div></el-col>
      <el-col
        :span="24"
      ><div class="AccountInfo-item">
        <label>企业信息:</label> <span>{{ enterpriseInfo.muse_name }}</span>
        <span><el-link
          type="primary"
          @click="golinkpage('/settings')"
        >修改</el-link></span>
        <!-- <span><el-link type="primary">企业认证</el-link></span> -->
      </div></el-col>
    </el-row>
  </div>
</template>

<script>
import { postAccountSettings } from '@/api/user'
import { getGetMuse } from '@/api/settings'
import { mapGetters } from 'vuex'
export default {
  name: 'AccountInfo',
  data() {
    return {
      enterpriseInfo: '',
      isShowUserTel: false,
      isShowUserName: false
    }
  },
  computed: {
    ...mapGetters(['userinfo'])
  },
  created() {
    this.GetMuse()
  },
  methods: {
    GetMuse() {
      getGetMuse().then((res) => {
        this.enterpriseInfo = res.data.muse_info
      })
    },
    // 修改用户信息
    accountSettings(obj) {
      const params = {
        ...obj
      }
      const loading = this.$loading({
        text: '修改中'
      })
      postAccountSettings(this.qs.stringify(params)).then((res) => {
        loading.close()
        this.isShowUserName = false
        this.isShowUserName = false
      })
    },
    golinkpage(page, obj) {
      this.$router.push({
        path: page,
        query: {
          ...obj
        }
      })
    }
  }
}
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
  height: 200px;
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
</style>
