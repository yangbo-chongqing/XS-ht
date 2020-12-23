<template>
  <div class="entry-code">
    <el-row :gutter="20">
      <el-col :span="14"><div class="entry-title">词条码</div></el-col>
      <el-col :span="10">
        <el-row :gutter="20">
          <el-col :span="18">
            <div class="entry-search">
              <el-input
                placeholder="请输入"
                v-model="keyword"
                clearable
                class="input-with-select"
                @keyup.enter.native="onSearch"
              >
                <el-select
                  v-model="entryselect"
                  slot="prepend"
                  placeholder="请选择"
                >
                  <el-option label="词条码" value="1"></el-option>
                  <el-option label="词条分类" value="0"></el-option>
                </el-select>
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="onSearch"
                ></el-button>
              </el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="entry-search">
              <el-button type="primary" @click="golinkpage('/codelist/create')"
                >新增二维码</el-button
              >
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div class="entry-table">
      <div class="entry-table-tips-btn">
        <div class="entry-table-tips-item">
          <el-button
            :loading="downloadLoading"
            type="primary"
            icon="el-icon-document"
            @click="handleDownload"
          >
            导出
          </el-button>
        </div>
        <div class="entry-table-tips-item">
          <el-select
            v-model="tipValue"
            @visible-change="(v) => visibleChange(v, 'cascader', cascaderClick)"
            ref="cascader"
            @change="tipsChange"
            placeholder="标签"
          >
            <el-option
              v-for="(item, index) in tipData"
              :key="index"
              :value="item.id"
              :label="item.tag_name"
            >
            </el-option>
          </el-select>
        </div>
        <div class="entry-table-tips-item">
          <el-checkbox
            v-model="checked1"
            @change="ctypeChange"
            label="草稿"
            border
          ></el-checkbox>
        </div>
      </div>
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
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.sort"
              @blur="editSort(scope.row.id, scope.row.sort)"
              placeholder="排序"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="二维码名称">
          <template slot-scope="scope">
            <img
              class="code-img"
              :src="scope.row.mini_code"
              width="30"
              alt=""
              srcset=""
            />
            <span class="code-name">{{ scope.row.name }}</span>
            <div class="code-ftype">
              标签：<span
                class="tips"
                v-for="(lableel, index) in scope.row.tag"
                :key="lableel.id"
                >{{ lableel.tag_name
                }}<i
                  class="del-tip el-icon-close"
                  @click="deltips(scope, index)"
                ></i></span
              ><span class="addtips" @click="addTips(scope)">+标签</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="分类" align="center">
          <template slot-scope="scope">
            <el-tag>{{
              scope.row.type.type_name ? scope.row.type.type_name : "暂无分类"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.create_time }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.state == 1">已发布</el-tag>
            <el-tag type="danger" v-if="scope.row.state == 2">草稿</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <span class="el-link-btn"
              ><el-link
                type="primary"
                @click="downloadImg(scope.row.mini_code, 'code')"
                >下载</el-link
              ></span
            >
            <span class="el-link-btn"
              ><el-link type="primary" @click="togglePopover(scope.row.id)"
                >预览</el-link
              ></span
            >
            <span class="el-link-btn"
              ><el-link
                type="primary"
                @click="golinkpage('/codelist/edit', { id: scope.row.id })"
                >编辑</el-link
              ></span
            >
            <span class="el-link-btn"
              ><el-link type="primary" @click="delEntry(scope.row.id, scope)"
                >删除</el-link
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog
      title="添加标签"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div>
        <el-input
          type="text"
          placeholder="添加标签"
          v-model="entryTipVal"
          maxlength="10"
          show-word-limit
        >
        </el-input>
      </div>
      <div class="entry-his-tips" v-if="entryTipHisList">
        <p>最近使用</p>
        <div class="entry-his-tips-item">
          <span
            v-for="item in entryTipHisList"
            :key="item.id"
            @click="setTabCreate(item)"
            >{{ item.tag_name }}</span
          >
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createTag">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="标签管理" :visible.sync="dialogTableVisible">
      <el-table :data="gridData" height="450" border>
        <el-table-column property="tag_name" label="标签名称"></el-table-column>
        <el-table-column
          property="tag_object_count"
          label="二维码数量"
        ></el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <div class="tag-btn-box">
              <span><el-link type="primary">重命名</el-link></span>
              <span
                ><el-link type="primary" @click="delTag(scope)"
                  >删除</el-link
                ></span
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <EntryQuery
      v-if="popoverFlag"
      :infoUrl="'http://xsdth5.xunsheng.org.cn/#/entryinfo?id=' + id"
      :id="id"
      @popoverEven="togglePopover"
    />
  </div>
</template>
<script>
import { downloadIamge } from "@/utils/utils";
import table2excel from "js-table2excel";
import {
  entryCodeList,
  postDelRelics,
  postTagCreate,
  postTagDel,
  relicsRevise,
  postTagList,
} from "@/api/entrycode";
import { getGetMuse } from "@/api/settings";
import EntryQuery from "@/components/EntryQuery";
export default {
  name: "EntryCode",
  components: {
    EntryQuery,
  },
  data() {
    return {
      list: null,
      listLoading: true,
      multipleSelection: [],
      downloadLoading: false,
      dialogVisible: false,
      dialogTableVisible: false,
      filename: "",
      page: 1,
      pages: 0,
      count: 0,
      page_size: 10,
      keyword: this.$route.query.keyword || "",
      popoverFlag: false,
      checked1: false,
      draft: 0,
      entryselect: "1",
      tipValue: "",
      entryTipVal: "",
      entryId: "",
      tag_id: "",
      entryTipHisList: "",
      gridData: [],
      tipData: [{ tag_name: "标签" }],
    };
  },
  beforeRouteEnter(to, from, next) {
      if(from.name === 'EntryEdit' || from.name === 'CreateArticle') { //判断是从哪个路由过来的，若是detail页面不需要刷新获取新数据，直接用之前缓存的数据即可
          to.meta.isBack = true;
      }
      next();
  },
  activated() {
    if(!this.$route.meta.isBack) {
      this.page = 1;
      // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
      this.fetchData();
      this.GetMuse();
    }
    // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
    this.$route.meta.isBack = false
  },
  created() {
    this.fetchData();
    this.GetMuse();
  },
  methods: {
    //标签管理按钮
    cascaderClick() {
      this.dialogTableVisible = true;
      const params = {
        type: 0,
      };
      //查询是否存在历史记录
      postTagList(this.qs.stringify(params)).then((res) => {
        if (res.status == 200) {
          this.gridData = res.data.list;
        }
      });
    },
    //下拉列表添加管理按钮
    visibleChange(visible, refName, onClick) {
      if (visible) {
        const ref = this.$refs[refName];
        let popper = ref.$refs.popper;
        if (popper.$el) popper = popper.$el;
        if (
          !Array.from(popper.children).some(
            (v) => v.className === "el-cascader-menu__list"
          )
        ) {
          const el = document.createElement("ul");
          el.className = "el-cascader-menu__list";
          el.style =
            "border-top: solid 1px #E4E7ED; padding:0; color: #606266;";
          el.innerHTML = `<li class="el-cascader-node" style="height:38px;line-height: 38px">
<i class="el-icon-menu"></i>
<span class="el-cascader-node__label">分组管理</span>
</li>`;
          popper.appendChild(el);
          el.onclick = () => {
            // 底部按钮的点击事件 点击后想触发的逻辑也可以直接写在这
            onClick && onClick();
            // 以下代码实现点击后弹层隐藏 不需要可以删掉
            if (ref.toggleDropDownVisible) {
              ref.toggleDropDownVisible(false);
            } else {
              ref.visible = false;
            }
          };
        }
      }
    },
    //点击历史记录设置添加标签
    setTabCreate(item) {
      this.tag_id = item.id;
      this.entryTipVal = item.tag_name;
    },
    //添加标签
    createTag() {
      const params = {
        tag_name: this.entryTipVal,
        tag_id: this.tag_id,
        relics_id: this.entryId,
      };
      postTagCreate(this.qs.stringify(params)).then((res) => {
        if (res.status == 200) {
          this.dialogVisible = false;
          this.tag_id = "";
          this.entryTipVal = "";
          this.$message({
            type: "success",
            message: "添加成功",
          });
          this.list[scope.$index].tag.push(instance.inputValue);
          this.GetMuse();
        }
      });
    },
    //标签关闭操作
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 添加分组
    addTips(scope) {
      this.entryId = scope.row.id;
      this.dialogVisible = true;
      const params = {
        type: 1,
      };
      //查询是否存在历史记录
      postTagList(this.qs.stringify(params)).then((res) => {
        if (res.status == 200) {
          this.entryTipHisList = res.data.list;
        }
      });
    },
    //修改排序
    editSort(id, sortnum) {
      let params = {
        id: id,
        sort: sortnum,
      };
      relicsRevise(this.qs.stringify(params)).then((res) => {
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "修改成功请手动刷新",
          });
        }
      });
    },
    //查询所有分组
    GetMuse() {
      const params = {
        type: 0,
      };
      //查询是否存在历史记录
      postTagList(this.qs.stringify(params)).then((res) => {
        if (res.status == 200) {
          this.tipData = [{ tag_name: "标签" }];
          this.tipData = this.tipData.concat(res.data.list);
        }
      });
    },
    //删除标签
    delTag(item) {
      let params = {
        tag_id: item.row.id,
      };
      this.$prompt(
        "一旦删除标签，这些二维码上的标签会被删除，请谨慎操作！",
        `确定删除：标签 「${item.row.tag_name}」，该标签下共有 ${item.row.tag_object_count} 个二维码`,
        {
          confirmButtonClass: "btnFalses",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPlaceholder: "请输入'删除'确认删除",
          beforeClose: (action, instance, done) => {
            if (action == "confirm") {
              if (instance.inputValue != "删除") {
                this.$message({
                  type: "success",
                  message: "文字输出成功！请输入'删除'",
                });
              } else {
                postTagDel(this.qs.stringify(params)).then((res) => {
                  if (res.status == 200) {
                    this.gridData.splice(item.$index, 1);
                    this.$message({
                      type: "success",
                      message: "删除成功",
                    });
                    this.GetMuse();
                    done();
                  }
                });
              }
            } else {
              done();
            }
          },
        }
      ).catch(() => {});
    },
    //删除词条上标签
    deltips(item, index) {
      let params = {
        relics_id: item.row.id,
        tag_id: item.row.tag[index].id,
      };
      postTagDel(this.qs.stringify(params)).then((res) => {
        if (res.status == 200) {
          this.list[item.$index].tag.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.GetMuse();
        }
      });
    },
    togglePopover(id) {
      this.id = id;
      this.popoverFlag = !this.popoverFlag;
    },
    downloadImg(img, imgname) {
      downloadIamge(img, imgname);
    },
    // 删除词条
    delEntry(id, item) {
      this.$confirm("此操作将删除该词条, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const parmas = {
            id: id,
          };
          postDelRelics(this.qs.stringify(parmas)).then((res) => {
            if (res.status == 200) {
              this.list.splice(item.$index, 1);
              this.$message({
                type: "success",
                message: "删除成功!",
              });
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
      this.checked1 = false;
      this.draft = 0;
      this.tipValue = "标签";
      localStorage.setItem("entrykeyword", this.keyword);
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
    //草稿查询切换
    ctypeChange() {
      this.draft = this.checked1 ? 1 : 0;
      this.fetchData();
    },
    //分组切换查询
    tipsChange() {
      this.fetchData();
    },
    fetchData() {
      this.listLoading = true;
      const params = {
        page: this.page,
        page_size: this.page_size,
        keyword: this.keyword,
        label: this.tipValue == "标签" ? "" : this.tipValue,
        draft: this.draft,
        type: this.entryselect,
      };
      entryCodeList(this.qs.stringify(params)).then((res) => {
        console.log(res.data.relics_list);
        this.pages = res.data.relics_list.last_page;
        this.count = res.data.relics_list.total;
        this.list = res.data.relics_list.data;
        this.listLoading = false;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDownload() {
      if (this.multipleSelection.length) {
        this.downloadLoading = true;
        const tHeader = [
          {
            title: "二维码名称",
            key: "name",
            type: "text",
          },
          {
            title: "二维码",
            key: "mini_code",
            type: "image",
            width: 100,
            height: 100,
          },
          {
            title: "分类",
            key: "typename",
            type: "text",
          },
          {
            title: "创建时间",
            key: "create_time",
            type: "text",
          },
        ];
        this.multipleSelection.map((item, index) => {
          item.typename = item.type.type_name;
        });

        console.log(this.multipleSelection);
        table2excel(tHeader, this.multipleSelection, "词条码.xls");
        this.downloadLoading = false;
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
<style lang="scss">
.btnFalses {
  background: red !important;
  border-color: red !important;
  color: #fff !important;
}
.entry-code {
  .el-select .el-input {
    width: 110px;
  }

  .el-table__row {
    .el-input__inner {
      border: none;
      text-align: center;
    }
  }
.el-message-box__message{
    color: red;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
<style lang="scss" scoped>
.entry-code {
  background: white;
  padding: 20px;
  box-sizing: border-box;
  
  .tag-btn-box {
    display: flex;
    justify-content: space-around;
  }
  .entry-his-tips {
    margin-top: 15px;
    .entry-his-tips-item {
      display: flex;
      flex-wrap: wrap;
      margin-top: 15px;
      span {
        background: rgba(0, 0, 0, 0.04);
        font-size: 12px;
        color: #333;
        padding: 3px 5px;
        border-radius: 3px;
        margin-right: 10px;
        margin-bottom: 10px;
        cursor: pointer;
      }
    }
  }
  .entry-table-tips-btn {
    margin: 15px 0;
    &::after {
      content: "";
      display: block;
      width: 100%;
      clear: both;
    }
    .entry-table-tips-item {
      float: left;
      margin-right: 10px;
    }
  }
  .code-ftype {
    clear: both;
    font-size: 12px;
    color: #9b9b9b;
    padding-top: 10px;
    .tips {
      display: inline-flex;
      position: relative;
      padding: 0 6px;
      height: 20px;
      margin-right: 8px;
      margin-bottom: 8px;
      border-radius: 2px;
      background: #f5f5f5;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 18px;
      cursor: pointer;
      .del-tip {
        display: none;
        position: absolute;
        right: 0;
        top: 0;
        background: #999;
        line-height: 18px;
        width: 18px;
        text-align: center;
      }
      &:hover {
        .del-tip {
          display: block;
        }
      }
    }
    .addtips {
      border: 1px dashed rgba(0, 0, 0, 0.15);
      border-radius: 2px;
      color: #999;
      font-size: 12px;
      line-height: 18px;
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      &:hover {
        border-color: #409eff;
        color: #409eff;
      }
    }
  }
  .entry-title {
    font-size: 16px;
    font-weight: 600;
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
</style>
