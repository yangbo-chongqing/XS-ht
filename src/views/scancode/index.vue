<template>
  <div class="scancode-container">
    <div class="scancode-text">扫码量统计</div>
    <div class="scancode-head-num">
      <el-row :gutter="20">
        <el-col :offset="2" :span="4"
          ><div class="workbench-chart-tip">
            <p class="tip-title">昨日</p>
            <p class="tip-number">{{ relics.yesterday }}</p>
          </div></el-col
        >
        <el-col :span="4"
          ><div class="workbench-chart-tip">
            <p>今日</p>
            <p class="tip-number">{{ relics.nowadays }}</p>
          </div></el-col
        >
        <el-col :span="4"
          ><div class="workbench-chart-tip">
            <p>近7日</p>
            <p class="tip-number">{{ relics.seven_count }}</p>
          </div></el-col
        >
        <el-col :span="4"
          ><div class="workbench-chart-tip">
            <p>近30日</p>
            <p class="tip-number">{{ relics.monthly_count }}</p>
          </div></el-col
        >
        <el-col :span="4"
          ><div class="workbench-chart-tip">
            <p>累计（截止昨日）</p>
            <p class="tip-number">{{ relics.total }}</p>
          </div></el-col
        >
      </el-row>
    </div>
    <div class="scancode-tab">
      <span :class="dateTabIndex == 1 ? 'active' : ''" @click="toggleDate(1)"
        >昨日</span
      >
      <span :class="dateTabIndex == 2 ? 'active' : ''" @click="toggleDate(2)"
        >今日</span
      >
      <span :class="dateTabIndex == 3 ? 'active' : ''" @click="toggleDate(3)"
        >七日内</span
      >
      <span :class="dateTabIndex == 4 ? 'active' : ''" @click="toggleDate(4)"
        >30日内</span
      >
      <span :class="dateTabIndex == 5 ? 'active' : ''" @click="dateTabIndex = 5"
        >自定义</span
      >
      <el-date-picker
        v-if="dateTabIndex == 5"
        v-model="dateZdy"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        @change="toggleDate(5)"
      />
    </div>
    <div v-if="chartData" class="workbench-chart-body">
      <line-chart :chart-data="chartData" />
    </div>
    <div v-if="codeData" class="scancode-data">
      <div class="scancode-data-title">
        <el-row>
          <el-col :span="20"><p>二维码名称</p></el-col>
          <el-col :span="4"
            ><span>{{ day }}日内扫码量</span></el-col
          >
        </el-row>
      </div>
      <div class="scancode-body">
        <el-row v-for="(item, index) in codeData" :key="index">
          <el-col :span="20"
            ><p>{{ item.name }}</p></el-col
          >
          <el-col :span="4"
            ><span>{{ item.frequency }}</span></el-col
          >
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { postStatistics } from "@/api/entrycode";
import { workbench } from "@/api/workbench";
import LineChart from "./components/LineChart";
export default {
  name: "ScanCode",
  components: { LineChart },
  data() {
    return {
      start_time:
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate(),
      end_time:
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate(),
      chartData: "",
      day: 1,
      codeData: "",
      dateTabIndex: 2,
      relics: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      dateZdy: "",
    };
  },
  mounted() {
    this.getWorkbenchInfo();
    this.Statistics();
  },
  methods: {
    // 切换时间

    toggleDate(index) {
      this.dateTabIndex = index;
      let start = new Date();
      let end = new Date();
      console.log(index);
      if (index == 1) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);

        this.start_time =
          start.getFullYear() +
          "-" +
          (start.getMonth() * 1 + 1) +
          "-" +
          start.getDate();
        this.end_time =
          start.getFullYear() +
          "-" +
          (start.getMonth() * 1 + 1) +
          "-" +
          start.getDate();
      } else if (index == 2) {
        this.start_time =
          new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          new Date().getDate();
        this.end_time =
          new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          new Date().getDate();
      } else if (index == 3) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        this.start_time =
          start.getFullYear() +
          "-" +
          (start.getMonth() * 1 + 1) +
          "-" +
          start.getDate();
        this.end_time =
          end.getFullYear() +
          "-" +
          (end.getMonth() + 1 * 1) +
          "-" +
          end.getDate();
      } else if (index == 4) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        this.start_time =
          start.getFullYear() +
          "-" +
          (start.getMonth() * 1 + 1) +
          "-" +
          start.getDate();
        this.end_time =
          end.getFullYear() +
          "-" +
          (end.getMonth() + 1 * 1) +
          "-" +
          end.getDate();
      } else {
        this.start_time = new Date(this.dateZdy[0]).toLocaleDateString();
        this.end_time = new Date(this.dateZdy[1]).toLocaleDateString();
      }
      this.Statistics();
      // console.log(this.start_time);
    },
    getWorkbenchInfo() {
      workbench().then((res) => {
        this.relics = res.data;
      });
    },
    Statistics() {
      const loading = this.$loading({
        text: "加载中...",
      });
      const params = {
        start_time: this.start_time,
        end_time: this.end_time,
      };
      postStatistics(this.qs.stringify(params)).then((res) => {
        this.chartData = res.data.date;
        this.codeData = res.data.relics_list;
        if (this.codeData.length == 0) {
          this.codeData = "";
        }
        this.day = res.data.day;
        loading.close();
      });
    },
  },
};
</script>
<style lang="scss">
.scancode-container {
  .scancode-body {
    .el-row {
      border-bottom: 1px solid #f5f5f5;
    }
  }
  .el-col-4 {
    &:nth-last-of-type(1) {
      .workbench-chart-tip {
        border-right: none;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.scancode-container {
  padding: 20px;
  box-sizing: border-box;
  .workbench-chart-body {
    background: white;
    padding: 20px;
    box-sizing: border-box;
  }
  .scancode-data {
    margin-top: 15px;
    .scancode-body {
      line-height: 50px;
      background: #ffffff;
      padding: 0 20px;
    }
    .scancode-data-title {
      width: 100%;
      height: 50px;
      line-height: 50px;
      background: #fafafa;
      padding: 0 20px;
      box-sizing: border-box;
      p {
        float: left;
      }
      span {
        float: left;
      }
    }
  }
  .scancode-tab {
    height: 50px;
    padding: 10px 0;
    margin: 15px 0;
    span {
      border: 1px solid #ccc;
      padding: 3px 10px;
      float: left;
      margin-top: 8px;
      margin-right: 20px;
      border-radius: 999px;
      color: #ccc;
      &.active {
        border-color: #4caf50;
        color: #4caf50;
      }
    }
  }
  .scancode-text {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 15px;
  }
  .scancode-head-num {
    width: 100%;
    height: 120px;
    background: white;
    padding-top: 40px;
  }
  .workbench-chart-tip {
    border-right: 1px solid #ccc;
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
