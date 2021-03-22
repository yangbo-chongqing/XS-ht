<template>
  <div class="fun-code">
    <div class="fun-code-head">
      <el-row>
        <el-col :span="14"><div class="entry-title">产品码</div></el-col>
        <el-col :span="10">
          <el-row :gutter="20">
            <el-col :span="18">
              <div class="entry-search">
                <el-input
                  v-model="pageList.keyword"
                  type="search"
                  clearable
                  placeholder="搜索产品码"
                  ><i slot="prefix" class="el-input__icon el-icon-search" />
                  <el-button slot="append" @click="onSearch">搜索</el-button>
                </el-input>
              </div>
            </el-col>

            <!-- <el-col :span="6">
              <div class="entry-search">
                <el-button type="primary" @click="golinkpage('/customCode')"
                  >新增扩展字段</el-button
                >
              </div>
            </el-col> -->
            <el-col :span="5" v-if="userinfo.purview.product.add">
              <div class="entry-search">
                <el-button
                  type="primary"
                  @click="golinkpage('/codelist/productedit', {})"
                  >新增产品码</el-button
                >
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="fun-table">
      <el-row>
        <!-- 分类板块 -->
        <el-col :span="5">
          <div class="entry-type-menu" style="padding-top: 10px">
            <div class="entry-type-menu-title">
              分类<span v-if="treeCount">共{{ treeCount }}个码</span>
            </div>
            <el-tree
              v-if="tree"
              :data="tree"
              node-key="id"
              @node-click="entryTypeToggle"
              draggable
              ref="entryTypeList"
              @node-drop="node_drop"
              :allow-drop="allowDrop"
            >
              <span class="custom-tree-node" slot-scope="{ noed, data }">
                <span v-if="!data.edit">{{ data.type_name }}</span>
                <span v-else
                  ><input
                    class="entry-type-input"
                    autofocus
                    @focus="selectText($event)"
                    @keyup.enter="$event.target.blur"
                    @blur="entryTypeEdit(data)"
                    type="text"
                    v-model="data.type_name"
                /></span>
                <span @click.stop="return false;">
                  <el-button class="code-num" type="text" size="mini">
                    {{ data.count }}
                  </el-button>
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                      <el-button
                        type="text"
                        size="mini"
                        icon="el-icon-more"
                        class="down-btn"
                      >
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        icon="el-icon-plus"
                        v-if="!data.top_id"
                        @click.native="() => addChildType(noed, data)"
                        >创建子分类</el-dropdown-item
                      >
                      <el-dropdown-item
                        icon="el-icon-edit"
                        @click.native="() => editFlagToggle(noed, data)"
                        >重命名</el-dropdown-item
                      >
                      <el-dropdown-item
                        icon="el-icon-delete"
                        @click.native="delType(data.id)"
                        >删除</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                </span>
              </span>
            </el-tree>
            <div class="add-entry-type">
              <el-button size="small" @click="addEntryType" icon="el-icon-plus"
                >新建分类</el-button
              >
            </div>
          </div>
        </el-col>
        <el-col :span="19">
          <!-- 表格展示模块 -->
          <el-table
            ref="multipleTable"
            v-loading="listLoading"
            :data="list"
            element-loading-text="拼命加载中"
            :height="tableHeight"
            border
            fit
            highlight-current-row
            @sort-change="changeTableSort"
          >
            >
            <el-table-column
              label="产品编号"
              prop="unique"
              :sortable="'custom'"
              width="150"
              align="center"
            >
            </el-table-column>
            <el-table-column label="产品名称" align="center">
              <template slot-scope="scope">
                <span class="code-name">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="产品码统计" align="center">
              <template slot-scope="scope">
                <div
                  style="
                    text-align: center;
                    overflow: hidden;
                    display: inline-block;
                  "
                >
                  订阅人数:{{ scope.row.subscribe_number }}; 扫码人数:{{
                    scope.row.scan_code_number
                  }}; 浏览次数:{{ scope.row.watch_number }};
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="320">
              <template slot-scope="scope">
                <span class="el-link-btn" v-if="userinfo.purview.flowing.select"
                  ><el-link
                    type="primary"
                    @click="
                      golinkpage('/codelist/flowcode', {
                        id: scope.row.id,
                        page: page,
                      })
                    "
                    >查看流水码</el-link
                  ></span
                >
                <span class="el-link-btn"
                  ><el-link
                    type="primary"
                    @click="
                      openPopover(
                        'http://xsdt.xunsheng.org.cn/api/web/code?type=4&id=' +
                          scope.row.id +
                          '&muse_id=' +
                          userinfo.user_info.muse_id,
                        scope.row.name
                      )
                    "
                    >下载二维码</el-link
                  ></span
                >
                <span class="el-link-btn" v-if="userinfo.purview.product.edit"
                  ><el-link
                    type="primary"
                    @click="
                      golinkpage('/codelist/productedit', {
                        id: scope.row.id,
                        page: page,
                      })
                    "
                    >编辑</el-link
                  ></span
                >
                <span class="el-link-btn" v-if="userinfo.purview.product.del">
                  <el-link type="primary" @click="dele(scope.row)"
                    >删除</el-link
                  >
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div class="entry-pagination">
        <el-pagination
          :current-page="pageList.page * 1"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count"
          :page-size="pageList.page_size * 1"
          :page-sizes="[20, 50, 70, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <codedown
        :titleName="titleName"
        :dialogVisible="codeDialog"
        :codeImg="codeImg"
        @toggleDialog="toggle"
      />
    </div>
  </div>
</template>

<script>
import {
  productList,
  productEdit,
  preview,
  manualList,
  manualCreate,
  productDel,
  createType,
  structure,
  postTypeSort,
  postTypeEdit,
  postTypeDel,
} from "@/api/product";
import { downloadIamge } from "@/utils/utils";
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import { getQiToken } from "@/api/user";
import codedown from "@/components/codeDown/index";
export default {
  name: "ProductCode",
  components: {
    codedown,
  },

  data() {
    return {
      list: null,
      listLoading: true,
      page: 1,
      count: 0,
      options: [],
      value: [],
      loading: false,
      showPage: false,
      headers: { Authorization: "Bearer " + getToken() },
      tableHeight: document.body.clientHeight - 200,
      addInstruFlag: false,
      addinstruFromFlag: false,
      addInspectionFlag: false,
      type: "",
      treeCount: 0,
      order: 1,
      tree: [],
      productId: 0,
      form: {
        manual_name: "",
        fileList: [],
      },
      codeDialog: false,
      codeImg: "",
      titleName: "",
      pageList: {
        keyword: this.$route.query.keyword || "",
        page: this.$route.query.page || 1,
        order: this.$route.query.order || 1,
        page_size: this.$route.query.page_size || 20,
        type_id: this.$route.query.type_id || 0,
      },
    };
  },
  computed: {
    ...mapGetters(["userinfo"]),
  },
  created() {
    this.fetchData();

    // 获取七牛token
    getQiToken().then((res) => {
      let str = res.data.data;
      str.token = JSON.parse(JSON.stringify(str.upToken));
      str.key = JSON.parse(JSON.stringify(str.path));
      delete str.path;
      delete str.upToken;
      sessionStorage.setItem("qiToken", JSON.stringify(str));
    });
    this.getstructure();
  },
  methods: {
    dele(id) {
      // 删除产品码
      console.log(id);
      productDel(this.qs.stringify({ id: id.id })).then((res) => {
        if (res.status == 200) {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.fetchData();
        }
      });
    },
    getstructure() {
      structure().then((res) => {
        if (res.status == 200) {
          this.tree = res.data.data.list;
          this.treeCount = res.data.data.count;
        }
      });
    },
    //切换分类数据
    entryTypeToggle(data, node) {
      this.pageList.type_id = data.id;
      this.keyword = "";
      this.fetchData();
    },
    //自动选中文本值
    selectText(e) {
      e.currentTarget.select();
    },
    //修改分类名称
    entryTypeEdit(data) {
      let params = {
        id: data.id,
        name: data.type_name,
      };
      postTypeEdit(this.qs.stringify(params)).then((res) => {
        if (res.status == 200) {
          this.$set(data, "edit", false);
          this.$message({
            message: res.message,
            type: "success",
          });
        }
      });
    },
    //拖动判断
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.level == 2) {
        return false;
      } else {
        return true;
      }
    },
    node_drop() {
      //拖动完成提交数据

      console.log(this.tree);
      postTypeSort(
        this.qs.stringify({ type_json: JSON.stringify(this.tree) })
      ).then((res) => {
        if (res.status == 200) {
          this.getstructure();
        }
      });
    },
    //添加分类
    addEntryType() {
      let params = {
        name: "未命名分类",
      };
      createType(this.qs.stringify(params)).then((res) => {
        if (res.status == 200) {
          res.data.data.edit = true;
          let addData = res.data.data;
          this.tree.push(addData);
          this.$message({
            message: res.message,
            type: "success",
          });
        }
      });
    },
    changeTableSort(column) {
      if (column.order == "ascending") {
        this.pageList.order = 0;
      } else {
        this.pageList.order = 1;
      }
      this.fetchData();
    },
    toggle() {
      this.codeDialog = !this.codeDialog;
      this.codeImg = "";
    },
    openPopover(code, name) {
      this.codeImg = code;
      this.titleName = name;
      this.codeDialog = true;
    },
    handleRemove(file, fileList) {
      this.form.fileList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true;
    },
    handleDownload(file) {},
    imageUploadSuccess(response, file, fileList) {
      this.form.fileList = fileList;
    },
    uploadProgress() {},
    downloadImg(id, name) {
      let params = {
        type: 0,
        id: id,
      };
      preview(this.qs.stringify(params)).then((res) => {
        if (res.status == 200) {
          downloadIamge(res.data.img, name);
        }
      });
    },
    onSearch() {
      this.pageList.page = 1;
      this.fetchData();
    },
    golinkpage(page, obj) {
      console.log(obj);
      this.$router.push({
        path: page,
        query: {
          ...obj,
        },
      });
    },
    //添加子分类
    addChildType(node, data) {
      this.$refs.entryTypeList.store.nodesMap[data.id].expanded = true;
      let params = {
        name: "未命名分类",
        top_id: data.id,
      };
      createType(this.qs.stringify(params)).then((res) => {
        if (res.status == 200) {
          res.data.data.edit = true;
          let addData = res.data.data;
          data.children.push(addData);
          this.$message({
            message: res.message,
            type: "success",
          });
        }
      });
    },
    //切换重命名输入
    editFlagToggle(noeds, data) {
      this.$set(data, "edit", true);
    },
    //分类删除
    delType(id) {
      this.$confirm("此操作将删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const parmas = {
            id: id,
          };
          postTypeDel(this.qs.stringify(parmas)).then((res) => {
            if (res.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getstructure();
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
    handleSizeChange(size) {
      this.pageList.page_size = size;
      sessionStorage.setItem("pageSize", this.pageList.page_size * 1);

      this.pageList.page = 1;
      this.fetchData();
    },
    handleCurrentChange(size) {
      this.pageList.page = size;
      this.fetchData();
    },
    //是否上架
    toggleShow(id, flag) {
      let loading = this.$loading({
        text: "修改中...",
      });
      let parmas = {
        id: id,
        show: flag ? 1 : 0,
      };
      productEdit(this.qs.stringify(parmas)).then((res) => {
        loading.close();
        if (res.status == 200) {
          this.$message({
            message: res.message,
            type: "success",
          });
        }
      });
    },
    fetchData() {
      this.listLoading = true;
      productList(this.qs.stringify(this.pageList)).then((res) => {
        this.count = res.data.total;
        if (res.data.data.length > 0) {
          res.data.data.map((item, index) => {
            item.showFlag = item.show == 1;
          });
        }
        this.list = res.data.data;
        this.listLoading = false;
        this.showPage = res.data.last_page > 1;
        this.$router.push({ path: "productcode", query: this.pageList });
      });
    },
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
    margin: 20px 0 0 0;
    text-align: center;
  }
  .fun-table {
    .entry-type-menu {
      width: 260px;
      flex-shrink: 0;
      border-right: 1px solid #e0e1e3;
      .entry-type-input {
        border: 1px solid #66b1ff;
        border-radius: 5px;
        padding: 4px;
        box-sizing: border-box;
      }
      .add-entry-type {
        text-align: center;
        margin-top: 15px;
      }
      .el-tree-node__content {
        height: 35px;
      }
      .code-num {
        color: #333;
      }
      .down-btn {
        display: none;
      }
      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
      }
      .entry-type-menu-title {
        font-size: 16px;
        color: #333;
        padding-left: 20px;
        box-sizing: border-box;
        margin-bottom: 15px;
        span {
          font-size: 14px;
          color: #999;
          margin-left: 10px;
        }
      }
    }
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
.entry-type-menu {
  .el-tree-node__content {
    height: 35px;
    &:hover {
      .down-btn {
        display: inline-block;
      }
      .code-num {
        display: none;
      }
    }
  }
}
</style>
