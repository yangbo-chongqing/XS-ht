<template>
  <section class="app-main">
    <keep-alive>
      <router-view v-if="!$route.meta.noCache"></router-view>
    </keep-alive>
    <transition v-if="$route.meta.noCache" name="fade-transform" mode="out-in">
      <router-view />
    </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain",
  computed: {
    key() {
      return this.$route.path;
    },
  },
};
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 90px);
  width: 100%;
  /* padding: 20px; */
  padding: 20px 20px 0 20px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  background: #f5f5f5;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
