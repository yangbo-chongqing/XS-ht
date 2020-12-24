<template>
  <div class="create-code">
    <div class="create-code-body">
      <div class="back-box" @click="goback">
        <i class="el-icon-arrow-left"></i> 返回列表
      </div>
      <el-row :gutter="20">
        <el-col :span="18">
          <el-form ref="form" label-width="80px" label-position="top">
            <div class="create-code-body-title">
              <el-form-item label="词条名称">
                <el-input
                  v-model="codeTitle"
                  clearable
                  placeholder="请输入词条名称"
                />
              </el-form-item>
            </div>
            <div class="create-code-body-title create-tips">
              <el-form-item label="词条分类">
                <el-select v-model="typeCheck" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.type_name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
                <el-button
                  type="primary"
                  @click="createEntryTypeFlag = true"
                  :style="{ 'margin-left': '10px' }"
                  icon="el-icon-plus"
                ></el-button>
              </el-form-item>
              <el-form-item label="是否隐藏(主页列表不显示)">
                <el-checkbox v-model="endtyshowflag" label="隐藏"></el-checkbox>
              </el-form-item>
            </div>
            <el-form-item label="词条封面">
              <div class="create-code-body-upload">
                <div v-if="codeImage" class="upload-info">
                  <div class="code-img-tips">
                    <el-button type="warning" @click="delCodeImg"
                      >删除</el-button
                    >
                  </div>
                  <div class="upload-info-img">
                    <img :src="codeImage" width="100%" alt="" />
                  </div>
                </div>
                <div v-if="codeVideo" class="upload-info">
                  <div class="code-img-tips">
                    <el-button type="warning" @click="delCodeVideo"
                      >删除</el-button
                    >
                  </div>
                  <video width="100%" controls :src="codeVideo" />
                </div>
                <div v-if="codeAudio" class="upload-info">
                  <div class="code-img-tips">
                    <el-button type="warning" @click="delCodeAudio"
                      >删除</el-button
                    >
                  </div>
                  <audio width="100%" controls :src="codeAudio" />
                </div>
                <el-row v-if="!codeImage || !codeVideo || !codeAudio">
                  <!-- <el-col :span="6"><p class="upload-tips">重点内容</p></el-col> -->
                  <el-col :span="4">
                    <el-upload
                      class="upload-demo"
                      action="/api/store/upload"
                      :headers="headers"
                      :on-success="imageUploadSuccess"
                      accept=".jpg,.png"
                      :show-file-list="false"
                      :on-change="uploadProgress"
                    >
                      <el-button size="small" type="primary"
                        >图片<i class="el-icon-upload el-icon--right"
                      /></el-button>
                    </el-upload>
                  </el-col>
                  <el-col :span="4">
                    <el-upload
                      class="upload-demo"
                      action="/api/store/upload"
                      :headers="headers"
                      :show-file-list="false"
                      accept=".MPEG,.MP3,.MPEG-4,.MIDI,.WMA"
                      :on-success="audioUploadSuccess"
                      :on-change="uploadProgress"
                    >
                      <el-button size="small" type="primary"
                        >音频<i class="el-icon-upload el-icon--right"
                      /></el-button>
                    </el-upload>
                  </el-col>
                  <el-col :span="4">
                    <el-upload
                      class="upload-demo"
                      action="/api/store/upload"
                      :headers="headers"
                      accept=".MPEG,.baiAVI,.nAVI,.ASF,.MOV,.3GP,.mp4"
                      :show-file-list="false"
                      :on-success="videoUploadSuccess"
                      :on-change="uploadProgress"
                    >
                      <el-button size="small" type="primary"
                        >视频<i class="el-icon-upload el-icon--right"
                      /></el-button>
                    </el-upload>
                  </el-col>
                </el-row>
                <el-progress
                  v-if="progressFlag"
                  :percentage="loadProgress"
                ></el-progress>
              </div>
            </el-form-item>
            <div class="cheditor-body" v-if="loadFlag">
              <div class="cheditor-title">词条内容</div>
              <div
                :class="isShowDoc ? 'cheditor-mybtn active' : 'cheditor-mybtn'"
                @click="isShowDoc = !isShowDoc"
              >
                <i class="el-icon-document" />
                <p>快速排版</p>
              </div>
              <ue
                :value="editorData"
                @input="setEditorData"
                :mobHtml="mobHtml"
              ></ue>
              <div class="create-code-body-title">
                <el-form-item label="排序">
                  <el-input
                    v-model="codeSort"
                    type="number"
                    placeholder="数值越小越排前"
                  />
                </el-form-item>
              </div>
              <div class="entry-entry-tip">
                <div class="entry-entry-item" @click="openPopver(1)">
                  <i class="el-icon-plus" /> 相关词条
                </div>
              </div>
              <div class="entry-entry-add-body">
                <div class="multipleSelection-body" v-if="checkList">
                  <span v-for="(item, index) in checkList" :key="item.id">
                    {{ item.name }}
                    <i
                      class="el-icon-close"
                      @click="checkListDel(index, item)"
                    ></i>
                  </span>
                </div>
              </div>
              <div class="entry-entry-tip">
                <div class="entry-entry-item" @click="openPopver(2)">
                  <i class="el-icon-plus" /> 我与
                </div>
              </div>
              <div class="entry-entry-add-body">
                <div class="multipleSelection-body" v-if="checkHisList">
                  <span v-for="(item, index) in checkHisList" :key="item.id">
                    {{ item.name }}
                    <i
                      class="el-icon-close"
                      @click="checkHisListDel(index, item)"
                    ></i>
                  </span>
                </div>
              </div>
            </div>
          </el-form>
        </el-col>
        <el-col :span="6">
          <div class="create-code-img">
            <img
              v-if="!id"
              src="@/assets/icon/create-codeno.png"
              alt=""
              srcset=""
            />
            <img v-else :src="'http://xsdt.xunsheng.org.cn/api/web/code?type=1&id='+id+'&muse_id='+userinfo.user_info.muse_id" alt="" srcset="" />
            <div v-if="!id" class="create-btn">
              <el-button type="primary" @click="publish(2)"
                >生成二维码</el-button
              >
            </div>
            <div v-else class="create-btn">
              <span
                ><el-link type="primary" @click="togglePopover"
                  >预览</el-link
                ></span
              >
              <span
                ><el-link
                  type="primary"
                  @click="openPopover('http://xsdt.xunsheng.org.cn/api/web/code?type=1&id='+id+'&muse_id='+userinfo.user_info.muse_id)"
                  >下载</el-link
                ></span
              >
              <div class="create-btn-yes">
                <el-button plain @click="entryEdit(2)">保存草稿</el-button>
                <el-button type="primary" @click="entryEdit(1)">发布</el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div v-if="isShowDoc" class="add-document-list">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="组合样式" name="first">
            <div class="styleLibTplWrapper" @click="setCheditor($event)">
              <div>
                <section
                  style="
                    font-size: 14px;
                    line-height: 1.4;
                    color: rgba(0, 0, 0, 0.87);
                    font-weight: bold;
                    text-align: center;
                  "
                >
                  <p>产品名称</p>
                </section>
                <section
                  style="
                    font-size: 20px;
                    line-height: 1.4;
                    color: rgba(0, 0, 0, 0.87);
                    font-weight: bold;
                    text-align: center;
                  "
                >
                  <p>产品介绍</p>
                </section>
              </div>
              <div>
                <section
                  class="stylelib-wrapper"
                  contenteditable="false"
                  data-theme-color="#365f93"
                  data-is-vip="undefined"
                  data-change-color="on"
                  data-key="text-tpl72"
                >
                  <section class="x-vipIcon">
                    <section style="display: none" />
                  </section>
                  <section>
                    <section
                      data-stylelib-stylename="background-color"
                      data-opacity-value="1/10"
                      style="
                        position: relative;
                        padding: 16px;
                        background-color: rgba(54, 95, 147, 0.1);
                        color: rgba(0, 0, 0, 0.87);
                        font-size: 14px;
                        line-height: 1.5;
                        overflow: hidden;
                        border-radius: 8px;
                      "
                    >
                      <section contenteditable="undefined">
                        公司莎车西站铁路物流专用线项目新建信号综合楼框架主题混凝土浇筑顺利完成。
                      </section>
                    </section>
                  </section>
                </section>
              </div>
              <div>
                <section>
                  <br />
                </section>
                <section
                  style="
                    font-size: 14px;
                    line-height: 1.4;
                    color: rgba(0, 0, 0, 0.87);
                    font-weight: bold;
                    text-align: center;
                  "
                >
                  <p>产品名称</p>
                </section>
                <section
                  style="
                    font-size: 20px;
                    line-height: 1.4;
                    color: rgba(0, 0, 0, 0.87);
                    font-weight: bold;
                    text-align: center;
                  "
                >
                  <p>产品信息</p>
                </section>
              </div>
              <div>
                <section
                  class="stylelib-wrapper stylelib-list"
                  contenteditable="false"
                  data-theme-color="#365f93"
                  data-is-vip="undefined"
                  data-change-color="on"
                  data-key="text-tpl73"
                >
                  <section class="x-vipIcon">
                    <section style="display: none" />
                  </section>
                  <section>
                    <section
                      class="stylelib-list-item"
                      style="margin-bottom: 8px"
                    >
                      <section
                        data-stylelib-stylename="background-color"
                        data-opacity-value="3/20"
                        style="
                          font-size: 14px;
                          font-weight: bold;
                          padding: 12px 16px;
                          color: rgba(0, 0, 0, 0.87);
                          background-color: rgba(54, 95, 147, 0.15);
                          line-height: 1.25;
                        "
                        contenteditable="undefined"
                      >
                        产品名称
                      </section>
                      <section
                        data-stylelib-stylename="background-color"
                        data-opacity-value="1/20"
                        style="
                          font-size: 13px;
                          padding: 12px 16px;
                          color: rgba(0, 0, 0, 0.87);
                          background-color: rgba(54, 95, 147, 0.05);
                          line-height: 1.25;
                        "
                        contenteditable="undefined"
                      >
                        油漆喷枪
                      </section>
                    </section>
                    <section
                      class="stylelib-list-item"
                      style="margin-bottom: 8px"
                    >
                      <section
                        data-stylelib-stylename="background-color"
                        data-opacity-value="3/20"
                        style="
                          font-size: 14px;
                          font-weight: bold;
                          padding: 12px 16px;
                          color: rgba(0, 0, 0, 0.87);
                          background-color: rgba(54, 95, 147, 0.15);
                          line-height: 1.25;
                        "
                        contenteditable="undefined"
                      >
                        产品品牌
                      </section>
                      <section
                        data-stylelib-stylename="background-color"
                        data-opacity-value="1/20"
                        style="
                          font-size: 13px;
                          padding: 12px 16px;
                          color: rgba(0, 0, 0, 0.87);
                          background-color: rgba(54, 95, 147, 0.05);
                          line-height: 1.25;
                        "
                        contenteditable="undefined"
                      >
                        草料二维码
                      </section>
                    </section>
                    <section
                      class="stylelib-list-item"
                      style="margin-bottom: 8px"
                    >
                      <section
                        data-stylelib-stylename="background-color"
                        data-opacity-value="3/20"
                        style="
                          font-size: 14px;
                          font-weight: bold;
                          padding: 12px 16px;
                          color: rgba(0, 0, 0, 0.87);
                          background-color: rgba(54, 95, 147, 0.15);
                          line-height: 1.25;
                        "
                        contenteditable="undefined"
                      >
                        产品型号
                      </section>
                      <section
                        data-stylelib-stylename="background-color"
                        data-opacity-value="1/20"
                        style="
                          font-size: 13px;
                          padding: 12px 16px;
                          color: rgba(0, 0, 0, 0.87);
                          background-color: rgba(54, 95, 147, 0.05);
                          line-height: 1.25;
                        "
                        contenteditable="undefined"
                      >
                        LUX-101
                      </section>
                    </section>
                  </section>
                </section>
              </div>
              <div>
                <section>
                  <br />
                </section>
                <section
                  style="
                    font-size: 14px;
                    line-height: 1.4;
                    color: rgba(0, 0, 0, 0.87);
                    font-weight: bold;
                    text-align: center;
                  "
                >
                  <p>产品名称</p>
                </section>
                <section
                  style="
                    font-size: 20px;
                    line-height: 1.4;
                    color: rgba(0, 0, 0, 0.87);
                    font-weight: bold;
                    text-align: center;
                  "
                >
                  <p>产品展示</p>
                </section>
              </div>
              <div>
                <section
                  class="stylelib-wrapper"
                  contenteditable="false"
                  data-theme-color="#365f93"
                  data-is-vip="undefined"
                  data-change-color="on"
                  data-key="text-tpl72"
                >
                  <section class="x-vipIcon">
                    <section style="display: none" />
                  </section>
                  <section>
                    <section
                      data-stylelib-stylename="background-color"
                      data-opacity-value="1/10"
                      style="
                        position: relative;
                        padding: 16px;
                        background-color: rgba(54, 95, 147, 0.1);
                        color: rgba(0, 0, 0, 0.87);
                        font-size: 14px;
                        line-height: 1.5;
                        overflow: hidden;
                        border-radius: 8px;
                      "
                    >
                      <section contenteditable="undefined">
                        公司莎车西站铁路物流专用线项目新建信号综合楼框架主题混凝土浇筑顺利完成。
                      </section>
                    </section>
                  </section>
                </section>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="select-entry-popover" v-if="entryXFlag"></div>
    <div class="select-entry-body" v-if="entryXFlag">
      <div>
        <el-input
          placeholder="请输入"
          v-model="entryTipValue"
          class="input-with-select"
          @keyup.enter.native="fetchData(type)"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="fetchData(type)"
          ></el-button>
        </el-input>
      </div>
      <div class="multipleSelection-body" v-if="multipleSelection">
        <span v-for="(item, index) in multipleSelection" :key="item.id">
          {{ item.name }}
          <i class="el-icon-close" @click="entrySelDel(index, item)"></i>
        </span>
      </div>
      <div class="popover-table">
        <!-- @row-click="btnRow" -->
        <el-checkbox-group v-model="multipleSelection">
          <el-table
            ref="multipleTable"
            v-loading="listLoading"
            :data="list"
            element-loading-text="拼命加载中"
            border
          >
            <el-table-column :label="type == 1 ? '关联词条' : '我与'">
              <template slot-scope="scope">
                <el-checkbox :label="scope.row">
                  <div class="scope-body">
                    <span class="code-name">{{ scope.row.name }}</span>
                  </div>
                </el-checkbox>
                <div v-if="type == 1">
                  <span
                    class="entry-toggle"
                    @click="entryToggle(scope.row)"
                    v-if="!scope.row.flag"
                    ><i class="el-icon-finished" size="30"
                  /></span>
                  <span
                    class="entry-toggle"
                    @click="entryToggle(scope.row)"
                    v-else
                    ><i class="el-icon-finished red" size="30"
                  /></span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-checkbox-group>

        <div>
          <div class="entry-pagination" v-if="list">
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
        <div class="entry-popover-btn-body">
          <el-button type="primary" plain @click="savePopover(type)"
            >确定</el-button
          >
          <el-button plain @click="closePopover()">取消</el-button>
        </div>
      </div>
    </div>
    <el-dialog title="添加分类" :visible.sync="createEntryTypeFlag" width="30%">
      <entrytype @createType="createEntryTypeFlag = false" :back-flag="false" />
    </el-dialog>
    <codedown :dialogVisible="dialogVisible" :codeImg="codeImg" @toggleDialog="toggle" />
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
import EntryQuery from "@/components/EntryQuery";
import { Loading } from "element-ui";
import { getToken } from "@/utils/auth";
import { mapGetters } from 'vuex'
import entrytype from "@/views/codelist/entrytype/create/index";
import codedown from "@/components/codeDown/index";
import {
  postPublish,
  postTypeList,
  postEntryList,
  RelicsList,
  entryCodeList,
  postEdit,
} from "@/api/entrycode";
import ue from "@/components/ue";
export default {
  name: "CreateArticle",
  components: {
    EntryQuery,
    ue,
    entrytype,
    codedown,
  },
  computed: {
    ...mapGetters(['userinfo'])
  },
  data() {
    return {
      activeName: "first",
      id: "",
      headers: { Authorization: "Bearer " + getToken() },
      popoverFlag: false,
      list: null,
      listLoading: true,
      multipleSelection: [],
      entryTipList: [],
      entryHisList: [],
      endtyshowflag: false,
      entryTipValue: "",
      checkList: [],
      checkHisList: [],
      entryHisValue: "",
      loading: false,
      codeTitle: "",
      codeImage: "",
      codeVideo: "",
      codeAudio: "",
      uploadLoading: "",
      isCkeditorFlag: false,
      codeImageFlag: false,
      fullscreenLoading: "",
      isShowDoc: false,
      mobHtml: "",
      editor: null, // 编辑器实例
      editorData: "",
      loadFlag: false,
      typeCheck: "",
      codeSort: 0,
      options: [],
      count: "",
      page: 1,
      page_size: 10,
      pages: "",
      type: 1,
      entryXFlag: false,
      flag: false,
      entrySelData: [],
      loadProgress: 0, // 动态显示进度条
      progressFlag: false, // 关闭进度条
      createEntryTypeFlag: false,
      dialogVisible: false,
      codeImg: "",
    };
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.loadFlag = true;
      }, 1000);
      this.queryType();
    });
  },
  methods: {
    toggle() {
      this.dialogVisible = !this.dialogVisible;
      this.codeImg = "";
    },
    openPopover(code) {
      this.codeImg = code;
      this.dialogVisible = true;
    },
    //模态窗确定
    savePopover(type) {
      if (type == 1) {
        this.checkList = this.multipleSelection;
      } else {
        this.checkHisList = this.multipleSelection;
      }
      this.closePopover();
    },
    //模态窗取消
    closePopover() {
      this.entryXFlag = false;
    },
    //打开模态窗
    openPopver(type) {
      this.type = type;
      if (type == 1) {
        this.multipleSelection = this.checkList;
      } else {
        this.multipleSelection = this.checkHisList;
      }
      this.entryXFlag = true;
      this.fetchData(type);
    },
    entryToggle(row) {
      row.flag = !row.flag;
    },
    //删除选中的相关数据
    entrySelDel(index, item) {
      this.multipleSelection.splice(index, 1);
    },
    //相关删除
    checkListDel(index, item) {
      this.checkList.splice(index, 1);
    },
    //我与删除
    checkHisListDel(index, item) {
      this.checkHisList.splice(index, 1);
    },
    handleSizeChange(size) {
      this.page = size;
      this.fetchData(this.type);
    },
    handleCurrentChange(size) {
      this.page = size;
      this.fetchData(this.type);
    },
    //查询所有
    fetchData(type) {
      this.type = type;
      this.listLoading = true;
      const params = {
        page: this.page,
        page_size: this.page_size,
        keyword: this.keyword,
        keyword: this.entryTipValue,
        type: type,
        scenes: 1,
      };
      postEntryList(this.qs.stringify(params)).then((res) => {
        res.data.list.data.map((item) => {
          item.flag = false;
        });
        this.pages = res.data.list.last_page;
        this.count = res.data.list.total;
        this.list = res.data.list.data;
        this.listLoading = false;
      });
    },
    //查询分类
    queryType() {
      const params = {
        type: 1,
      };
      postTypeList(this.qs.stringify(params)).then((res) => {
        this.options = res.data.data;
      });
    },
    setEditorData(data) {
      this.editorData = data;
    },
    togglePopover() {
      this.popoverFlag = !this.popoverFlag;
    },
    downloadImg(img, imgname) {
      downloadIamge(img, imgname);
    },
    // 查找相关
    remoteMethod(type) {
      this.loading = true;
      const params = {
        keyword: type == 1 ? this.entryTipValue : this.entryHisValue,
        type: type,
      };
      postEntryList(this.qs.stringify(params)).then((res) => {
        if (type == 1) {
          this.entryTipList = res.data.list;
        } else {
          this.entryHisList = res.data.list;
        }
        this.loading = false;
      });
    },
    // 返回
    goback() {
      this.$router.go(-1);
    },
    // 点击上传生成二维码
    publish(state) {
      let related_ids = [];
      let history_ids = [];
      this.checkList.map((item) => {
        let flag = item.flag ? 1 : 0;
        related_ids.push(item.id + "." + flag);
      });
      this.checkHisList.map((item) => {
        history_ids.push(item.id);
      });
      const parmas = {
        name: this.codeTitle,
        image: this.codeImage,
        voice_url: this.codeAudio,
        video_url: this.codeVideo,
        content: this.editorData,
        sort: this.codeSort,
        type_id: this.typeCheck,
        related_ids: related_ids.toString(),
        history_ids: history_ids.toString(),
        hide: this.endtyshowflag ? 1 : 0,
        state: state, //1发布2草稿
      };
      const loading = this.$loading();
      postPublish(this.qs.stringify(parmas)).then((res) => {
        this.id = res.data.id;
        loading.close();
      });
    },
    // 编辑
    entryEdit(state) {
      let related_ids = [];
      let history_ids = [];
      this.checkList.map((item) => {
        let flag = item.flag ? 1 : 0;
        related_ids.push(item.id + "." + flag);
      });
      this.checkHisList.map((item) => {
        history_ids.push(item.id);
      });
      const parmas = {
        id: this.id,
        name: this.codeTitle,
        image: this.codeImage,
        voice_url: this.codeAudio,
        video_url: this.codeVideo,
        content: this.editorData,
        sort: this.codeSort,
        type_id: this.typeCheck,
        related_ids: related_ids.toString(),
        history_ids: history_ids.toString(),
        hide: this.endtyshowflag ? 1 : 0,
        state: state, //1发布2草稿
      };
      const loading = this.$loading();
      postEdit(this.qs.stringify(parmas)).then((res) => {
        if (res.status == 200) {
          this.isEdit = true;
        }
        loading.close();
        if (state == 1) {
          this.golinkpage("/codelist/entrycode", {
            keyword: localStorage.getItem("entrykeyword"),
          });
        }
      });
    },
    delCodeImg() {
      this.codeImage = "";
    },
    delCodeVideo() {
      this.codeVideo = "";
    },
    delCodeAudio() {
      this.codeAudio = "";
    },
    imageUploadSuccess(response, file, fileList) {
      this.codeImage = response.data.file_path;
    },
    audioUploadSuccess(response, file, fileList) {
      this.codeAudio = response.data.file_path;
    },
    videoUploadSuccess(response, file, fileList) {
      this.codeVideo = response.data.file_path;
    },
    setCheditor(e) {
      this.mobHtml = e.target.innerHTML;
    },
    uploadProgress(file, fileList) {
      if (file.status === "ready") {
        this.loadProgress = 0;
        this.progressFlag = true; // 显示进度条
        let intval = setInterval(() => {
          if (this.loadProgress >= 99) {
            clearInterval(intval);
          }
          this.loadProgress += 1;
        }, 20);
      }
      if (file.status === "success") {
        this.loadProgress = 100;
      }
      setTimeout(() => {
        this.progressFlag = false;
      }, 1000); // 一秒后关闭进度条
    },
    onNamespaceLoaded(CKEDITOR) {},
    ckeditorReady() {
      this.isCkeditorFlag = true;
      this.fullscreenLoading.close();
    },
    handleClick(tab, event) {
      console.log(tab, event);
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
  watch: {
    createEntryTypeFlag(val) {
      if (!val) {
        this.queryType();
      }
    },
  },
};
</script>
<style lang="scss">
.create-code {
  .edui-editor-toolbarbox {
    padding-left: 75px;
    box-sizing: border-box;
  }
  .create-tips {
    display: flex;
    justify-content: space-between;
  }
  .el-table__row {
    .cell {
      display: flex;
      justify-content: space-between;
      span {
        flex-shrink: 0;
      }
    }
  }
  .create-code-body-title {
    .el-checkbox {
      width: 70%;
    }
    .el-checkbox__label {
      width: 100%;
    }
    .el-tabs__content {
      overflow-y: scroll;
      background: white;
    }
  }

  .cke_contents {
    height: 440px !important;
  }
}
</style>
<style lang="scss" scoped>
.create-code {
  max-height: 90vh;
  overflow-y: scroll;
  .back-box {
    padding: 10px 0;
    box-sizing: border-box;
    color: #999;
    cursor: pointer;
  }
  .entry-toggle {
    .red {
      color: #5387fd;
    }
    i {
      font-size: 20px;
      color: #999;
    }
  }
  .multipleSelection-body {
    width: 100%;
    margin-top: 15px;
    display: flex;
    flex-wrap: wrap;
    span {
      flex-shrink: 0;
      background: #ccc;
      color: #ffffff;
      padding: 2px 5px;
      margin-right: 10px;
      margin-top: 10px;
      border-radius: 5px;
      font-size: 14px;
      i {
        cursor: pointer;
      }
    }
  }
  .scope-body {
    display: flex;
    justify-content: space-between;
    .code-name {
      width: 100%;
    }
  }
  .select-entry-body {
    width: 500px;
    height: 800px;
    background: white;
    border-radius: 10px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1021;
    padding: 20px;
    box-sizing: border-box;
    .popover-table {
      margin-top: 15px;
    }
    .entry-popover-btn-body {
      text-align: center;
      margin-top: 15px;
    }
  }
  .select-entry-popover {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1020;
  }
  .entry-entry-tip {
    margin-top: 20px;
    .entry-entry-item {
      color: #5387fd;
    }
  }
  .create-code-body-title {
    margin-bottom: 20px;
  }
  .entry-entry-add-body {
    .entry-tip-list {
      margin-top: 15px;
    }
  }
  .create-code-title {
    background: white;
    line-height: 40px;
  }
  .create-code-img {
    position: fixed;
    top: 120px;
    width: 100%;
    width: 200px;
    text-align: center;
    img {
      width: 100%;
    }
    .create-btn {
      margin-top: 10px;
      .create-btn-yes {
        margin-top: 10px;
      }
      span {
        margin: 10px;
      }
    }
  }
  .cheditor-mybtn {
    &.active {
      background: white;
    }
    width: 60px;
    height: 60px;
    border: 1px solid #ccc;
    text-align: center;
    padding-top: 8px;
    box-sizing: border-box;
    position: absolute;
    top: 61px;
    left: 8px;
    z-index: 1000;
    cursor: pointer;
    i {
      font-size: 30px;
    }
    p {
      font-size: 12px;
    }
  }
  .cheditor-body {
    position: relative;
    .cheditor-title {
      vertical-align: middle;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 0 10px;
      box-sizing: border-box;
      font-weight: 700;
    }
  }
  .upload-info {
    .upload-info-img {
      width: 100%;
      max-height: 250px;
      overflow: hidden;
    }
    position: relative;
  }
  .create-code-body {
    max-width: 1000px;
    margin: auto;
    padding: 20px;
    box-sizing: border-box;
    background: white;
    position: relative;
    .add-document-list {
      width: 320px;
      position: fixed;
      left: 230px;
      top: 70px;
      background: white;
      padding: 20px;
      box-sizing: border-box;
      .styleLibTplWrapper {
        div {
          pointer-events: none;
        }
        cursor: pointer;
        &:hover {
          background: #f5f5f5;
        }
      }
    }
    .create-code-body-upload {
      position: relative;
      .code-img-tips {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 100;
      }
      &:hover {
        border-color: #114a78;
      }
      width: 100%;
      padding: 10px 20px;
      box-sizing: border-box;
      border: 2px dotted #dcdfe6;
      .upload-tips {
        line-height: 40px;
      }
    }
  }
}
</style>
