<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1 v-else class="sidebar-title">{{ title }}</h1>
      </router-link>
      <div v-else class="logo-body">
        <router-link key="expand" class="sidebar-logo-link" to="/">
          <img v-if="logo" :src="logo" class="sidebar-logo" />
        </router-link>
        <el-select
          style="width: 180px"
          v-model="id"
          placeholder="请选择切换的公司"
          @change="changeValue"
        >
          <el-option
            v-for="(item, index) of userinfo.muse_list"
            :key="index"
            :label="item.muse_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <!-- <h1 class="sidebar-title">{{ title }}</h1> -->
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { museSwitch } from "@/api/user";

export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "name", "userinfo"]),
  },
  created() {
    this.userinfo.muse_list.map((item) => {
      if (item.select == 1) {
        this.logo = item.logo;
        this.title = item.muse_name;
        this.id = item.id;
      }
    });
  },
  data() {
    return {
      title: "寻声扫码",
      logo: "http://www.xunsheng.org.cn/img/logo-white.png?v=2018",
      id: "",
      dataList: [],
    };
  },
  methods: {
    async changeValue(id) {
      // 切换后 页面刷新
      this.id = id;
      await this.getId();
      await this.$store.dispatch("user/getInfo");
      await this.$router.go(0);
      await this.getMenuList();
      // await this.reload();
    },

    async getMenuList() {
      await getMenu().then((res) => {
        let list = res.data.menu;
        for (let i = 0; i < list.length; i++) {
          this.dataList.push(list[i].path);
          for (let n = 0; n < list[i].children.length; n++) {
            this.dataList.push(list[i].children[n].path);
          }
        }
        sessionStorage.setItem("router", JSON.stringify(this.dataList));
      });
    },
    getId() {
      // 切换公司ID
      museSwitch(
        this.qs.stringify({ id: JSON.stringify(this.id) })
      ).then((res) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}
.logo-body {
  display: flex;
  align-items: center;
  img {
    flex-shrink: 0;
  }
  h1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  height: 50px;
  line-height: 50px;
  padding-left: 20px;
  box-sizing: border-box;
  background: #ffffff;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #409eff;
      font-weight: 600;
      line-height: 50px;
      font-size: 16px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    padding-left: 0px;
    text-align: center;
    .sidebar-logo {
      margin-right: 0px;
      height: 15px;
    }
  }
}
.sidebar-container a {
  width: 52px !important;
}
</style>
