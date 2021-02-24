<template>
  <div class="workbench-admin">
    <div class="workbench-admin-code">
      <el-row :gutter="20">
        <el-col :span="6"
          ><div class="grid-content bg-purple">
            <p>词条码</p>
            <p>{{ relicsCount }}</p>
          </div></el-col
        >
        <el-col :span="6" :offset="6"
          ><div class="grid-content bg-purple">
            <p>功能码</p>
            <p>{{ product_count }}</p>
          </div></el-col
        >
      </el-row>
    </div>
    <div class="workbench-admin-code-body">
      <el-row>
        <el-col :span="12" style="text-align: center"
          ><div>昨日词条码</div></el-col
        >
        <el-col :span="12" style="text-align: center"
          ><div>昨日产品码</div></el-col
        >
      </el-row>
      <div class="workbench-chart-tips">
        <el-row :gutter="20">
          <el-col :span="6"
            ><div class="workbench-chart-tip">
              <p>新增</p>
              <p class="tip-number">{{ readList.entry_add }}</p>
            </div></el-col
          >
          <el-col :span="6"
            ><div class="workbench-chart-tip">
              <p>编辑</p>
              <p class="tip-number">{{ readList.entry_edit }}</p>
            </div></el-col
          >
          <el-col :span="6"
            ><div class="workbench-chart-tip">
              <p>新增</p>
              <p class="tip-number">{{ readList.product_add }}</p>
            </div></el-col
          >
          <el-col :span="6"
            ><div class="workbench-chart-tip">
              <p>编辑</p>
              <p class="tip-number">{{ readList.product_edit }}</p>
            </div></el-col
          >
        </el-row>
      </div>
    </div>
    <div class="workbench-admin-code-body">
      <el-row>
        <el-col :span="24"><div>近3日热码</div></el-col>
      </el-row>
      <div class="workbench-code-list">
        <div
          v-for="(item, index) in relicsList"
          :key="item.id + index"
          class="workbench-code-list-item"
        >
          <el-row :gutter="20">
            <el-col :span="16">
              <el-row :gutter="20">
                <el-col :span="3" style="padding-left: 0px"
                  ><div
                    class="workbench-code-item-img"
                    @click="
                      openPopover(
                        'http://xsdt.xunsheng.org.cn/api/web/code?type=1&id=' +
                          item.id +
                          '&muse_id=' +
                          userinfo.user_info.muse_id
                      )
                    "
                  >
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="
                        'http://xsdt.xunsheng.org.cn/api/web/code?type=1&id=' +
                        item.id +
                        '&muse_id=' +
                        userinfo.user_info.muse_id
                      "
                    /></div
                ></el-col>
                <el-col :span="12"
                  ><div class="workbench-code-item-body">
                    <h3>{{ item.name }}</h3>
                    <p>
                      近3日扫码量<span>{{ item.three }}</span
                      >总扫码量<span>{{ item.watch_number }}</span>
                    </p>
                    <p>
                      分类<span>{{ item.type.type_name }}</span>
                    </p>
                  </div></el-col
                >
              </el-row>
            </el-col>
            <el-col :span="8">
              <div class="workbench-code-item-link-body">
                <el-link
                  target="_blank"
                  @click="
                    openPopover(
                      'http://xsdt.xunsheng.org.cn/api/web/code?type=1&id=' +
                        item.id +
                        '&muse_id=' +
                        userinfo.user_info.muse_id
                    )
                  "
                  >下载</el-link
                >
                <el-link @click="togglePopover(item.id)">预览</el-link>
                <el-link @click="golinkpage('/codelist/edit', { id: item.id })"
                  >编辑</el-link
                >
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <codedown
      :dialogVisible="dialogVisible"
      :codeImg="codeImg"
      @toggleDialog="toggle"
    />
    <EntryQuery
      v-if="popoverFlag"
      :infoUrl="'http://xsdth5.xunsheng.org.cn/entryinfo?id=' + id"
      :id="id"
      @popoverEven="togglePopover"
    />
  </div>
</template>

<script>
import { downloadIamge } from "@/utils/utils";
import EntryQuery from "@/components/EntryQuery";
import { mapGetters } from "vuex";
import codedown from "@/components/codeDown/index";
import { array } from "js-md5";
export default {
  name: "WorkbenchCode",
  components: {
    EntryQuery,
    codedown,
  },
  props: {
    readList: {
      type: Object,
      default: {},
    },
    relicsCount: {
      type: Number,
      default: 0,
    },
    product_count: {
      type: Number,
      default: 0,
    },
    relicsList: {
      type: Array,
      default: [],
    },
  },
  computed: {
    ...mapGetters(["userinfo"]),
  },
  data() {
    return {
      url:
        "https://voice.xunsheng.org.cn/sydt_mini/0dba4ee49138234a7c3265c74b2c490f.png",
      srcList: [
        "https://voice.xunsheng.org.cn/sydt_mini/0dba4ee49138234a7c3265c74b2c490f.png",
        "https://voice.xunsheng.org.cn/sydt_mini/0dba4ee49138234a7c3265c74b2c490f.png",
      ],
      popoverFlag: false,
      dialogVisible: false,
      id: "",
      codeImg: "",
    };
  },
  created() {},
  methods: {
    toggle() {
      this.dialogVisible = !this.dialogVisible;
      this.codeImg = "";
    },
    openPopover(code) {
      this.codeImg = code;
      this.dialogVisible = true;
    },
    togglePopover(id) {
      this.id = id;
      this.popoverFlag = !this.popoverFlag;
    },
    downloadImg(img, imgname) {
      downloadIamge(img, imgname);
    },
    golinkpage(page, obj) {
      this.$router.push({
        path: page,
        query: {
          ...obj,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.workbench-container {
  background: white;
  padding: 20px;
  box-sizing: border-box;
  .workbench-admin-code-body {
    border: 1px solid #f2f2f2;
    padding: 20px;
    box-sizing: border-box;
    margin-top: 20px;
    .workbench-code-list-item {
      margin: 20px 0;
    }
    .workbench-code-item-link-body {
      text-align: right;
      .el-link {
        margin: 0 10px;
      }
    }
    .workbench-code-list {
      .workbench-code-item-img {
        width: 100px;
        height: 100px;
        float: left;
        cursor: pointer;
      }
      .workbench-code-item-body {
        float: left;
        margin-left: 20px;
        p {
          margin: 15px 0;
          font-size: 13px;
          color: #999;
          span {
            color: #333;
            font-size: 16px;
            margin: 0 5px;
          }
        }
      }
    }
  }
  .workbench-admin-code {
    border: 1px solid #f2f2f2;
    padding: 20px;
    box-sizing: border-box;
    .el-row {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .el-col {
      border-radius: 4px;
    }
    .bg-purple {
      background: #d3dce6;
    }

    .grid-content {
      border-radius: 4px;
      min-height: 36px;
      text-align: center;
      padding: 40px 0;
      box-sizing: border-box;
    }
    .row-bg {
      padding: 10px 0;
      background-color: #f9fafc;
    }
  }
}
.workbench-chart-tips {
  padding-top: 20px;
  .workbench-chart-tip {
    text-align: center;
    .tip-title {
      color: #999;
    }
    .tip-number {
      color: #4caf50;
      margin-top: 10px;
    }
  }
}
</style>
