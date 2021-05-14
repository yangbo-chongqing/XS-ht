<template>
  <div class="create-code editor-scroll">
    <div class="create-code-body">
      <div class="back-box" @click="goback">
        <i class="el-icon-arrow-left"></i> 返回列表
      </div>
      <el-dialog
        title="添加分类"
        :visible.sync="createEntryTypeFlag"
        width="40%"
      >
        <entrytype
          @createType="createEntryTypeFlag = false"
          :back-flag="false"
        />
      </el-dialog>
      <el-row :gutter="20">
        <el-col :span="18">
          <el-form ref="form" label-width="80px" label-position="top">
            <div class="create-code-body-title">
              <el-form-item label="词条名称">
                <el-input v-model="codeTitle" placeholder="请输入词条名称" />
              </el-form-item>
            </div>
            <div class="create-code-body-title">
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
                <!-- <el-button //   添加分类
                  @click="createEntryTypeFlag = true"
                  type="primary"
                  :style="{ 'margin-left': '10px' }"
                  icon="el-icon-plus"
                ></el-button> -->
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
                      :before-upload="uploadPic"
                      :data="qiToken"
                      :on-error="uploadToken"
                      action="http://upload.qiniup.com"
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
                      :before-upload="uploadAudio"
                      :on-error="uploadToken"
                      :data="qiToken"
                      action="http://upload.qiniup.com"
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
                      action="http://upload.qiniup.com"
                      :on-error="uploadToken"
                      :data="qiToken"
                      :before-upload="uploadVideo"
                      :headers="headers"
                      accept=".mp4"
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
            <!-- 词条编辑 -->
            <div class="cheditor-body" v-if="loadFlag">
              <div class="cheditor-title">词条内容</div>
              <div class="ueBox">
                <el-menu
                  :default-active="activeIndex2"
                  class="el-menu-demo"
                  mode="horizontal"
                  @select="handleSelect"
                  background-color="#F2F2F2"
                  active-background-color="#333333"
                  text-color="#333333"
                  active-text-color="#333333"
                >
                  <el-menu-item index="1" @click="headline">标题</el-menu-item>
                  <el-menu-item index="3" @click="upload(3, '添加集锦')"
                    >活动集锦</el-menu-item
                  >
                  <el-menu-item index="5" @click="upload(4, '添加评测')"
                    >评测</el-menu-item
                  >
                  <el-menu-item index="7" @click="upload(6, '添加商城')"
                    >网络商城</el-menu-item
                  >
                  <el-menu-item index="6" @click="upload(2)">视频</el-menu-item>
                  <el-submenu index="2">
                    <template slot="title">模板</template>
                    <el-menu-item index="2-1">摩托车宣传</el-menu-item>
                    <el-menu-item index="2-2">摩托车售后</el-menu-item>
                    <el-menu-item index="2-3">景区宣传</el-menu-item>
                  </el-submenu>
                  <el-menu-item index="4"
                    ><a href="https://www.ele.me" target="_blank"
                      >订单管理</a
                    ></el-menu-item
                  >
                </el-menu>
              </div>
              <!-- <div
                :class="isShowDoc ? 'cheditor-mybtn active' : 'cheditor-mybtn'"
                @click="isShowDoc = !isShowDoc"
              >
                <i class="el-icon-document" />
                <p>快速排版</p>
              </div> -->
              <ue
                @transfereditor="getUe"
                :value="editorData"
                :ueConfig="ueConfig"
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
          <div class="create-code-img" v-if="codeSendImgData">
            <img
              :src="
                'http://xsdt.xunsheng.org.cn/api/web/code?type=1&id=' +
                codeSendImgData.id +
                '&muse_id=' +
                codeSendImgData.muse_id
              "
              alt=""
              srcset=""
            />
            <div class="create-btn">
              <span
                ><el-link type="primary" @click="togglePopover"
                  >预览</el-link
                ></span
              >
              <span
                ><el-link
                  type="primary"
                  @click="
                    openPopover(
                      'http://xsdt.xunsheng.org.cn/api/web/code?type=1&id=' +
                        codeSendImgData.id +
                        '&muse_id=' +
                        codeSendImgData.muse_id,
                      codeTitle
                    )
                  "
                  >下载</el-link
                ></span
              >
              <div class="create-btn-yes">
                <el-button plain @click="entryEdit(2)">保存草稿</el-button>
                <el-button type="primary" @click="entryEdit(1)">发布</el-button>
                <!-- <el-button v-else type="primary" @click="goback"
                  >完成</el-button
                > -->
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="select-entry-popover" v-if="entryXFlag"></div>
    <!-- 词条关联 -->
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
            height="600"
            element-loading-text="拼命加载中"
            border
          >
            <el-table-column>
              <template slot="header">
                <div class="table-header">
                  <div>{{ type == 1 ? "关联词条" : "我与" }}</div>
                  <div>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="双向关联为两词条相互关联上"
                      placement="left"
                    >
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </div>
                </div>
              </template>
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
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="双向关联"
                      placement="top"
                    >
                      <i class="el-icon-connection" size="30" />
                    </el-tooltip>
                  </span>
                  <span
                    class="entry-toggle"
                    @click="entryToggle(scope.row)"
                    v-else
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="取消双向关联"
                      placement="top"
                    >
                      <i class="el-icon-connection red" size="30" />
                    </el-tooltip>
                  </span>
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
    <codedown
      :dialogVisible="dialogVisible"
      :codeImg="codeImg"
      :titleName="titleName"
      @toggleDialog="toggle"
    />
    <EntryQuery
      v-if="popoverFlag"
      :infoUrl="'http://xsdth5.xunsheng.org.cn/entryinfo?id=' + id"
      :id="id"
      @popoverEven="togglePopover"
    />
    <!-- 组合弹框 -->
    <el-dialog
      :title="titName + '编辑'"
      :visible.sync="activity"
      width="400px"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form3" label-width="100px">
        <el-form-item :label="titName + '封面'">
          <div class="upload-box" v-if="form3.image">
            <img :src="form3.image" alt="" /><span
              @click="delCodeVideo('image')"
              ><i class="el-icon-close"></i
            ></span>
          </div>
          <div v-else-if="videoFlag" class="upload-box plot">
            <el-progress
              :width="167"
              type="circle"
              :percentage="videoUploadPercent"
            ></el-progress>
          </div>
          <el-upload
            class="upload-demo"
            :data="qiToken"
            action="http://upload.qiniup.com"
            :headers="headers"
            accept=".jpg,.png"
            :on-error="uploadToken"
            v-else
            :before-upload="uploadPic"
            :on-success="imageUploadSuccess.bind(null, { type: 'activity' })"
            :on-progress="uploadProgress"
            :show-file-list="false"
          >
            <div class="upload-box relaFa">
              <i class="el-icon-plus"></i>
              <div v-if="typeNum == 0 || typeNum == 2" class="absChild">
                建议尺寸750*187
              </div>
              <div v-if="typeNum == 1" class="absChild">建议尺寸750*526</div>
              <div v-if="typeNum == 3" class="absChild">建议尺寸240*240</div>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item :label="titName + '标题'">
          <el-input v-model="form3.title"></el-input>
        </el-form-item>
        <el-form-item v-if="typeNum == 4" :label="titName + '副标题'">
          <el-input v-model="form3.summary"></el-input>
        </el-form-item>
        <el-form-item :label="titName + '链接'">
          <el-input v-model="form3.jump_url"></el-input>
        </el-form-item>
        <el-form-item
          v-if="typeNum == 3 || typeNum == 1"
          :label="titName + '来源'"
        >
          <el-input v-model="form3.source"></el-input>
        </el-form-item>
        <el-form-item v-if="typeNum == 3" :label="titName + '简介'">
          <el-input v-model="form3.summary"></el-input>
        </el-form-item>
        <el-form-item :label="titName + '排序'">
          <el-input v-model="form3.sort"></el-input>
        </el-form-item>
        <el-form-item label="素材分类">
          <el-select v-model="stateDetail" placeholder="请选择">
            <el-option
              v-for="item in typeState"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="padding-top: 10px; margin-left: 35px; color: #f56c6c">
        注：如不存入素材库，则不需选择分类.
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="activityClose">取 消</el-button>
        <el-button type="primary" @click="activityAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 视频弹窗 -->
    <el-dialog title="上传" :visible.sync="VisiblePic" width="400px">
      <div style="display: inline-block">
        <div v-if="form2.url" class="upload-info">
          <div class="code-img-tips">
            <el-button type="warning" @click="delCodeVideo">删除</el-button>
          </div>
          <video width="100%" controls :src="form2.url" />
        </div>
        <el-upload
          v-else
          class="upload-demo"
          :on-error="uploadToken"
          action="http://upload.qiniup.com"
          :data="qiToken"
          :before-upload="uploadVideo"
          :headers="headers"
          accept=".mp4"
          :multiple="true"
          :show-file-list="false"
          :on-success="videoUploadSuccess.bind(null, {})"
        >
          <el-button
            size="small"
            type="primary"
            style="margin-left: 18px; margin-bottom: 20px"
            >视频上传<i class="el-icon-upload el-icon--right"
          /></el-button>
        </el-upload>
      </div>
      <el-form ref="form" :model="form2" label-width="100px">
        <el-form-item label="视频名称：">
          <el-input v-model="form2.name"></el-input>
        </el-form-item>
        <el-form-item label="素材分类：">
          <el-select v-model="stateNum" placeholder="请选择">
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div style="padding-top: 10px; margin-left: 20px; color: #f56c6c">
        注：如不存入素材库，则不需选择分类
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAdd">取 消</el-button>
        <el-button type="primary" @click="addPic">确 定</el-button>
      </span>
    </el-dialog>
    <management
      :type="typeStu"
      :title="titleName"
      :dialogTableVisible="openUpload"
      @event1="changeChild($event)"
      @addEvent="uploadAll($event)"
      @getEvent="pushList($event)"
      @getform="gettableList($event)"
      @getClassify="getClassify($event)"
    />
  </div>
</template>

<script>
import { downloadIamge } from "@/utils/utils";
import { Loading } from "element-ui";
import { getToken } from "@/utils/auth";
import codedown from "@/components/codeDown/index";
import entrytype from "@/views/codelist/entrytype/create/index";
import { getQiToken } from "@/api/user";
import { publicPath } from "@/main";
import management from "@/components/management/management";
import { TypeList, createMater } from "@/api/myApi";

import {
  postEntryList,
  typeList,
  postGetRelics,
  postEdit,
  getList,
} from "@/api/entrycode";
import ue from "@/components/ue";
import EntryQuery from "@/components/EntryQuery";
export default {
  name: "EntryEdit",
  components: {
    EntryQuery,
    entrytype,
    ue,
    codedown,
    management,
  },
  data() {
    return {
      activeIndex2: "1",
      ueConfig: {
        toolbars: [
          [
            "undo", //撤销
            "redo", //重做
            // "autotypeset", //自动排版'
            "removeformat", //清除格式
            "|",
            "fontsize", //字号
            "fontfamily", //字体
            "|",
            "forecolor", //字体颜色
            "backcolor", //背景色
            "bold", //加粗
            "italic", //斜体
            "underline", //下划线
            "strikethrough", //删除线
            "link", //超链接
            "entry", //词条
            "|",
            "blockquote", //引用
            "horizontal", //分隔线
            "|",
            "information", //联系方式
            // "camera", //摄像头
            "indent", //首行缩进
            "justifyleft", //居左对齐
            "justifyright", //居右对齐
            "justifycenter", //居中对齐
            "justifyjustify", //两端对齐
            "|",
            "rowspacingtop", //段前距
            "rowspacingbottom", //段后距
            "lineheight", //行间距
            "letterspacing", //字间距
            "insertorderedlist", //有序列表
            // "insertunorderedlist", //无序列表
            "|",
            // "subscript", //下标
            // "fontborder", //字符边框
            // "superscript", //上标
            // "formatmatch", //格式刷
            // "pasteplain", //纯文本粘贴模式
            // "selectall", //全选
            // "preview", //预览
            // "time", //时间
            // "date", //日期
            // "unlink", //取消链接
            // "cleardoc", //清空文档
            "simpleupload", //单图上传
            "insertimage", //图上传
            "attachment", //附件上传
            "music",
            "insertvideo",
            "|",

            // "fullscreen", //全屏
            // "directionalityltr", //从左向右输入
            // "directionalityrtl", //从右向左输入
            // "imagenone", //默认
            // "imageleft", //左浮动
            // "imageright", //右浮动
            // "imagecenter", //居中
            // "inserttable", //插入表格
            // "customstyle", //自定义标题
            // "paragraph", //段落格式
            "contact", //相关链接
            "update", //一键排版
            "allimage", //图片集
            // "titlefont", //标题
          ],
        ],
        labelMap: {
          entry: "添加词条链接",
          contact: "添加相关链接",
          information: "添加联系方式",
          update: "快速排版",
          camera: "直播视频地址",
          allimage: "图片集",
          // titlefont: "标题",
        },
        compressSide: 0,
        maxImageSideLength: 500,
        catchRemoteImageEnable: true,
        // 初始容器高度
        initialFrameHeight: 500,
        // 初始容器宽度
        initialFrameWidth: "100%",
        enableAutoSave: false,
        elementPathEnable: false,
        wordCount: false,
        serverUrl: "/api/store/ueditor/config",
        // UEDITOR_HOME_URL: "//xsdtcentercdn.xunsheng.org.cn/UEditor/",
        UEDITOR_HOME_URL: publicPath + "UEditor/",
      },
      headers: { Authorization: "Bearer " + getToken() },
      popoverFlag: false,
      activeName: "first",
      id: this.$route.query.id,
      list: null,
      endtyshowflag: false,
      multipleSelection: [],
      entryTipList: [],
      entryHisList: [],
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
      codeSendImgData: "",
      typeList: [],
      isShowDoc: false,
      editor: null, // 编辑器实例
      editorData: "",
      mobHtml: "",
      isEdit: false,
      loadFlag: false,
      typeCheck: 0,
      branch: "",
      branchList: [],
      codeSort: 0,
      options: [],
      count: "",
      page: 1,
      page_size: 10,
      pages: "",
      type: 1,
      picList: [], //視頻列表
      qiToken: {},
      entryXFlag: false,
      createEntryTypeFlag: false,
      flag: false,
      entrySelData: [],
      loadProgress: 0, // 动态显示进度条
      progressFlag: false, // 关闭进度条
      dialogVisible: false,
      codeImg: "",
      titleName: "",
      pageed: this.$route.query.page,
      dialogType: 1, //打开弹窗的方式
      titName: "", //弹窗标题名
      activity: false,
      videoFlag: false, //上传进度显示
      typeNum: 0, //弹窗类型     // 类型 0 活动集锦 1 产品评测 2 常见问题 3 网络商城
      stateDetail: "", //素材类型
      typeState: [], //素材列表
      form3: {}, //单条弹窗数据
      typeStu: 0, //调用素材库组件类型
      openUpload: false, //组件是否显示
      VisiblePic: false, //视频弹窗是否显示
      form2: {}, //视频数据
      stateNum: "", //选择素材库类型
      videoType: {}, //type  1：上传视频；2：修改视频
    };
  },

  methods: {
    toggle() {
      this.dialogVisible = !this.dialogVisible;
      this.codeImg = "";
    },
    // 添加标题
    headline() {
      let str = `<p style="text-align:center"><span style="color:rgba(0,0,0,0.87); line-height:1.4" class="titleFontSize"><strong>产品信息</strong> </span></p>`;
      this.editor.execCommand("inserthtml", str);
    },
    // 关闭弹窗
    handleClose(none) {
      // 关闭活动集锦的弹窗
      if (this.dialogType == 1) {
        this.form3 = {};
      }
      none();
    },
    // 确认增加或修改组合内容
    activityAdd() {
      console.log(this.typeNum);
      //  类型 0 活动集锦 1 产品评测 2 常见问题 3 网络商城
      if (this.typeNum == 0) {
        let parasm = this.form3;
        let str = `<div id="group${parasm.sort}" contenteditable="false" data-id="${parasm.sort}" class="borderMy" style="margin-top: 0.53333rem; position: relative"><div class="showIcon${parasm.sort} delete" style="text-align: center; position: absolute; top: -5px; display: none; right: -5px; width: 120px;"><button data-updategroup="${parasm.sort}" class="updateBtn ckEditorToolbarBtn">修 改</button><button class="deleteBtn ckEditorToolbarBtn" data-deletegroup="${parasm.sort}">删 除</button></div><a contenteditable="false" data-id="${parasm.sort}" href="${parasm.jump_url}" target="_self" _href="${parasm.jump_url}" ><img  src="${parasm.image}" alt="" data-id="${parasm.sort}" style="width: 100%;border-radius: 0.26667rem;"><div data-id="${parasm.sort}" style="position: absolute;display: flex;align-items: center;left: 0;bottom: 0.21333rem;padding: 0.16rem 0.26667rem;background-color: rgba(0, 0, 0, 0.5);font-size: 0.42667rem;color: #ffffff;width: 100%;box-sizing: border-box;border-radius: 0 0 0.26667rem 0.26667rem;"><h6>${parasm.title}</h6><i  class="van-icon van-icon-arrow"></i></div></a></div><p><br></p>`;
        this.editor.execCommand("inserthtml", str);
      } else if (this.typeNum == 1) {
        let parasm = this.form3;
        let str = `<div id="group${parasm.sort}" contenteditable="false" data-id="${parasm.sort}" class="product-evaluating-list borderMy"><a data-v-b4edb268="" href="${parasm.jump_url}" data-id="${parasm.sort}" target="_blank"><div data-v-b4edb268="" class="product-evaluating-list-img"><img data-v-b4edb268="" data-id="${parasm.sort}" src="${parasm.image}" alt=""></div><div data-v-b4edb268="" data-id="${parasm.sort}" class="product-evaluating-list-content"><div class="showIcon${parasm.sort} delete" style="text-align: center; position: absolute; top: -25px; display: none; right: -5px; width: 120px;"><button data-updategroup="${parasm.sort}" class="updateBtn ckEditorToolbarBtn">修 改</button><button class="deleteBtn ckEditorToolbarBtn" data-deletegroup="${parasm.sort}">删 除</button></div><p data-id="${parasm.sort}" data-v-b4edb268="">${parasm.title}</p><div data-v-b4edb268="" data-id="${parasm.sort}"><span data-v-b4edb268="">${parasm.source}</span><p data-v-b4edb268=""></p></div></div></a></div><p><br></p>`;
        this.editor.execCommand("inserthtml", str);
      } else if (this.typeNum == 3) {
        let parasm = this.form3;
        let str = `<div data-id="${parasm.sort}" id="group${parasm.sort}" contenteditable="false" class="product-shopping-content-list borderMy"><div data-id="${parasm.sort}" class="product-shopping-content-img"><img data-id="${parasm.sort}" src="${parasm.image}" alt=""><p data-id="${parasm.sort}">长按识别小程序</p></div><div data-id="${parasm.sort}" class="product-shopping-content-right"><div class="showIcon${parasm.sort} delete" style="text-align: center; position: absolute; top: -15px; display: none; right: -5px; width: 120px;"><button data-updategroup="${parasm.sort}" class="updateBtn ckEditorToolbarBtn">修 改</button><button class="deleteBtn ckEditorToolbarBtn" data-deletegroup="${parasm.sort}">删 除</button></div><h5 data-id="${parasm.sort}">${parasm.title}</h5><h6 data-id="${parasm.sort}">${parasm.summary}</h6><p data-id="${parasm.sort}">${parasm.source}</p></div></div>`;
        this.editor.execCommand("inserthtml", str);
      } else if (this.typeNum == 6) {
        console.log(this.form3);
      }
      // if (this.form3.id) {
      //   // 修改
      //   if (!this.form3.title || !this.form3.image) {
      //     this.$message({
      //       message: "请完善数据后提交",
      //       type: "warning",
      //     });
      //     return;
      //   }
      //   parasm = {
      //     product_id: this.id,
      //     title: this.form3.title,
      //     type: this.typeNum,
      //     image: this.form3.image,
      //     jump_url: this.form3.jump_url,
      //     sort: this.form3.sort,
      //     id: this.form3.id,
      //     source: this.form3.source,
      //     summary: this.form3.summary,
      //   };
      //   relatedEdit(this.qs.stringify(parasm)).then((res) => {
      //     if (res.status == 200) {
      //       this.$message({
      //         message: res.msg,
      //         type: "success",
      //       });
      //       this.getRelated();
      //     }
      //   });
      // } else {
      //   // 添加
      //   if (!this.form3.title || !this.form3.image) {
      //     this.$message({
      //       message: "请完善数据后提交",
      //       type: "warning",
      //     });
      //     return;
      //   }
      //   parasm = {
      //     product_id: this.id,
      //     title: this.form3.title,
      //     type: this.typeNum,
      //     image: this.form3.image,
      //     jump_url: this.form3.jump_url,
      //     sort: this.form3.sort,
      //     source: this.form3.source,
      //     summary: this.form3.summary,
      //   };
      //   createsRelated(this.qs.stringify(parasm)).then((res) => {
      //     if (res.status == 200) {
      //       this.$message({
      //         message: res.msg,
      //         type: "success",
      //       });
      //       this.getRelated();
      //     }
      //   });
      // }
      // if (this.stateDetail) {
      //   createMater(
      //     this.qs.stringify({
      //       type_id: this.stateDetail,
      //       file_type: "png",
      //       file_path: this.form3.image,
      //       expand: JSON.stringify({ parasm }),
      //     })
      //   );
      // }
      this.form3 = {};
      this.stateDetail = "";
      this.activity = false;
    },
    // 素材库组件内新增

    uploadAll(val) {
      console.log(val);
      this.stateType = val[2];
      if (val[2]) {
      }
      TypeList(
        this.qs.stringify({
          species: val[1],
        })
      ).then((res) => {
        this.typeState = res.data.type_list;
      });
      this.form3 = {};
      this.stateDetail = "";
      if (val[0] == "图片上传") {
        this.openUpload = false;

        this.$refs.uploadPng.click();
      } else if (val[0] == "视频上传") {
        // console.log(this.$refs.videoUpload);
        this.openUpload = false;
        this.VisiblePic = true;
        // this.$refs.videoUpload.click();
      } else if (val[0] == "添加集锦") {
        this.add(0, 0);
      } else if (val[0] == "添加评测") {
        this.add(1, 0);
      } else if (val[0] == "添加问题") {
        this.add(2, 0);
      } else if (val[0] == "添加圈子") {
        this.add(4, 0);
      } else {
        this.add(3, 0);
      }
    },
    getClassify(val) {
      console.log(val);
      this.VisiblePic = true;
      this.videoType.type = 1;
      this.typeList = val[0];
    },
    // 给组件表单传参  唤出修改弹窗
    gettableList(val) {
      console.log(val);
      this.form3 = val[0];

      if (val[1] == 3) {
        this.add(0, 0);
      } else if (val[1] == 4) {
        this.add(1, 0);
      } else if (val[1] == 5) {
        this.add(2, 0);
      } else if (val[1] == 6) {
        this.add(3, 0);
      } else if (val[1] == 7) {
        this.add(4, 0);
      }
    },
    // 组件传参组件弹窗是否关闭
    changeChild(val) {
      // console.log(val);
      this.openUpload = val;
    },
    // 关闭弹窗
    activityClose() {
      this.activity = false;
      this.form3 = {};
      this.stateDetail = "";
    },
    // 取消添加视频
    closeAdd() {
      this.form2 = {
        name: "",
        url: "",
        id: 0,
      };
      this.stateNum = null;
      this.VisiblePic = false;
    },
    // 确认添加视频
    addPic() {
      if (this.videoType.type == 2) {
        this.picList[this.videoType.index].url = this.form2.url;
        this.picList[this.videoType.index].name = this.form2.name;

        this.stateNum = null;
        this.VisiblePic = false;
        this.form2 = {
          name: "",
          url: "",
          id: 0,
        };
        console.log(this.picList);
        return;
      }
      this.picList = this.picList.concat(this.form2);

      if (this.stateNum) {
        createMater(
          this.qs.stringify({
            type_id: this.stateNum,
            name: this.form2.name,
            file_type: "mp4",
            file_path: this.form2.url,
          })
        ).then((res) => {
          this.form2 = {
            name: "",
            url: "",
            id: 0,
          };
          this.stateNum = null;
        });
      }
      this.VisiblePic = false;
    },
    // 展示添加弹窗
    add(n, m) {
      this.dialogType = m;
      this.typeNum = n;

      // 添加相关内容，实现弹窗
      // 类型 0 活动集锦 1 产品评测 2 常见问题 3 网络商城
      if (n == 0) {
        this.titName = "活动";
        this.activity = true;
      } else if (n == 1) {
        this.titName = "评测";
        this.activity = true;
      } else if (n == 2) {
        this.titName = "问题";
        this.activity = true;
      } else if (n == 3) {
        this.titName = "商城";
        this.activity = true;
      } else if (n == 4) {
        this.titName = "圈子";
        this.activity = true;
      }
    },
    // 显示编辑弹窗
    editActivity(row, index, type) {
      console.log(index, type);
      this.typeNum = JSON.parse(JSON.stringify(index));
      this.form3 = JSON.parse(JSON.stringify(row));
      this.activity = true;
      this.dialogType = type;
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    openPopover(code, name) {
      this.codeImg = code;
      this.titleName = name;
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
    pushList(val) {
      console.log(val);
      if (val[1] == 1) {
        // 选择照片  判断添加图片的位置 1为封面图 2为详情图  3为参数图 4为kv图 5为方位图
        if (this.detailPng.numId == 1) {
          let picList = [];
          picList = val[0].map((item) => item.file_path);
          this.imgs = this.imgs.concat(picList);
        } else if (this.detailPng.numId == 2) {
          let picList = [];
          picList = val[0].map((item) => item.file_path);
          this.detailPng.detail_img = this.detailPng.detail_img.concat(picList);
        } else if (this.detailPng.numId == 4) {
          let picList = [];
          picList = val[0].map((item) => item.file_path);
          this.detailPng.kv = this.detailPng.kv.concat(picList);
        } else if (this.detailPng.numId == 5) {
          let picList = [];
          picList = val[0].map((item) => item.file_path);
          this.detailPng.orientation = this.detailPng.orientation.concat(
            picList
          );
        } else if (this.detailPng.numId == 6) {
          let picList = [];
          picList = val[0].map((item) => item.file_path);
          this.detailPng.detail = this.detailPng.detail.concat(picList);
        } else {
          let picList = [];
          picList = val[0].map((item) => item.file_path);
          this.detailPng.parameter_img = this.detailPng.parameter_img.concat(
            picList
          );
        }
      } else if (val[1] == 2) {
        // 选择视频
        let videoList = [];
        videoList = val[0].map((item) => ({
          url: item.file_path,
          name: item.name,
        }));
        this.picList = this.picList.concat(videoList);
        console.log(this.picList);
      }
      let parasm = { sort: 234 };
      let str = `<div data-id="${parasm.sort}" id="group${parasm.sort}" contenteditable="false"  class="product-example-list borderMy"><a data-id="${parasm.sort}" href="http://voice.xunsheng.org.cn/sydt/muse_12/1618646040535.mp4"><div class="imgDiv"><img data-id="${parasm.sort}" src="http://voice.xunsheng.org.cn/sydt/muse_12/1618646040535.mp4?vframe/jpg/offset/0" alt="" srcset=""></div><div  class="video-play-body"><i  class="van-icon van-icon-play-circle-o" style="color: rgb(255, 255, 255);"><!----></i></div><div  class="product-activity-list-content"><p data-v-b4edb268="">打劫</p><p>00:10</p></div></a></div>`;
      this.editor.execCommand("inserthtml", str);
    },
    uploadToken(err, file, fileList) {
      // 上传失败处理方式
      console.log(err);
      getQiToken({}).then((res) => {
        let str = res.data.data;
        str.token = JSON.parse(JSON.stringify(str.upToken));
        str.key = JSON.parse(JSON.stringify(str.path));
        delete str.path;
        delete str.upToken;
        sessionStorage.setItem("qiToken", JSON.stringify(str));
      });
      // this.uploadLoading.close();

      this.qiToken = JSON.parse(sessionStorage.qiToken);
      this.$message.error("Token失效，请重新上传");
    },
    getListGuan() {
      const params = {
        page: 1,
        keyword: "",
      };
      getList(this.qs.stringify(params)).then((res) => {
        this.branchList = res.data.list.data;
      });
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
    //查询分类
    queryType() {
      const params = {
        type: 1,
      };
      typeList(this.qs.stringify(params)).then((res) => {
        this.options = res.data.data;
      });
    },
    setEditorData(data) {
      this.editorData = data;
    },
    getUe(data) {
      this.editor = data.editor;
    },
    uploadPic(file) {
      let newTime = new Date().getTime();
      this.qiToken.key = `${this.qiToken.key}${newTime}.png`;
    },
    uploadAudio() {
      let newTime = new Date().getTime();
      this.qiToken.key = `${this.qiToken.key}${newTime}.mp3`;
    },
    uploadVideo() {
      let newTime = new Date().getTime();
      this.qiToken.key = `${this.qiToken.key}${newTime}.mp4`;
    },
    togglePopover() {
      this.popoverFlag = !this.popoverFlag;
    },
    downloadImg(img, imgname) {
      downloadIamge(img, imgname);
    },
    checkChange() {
      console.log(this.checkList);
    },
    // 词条详情信息查询
    GetRelics() {
      const params = {
        id: this.id,
      };
      postGetRelics(this.qs.stringify(params)).then((res) => {
        this.codeTitle = res.data.relics_info.name;
        this.codeImage = res.data.relics_info.image;
        this.codeVideo = res.data.relics_info.video_url;
        this.codeAudio = res.data.relics_info.voice_url;
        this.editorData = res.data.relics_info.content;
        this.codeSendImgData = res.data.relics_info;
        this.codeSort = res.data.relics_info.sort;
        this.typeCheck = res.data.relics_info.type_id;
        this.branch = res.data.relics_info.part_id;
        res.data.relics_info.related_list.map((item) => {
          item.flag = false;
        });
        this.checkList = res.data.relics_info.related_list;
        console.log(this.checkList);
        this.checkHisList = res.data.relics_info.history_list;
        this.endtyshowflag = res.data.relics_info.hide == 0 ? false : true;
        this.loadFlag = true;
      });
    },

    // 查找相关
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
    // 返回
    goback() {
      console.log(this.$route);
      this.$router.go(-1);
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
      if (this.editorData.indexOf("loadingclass") != "-1") {
        this.$message.error("对不起，请加载完成后提交！");
        return;
      }
      const parmas = {
        id: this.id,
        name: this.codeTitle,
        image: this.codeImage,
        voice_url: this.codeAudio,
        video_url: this.codeVideo,
        content: this.editorData,
        sort: this.codeSort,
        type_id: this.typeCheck,
        part_id: this.branch,
        related_ids: related_ids.toString(),
        history_ids: history_ids.toString(),
        hide: this.endtyshowflag ? 1 : 0,
        state: state, //1发布2草稿
      };
      const loading = this.$loading();
      postEdit(this.qs.stringify(parmas)).then((res) => {
        if (res.status == 200) {
          this.isEdit = true;
          if (state == 1) {
            this.golinkpage("/codelist/entrycode", {
              keyword: localStorage.getItem("entrykeyword"),
            });
          }
        }
        loading.close();
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
    delCodeImg() {
      this.codeImage = "";
    },
    upload(index, name) {
      if (index == 1) {
        this.titleName = "图片上传";
        this.typeStu = 1;
        this.openUpload = true;
        this.detailPng.numId = name;
      } else if (index == 2) {
        this.titleName = "视频上传";
        this.typeStu = 2;
        this.openUpload = true;
      } else {
        this.titleName = name;
        this.typeStu = index;
        this.openUpload = true;
      }
    },
    delCodeVideo(n) {
      if (n == "image") {
        this.form3.image = "";
        this.form3 = Object.assign({}, this.form3); //刷新视图
      } else {
        this.codeVideo = "";
      }
    },
    delCodeAudio() {
      this.codeAudio = "";
    },
    imageUploadSuccess(response, file, fileList) {
      if (response.type) {
        this.form3.image = `http://voice.xunsheng.org.cn/${file.key}`;
        this.qiToken = JSON.parse(sessionStorage.qiToken);
      } else {
        let path = `http://voice.xunsheng.org.cn/${file.key}`;
        this.codeImage = path;
        this.qiToken = JSON.parse(sessionStorage.qiToken);
      }
    },
    audioUploadSuccess(response, file, fileList) {
      let path = `http://voice.xunsheng.org.cn/${response.key}`;
      this.codeAudio = path;
      this.qiToken = JSON.parse(sessionStorage.qiToken);
    },
    videoUploadSuccess(response, file, fileList) {
      if (obj.index || obj.index === 0) {
        this.form1[obj.index] = `http://voice.xunsheng.org.cn/${res.key}`;
        // this.uploadLoading.close();
        // console.log(this.form2);
      } else {
        let path = `http://voice.xunsheng.org.cn/${response.key}`;
        this.codeVideo = path;
      }

      this.qiToken = JSON.parse(sessionStorage.qiToken);
    },
    setCheditor(e) {
      this.mobHtml = e.target.innerHTML;
    },
    uploadProgress(file, fileList) {
      if (file.status === "ready") {
        this.loadProgress = 0;
        this.progressFlag = true; // 显示进度条
        let intval = setInterval(() => {
          if (this.loadProgress >= 90) {
            clearInterval(intval);
          }
          if (this.loadProgress < 100) {
            this.loadProgress += 1;
          }
        }, 20);
      }
      if (file.status === "success") {
        this.loadProgress = 100;
        setTimeout(() => {
          this.progressFlag = false;
        }, 1000); // 一秒后关闭进度条
      }
    },
    onNamespaceLoaded(CKEDITOR) {},
    ckeditorReady() {
      this.isCkeditorFlag = true;
      this.fullscreenLoading.close();
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
  created() {
    this.getListGuan();
    this.qiToken = JSON.parse(sessionStorage.qiToken);
  },
  mounted() {
    this.$nextTick(() => {
      this.queryType();
      this.GetRelics();
    });
    console.log(ue);
  },
  watch: {
    createEntryTypeFlag(val) {
      console.log(val);
      if (!val) {
        this.queryType();
      }
    },
  },
};
</script>
<style lang="scss">
.create-code {
  // .edui-editor-toolbarbox {
  //   // padding-left: 75px;
  //   // box-sizing: border-box;
  // }
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
  .cke_contents {
    height: 440px !important;
  }
}
</style>
<style lang="scss" scoped>
.create-code {
  .table-header {
    display: flex;
    justify-content: space-between;
  }
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
      left: 10px;
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
.ueBox {
  // border: 1px dashed hsla(210, 8%, 51%, 0.25);
  background-color: #fbfbfb;
  margin-bottom: 20px;
}
.el-menu--horizontal > .el-menu-item {
  height: 36px !important;
  line-height: 36px !important;
  border-bottom: none !important;
  padding: 0 12px !important;
}
.upload-box {
  width: 170px;
  height: 170px;
  margin-right: 10px;
  display: flex;
  border: 1px solid #ccc;
  position: relative;
  span {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #999;
    display: flex;
    cursor: pointer;
    i {
      font-size: 15px;
      margin: auto;
      color: white;
    }
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  i {
    color: #ccc;
    margin: auto;
    font-size: 30px;
  }
}
.relaFa {
  position: relative;
  .absChild {
    position: absolute;
    color: red;
    bottom: 2px;
    text-align: center;
    width: 100%;
  }
}
</style>
<style lang="sass">
.el-submenu .el-submenu__title
  height: 36px !important
  line-height: 36px !important
  border-bottom: none !important
  padding: 0 12px !important
</style>
