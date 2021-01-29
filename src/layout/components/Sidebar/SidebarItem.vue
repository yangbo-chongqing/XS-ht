<template>
  <div v-if="!item.hidden && dataList.indexOf(item.path) != -1">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu
      v-else
      ref="subMenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template slot="title">
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
        />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from "path";
import store from "@/store";
import { isExternal } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";
import FixiOSBug from "./FixiOSBug";
import { getMenu } from "@/api/user";
export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null;
    return {
      roles: store.getters.userinfo.user_info.roles,
      dataList: sessionStorage.getItem("router"),
    };
  },
  created() {
    this.dataList = sessionStorage.getItem("router");
    // console.log(this.dataList);
    // if (!sessionStorage.getItem("router")) {
    // this.getMenuList();
    // } else {
    // this.dataList = sessionStorage.getItem("router");
    // }
    if (this.roles == 1) {
      if (this.item.children) {
        this.item.children.map((item, index) => {
          if (item.path == "administrator") {
            item.hidden = true;
          }
        });
      }
    } else {
      if (this.item.children) {
        this.item.children.map((item, index) => {
          if (item.path == "administrator") {
            item.hidden = false;
          }
        });
      }
    }
    // console.log(
    //   this.item.path +
    //     "----------" +
    //     this.dataList +
    //     "--------" +
    //     this.dataList.indexOf(this.item.path)
    // );
    // console.log(this.dataList.indexOf(this.item.path) != -1);
    // console.log(this.item);
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item;
          return true;
        }
      });

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true;
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }

      return false;
    },
    // async getMenuList() {
    //   await getMenu().then((res) => {
    //     let list = res.data.menu;
    //     for (let i = 0; i < list.length; i++) {
    //       this.dataList.push(list[i].path);
    //       if (list[i].children) {
    //         for (let n = 0; n < list[i].children.length; n++) {
    //           this.dataList.push(list[i].children[n].path);
    //         }
    //       }
    //     }
    //     // console.log(this.dataList);
    //     sessionStorage.setItem("router", JSON.stringify(this.dataList));
    //     console.log(sessionStorage.getItem("router"));
    //   });
    // },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    },
  },
};
</script>
