<template>
  <div class="all">
    <div class="navbar">
      <hamburger
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      <breadcrumb class="breadcrumb-container" />
      <div class="right-menu">
        <!-- <div class="avatar-hlpe"><i class="el-icon-question" />帮助</div> -->
        <!-- <el-dropdown class="avatar-container" trigger="click">
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
        </el-dropdown> -->
      </div>
    </div>
    <div class="helpAll">
      <div class="sidebar">
        <el-menu
          :default-active="id"
          class="el-menu-vertical-demo"
          @select="select"
        >
          <el-submenu
            v-for="(item, index) of newsList"
            :key="index"
            :index="index + '-' + 1"
          >
            <template slot="title">
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item-group
              v-for="(i, n) of newsList[index].news"
              :index="n + 1"
              :key="n"
            >
              <el-menu-item :index="i.id">{{ i.title }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>
      <div class="right" v-html="detailHtml"></div>
    </div>
  </div>
</template>
<script>
import { getList } from "@/api/workbench";
import { getDetail } from "@/api/user";
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "name"]),
  },
  data() {
    return {
      newsList: [],
      detailHtml: "",
      id: 1,
    };
  },
  methods: {
    getList() {
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
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    settings() {
      this.$router.push("/settings/account");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
    }
    this.getList();
    this.getDetail();
  },
};
</script>
<style lang="scss" scoped>
.all {
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
        font-size: 18 px;
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
      width: 1150px;
      background: #fff;
      padding: 15px 30px;
    }
  }
}
</style>