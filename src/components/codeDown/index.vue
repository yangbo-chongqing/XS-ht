<template>
  <div class="fun-code">
     <el-dialog
    :visible.sync="dialogVisible"
    width="400px"
    center
    >
    <el-tabs v-model="activeName" stretch>
        <el-tab-pane label="样式标签" name="first">用户管理</el-tab-pane>
        <el-tab-pane label="普通二维码标签" name="second">配置管理</el-tab-pane>
    </el-tabs>



    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
</el-dialog>
  </div>
</template>

<script>

export default {
  name: "InstructionsCreate",
  props:['dialogVisible'],
  data() {
    return {
        activeName:'second'
    };
  },
  created() {},
  methods: {
    
  },
};
</script>
<style lang="scss" scoped>
.fun-code {
 
}
</style>
