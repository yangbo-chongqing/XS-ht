<template>
  <div class="workbench-chart">
    <div class="workbench-title">
      <el-row>
        <el-col :span="24"><div>近3日热码</div></el-col>
      </el-row>
    </div>
    <div class="workbench-chart-tips">
      <el-row :gutter="20">
        <el-col :span="6"
          ><div class="workbench-chart-tip">
            <p class="tip-title">昨日</p>
            <p class="tip-number">{{ codeObj.yesterday }}</p>
          </div></el-col
        >
        <el-col :span="6"
          ><div class="workbench-chart-tip">
            <p>今日</p>
            <p class="tip-number">{{ codeObj.nowadays }}</p>
          </div></el-col
        >
        <el-col :span="6"
          ><div class="workbench-chart-tip">
            <p>近7日</p>
            <p class="tip-number">{{ codeObj.seven_count }}</p>
          </div></el-col
        >
        <el-col :span="6"
          ><div class="workbench-chart-tip">
            <p>近30日</p>
            <p class="tip-number">{{ codeObj.monthly_count }}</p>
          </div></el-col
        >
      </el-row>
    </div>
    <div class="workbench-chart-body">
      <line-chart :chart-data="chartData" />
    </div>
    <div class="workbench-chart-hlep">
      帮助
      <div class="workbench-chart-hlep-list">
        <el-row>
          <el-col :span="24"
            ><div
              class="news-list-item"
              v-for="item in newsList.news"
              :key="item.id"
              @click="openNewInfo(item.id)"
            >
              <el-link>{{ item.title }}</el-link>
            </div></el-col
          >
        </el-row>
      </div>
    </div>
    <el-dialog
      custom-class="dialogStyle"
      :title="newsinfo.title"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div v-html="newsinfo.content"></div>
    </el-dialog>
  </div>
</template>

<script>
import LineChart from "./components/LineChart";
import { newsDetails } from "@/api/workbench";
import { getList } from "@/api/workbench";

export default {
  name: "EntryCode",
  components: { LineChart },
  props: {
    codeObj: {
      type: Object,
      default: {
        monthly_count: 0,
        seven_count: 0,
        yesterday: 0,
        nowadays: 0,
      },
    },
    chartData: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      dialogVisible: false,
      newsinfo: "",
      newsList: [],
    };
  },
  created() {
    console.log(this.newsList);
    this.getList();
  },
  methods: {
    openNewInfo(id) {
      this.$router.push({
        name: "help",
        params: {
          id,
        },
      });
    },
    async getList() {
      getList().then((res) => {
        this.newsList = res.data.list[0];
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.workbench-chart {
  background: white;
  padding: 20px;
  box-sizing: border-box;
  .news-list-item {
    margin: 10px 0;
  }
  .workbench-chart-hlep {
    padding-top: 25px;
    .helpFont {
      color: #2284e6;
    }
    .workbench-chart-hlep-list {
      .el-col {
        margin: 10px 0;
      }
    }
  }
  .workbench-chart-body {
    width: 100%;
    height: 300px;
    margin: 20px 0;
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
}
</style>
