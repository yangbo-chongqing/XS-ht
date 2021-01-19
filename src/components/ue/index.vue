<template>
  <div class="ue-box" ref="ue">
    <vue-ueditor-wrap
      @ready="ready"
      v-model="ueData"
      :config="ueConfig"
    ></vue-ueditor-wrap>
    <div class="ck-popover" v-if="entryFlag" @click="entryFlag = false"></div>
    <div class="ck-popover-entry" v-if="entryFlag">
      <div class="ck-popover-title">添加词条</div>
      <div class="ck-popover-body">
        <el-select
          v-model="entrykey"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词搜索"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="(item, index) of options"
            :key="index"
            :label="item.name"
            :value="index"
          >
          </el-option>
        </el-select>
      </div>
      <div class="entry-btn">
        <el-button type="primary" @click="addEntry">添加</el-button>
      </div>
    </div>
    <!-- 相关链接 -->
    <el-dialog
      width="500px"
      title="相关链接"
      :visible.sync="contactFlag"
      label-position="top"
    >
      <el-form ref="form" :inline="true" size="mini">
        <div v-for="(item, index) in form" :key="index + 'item'">
          <h3 style="margin-bottom: 15px">链接{{ index + 1 }}</h3>
          <el-form-item label="标题" label-width="30px">
            <el-input v-model="item.title" placeholder="例如名称"></el-input>
          </el-form-item>
          <el-form-item label="链接" label-width="30px">
            <el-input
              v-model="item.url"
              placeholder="url:http://或者/https://"
            ></el-input>
          </el-form-item>
          <span v-if="index > 0"
            ><el-button
              size="mini"
              @click="delFromItem(index)"
              icon="el-icon-minus"
              circle
            ></el-button
          ></span>
        </div>
        <div>
          <el-button
            @click="addFromItem"
            type="primary"
            icon="el-icon-plus"
            circle
          ></el-button>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="contactFlag = false">取 消</el-button>
        <el-button type="primary" @click="addXurl">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 直播视频添加 -->
    <el-dialog
      width="500px"
      title="直播地址"
      :visible.sync="cameraFlag"
      label-position="top"
    >
      <el-form ref="form" :inline="true" size="mini">
        <div v-for="(item, index) in form" :key="index + 'item'">
          <h3 style="margin-bottom: 15px">链接{{ index + 1 }}</h3>
          <el-form-item label="标题" label-width="30px">
            <el-input v-model="item.title" placeholder="例如名称"></el-input>
          </el-form-item>
          <el-form-item label="链接" label-width="30px">
            <el-input
              v-model="item.url"
              placeholder="url:http://或者/https://"
            ></el-input>
          </el-form-item>
          <span v-if="index > 0"
            ><el-button
              size="mini"
              @click="delFromItem(index)"
              icon="el-icon-minus"
              circle
            ></el-button
          ></span>
        </div>
        <div>
          <el-button
            @click="addFromItem"
            type="primary"
            icon="el-icon-plus"
            circle
          ></el-button>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cameraFlag = false">取 消</el-button>
        <el-button type="primary" @click="addXurl">确 定</el-button>
      </div>
    </el-dialog>
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
    <!-- 图片集 -->
    <div>
      <el-dialog
        class="picS"
        title="图片集上传"
        :visible.sync="centerDialogVisible"
        width="720px"
      >
        <el-tabs v-model="activeNum" @tab-click="getPic" type="border-card">
          <el-tab-pane name="one" label="本地上传">
            <!-- <el-upload
              class="upload-demo"
              :before-upload="uploadPic"
              :data="qiToken"
              action="http://upload.qiniup.com"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture-card"
            >
              <i slot="default" class="el-icon-plus"></i>
            </el-upload> -->
            <drag :picList="imgList" play="1" @childFn="parentFn" />
            <!-- {{ imgList }} -->
          </el-tab-pane>
          <el-tab-pane name="two" label="在线管理">
            <div class="demo-image__lazy">
              <li
                v-for="(item, index) of webPic"
                :key="item + index"
                class="draggable-item"
                :style="{ width: width + 'px', height: height + 'px' }"
                @click="selectPic(index)"
              >
                <el-image :src="item" lazy></el-image>
                <div v-if="selectClass[index] == 1" class="shadow">
                  <img src="../../assets/icon/success.png" alt="" />
                </div>
              </li>
            </div>
            <div class="fontTil">图集排列</div>
            <div class="demo-image__lazy">
              <drag :picList="picList" @chilX="parX" @deleOne="deleDetail" />
            </div>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeAdd">取 消</el-button>
          <el-button type="primary" @click="addYes()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { RelicsList } from "@/api/entrycode";
import VueUeditorWrap from "vue-ueditor-wrap";
import { getToken } from "@/utils/auth";
import drag from "@/components/drag";
import { getPicList } from "@/api/user";
import { createPics, delPic, details } from "@/api/ue";
import { mapGetters } from "vuex";

export default {
  name: "UE",
  components: {
    VueUeditorWrap,
    drag,
  },
  props: ["value", "ueConfig"],

  mounted: function () {
    this.$nextTick(() => {
      let _this = this;
      let scroll_box = document.querySelector(".create-code");
      scroll_box.addEventListener(
        "scroll",
        function () {
          let edui1_toolbarbox = document.querySelector("#edui1_toolbarbox");
          let ue_box = _this.$refs.ue.getBoundingClientRect().top;
          // let ue_left = _this.$refs.ue.getBoundingClientRect();
          // console.log(edui1_toolbarbox);
          if (ue_box <= 0) {
            edui1_toolbarbox.classList.add("setFixed");
          } else {
            edui1_toolbarbox.classList.remove("setFixed");
          }
        },
        false
      );
    });
  },
  data: function () {
    return {
      centerDialogVisible: false,
      id: parseInt(Math.random() * 10000).toString(),
      activeNum: "one", //默认tab
      ueData: "",
      deteThis: "",
      status: 1,
      selectNum: [],
      addPic: [],
      pData: "",
      fram: {}, //指向
      picList: [], //在线选择的图片
      webPic: [], //在线图片
      isShowDoc: false,
      activeName: "first",
      addList: [],
      headers: { Authorization: "Bearer " + getToken() },
      qiToken: {},
      ids: "",
      mobHtml: "",
      width: 100,
      height: 100,
      imgList: [],
      selectClass: [],
      editor: null,
      loading: false,
      options: [],
      entrykey: "",
      entryFlag: false,
      contactFlag: false,
      cameraFlag: false,
      form: [
        {
          title: "",
          url: "",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["userinfo"]),
  },
  methods: {
    addUpdate() {
      //一键排版
      this.isShowDoc = !this.isShowDoc;
    },
    //添加联系方式到富文本
    addInformation() {
      let aStr = `
        <ul style='background: #f5f5f5;width:100%;border-radius: 10px;padding: 10px;box-sizing: border-box;'>
          <li style="text-align:center"><span style='font-size:18px;font-weight: bold;'>基本信息</span></li>
          <li style="text-align:center;color:#333"><span style='color:#999;margin-right:20px'>联系电话：</span>023-123456</li>
          <li style="text-align:center;color:#333"><span style='color:#999;margin-right:20px'>联系手机：</span>12345678911</li>
          <li style="text-align:center;color:#333"><span style='color:#999;margin-right:20px'>联系地址：</span>某某市某某区某某街道</li>
        </ul>`;
      this.editor.execCommand("inserthtml", aStr);
    },
    //添加相关链接到富文本
    addXurl() {
      let aStr = "";
      this.form.map((item, index) => {
        if (item.url == "" || item.title == "") {
          this.$message({
            type: "error",
            message: "请填写完整链接信息",
          });
          return false;
        } else {
          if (
            !item.url.match(
              /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
            )
          ) {
            this.$message({
              type: "error",
              message: "存在异常链接已自动剔除",
            });
            return false;
          } else {
            aStr += `<p><a style="color:#333;text-decoration: none;" href="${
              item.url
            }">${index + 1}、${
              item.title
            }</a><img class="a-href-icon" width='13px' style='margin-left:5px' src='https://voice.xunsheng.org.cn/sydt/muse_0/63b9127961b3bede237e8dd3267514c9.png' /></p>`;
          }
        }
      });
      this.editor.execCommand("inserthtml", aStr);
      this.form = [
        {
          title: "",
          url: "",
        },
      ];
      this.contactFlag = false;
    },
    //删除相关链接
    delFromItem(index) {
      this.form.splice(index, 1);
    },
    //添加相关链接
    addFromItem() {
      this.form.push({
        title: "",
        url: "",
      });
    },
    setCheditor(e) {
      this.mobHtml = e.target.innerHTML;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    ready(editorInstance) {
      this.ueData = this.value;
      this.editor = editorInstance;
      let entry = document.querySelector(".edui-for-entry");
      let contact = document.querySelector(".edui-for-contact");
      let information = document.querySelector(".edui-for-information");
      // let updateBtn = document.querySelectorAll(".updateBtn");
      let update = document.querySelector(".edui-for-update");
      let allimage = document.querySelector(".edui-for-allimage");
      // let camera = document.querySelector(".edui-for-camera");
      // updateBtn.addEventListener("click", () => {
      //   console.log(updateBtn);
      // });
      if (entry) {
        entry.addEventListener("click", () => {
          this.entryFlag = true;
        });
      }
      if (contact) {
        contact.addEventListener("click", () => {
          this.contactFlag = true;
        });
      }
      // camera.addEventListener("click", () => {
      //   this.cameraFlag = true;
      // });
      if (information) {
        information.addEventListener("click", () => {
          this.addInformation();
        });
      }
      if (update) {
        update.addEventListener("click", () => {
          this.addUpdate();
        });
      }
      if (allimage) {
        allimage.addEventListener("click", () => {
          this.addImageAll(1);
        });
      }
    },
    addEntry() {
      console.log(this.entrykey);
      if (!this.entrykey && this.entrykey != 0) {
        this.$message({
          type: "error",
          message: "词条不能为空",
        });
        return false;
      }
      var mySelection = this.editor.selection.getRange().cloneContents();
      console.log(mySelection);
      let aStr = "";
      if (mySelection) {
        let a = document.createElement("a");
        a.appendChild(mySelection);

        aStr = `<a href="http://xs_j1_${this.options[this.entrykey].id}">${
          a.innerHTML
        }</a>`;
      } else {
        aStr = `<a href="http://xs_j1_${this.options[this.entrykey].id}">${
          this.options[this.entrykey].name
        }</a>`;
      }
      unSelectable;
      this.editor.execCommand("inserthtml", aStr);
      this.entryFlag = false;
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        let parmas = {
          keyword: query,
        };
        RelicsList(this.qs.stringify(parmas)).then((res) => {
          this.loading = false;
          this.options = res.data.relics_list.data;
        });
      } else {
        this.options = [];
      }
    },

    //图片集上传管理
    // 图片集打开按钮
    addImageAll(type, data) {
      console.log(data);
      // 图片集操作
      if (type == 1) {
        // console.log(data);
        if (data) {
          details(this.qs.stringify({ id: data })).then((res) => {
            this.imgList = res.data.info.images;
            this.picList = res.data.info.images;
            this.pData = data;
          });
        }
        this.centerDialogVisible = true;
        this.selectClass = [];
      } else {
        let box = this.fram.document.querySelector(`#pic${data}`);
        // console.log(box);
        box.parentNode.removeChild(box);
      }
    },
    selectPic(i) {
      this.picList = JSON.parse(JSON.stringify(this.addPic));
      if (this.picList.indexOf(this.webPic[i]) == -1) {
        this.picList.push(this.webPic[i]);
        this.selectClass[i] = 1;
      } else {
        let index = this.picList.indexOf(this.webPic[i]);
        this.picList.splice(index, 1);
        this.selectClass[i] = -1;
      }
    },
    uploadPic(file) {
      let newTime = new Date().getTime();
      this.qiToken.key = `${this.qiToken.key}${newTime}.png`;
    },

    async addYes() {
      if (this.status == 1 && this.pData) {
        let box = this.fram.document.querySelector(`#pic${this.pData}`);
        console.log(this.pData);
        box.parentNode.removeChild(box);
        this.pData = "";
      }
      if (this.activeNum == "one") {
        let img = this.addList;
        let imgThis = JSON.parse(JSON.stringify(this.addPic));
        let newTime = new Date().getTime();
        let userIn = this.userinfo.user_info.user_id;
        console.log(this.addList);
        let imgS = "";
        if (img.length < 2) {
          img.push(
            "http://voice.xunsheng.org.cn/sydt/muse_12/1610949315696.png"
          );
          img.push(
            "http://voice.xunsheng.org.cn/sydt/muse_12/1610949315696.png"
          );
        } else if (img.length < 3) {
          img.push(
            "http://voice.xunsheng.org.cn/sydt/muse_12/1610949315696.png"
          );
        }
        console.log(imgThis);
        for (var i = 0; i < imgThis.length; i++) {
          imgS = imgS + imgThis[i] + ",";
        }
        let data = {
          images: imgS,
          album_name: userIn + "-" + newTime,
        };
        await createPics(this.qs.stringify(data)).then((res) => {
          this.ids = res.data.result;
        });
        console.log(this.ids);
        this.centerDialogVisible = false;
        let str = `  <div id="pic${this.ids}"   contenteditable="false" class="borderMy"  data-id="${this.ids}" style="-khtml-user-select: none;
   user-select: none;display: flex;justify-content: center;">
        <div style="width:170px;height:200px; cursor: pointer;display: table-cell;text-align: center;"><img
                data-id="${this.ids}" class="dataL" style="width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;" src="${img[0]}" alt=""></div><div style="display: flex;flex-direction: column;width:170px;height:200px;cursor: pointer;position:relative;">
            <img data-id="${this.ids}" class="dataRT" style="width: 100%;
            height: 50%;
            object-fit: cover;
            object-position: center;" src="${img[1]}" alt=""><img data-id="${this.ids}" style="width: 100%;
                height: 50%;
                object-fit: cover;
                object-position: center;" src="${img[2]}" alt=""><span data-id="${this.ids}" class="data" style="position: absolute;cursor: pointer;
                background: #2b323e;
                opacity: 0.8;
                width:170px;
                height: 100px;
                left: 0;
                bottom: 0;
                font-weight: 500;
                letter-spacing:2px;
                font-size:22px;
                line-height:100px;
                color:#fff;
                text-align: center; ">共${imgThis.length}张</span><div class="showIcon${this.ids} delete"
                style="text-align: center; position: absolute; top:-5px;display:none;right:-35px;width:120px"><button
                    data-updateId="${this.ids}" class='updateBtn ckEditorToolbarBtn'>修 改</button><button
                    class='deleteBtn ckEditorToolbarBtn' data-deleteId="${this.ids}">删 除</button></div></div></div><div><br></div>`;
        this.editor.execCommand("inserthtml", str);
        this.imgList = [];
        this.activeNum = "one";
        this.picList = [];
      } else {
        let img = this.addPic;
        let imgThis = JSON.parse(JSON.stringify(this.addPic));
        let newTime = new Date().getTime();
        let userIn = this.userinfo.user_info.user_id;
        let imgS = "";
        if (img.length < 2) {
          img.push(
            "http://voice.xunsheng.org.cn/sydt/muse_12/1610949315696.png"
          );
          img.push(
            "http://voice.xunsheng.org.cn/sydt/muse_12/1610949315696.png"
          );
        } else if (img.length < 3) {
          img.push(
            "http://voice.xunsheng.org.cn/sydt/muse_12/1610949315696.png"
          );
        }
        console.log(imgThis);
        for (var i = 0; i < imgThis.length; i++) {
          imgS = imgS + imgThis[i] + ",";
        }
        let data = {
          images: imgS,
          album_name: userIn + "-" + newTime,
        };
        await createPics(this.qs.stringify(data)).then((res) => {
          this.ids = res.data.result;
        });
        console.log(this.ids);

        this.centerDialogVisible = false;

        let str = `  <div id="pic${this.ids}"   contenteditable="false" class="borderMy"  data-id="${this.ids}" style="-khtml-user-select: none;
   user-select: none;display: flex;justify-content: center;">
        <div style="width:170px;height:200px; cursor: pointer;display: table-cell;text-align: center;"><img
                data-id="${this.ids}" class="dataL" style="width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;" src="${img[0]}" alt=""></div><div style="display: flex;flex-direction: column;width:170px;height:200px;cursor: pointer;position:relative;">
            <img data-id="${this.ids}" class="dataRT" style="width: 100%;
            height: 50%;
            object-fit: cover;
            object-position: center;" src="${img[1]}" alt=""><img data-id="${this.ids}" style="width: 100%;
                height: 50%;
                object-fit: cover;
                object-position: center;" src="${img[2]}" alt=""><span data-id="${this.ids}" class="data" style="position: absolute;cursor: pointer;
                background: #2b323e;
                opacity: 0.8;
                width:170px;
                height: 100px;
                left: 0;
                bottom: 0;
                font-weight: 500;
                letter-spacing:2px;
                font-size:22px;
                line-height:100px;
                color:#fff;
                text-align: center; ">共${imgThis.length}张</span><div class="showIcon${this.ids} delete"
                style="text-align: center; position: absolute; top:-5px;display:none;right:-35px;width:120px"><button
                    data-updateId="${this.ids}" class='updateBtn ckEditorToolbarBtn'>修 改</button><button
                    class='deleteBtn ckEditorToolbarBtn' data-deleteId="${this.ids}">删 除</button></div></div></div><div><br></div>`;
        this.editor.execCommand("inserthtml", str);
        this.imgList = [];
        this.activeNum = "one";
        this.picList = [];
        console.log(this.ids);
      }
      this.pData = "";
    },
    closeAdd() {
      this.centerDialogVisible = false;
      this.imgList = [];
      this.picList = [];
      this.activeNum = "one";
      this.pData = "";
    },
    parentFn(payload) {
      this.addList = payload.url;
      console.log(payload);
      console.log(this.addList);
    },
    parX(val) {
      this.addPic = val;
    },
    deleDetail(val) {
      this.picList = JSON.parse(JSON.stringify(this.addPic));
      if (this.webPic.indexOf(val) != -1) {
        this.selectClass[this.webPic.indexOf(val)] = -1;
      }
      if (this.picList.indexOf(val) != -1) {
        this.picList.splice(this.picList.indexOf(val), 1);
      }
    },
    getPic(tab, event) {
      // 获取线上图片
      console.log(tab, event);
      if (tab.name == "two") {
        this.webPic = [];
        let token = window.localStorage.getItem("userInfo") || "";
        let data = {
          action: "listimage",
          start: 0,
          size: 30,
        };
        getPicList(this.qs.stringify(data)).then((res) => {
          for (let i = 0; i < res.list.length; i++) {
            this.webPic.push(res.list[i].url);
            if (this.picList.indexOf(res.list[i].url) != -1) {
              this.selectClass[i] = 1;
            }
          }
        });
      }
    },
    // 修改或者删除按钮
    updateOrDelete(e) {
      // console.log(e.target);
      // console.log(e.target);
      if (e.target.dataset.deleteid) {
        // console.log(
        //   this.fram.document.querySelector(`#pic${e.target.dataset.deleteid}`)
        // );

        this.addImageAll(2, e.target.dataset.deleteid);
      } else if (e.target.dataset.updateid) {
        this.addImageAll(1, e.target.dataset.updateid);
      }
    },
  },
  created() {
    this.qiToken = JSON.parse(sessionStorage.qiToken);
  },
  watch: {
    // 监听prop的变化，更新ckeditor中的值
    ueData: function () {
      let ueEl = this.$refs.ue;
      this.fram = ueEl
        .querySelector(".edui-editor-iframeholder")
        .querySelector("iframe").contentWindow;
      // 获取编辑器dom元素;
      let ifm = ueEl
        .querySelector(".edui-editor-iframeholder")
        .querySelector("iframe").contentWindow.document.body;
      ifm.addEventListener("click", this.updateOrDelete);
      this.$emit("input", this.ueData);
    },
    mobHtml: function (val) {
      this.editor.execCommand("inserthtml", val);
    },
  },
  // 销毁组件前，销毁编辑器
  beforeDestroy: function () {},
};
</script>
<style lang="scss">
.ue-box {
  position: relative;
  .setFixed {
    position: sticky !important;
    top: 0px;
    z-index: 1001;
    width: 712px !important;
    left: 0;
  }
}
</style>
<style lang="scss" scoped>
.ck-popover {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1002;
}
.ck-popover-entry {
  width: 400px;
  height: 200px;
  border-radius: 10px;
  background: white;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1003;
  transform: translate(-50%, -50%);
  text-align: center;
  .ck-popover-title {
    line-height: 40px;
    text-align: center;
  }
  .ck-popover-body {
    padding-top: 30px;
  }
  .entry-btn {
    margin-top: 20px;
    text-align: center;
  }
}
.create-code {
  max-height: 90vh;
  overflow-y: scroll;
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
.demo-image__lazy {
  height: 220px;
  overflow-y: auto;
  width: 100%;
  display: inline-block;
  border: 1px solid #777;
  padding: 2px;
}
.draggable-item {
  margin-right: 5px;
  margin-bottom: 5px;
  border: 1px solid #ddd;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  display: inline-block;

  .el-image {
    width: 100%;
    height: 100%;
  }
  .shadow {
    position: absolute;
    bottom: -4px;
    right: -2px;
    transition: opacity 0.3s;
    color: #fff;
    font-size: 20px;
    line-height: 20px;
    padding: 2px;
    cursor: pointer;
  }
  &:hover {
    // .shadow {
    //   opacity: 1;
    // }
    -webkit-transform: translateY(-2px);
    -ms-transform: translateY(-2px);
    transform: translateY(-2px);
    -webkit-box-shadow: 0 0 6px #999;
    box-shadow: 0 0 6px #999;
    -webkit-transition: all 0.5s ease-out;
    transition: all 0.5s ease-out;
  }
}
.fontTil {
  font-weight: 500;
  font-size: 18px;
  margin: 10px 0;
}
</style>