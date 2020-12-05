<template>
  <div class="AccountInfo-container">
    <div class="AccountInfo-text">账户信息</div>
    <el-row :gutter="20">
      <el-col :span="24"><div class="AccountInfo-item">
        <label>用户账号:</label> <span>18423075400</span><span><el-link type="primary">更换手机号</el-link></span>
      </div></el-col>
      <el-col :span="24"><div class="AccountInfo-item">
        <label>企业信息:</label> <span>大</span> <span><el-link type="primary">修改</el-link></span> <span><el-link type="primary">企业认证</el-link></span>
      </div></el-col>
      <el-col :span="24"><div class="AccountInfo-item">
        <label>用户账号:</label> <span>18423075400</span>    <el-link type="primary">更换手机号</el-link>
      </div></el-col>
      <el-col :span="24"><div class="AccountInfo-item">
        <label>用户账号:</label> <span>18423075400</span>    <el-link type="primary">更换手机号</el-link>
      </div></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AccountInfo'
}
</script>

<style lang="scss" scoped>
.AccountInfo-container {
  padding: 20px;
  box-sizing: border-box;
  border: 1px solid #f5f5f5;
  box-shadow: 0px 0px 10px #f5f5f5;
  .AccountInfo-text{
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .AccountInfo-item{
    margin: 10px 0 ;
    label{
      font-size: 14px;
    }
    span{
      margin: 0 10px;
      font-size: 13px;
      color: #999;
    }
  }
}
</style>
