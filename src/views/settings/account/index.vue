<template>
  <div class="Account-container">
    <el-row :gutter="20">
      <el-col :span="16"><accountInfo /></el-col>
      <el-col :span="8"><editionInfo /></el-col>
      <el-col :span="24"><msgScription /></el-col>
    </el-row>
  </div>
</template>

<script>
import accountInfo from './accountinfo'
import editionInfo from './editioninfo'
import msgScription from './msgscription'
export default {
  name: 'Account',
  components: {
    accountInfo,
    editionInfo,
    msgScription
  }
}
</script>

<style lang="scss" scoped>
.Account-container {
  background: white;
  padding: 20px;
  box-sizing: border-box;
}
</style>
