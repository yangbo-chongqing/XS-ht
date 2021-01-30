<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <!-- <el-select
        style="width: 180px; margin-right: 10px"
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
      </el-select> -->
      <router-link target="_blank" :to="{ name: 'help' }">
        <div class="avatar-hlpe"><i class="el-icon-question" />帮助</div>
      </router-link>

      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          {{ name }}
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="settings">
            <span style="display: block">设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { museSwitch } from "@/api/user";

import { getGetMuse } from "@/api/settings";
export default {
  inject: ["reload"],
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    return {
      id: "",
      dataList: [],
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "name", "userinfo"]),
  },
  mounted() {
    console.log(this.avatar);
  },
  methods: {
    async changeValue(id) {
      // 切换后 页面刷新
      this.id = id;
      await this.getId();
      await this.$store.dispatch("user/getInfo");
      await this.$router.go(0);
      // await this.getMenuList();
      // await this.reload();
    },

    // async getMenuList() {
    //   await getMenu().then((res) => {
    //     let list = res.data.menu;
    //     for (let i = 0; i < list.length; i++) {
    //       this.dataList.push(list[i].path);
    //       for (let n = 0; n < list[i].children.length; n++) {
    //         this.dataList.push(list[i].children[n].path);
    //       }
    //     }
    //     sessionStorage.setItem("router", JSON.stringify(this.dataList));
    //   });
    // },
    getId() {
      // 切换公司ID
      museSwitch(
        this.qs.stringify({ id: JSON.stringify(this.id) })
      ).then((res) => {});
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    settings() {
      console.log(111111111);
      this.$router.push("/settings/account");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      localStorage.removeItem("router"); //移除sessionStorage
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
  created() {
    console.log("bbbbbbbbb");
    // this.getMenuList();
    this.userinfo.muse_list.map((item) => {
      if (item.select == 1) {
        this.id = item.id;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    .avatar-hlpe {
      margin-right: 10px;
      float: left;
    }
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        line-height: 40px;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          float: left;
          border-radius: 10px;
          margin-right: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 15px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
