  <template>
  <div class="fun-code">
    <div class="fun-code-head">
      <el-row>
        <el-col :span="20"><div class="entry-title">工单列表</div></el-col>
        <el-col :span="4">
          <el-row :gutter="24">
            <el-col :span="24">
              <div class="entry-search">
                <!-- <el-input
                  v-model="keyword"
                  type="search"
                  clearable
                  placeholder="搜索工单号"
                  ><i slot="prefix" class="el-input__icon el-icon-search" />
                  <el-button slot="append" @click="onSearch">搜索</el-button>
                </el-input> -->
                状态：
                <el-select
                  style="width: 140px"
                  v-model="state"
                  placeholder="请选择"
                  @change="selectState"
                >
                  <el-option
                    v-for="item in states"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <!-- <el-col :span="5">
              <div class="entry-search">
                <el-button
                  type="primary"
                  @click="golinkpage('/codelist/productedit', {})"
                  >新增产品码</el-button
                >
              </div>
            </el-col> -->
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="fun-table">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        :height="tableHeight"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="工单ID" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="用户" align="center">
          <template slot-scope="scope">
            <span class="code-name">{{ scope.row.user_info.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标题" align="center">
          <template slot-scope="scope">
            <span class="code-name">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span
              class="code-name"
              v-if="scope.row.state == 0 || scope.row.state == 1"
              >待回复</span
            >
            <span class="code-name" v-if="scope.row.state == 2">已回复</span>
            <span class="code-name" v-if="scope.row.state == 3">已完结</span>
            <!-- <span class="code-name" v-if="scope.row.state == 4">已解决</span> -->
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <span class="el-link-btn"
              ><el-link
                type="primary"
                @click="
                  golinkpage('/workOrder/workOrderListDetail', {
                    id: scope.row.id,
                  })
                "
                >查看</el-link
              ></span
            >
            <span class="el-link-btn"
              ><el-link type="primary" @click="over(scope.row)"
                >完结</el-link
              ></span
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="entry-pagination">
        <el-pagination
          background
          :current-page.sync="page"
          layout="prev, pager, next"
          :total="count"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { workorderList, workorderFinish } from "@/api/myApi";
export default {
  data() {
    return {
      keyword: "", //搜索值
      listLoading: false,
      list: [], //工单列表
      tableHeight: document.body.clientHeight - 230,
      page: 1, //页码
      count: 0, //总条数
      state: "-1", //筛选状态
      states: [
        { label: "全部", value: "-1" },
        { label: "待回复", value: "1" },
        { label: "已回复", value: "2" },
        { label: "已完结", value: "3" },
      ],
    };
  },
  methods: {
    onSearch() {},
    handleCurrentChange(size) {
      // 换页
      this.page = size;
      this.getList();
    },
    handleSizeChange(size) {
      this.page = size;
      this.getList();
    },
    selectState() {
      this.page = 1;
      this.getList();
    },
    getList() {
      let parasm = {
        page: this.page,
        state: this.state,
      };
      workorderList(this.qs.stringify(parasm)).then((res) => {
        this.list = res.data.list.data;
        this.count = res.data.list.total;
      });
    },
    over(id) {
      let params = {
        // type: 3,
        workorder_id: id.id,
        type: 0,
      };
      workorderFinish(this.qs.stringify(params)).then((res) => {
        if (res.status == 200) {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.getList();
        }
      });
    },
    golinkpage(page, obj) {
      // 路由跳转
      this.$router.push({
        path: page,
        query: {
          ...obj,
        },
      });
    },
  },
  created() {
    this.getList();
  },
};
</script>
<style lang="scss" scoped>
.fun-code {
  background: white;
  .fun-code-head {
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .entry-pagination {
    margin: 20px 0;
    text-align: center;
  }
  .fun-table {
    .fun-table-body {
      width: 100%;
      height: 100px;
      padding: 10px 20px;
      box-sizing: border-box;
      border-bottom: 1px solid #f5f5f5;
      .fun-table-info-num-title {
        font-size: 13px;
        color: #999;
        margin: 10px 0;
      }
      .fun-table-info-cz-tips {
        padding-top: 20px;
        box-sizing: border-box;
        text-align: right;
        span {
          margin: 0 10px;
        }
      }
      .fun-table-info-num-number {
        font-size: 13px;
        color: #409eff;
      }
      &:hover {
        background: #d7ebff;
      }
      .fun-table-info-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 10px;
      }
      .fun-table-info-id {
        font-size: 13px;
        color: #999;
        margin-bottom: 10px;
      }
      .fun-table-info-tips {
        font-size: 13px;
        color: #999;
      }
    }
  }
  .fun-title {
    font-size: 16px;
    font-weight: 600;
  }
  .el-image {
    float: left;
  }
  .code-name {
    // float: left;
    line-height: 30px;
    margin-left: 5px;
  }
  .el-link-btn {
    margin: 0 5px;
  }
  .fun-pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>