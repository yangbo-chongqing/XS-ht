<template>
  <div class="homepage-container">
    <div class="homepage-text">
      <el-row :gutter="20">
        <el-col :span="18">
          <pageForm v-if="enterpriseInfo" :info="enterpriseInfo" />
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
import { getGetMuse } from '@/api/settings'
export default {
  name: 'HomePage',
  components: {
    pageForm,
    wapAntevisao
  },
  data() {
    return {
      enterpriseInfo: ''
    }
  },
  created() {
    this.GetMuse()
  },
  methods: {
    GetMuse() {
      getGetMuse().then((res) => {
        this.enterpriseInfo = res.data.muse_info
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.homepage-container {
  background: white;
  padding: 20px;
  position: absolute;
  width: 100%;
  height: 95%;
  overflow-y: scroll;
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
