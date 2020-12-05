<template>
  <div class="homepage-container">
    <div class="homepage-text">
      <el-row :gutter="20">
        <el-col :span="18">
          <pageForm />
        </el-col>
        <el-col :span="6">
          <wapAntevisao />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import pageForm from './form'
import wapAntevisao from './wapAntevisao'
export default {
  name: 'HomePage',
  components: {
    pageForm,
    wapAntevisao
  }
}
</script>

<style lang="scss" scoped>
.homepage-container {
  background: white;
  padding: 20px;
  box-sizing: border-box;
  &::after{
    content: '';
    display:block;
    width: 100%;
    clear: both;
  }
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
