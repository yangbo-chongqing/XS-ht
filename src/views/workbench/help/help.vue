<template>
  <div class="helpAll">
    <div class="sidebar">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @select="select"
      >
        <el-submenu
          v-for="(item, index) of newsList"
          :key="index"
          :index="index"
        >
          <template slot="title">
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item-group
            v-for="(i, n) of newsList[index].news"
            :index="n"
            :key="n"
          >
            <el-menu-item :index="i.id">{{ i.title }}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
    <div class="right" v-html="detailHtml"></div>
  </div>
</template>
<script>
import { getList } from "@/api/workbench";
import { getDetail } from "@/api/user";
export default {
  data() {
    return {
      newsList: [],
      detailHtml: "",
      id: 1,
    };
  },
  methods: {
    async getList() {
      getList().then((res) => {
        this.newsList = res.data.list;
      });
    },
    select(key, keyPath) {
      this.id = key;
      this.getDetail();
    },
    getDetail() {
      getDetail(this.qs.stringify({ id: this.id })).then((res) => {
        this.detailHtml = res.data.data.content;
      });
    },
  },
  created() {
    this.getList();
    this.getDetail();
  },
};
</script>
<style lang="scss" scoped>
.helpAll {
  display: flex;
  .sidebar {
    height: 100vh;
    background: #ffffff;
    .el-menu-vertical-demo {
      width: 220px;
    }
  }
  .right {
    margin-left: 20px;
    width: 100%;
    background: #fff;
    padding: 15px 30px;
  }
}
</style>