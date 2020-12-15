<template>
  <div class="wap-container">
    <iframe class="myiframe" :src="'http://xsdth5.xunsheng.org.cn/#/home?muse_id='+userinfo.user_info.muse_id" frameborder="0"></iframe>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'HomePageWapAntevisao',
  computed: {
    ...mapGetters(['userinfo'])
  },
  data() {
    return {
    }
  },
}
</script>

<style lang="scss" scoped>
.wap-container {
  width: 100%;
  height: 750px;
  background: #f5f5f5;
  .myiframe{
    width: 100%;
    height: 100%;
  }
}
</style>
