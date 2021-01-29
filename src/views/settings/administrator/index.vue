<template>
  <div class="entry-code">
    <el-row :gutter="20">
      <el-col :span="14"><div class="entry-title">子管理员列表</div></el-col>
      <el-col :span="10">
        <el-row :gutter="20">
          <!-- <el-col :span="18">
            <div class="entry-search">
              <el-input
                v-model="keyword"
                type="search"
                placeholder="请输入"
              ><i slot="prefix" class="el-input__icon el-icon-search" />
                <el-button slot="append" @click="onSearch">搜索</el-button>
              </el-input>
            </div>
          </el-col> -->
          <el-col :span="6">
            <div class="entry-search">
              <!-- <el-button
                type="primary"
                @click="golinkpage('/codelist/create')"
              >新增二维码</el-button> -->
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div class="entry-table">
      <!-- <el-button
        :loading="downloadLoading"
        style="margin-bottom: 20px"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
      >
        下载二维码
      </el-button> -->
      <!-- <el-button
        :loading="downloadLoading"
        style="margin-bottom: 20px"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
      >
        导出
      </el-button> -->
      <!-- <el-button
        :loading="downloadLoading"
        style="margin-bottom: 20px"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
      >
        删除
      </el-button> -->
      <el-button style="margin-bottom: 20px" type="primary" @click="addAdmin"
        >新增管理员</el-button
      >

      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="管理员名称">
          <template slot-scope="scope">
            <img
              class="code-img"
              :src="scope.row.avatar"
              width="30"
              alt=""
              srcset=""
            />
            <span class="code-name">{{ scope.row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" align="center">
          <template slot-scope="scope">
            {{ scope.row.mobile }}
          </template>
        </el-table-column>
        <el-table-column label="添加时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.create_time }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <span class="el-link-btn"
              ><el-link
                type="primary"
                @click="delDelAadmin(scope.row.user_id, scope)"
                >删除</el-link
              ></span
            >
            <span class="el-link-btn"
              ><el-link type="primary" @click="editAadmin(scope.row)"
                >权限编辑</el-link
              ></span
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="title" width="400px" :visible.sync="dialogFormVisible">
      <div v-if="title == '创建子管理员'" style="padding-bottom: 10px">
        手机号码：<el-input v-model="mobile" style="width: 220px" />
      </div>
      <span style="margin-bottom: 10px" v-if="title == '创建子管理员'"
        >权限分配：</span
      >
      <el-tree
        :data="data"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        :default-checked-keys="selectHave"
        highlight-current
        :props="defaultProps"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editTree">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSubAdmin,
  delAadmin,
  insertAdmin,
  subadminDetail,
  subadminEdit,
} from "@/api/settings";
export default {
  name: "EntryCode",
  data() {
    return {
      list: null,
      listLoading: true,
      multipleSelection: [],
      downloadLoading: false,
      filename: "",
      page: 1,
      pages: 0,
      id: "",
      title: "",
      dataList: [],
      mobile: "",
      count: 0,
      page_size: 10,
      data: [],
      keyword: "",
      form: {},
      selectHave: [],
      dialogFormVisible: false,
      formLabelWidth: "80px",
      defaultProps: {
        children: "list",
        label: "name",
      },
    };
  },
  created() {
    this.SubAdmin();
  },
  methods: {
    // 添加管理员
    addAdmin() {
      this.title = "创建子管理员";
      this.dialogFormVisible = true;
      this.selectHave = [];
      this.data = this.dataList;
      this.mobile = "";
    },
    editTree() {
      // 子管理员创建或修改弹窗确认按钮
      if (this.title == "创建子管理员") {
        let data = this.$refs.tree.getCheckedNodes();
        let rules = [];
        for (let i = 0; i < data.length; i++) {
          rules.push(data[i].id);
        }
        const params = {
          mobile: this.mobile,
          rules: JSON.stringify(rules),
        };
        insertAdmin(this.qs.stringify(params)).then((res) => {
          if (res.status == 200) {
            this.$message({
              type: "success",
              message: "添加成功",
            });
            this.SubAdmin();
          }
        });
      } else {
        let data = this.$refs.tree.getCheckedNodes();
        let rules = [];
        for (let i = 0; i < data.length; i++) {
          rules.push(data[i].id);
        }
        let params = {
          user_id: this.id,
          rules: JSON.stringify(rules),
        };
        subadminEdit(this.qs.stringify(params)).then((res) => {
          if (res.status == 200) {
            this.$message({
              type: "success",
              message: "编辑成功",
            });
            this.SubAdmin();
          }
        });
      }
      this.dialogFormVisible = false;
    },
    editAadmin(row) {
      // 编辑获取权限树状图
      this.title = "权限编辑";
      this.selectHave = [];
      this.dialogFormVisible = true;
      // this.data=
      this.id = row.user_id;
      console.log(row.user_id);
      subadminDetail(this.qs.stringify({ user_id: row.user_id })).then(
        (res) => {
          this.data = res.data.rules;
          for (let i = 0; i < this.data[0].list.length; i++) {
            if (this.data[0].list[i].have == 1) {
              this.selectHave.push(this.data[0].list[i].id);
            }
          }
        }
      );
    },
    // 删除管理员
    delDelAadmin(id, item) {
      this.$confirm("此操作将删除该管理员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const parmas = {
            del_user_id: id,
          };
          delAadmin(this.qs.stringify(parmas)).then((res) => {
            if (res.status == 200) {
              this.list.splice(item.$index, 1);
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.SubAdmin();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    golinkpage(page, obj) {
      this.$router.push({
        path: page,
        query: {
          ...obj,
        },
      });
    },
    onSearch() {
      this.page = 1;
      this.fetchData();
    },
    handleSizeChange(size) {
      this.page = size;
      this.fetchData();
    },
    handleCurrentChange(size) {
      this.page = size;
      this.fetchData();
    },
    SubAdmin() {
      this.listLoading = true;
      getSubAdmin().then((res) => {
        this.list = res.data.user_list;
        this.dataList = res.data.rule;
        this.listLoading = false;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDownload() {
      if (this.multipleSelection.length) {
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then((excel) => {
          const tHeader = ["二维码", "二维码名称", "分类", "创建时间"];
          const filterVal = [
            {
              title: "二维码",
              key: "mini_code",
              type: "image",
              width: 50,
              height: 50,
            },
            "name",
            "type_name",
            "create_time",
          ];
          const list = this.multipleSelection.map((item, index) => {
            item.type_name = item.type.type_name;
            return item;
          });
          const data = this.formatJson(filterVal, list);
          console.log(list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
          });
          this.$refs.multipleTable.clearSelection();
          this.downloadLoading = false;
        });
      } else {
        this.$message({
          message: "请选择导出的数据",
          type: "warning",
        });
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
  },
};
</script>

<style lang="scss" scoped>
.entry-code {
  background: white;
  padding: 20px;
  box-sizing: border-box;
  .entry-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 40px;
  }
  .code-img {
    float: left;
  }
  .code-name {
    float: left;
    line-height: 30px;
    margin-left: 5px;
  }
  .el-link-btn {
    margin: 0 5px;
  }
  .entry-pagination {
    margin-top: 20px;
    text-align: right;
  }
}
.inputWid {
  width: 220px;
}
</style>
