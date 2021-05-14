<template>
  <el-dialog
    width="500px"
    title="相关链接"
    :visible.sync="show"
    label-position="top"
  >
    <el-form ref="form" :inline="true" size="mini">
      <div v-for="(item, index) in form" :key="index + 'item'">
        <h3 style="margin-bottom: 15px">链接{{ index + 1 }}</h3>
        <el-form-item label="标题" label-width="30px">
          <el-input v-model="item.title" placeholder="例如名称"></el-input>
        </el-form-item>
        <el-form-item label="链接" label-width="30px">
          <el-input
            v-model="item.url"
            placeholder="url:http://或者/https://"
          ></el-input>
        </el-form-item>
        <span v-if="index > 0"
          ><el-button
            size="mini"
            @click="delFromItem(index)"
            icon="el-icon-minus"
            circle
          ></el-button
        ></span>
      </div>
      <div>
        <el-button
          @click="addFromItem"
          type="primary"
          icon="el-icon-plus"
          circle
        ></el-button>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="addXurl">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      show: false,
      form: [],
    };
  },
  methods: {
    //添加相关链接
    addFromItem() {
      this.form.push({
        title: "",
        url: "",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>