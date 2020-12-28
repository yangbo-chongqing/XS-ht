<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
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
