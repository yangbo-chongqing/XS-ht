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
                  v-model="keyword"
                  type="search"
                  placeholder="搜索产品码"
                  ><i slot="prefix" class="el-input__icon el-icon-search" />
                  <el-button slot="append" @click="onSearch">搜索</el-button>
                </el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="entry-search">
                <el-button
                  type="primary"
                  @click="golinkpage('/product/productcreate')"
                  >新增产品码</el-button
                >
              </div>
            </el-col>
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
        border
        fit
        highlight-current-row
      >
        <el-table-column label="产品编号" width="220" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.unique }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 30px; height: 30px; object-fit: cover"
              :src="scope.row.image"
              :preview-src-list="[scope.row.image]"
            >
            </el-image>
            <span class="code-name">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="厂家" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.factory }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="上市时间" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.listed }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否上架" width="220" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.showFlag"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="toggleShow(scope.row.id,scope.row.showFlag)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center"  label="操作" width="220">
          <template slot-scope="scope">
            <span class="el-link-btn"
              ><el-link
                type="primary"
                >下载二维码</el-link
              ></span
            >
            <span class="el-link-btn"
              ><el-link
                type="primary"
                @click="golinkpage('/product/productedit', { id: scope.row.id })"
                >编辑</el-link
              ></span
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="entry-pagination" v-if="showPage">
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
  </div>
</template>

<script>
import { productList,productEdit } from "@/api/product";
export default {
  name: "ProductCode",
  data() {
    return {
      list: null,
      listLoading: true,
      keyword: "",
      page: 1,
      count: 0,
      showPage: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    onSearch() {
      this.page = 1;
      this.fetchData();
    },
    golinkpage(page, obj) {
      this.$router.push({
        path: page,
        query: {
          ...obj,
        },
      });
    },
    handleSizeChange(size) {
      this.page = size;
      this.fetchData();
    },
    handleCurrentChange(size) {
      this.page = size;
      this.fetchData();
    },
    //是否上架
    toggleShow(id,flag){
      let loading = this.$loading({
        text:'修改中...'
      })
      let parmas = {
        id: id,
        show: flag?1:0,
      };
      productEdit(this.qs.stringify(parmas)).then((res)=>{
        loading.close();
        if (res.status == 200) {
          this.$message({
            message: res.message,
            type: "success",
          });
        }
      })
    },
    fetchData() {
      this.listLoading = true;
      let parmas = {
        page: this.page,
        keyword: this.keyword,
      };
      productList(this.qs.stringify(parmas)).then((res) => {
        this.count = res.data.total;
        if(res.data.data.length>0){
          res.data.data.map((item,index)=>{
            item.showFlag = item.show==1?true:false;
          })
        }
        this.list = res.data.data;
        console.log(this.list);
        this.listLoading = false;
        this.showPage = res.data.last_page > 1 ? true : false;
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
    float: left;
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
