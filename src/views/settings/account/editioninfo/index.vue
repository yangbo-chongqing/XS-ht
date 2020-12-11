<template>
  <div class="editioninfo-container">
    <div class="editioninfo-text">版本信息</div>
    <el-row :gutter="20">
      <el-col
        :span="24"
      ><div class="editioninfo-item">
        <label>当前版本:</label> <span>最新</span>
      </div></el-col>
      <el-col
        :span="24"
      ><div class="editioninfo-item">
        <label>使用情况:</label>
        <div class="deitioninfo-item-body">
          <p>音视频流量：<span>1000</span></p>
          <p>访问人数：<span>1000</span></p>
          <p>子管理员数：<span>1000</span></p>
          <p>子管理员数：<span>1000</span></p>
        </div>
      </div></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'EditionInfo'
}
</script>

<style lang="scss" scoped>
.editioninfo-container {
  padding: 20px;
  height: 200px;
  box-sizing: border-box;
  border: 1px solid #f5f5f5;
  box-shadow: 0px 0px 10px #f5f5f5;
  .editioninfo-text {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .editioninfo-item {
    margin: 10px 0;
    label {
      font-size: 14px;
      float: left;
    }
    span {
      margin: 0 10px;
      font-size: 13px;
      color: #999;
    }
    .deitioninfo-item-body{
      float: left;
      margin-left: 10px;
      font-size: 13px;
      color: #999;
      p{
        margin-bottom:10px ;

      }
    }
  }
}
</style>
