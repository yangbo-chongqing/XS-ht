<template>
  <div class="workbench-container">
    <div class="workbench-left">
      <adminContent :relics-count="relicsCount" :relics-list="relicsList" />
    </div>
    <div class="workbench-right">
      <chartContent
        :code-obj="codeObj"
        :chart-data="chartData"
        :news-list="newsList"
      />
    </div>
  </div>
</template>

<script>
import adminContent from "./admin";
import chartContent from "./chart";
import { workbench } from "@/api/workbench";
import { getQiToken } from "@/api/user";

export default {
  name: "WorkbenchCode",
  components: { adminContent, chartContent },
  data() {
    return {
      relicsCount: 0,
      relicsList: [],
      codeObj: {},
      chartData: [],
      newsList: [],
    };
  },
  created() {
    this.getWorkbenchInfo();
    if (!sessionStorage.getItem("qiToken")) {
      //是否有qiToken
      getQiToken({}).then((res) => {
        let str = res.data.data;
        str.token = JSON.parse(JSON.stringify(str.upToken));
        str.key = JSON.parse(JSON.stringify(str.path));
        delete str.path;
        delete str.upToken;
        sessionStorage.setItem("qiToken", JSON.stringify(str));
      });
    }
  },
  methods: {
    getWorkbenchInfo() {
      workbench().then((res) => {
        this.relicsCount = res.data.relics_count;
        this.relicsList = res.data.relics_list;
        this.codeObj = {
          monthly_count: res.data.monthly_count,
          seven_count: res.data.seven_count,
          yesterday: res.data.yesterday,
          nowadays: res.data.nowadays,
        };
        this.chartData = res.data.info_list;
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
  &::after {
    content: "";
    display: block;
    width: 100%;
    clear: both;
  }
  .workbench-left {
    width: 70%;
    float: left;
  }
  .workbench-right {
    width: 30%;
    float: right;
  }
}
</style>
