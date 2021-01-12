<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: "App",
  provide() {
    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true, //控制视图是否显示的变量
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false; //先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true; //再打开
      });
    },
  },
};
</script>
<style>
@import url(./styles/reset.scss);
.dialogStyle .el-dialog__header {
  background: #409eff !important;
}
.dialogStyle .el-dialog__title,
.dialogStyle .el-dialog__headerbtn .el-dialog__close {
  color: #f2f2f2;
}
.custonStyle .el-dialog__close {
  color: #f2f2f2 !important;
}
body {
  min-width: 1600px;
}
</style>
