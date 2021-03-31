<template>
  <div class="fun-code">
    <div class="back-box" @click="back">
      <i class="el-icon-arrow-left"></i> 返回列表
    </div>
    <div class="fun-table-body">
      <el-tabs v-model="activeName" :before-leave="addOrEdit">
        <el-tab-pane label="基本信息" name="first">
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="产品名称">
              <el-input class="classInput" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="产品编号">
              <el-input class="classInput" v-model="form.unique"></el-input>
            </el-form-item>
            <el-form-item label="产品封面图">
              <div style="display: flex; flex-flow: wrap">
                <template v-if="imgs[0]">
                  <div
                    @click.stop="selectPic(index)"
                    v-for="(item, index) of imgs"
                    class="upload-box plot"
                    :key="index"
                  >
                    <img :src="item" alt="" />

                    <span @click.stop="deletImg(index)"
                      ><i class="el-icon-close"></i
                    ></span>
                    <div class="imgLeft" v-show="nIndex == index">
                      <img src="@/assets/icon/fm.png" alt="" />
                    </div>
                  </div>
                  <div v-if="videoFlag" class="upload-box plot">
                    <el-progress
                      :width="167"
                      type="circle"
                      :percentage="videoUploadPercent"
                    ></el-progress>
                  </div>
                </template>
                <!-- 素材组件调用上传 -->
                <el-upload
                  class="upload-demo"
                  :data="qiToken"
                  action="http://upload.qiniup.com"
                  :headers="headers"
                  multiple
                  accept=".jpg,.png"
                  :on-error="uploadToken"
                  :before-upload="uploadPic"
                  :on-success="imageUploadSuccess.bind(null, {})"
                  :on-progress="uploadProgress"
                  :show-file-list="false"
                >
                  <span ref="uploadPng"></span>
                </el-upload>
                <el-upload
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
                  :on-progress="uploadProgress"
                >
                  <span ref="videoUpload"></span>
                </el-upload>
                <div
                  style="cursor: pointer"
                  class="upload-box relaFa"
                  @click="upload(1)"
                >
                  <i class="el-icon-plus"></i>
                  <div class="absChild">建议尺寸750*421</div>
                </div>
                <!-- <div class="upload-box plot" v-else>
                  <img :src="form.dialogImageUrl" alt="" /><span
                    @click="form.dialogImageUrl = ''"
                    ><i class="el-icon-close"></i
                  ></span>
                </div> -->
              </div>
            </el-form-item>
            <el-form-item label="分类">
              <el-select v-model="form.classify" placeholder="请选择">
                <el-option
                  v-for="(item, index) of classifyList"
                  :key="index"
                  :label="item.type_name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排序">
              <el-input class="classInput" v-model="form.sort"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="form.show" placeholder="请选择">
                <el-option
                  v-for="(item, index) of editState"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
              <el-button @click="back">取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="说明书" name="second" class="editor-scroll">
          <div class="itemContent" v-if="haveState">
            <div class="leftContent">
              <div v-if="!reTitName" class="leftTitName">
                <span class="nameFont"> {{ stateName }} </span>
                <span class="reStateName" @click="reTitName = true"
                  >重命名</span
                >
              </div>
              <div v-else style="margin-bottom: 10px">
                <el-input
                  @blur="reName"
                  v-model="stateName"
                  type="mini"
                  autofocus
                ></el-input>
              </div>
              <el-button
                size="mini"
                style="margin-bottom: 12px"
                @click="append('add')"
                >添加</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="addState('delete')"
                class="delteBtn"
                >删除</el-button
              >
              <el-tree
                :data="data"
                default-expand-all
                :props="defaultProps"
                @node-click="handleNodeClick"
                :expand-on-click-node="false"
              >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span v-if="data.id != dataNum"
                    ><i
                      v-if="
                        typeof data.id == 'number' || data.id.indexOf('-') == -1
                      "
                      class="el-icon-folder"
                    ></i>
                    {{ node.label }}</span
                  >
                  <el-input
                    style="width: 100px"
                    v-if="data.id == dataNum"
                    size="mini"
                    @blur="dataNum = ''"
                    v-model="data.label"
                  />
                  <span>
                    <el-button
                      type="text"
                      size="mini"
                      @click.stop="() => updateName(data)"
                    >
                      重命名
                    </el-button>
                    <el-button
                      type="text"
                      v-show="
                        typeof data.id == 'number' || data.id.indexOf('-') == -1
                      "
                      size="mini"
                      @click.stop="() => append(data)"
                    >
                      添加
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click.stop="() => remove(node, data)"
                    >
                      删除
                    </el-button>
                  </span>
                </span>
              </el-tree>
            </div>
            <div class="rightContent">
              <ue
                class="ueClass"
                v-if="showEd"
                v-model="productState"
                :ueConfig="ueConfig"
                @input="setProductState"
                :mobHtml1="mobHtml1"
              ></ue>
              <!-- <ue
                class="ueClass"
                v-if="!ids"
                v-model="productState"
                :ueConfig="ueConfig"
                @input="setProductState"
                :mobHtml1="mobHtml1"
              ></ue> -->
            </div>
          </div>
          <div class="itemContent" v-if="!haveState">
            <el-button
              class="marBot"
              size="small"
              type="primary"
              @click="addState('open')"
              >添加说明书<i class="el-icon-upload el-icon--right"
            /></el-button>
          </div>
          <el-form
            ref="form"
            style="margin-top: 10px; text-align: center"
            :model="form"
            label-width="100px"
            v-if="haveState"
          >
            <el-form-item>
              <el-button type="primary" @click="saveState">保存</el-button>
              <el-button type="primary" @click="saveState('save')"
                >保存模板</el-button
              >

              <!-- <el-button type="danger" @click="addState('delete')"
                >删除所有说明书</el-button
              > -->
              <el-button @click="back">取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="活动集锦" name="third">
          <template>
            <el-button
              class="marBot"
              size="small"
              type="primary"
              @click="upload(3, '添加集锦')"
              >添加集锦<i class="el-icon-upload el-icon--right"
            /></el-button>
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="title" label="活动标题" width="180">
              </el-table-column>
              <el-table-column label="活动封面图" width="180">
                <template slot-scope="scope">
                  <img
                    :src="scope.row.image"
                    alt=""
                    style="width: 100%; height: 100px; object-fit: cover"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="jump_url" label="活动链接">
              </el-table-column>
              <el-table-column prop="sort" label="排序"> </el-table-column>
              <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                  <i
                    class="el-icon-edit"
                    @click="editActivity(scope.row, 0, 1)"
                  ></i>
                  <i
                    style="margin-left: 10px"
                    class="el-icon-delete"
                    @click="deleteActivity(scope.row, 0)"
                  ></i>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-tab-pane>
        <el-tab-pane label="产品评测" name="fourth">
          <el-button
            class="marBot"
            size="small"
            type="primary"
            @click="upload(4, '添加评测')"
            >添加评测<i class="el-icon-upload el-icon--right"
          /></el-button>
          <el-table :data="tableData1" border style="width: 100%">
            <el-table-column prop="title" label="评测标题"> </el-table-column>
            <el-table-column label="评测封面图" width="180">
              <template slot-scope="scope">
                <img
                  :src="scope.row.image"
                  alt=""
                  style="width: 100%; height: 100px; object-fit: cover"
                />
              </template>
            </el-table-column>
            <el-table-column prop="jump_url" label="评测链接">
            </el-table-column>
            <el-table-column prop="source" label="评测来源"> </el-table-column>
            <el-table-column prop="sort" label="排序"> </el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <i
                  class="el-icon-edit"
                  @click="editActivity(scope.row, 1, 1)"
                ></i>
                <i
                  style="margin-left: 10px"
                  class="el-icon-delete"
                  @click="deleteActivity(scope.row, 1)"
                ></i>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="常见问题" name="five">
          <el-button
            class="marBot"
            size="small"
            type="primary"
            @click="upload(5, '添加问题')"
            >添加问题<i class="el-icon-upload el-icon--right"
          /></el-button>
          <el-table :data="tableData2" border style="width: 100%">
            <el-table-column prop="title" label="问题标题"> </el-table-column>
            <el-table-column label="问题封面图" width="180">
              <template slot-scope="scope">
                <img
                  :src="scope.row.image"
                  alt=""
                  style="width: 100%; height: 100px; object-fit: cover"
                />
              </template>
            </el-table-column>
            <el-table-column prop="jump_url" label="问题链接">
            </el-table-column>
            <el-table-column prop="sort" label="排序"> </el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <i
                  class="el-icon-edit"
                  @click="editActivity(scope.row, 2, 1)"
                ></i>
                <i
                  style="margin-left: 10px"
                  class="el-icon-delete"
                  @click="deleteActivity(scope.row, 2)"
                ></i>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="网络商城" name="six">
          <template>
            <el-button
              class="marBot"
              size="small"
              type="primary"
              @click="upload(6, '添加商城')"
              >添加商城<i class="el-icon-upload el-icon--right"
            /></el-button>
            <el-table :data="tableData3" border style="width: 100%">
              <el-table-column prop="title" label="商城标题"> </el-table-column>
              <el-table-column label="商城封面图" width="180">
                <template slot-scope="scope">
                  <img
                    :src="scope.row.image"
                    alt=""
                    style="width: 100%; height: 100px; object-fit: cover"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="jump_url" label="商城链接">
              </el-table-column>
              <el-table-column prop="summary" label="商城简介">
              </el-table-column>
              <el-table-column prop="source" label="商城来源">
              </el-table-column>
              <el-table-column prop="sort" label="排序"> </el-table-column>
              <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                  <i
                    class="el-icon-edit"
                    @click="editActivity(scope.row, 3, 1)"
                  ></i>
                  <i
                    style="margin-left: 10px"
                    class="el-icon-delete"
                    @click="deleteActivity(scope.row, 3)"
                  ></i>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-tab-pane>
        <el-tab-pane label="相关视频" name="seven">
          <div>
            <el-button
              class="marBot"
              size="small"
              type="primary"
              @click="upload(2)"
              >视频<i class="el-icon-upload el-icon--right"
            /></el-button>
          </div>
          <template style="display: flex; flex-flow: wrap">
            <div v-for="(item, index) of picList" :key="index" class="itemPic">
              <template v-if="item.is_del != 1">
                <video height="150px" controls :src="item.url" />
                <span>{{ item.name }}</span>
                <el-button
                  class="detelePic"
                  type="warning"
                  @click="deleTP(index)"
                  >删 除</el-button
                >
              </template>
            </div>
            <div v-if="videoFlag" class="upload-box1 plot">
              <el-progress
                type="circle"
                :width="148"
                :percentage="videoUploadPercent"
              ></el-progress>
            </div>
          </template>
          <div style="text-align: center">
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="back">取消</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="扩展字段"
          name="eight"
          v-if="this.addList.length > 0"
        >
          <template v-for="(item, index) of addList">
            <div v-if="item.field_type == '文本'" :key="index" class="itemRich">
              <div class="font">{{ item.field_name }}</div>
              <el-input v-model="form1[index]" style="width: 360px"></el-input>
            </div>
            <div v-if="item.field_type == '视频'" :key="index" class="itemRich">
              <div class="font">{{ item.field_name }}</div>
              <div style="display: inline-block">
                <div
                  v-if="form1[index]"
                  class="upload-info"
                  style="width: 320px"
                >
                  <div class="code-img-tips">
                    <el-button type="warning" @click="delCodeVideo(index)"
                      >删除</el-button
                    >
                  </div>
                  <video width="100%" controls :src="form1[index]" />
                </div>
                <el-upload
                  v-else
                  class="upload-demo"
                  action="http://upload.qiniup.com"
                  :data="qiToken"
                  :before-upload="uploadVideo"
                  :headers="headers"
                  accept=".MPEG,.baiAVI,.nAVI,.ASF,.MOV,.3GP,.mp4"
                  :show-file-list="false"
                  :on-success="
                    videoUploadSuccess.bind(null, { item, index: index })
                  "
                  :on-progress="uploadProgress"
                >
                  <el-button
                    size="small"
                    type="primary"
                    style="margin-left: 18px; margin-bottom: 20px"
                    >视频上传<i class="el-icon-upload el-icon--right"
                  /></el-button>
                </el-upload>
              </div>
            </div>
            <div v-if="item.field_type == '图片'" :key="index" class="itemRich">
              <div class="font">{{ item.field_name }}</div>
              <div class="ueClass">
                <el-upload
                  class="upload-demo"
                  :data="qiToken"
                  action="http://upload.qiniup.com"
                  :headers="headers"
                  accept=".jpg,.png"
                  :before-upload="uploadPic"
                  v-if="!form1[index]"
                  :on-success="imageUploadSuccess.bind(null, { index })"
                  :on-progress="uploadProgress"
                  :show-file-list="false"
                >
                  <div class="upload-box"><i class="el-icon-plus"></i></div>
                </el-upload>
                <div class="upload-box" v-else>
                  <img :src="form1[index]" alt="" /><span
                    @click="delCodeVideo(index)"
                    ><i class="el-icon-close"></i
                  ></span>
                </div>
              </div>
            </div>
            <div
              v-if="item.field_type == '富文本'"
              :key="index"
              class="itemRich"
            >
              <div class="font">{{ item.field_name }}</div>
              <ue
                class="ueClass"
                :value="form1[index]"
                :ueConfig="ueConfig"
                @input="setProductDetail($event, index)"
              ></ue>
            </div>
          </template>
          <el-form>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
              <el-button @click="back">取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <!--     <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="产品名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="产品编号">
          <el-input v-model="form.unique"></el-input>
        </el-form-item>
         <el-form-item label="上市时间">
          <el-date-picker
            v-model="form.listed"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item> 
      <el-form-item label="厂家">
        <el-input v-model="form.factory"></el-input>
      </el-form-item>
      <el-form-item label="产品封面图">
        <el-upload
          class="upload-demo"
          :data="qiToken"
          action="http://upload.qiniup.com"
          :headers="headers"
          accept=".jpg,.png"
          :before-upload="uploadPic"
          v-if="!form.dialogImageUrl"
          :on-success="imageUploadSuccess.bind(null, {})"
          :on-progress="uploadProgress"
          :show-file-list="false"
        >
          <div class="upload-box"><i class="el-icon-plus"></i></div>
        </el-upload>
        <div class="upload-box" v-else>
          <img :src="form.dialogImageUrl" alt="" /><span
            @click="form.dialogImageUrl = ''"
            ><i class="el-icon-close"></i
          ></span>
        </div>
      </el-form-item>
      <el-form-item label="相关视频" style="width: 800px">
        <template v-for="(item, index) of picList">
          <div v-if="item.is_del != 1" :key="index" class="itemPic">
            <video height="150px" controls :src="item.url" />
            <span>{{ item.name }}</span>
            <el-button class="detelePic" type="warning" @click="deleTP(index)"
              >删 除</el-button
            >
          </div>
        </template>
        <el-button
          :class="{ marBot: picList.length > 0 }"
          size="small"
          type="primary"
          @click="VisiblePic = true"
          >视频<i class="el-icon-upload el-icon--right"
        /></el-button>
      </el-form-item>-->
      <!--  <el-form-item label="活动集锦" style="width: 750px">
          <template>
            <el-table :data="tableData" height="300" border style="width: 100%">
              <el-table-column prop="title" label="活动标题" width="180">
              </el-table-column>
              <el-table-column label="活动封面图" width="180">
                <template slot-scope="scope">
                  <img
                    :src="scope.row.image"
                    alt=""
                    style="width: 100%; height: 100px; object-fit: cover"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="jump_url" label="活动链接">
              </el-table-column>
              <el-table-column prop="sort" label="排序"> </el-table-column>
              <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                  <i
                    class="el-icon-edit"
                    @click="editActivity(scope.row, 0)"
                  ></i>
                  <i
                    style="margin-left: 10px"
                    class="el-icon-delete"
                    @click="deleteActivity(scope.row, 0)"
                  ></i>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <el-button
            :class="{ marBot: picList.length > 0 }"
            size="small"
            type="primary"
            @click="add(0)"
            >添加集锦<i class="el-icon-upload el-icon--right"
          /></el-button>
        </el-form-item>
        <el-form-item label="产品评测" style="width: 750px">
          <template>
            <el-table
              :data="tableData1"
              height="300"
              border
              style="width: 100%"
            >
              <el-table-column prop="title" label="评测标题"> </el-table-column>
              <el-table-column label="评测封面图" width="180">
                <template slot-scope="scope">
                  <img
                    :src="scope.row.image"
                    alt=""
                    style="width: 100%; height: 100px; object-fit: cover"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="jump_url" label="评测链接">
              </el-table-column>
              <el-table-column prop="source" label="评测来源">
              </el-table-column>
              <el-table-column prop="sort" label="排序"> </el-table-column>
              <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                  <i
                    class="el-icon-edit"
                    @click="editActivity(scope.row, 1)"
                  ></i>
                  <i
                    style="margin-left: 10px"
                    class="el-icon-delete"
                    @click="deleteActivity(scope.row, 1)"
                  ></i>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <el-button
            :class="{ marBot: picList.length > 0 }"
            size="small"
            type="primary"
            @click="add(1)"
            >添加评测<i class="el-icon-upload el-icon--right"
          /></el-button>
        </el-form-item>
        <el-form-item label="常见问题" style="width: 750px">
          <template>
            <el-table
              :data="tableData2"
              height="300"
              border
              style="width: 100%"
            >
              <el-table-column prop="title" label="问题标题"> </el-table-column>
              <el-table-column label="问题封面图" width="180">
                <template slot-scope="scope">
                  <img
                    :src="scope.row.image"
                    alt=""
                    style="width: 100%; height: 100px; object-fit: cover"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="jump_url" label="问题链接">
              </el-table-column>
              <el-table-column prop="sort" label="排序"> </el-table-column>
              <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                  <i
                    class="el-icon-edit"
                    @click="editActivity(scope.row, 2)"
                  ></i>
                  <i
                    style="margin-left: 10px"
                    class="el-icon-delete"
                    @click="deleteActivity(scope.row, 2)"
                  ></i>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <el-button
            :class="{ marBot: picList.length > 0 }"
            size="small"
            type="primary"
            @click="add(2)"
            >添加问题<i class="el-icon-upload el-icon--right"
          /></el-button>
        </el-form-item>
        <el-form-item label="网络商城" style="width: 750px">
          <template>
            <el-table
              :data="tableData3"
              height="300"
              border
              style="width: 100%"
            >
              <el-table-column prop="title" label="商城标题"> </el-table-column>
              <el-table-column label="商城封面图" width="180">
                <template slot-scope="scope">
                  <img
                    :src="scope.row.image"
                    alt=""
                    style="width: 100%; height: 100px; object-fit: cover"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="jump_url" label="商城链接">
              </el-table-column>
              <el-table-column prop="summary" label="商城简介">
              </el-table-column>
              <el-table-column prop="source" label="商城来源">
              </el-table-column>
              <el-table-column prop="sort" label="排序"> </el-table-column>
              <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                  <i
                    class="el-icon-edit"
                    @click="editActivity(scope.row, 3)"
                  ></i>
                  <i
                    style="margin-left: 10px"
                    class="el-icon-delete"
                    @click="deleteActivity(scope.row, 3)"
                  ></i>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <el-button
            :class="{ marBot: picList.length > 0 }"
            size="small"
            type="primary"
            @click="add(3)"
            >添加商城<i class="el-icon-upload el-icon--right"
          /></el-button>
        </el-form-item>
        <div class="itemRich">
          <div class="font">产品说明书</div>
          <ue
            class="ueClass"
            :value="productState"
            :ueConfig="ueConfig"
            v-if="getproductState"
            @input="setProductState"
            :mobHtml="mobHtml"
          ></ue>
        </div>
        <el-form-item label="产品详情"> 
        <div class="itemRich">
          <div class="font">产品详情</div>
          <ue
            class="ueClass"
            v-if="getproductDetail"
            :value="productDetail"
            :ueConfig="ueConfig"
            @input="setProductDetail"
            :mobHtml="mobHtml1"
          ></ue>
        </div>
         动态生成扩展字段 
 -->
    </div>
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
          :on-progress="uploadProgress"
        >
          <span ref="videoUpload"></span>
        </el-upload>
        <!-- <el-button
            size="small"
            type="primary"
            style="margin-left: 18px; margin-bottom: 20px"
            >视频上传<i class="el-icon-upload el-icon--right"
          /></el-button> -->
      </div>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="视频名称：">
          <el-input v-model="form2.name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAdd">取 消</el-button>
        <el-button type="primary" @click="addPic">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 说明书弹窗 -->
    <el-dialog
      title="添加说明书"
      :visible.sync="openState"
      width="400px"
      class="stateTab"
    >
      <el-tabs v-model="activeTab">
        <el-tab-pane label="新增说明" name="first">
          <span style="display: inline-block">说明书名称：</span>
          <el-input
            style="display: inline-block; width: 220px"
            placeholder="请输入说明书名称"
            v-model="stateName"
            clearable
          >
          </el-input>
        </el-tab-pane>
        <el-tab-pane label="选择模板" name="second">
          选择说明书：
          <el-select
            style="text-align: center"
            v-model="form.id"
            placeholder="请选择模板"
          >
            <el-option
              v-for="item in stateList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="openState = false">取 消</el-button>
        <el-button type="primary" @click="addState('add')">确 定</el-button>
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
    />
  </div>
</template>

<script>
import {
  productEdit,
  productDetails,
  expandList,
  createsRelated,
  relatedList,
  relatedEdit,
  relatedDel,
  productCreate,
  addManual,
  delManual,
  manualList,
  editType,
  manualDetails,
  contentDetail,
  manualEdit,
  contentEdit,
  typeList,
} from "@/api/product";
import { TypeList, createMater } from "@/api/myApi";

import { mapGetters } from "vuex";
import management from "@/components/management/management";
import { getQiToken } from "@/api/user";
import ue from "@/components/ue";
import { getToken } from "@/utils/auth";
import { publicPath } from "@/main";
import { Loading } from "element-ui";
import { first } from "js-md5";
export default {
  name: "ProductEdit",
  components: {
    ue,
    management,
  },
  data() {
    return {
      headers: { Authorization: "Bearer " + getToken() },
      id: this.$route.query.id,
      showEd: false,
      typeStu: 0,
      classifyList: [], //分类列表
      titleName: "",
      reTitName: false,
      activeName: "first",
      addList: [], //扩展字段列表
      ids: this.$route.query.id,
      pageed: this.$route.query.page,
      openUpload: false,
      nIndex: 0, //默认封面图
      haveState: false, //是否有说明书
      stateName: "",
      videoUploadPercent: 0,
      videoFlag: false,
      typeState: [],
      stateType: "",
      stateDetail: "",
      editState: [
        { label: "开启", value: 1 },
        { label: "关闭", value: 0 },
      ],
      data: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      form: {
        name: "",
        unique: "",
        dialogImageUrl: "",
        factory: "",
        listed: "",
        show: 1,
        sort: 0,
        id: "",
        manual_id: 0,
        classify: 0,
      },
      form2: {},
      form1: [],
      bookName: "",
      stateList: [], //说明书模板列表
      imgs: [], //基础信息封面图集
      dialogType: 1, //打开弹窗的方式
      tableData: [], //活动集锦列表
      tableData1: [], //产品评测
      tableData2: [], //常见问题
      tableData3: [], //网络商城
      dialogVisible: false,
      getproductDetail: "",
      typeNum: 0,
      activeTab: "first", //说明书默认选中的tab
      openState: false, //说明书弹窗开闭
      form3: {}, //单条活动集锦
      getproductState: "",
      titName: "",
      disabled: false,
      uploadLoading: "",
      activity: false, //活动集锦弹窗
      qiToken: {},
      VisiblePic: false,
      productState: "", //产品说明书
      productDetail: "", //产品详情
      picList: [],
      form2: {
        //创建单个视频的记录
        name: "",
        url: "",
        id: 0,
      },
      editorData: "",
      mobHtml: "",
      mobHtml1: "",
      dataNum: "",
      ueConfig: {
        toolbars: [
          [
            "undo", //撤销
            "redo", //重做
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
            "|",
            "blockquote", //引用
            "horizontal", //分隔线
            "|",
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
            "|",
            "simpleupload", //单图上传
            "insertimage", //图上传
            "attachment", //附件上传
            "music",
            "insertvideo",
          ],
        ],
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
    };
  },
  created() {
    if (this.id) {
      this.queryDetails();
      this.getRelated();
    }
    this.qiToken = JSON.parse(sessionStorage.qiToken);
    // 显示扩展字段
    this.geList();
    this.getTypeList();
  },
  computed: {
    ...mapGetters(["userinfo"]),
  },
  methods: {
    addState(type) {
      // 打开新增说明书
      if (type == "open") {
        this.openState = true;
        this.stateName = this.form.name;
        manualList(this.qs.stringify({ page: 1, page_size: 30, type: 1 })).then(
          (res) => {
            this.stateList = res.data.data.data;
          }
        );
      } else if (type == "add") {
        // 添加说明书
        if (this.activeTab == "first") {
          addManual(this.qs.stringify({ name: this.stateName })).then((res) => {
            if (res.status == 200) {
              this.$message({
                message: "添加成功",
                type: "success",
              });
              this.form.id = res.data.id;
              this.openState = false;
              this.onSubmit(res.data.id * 1);
              manualDetails(this.qs.stringify({ id: this.form.id })).then(
                (res) => {
                  this.data = JSON.parse(res.data.data.type_json);
                }
              );

              this.haveState = !this.haveState;
            }
          });
        } else if (this.activeTab == "second") {
          manualDetails(this.qs.stringify({ id: this.form.id })).then((res) => {
            this.data = JSON.parse(res.data.data.type_json);
          });
          this.onSubmit(this.form.id * 1);
          this.openState = false;
          this.haveState = !this.haveState;
        }
      } else if (type == "delete") {
        // 删除说明书
        // delManual(this.qs.stringify({ id: this.form.id })).then((res) => {
        //   if (res.status == 200) {
        //     this.$message({
        //       message: "删除成功",
        //       type: "success",
        //     });
        //     this.haveState = !this.haveState;
        //   }
        // });
        this.$confirm("确认删除所有说明书, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.onSubmit(0);
            this.haveState = !this.haveState;
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
    reName() {
      this.saveState("save");
      this.reTitName = false;
    },
    saveState(data) {
      // 保存说明书
      if (data == "save") {
        this.form.type = 1;
        manualEdit(
          this.qs.stringify({
            id: this.form.id,
            type_json: JSON.stringify(this.data),
            type: this.form.type,
            name: this.stateName,
            // name: "纸巾说明书",
          })
        ).then((res) => {
          this.$message({
            message: "保存成功",
            type: "success",
          });
        });
        return;
      }
      let params = {
        manual_id: this.form.id,
        id: this.form.ids,
        content: this.productState,
      };
      contentEdit(this.qs.stringify(params)).then((res) => {
        manualEdit(
          this.qs.stringify({
            id: this.form.id,
            type_json: JSON.stringify(this.data),
            type: this.form.type,
            name: this.stateName,
          })
        ).then((res) => {
          this.$message({
            message: "保存成功",
            type: "success",
          });
        });
      });
    },
    selectPic(n) {
      // 选中主页图片
      this.nIndex = n;
    },
    //查询产品码
    async queryDetails() {
      let loading = this.$loading({
        text: "加载中...",
      });
      let params = {
        id: this.id,
      };
      await productDetails(this.qs.stringify(params)).then((res) => {
        loading.close();
        for (let i = 0; i < res.data.data.picture.length; i++) {
          this.imgs.push(res.data.data.picture[i].value);
          if (res.data.data.picture[i].main == 1) {
            this.nIndex = i;
          }
        }
        console.log(this.form);
        this.form.name = res.data.data.name;
        this.form.classify = res.data.data.type_id;
        this.form.unique = res.data.data.unique;
        // this.form.dialogImageUrl = res.data.data.image;
        this.form.show = res.data.data.show;
        this.form.factory = res.data.data.factory;
        this.form.listed = res.data.data.listed;
        this.form.sort = res.data.data.sort;
        this.picList = res.data.data.video;
        this.form.manual_id = res.data.data.manual_id;
        for (let i = 0; i < this.picList.length; i++) {
          this.picList[i].url = JSON.parse(
            JSON.stringify(this.picList[i].video_url)
          );
          this.picList[i].name = JSON.parse(
            JSON.stringify(this.picList[i].video_name)
          );
          this.picList[i].is_del = 0;
        }
        // this.getproductState = res.data.data.expand.manual;
        this.getproductDetail = res.data.data.expand.details;
        // this.productState = JSON.parse(JSON.stringify(this.getproductState));
        this.productDetail = JSON.parse(JSON.stringify(this.getproductDetail));
        this.addList = res.data.data.muse_expand;
        for (let i = 0; i < this.addList.length; i++) {
          this.form1.push(this.addList[i].value);
        }
      });
      if (this.form.manual_id == 0) {
        return;
      }
      // 查询说明书详情
      await manualDetails(this.qs.stringify({ id: this.form.manual_id })).then(
        (res) => {
          if (res.status == 200) {
            this.data = JSON.parse(res.data.data.type_json);
            this.form.type = res.data.data.type;
            this.form.id = res.data.data.id;
            this.stateName = res.data.data.name;
            this.haveState = true;
          }
        }
      );
    },

    handleNodeClick(data) {
      // 点击树状图
      console.log(data.id);
      let showMe = data.id.toString();
      console.log(showMe.indexOf("-"));
      if (showMe.indexOf("-") != -1) {
        this.showEd = true;
        console.log(111);
      } else {
        this.showEd = false;
        console.log(222);
      }
      this.form.ids = data.id;
      let parasm = {
        id: data.id,
        manual_id: this.form.id,
      };
      // 防抖多点
      let that = this;
      if (this.stopClickLogin) {
        return false;
      }
      this.stopClickLogin = true;
      setTimeout(() => {
        that.stopClickLogin = false;
      }, 500);
      contentDetail(this.qs.stringify(parasm)).then((res) => {
        if (res.status == 200) {
          this.productState = res.data.data.content;
        }
      });
    },
    uploadToken(err, file, fileList) {
      //  token失效重新请求七牛token
      getQiToken({}).then((res) => {
        let str = res.data.data;
        str.token = JSON.parse(JSON.stringify(str.upToken));
        str.key = JSON.parse(JSON.stringify(str.path));
        delete str.path;
        delete str.upToken;
        sessionStorage.setItem("qiToken", JSON.stringify(str));
        this.$message.error("Token失效，请重新上传");
        this.videoFlag = false;
        this.qiToken = JSON.parse(sessionStorage.qiToken);
      });
      // this.uploadLoading.close();
    },
    addOrEdit() {
      if (!this.id) {
        this.$message({
          message: "请完善基本信息，保存后编辑其他信息",
          type: "warning",
        });
        return false;
      }
    },
    onSubmit(state) {
      let arry = [];
      for (let n = 0; n < this.imgs.length; n++) {
        if (this.nIndex == n) {
          let obj = { value: this.imgs[n], main: 1 };
          arry.push(obj);
        } else {
          let obj = { value: this.imgs[n], main: 0 };
          arry.push(obj);
        }
      }
      // 提交保存
      if (this.id) {
        let expand = [];
        for (let i = 0; i < this.addList.length; i++) {
          // expand[this.addList[i].id] = this.form1[i];
          let a = { id: this.addList[i].id };
          let b = { value: this.form1[i] };
          let c = Object.assign(a, b);
          expand.push(c);
        }
        let loading = this.$loading({
          text: "保存中",
        });
        let params = {};
        if (typeof state == "number") {
          params = {
            id: this.id,
            name: this.form.name,
            image: this.imgs,
            // image: this.form.dialogImageUrl,
            factory: this.form.factory,
            show: this.form.show,
            listed: this.form.listed,
            sort: this.form.sort,
            details: this.productDetail,
            manual: this.productState,
            picture: JSON.stringify(arry),
            videos: JSON.stringify(this.picList),
            expand: expand,
            manual_id: state,
            type_id: this.form.classify,
          };
        } else {
          params = {
            id: this.id,
            name: this.form.name,
            image: this.imgs,
            // image: this.form.dialogImageUrl,
            factory: this.form.factory,
            show: this.form.show,
            listed: this.form.listed,
            sort: this.form.sort,
            details: this.productDetail,
            manual: this.productState,
            picture: JSON.stringify(arry),
            videos: JSON.stringify(this.picList),
            expand: expand,
            type_id: this.form.classify,
          };
        }
        setTimeout(() => {}, 5000);
        productEdit(this.qs.stringify(params)).then((res) => {
          loading.close();
          if (res.status == 200) {
            this.$message({
              message: res.message,
              type: "success",
            });
          }
        });
        setTimeout(() => {
          loading.close();
        }, 5000);
      } else {
        let loading = this.$loading({
          text: "保存中",
        });
        let params = {
          unique: this.form.unique,
          name: this.form.name,
          // image: this.imgs,
          sort: this.form.sort,
          image: this.form.dialogImageUrl,
          show: this.form.show,
          picture: JSON.stringify(arry),
        };
        productCreate(this.qs.stringify(params), { meta: 1 }).then((res) => {
          loading.close();
          if (res.status == 200) {
            this.id = res.data.product_id;
            this.$message({
              message: res.message,
              type: "success",
            });
          }
        });
      }
    },
    getTypeList() {
      typeList(this.qs.stringify({ type: 1 })).then((res) => {
        this.classifyList = res.data.data;
      });
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true;
    },
    uploadProgress(event, file, fileList) {
      // this.uploadLoading = Loading.service({
      //   text: "上传中...",
      // });

      this.videoFlag = true;
      this.videoUploadPercent = file.percentage.toFixed(0) * 1;
    },
    back() {
      this.$router.go(-1);
    },
    uploadPic(file) {
      let newTime = new Date().getTime();
      this.qiToken.key = `${this.qiToken.key}${newTime}.png`;
    },
    setProductState(data) {
      this.productState = data;
    },
    setProductDetail(data, n) {
      if (n) {
        this.form1[n] = data;
      } else {
        this.productDetail = data;
      }
    },
    geList() {
      // 获取扩展字段列表
      expandList().then((res) => {
        this.addList = res.data.list.data;
      });
    },
    addPic() {
      this.picList = this.picList.concat(this.form2);
      this.form2 = {
        name: "",
        url: "",
        id: 0,
      };
      this.VisiblePic = false;
    },
    getRelated() {
      // 获取相关数据的列表
      relatedList(
        this.qs.stringify({
          product_id: this.id,
        })
      ).then((res) => {
        this.tableData = res.data.list[0];
        this.tableData1 = res.data.list[1];
        this.tableData2 = res.data.list[2];
        this.tableData3 = res.data.list[3];
      });
    },
    closeAdd() {
      this.form2 = {
        name: "",
        url: "",
        id: 0,
      };
      this.VisiblePic = false;
    },
    editActivity(row, index, type) {
      this.typeNum = JSON.parse(JSON.stringify(index));
      this.form3 = JSON.parse(JSON.stringify(row));
      this.activity = true;
      this.dialogType = type;
    },
    deleteActivity(row, type) {
      relatedDel(
        this.qs.stringify({
          id: row.id,
        })
      ).then((res) => {
        if (res.status == 200) {
          this.$message({
            message: res.msg,
            type: "success",
          });
          this.getRelated();
        }
      });
    },
    activityAdd() {
      // 确认增加或修改
      console.log(this.form3);
      let parasm = {};
      if (this.form3.id) {
        // 修改
        if (!this.form3.title || !this.form3.image) {
          this.$message({
            message: "请完善数据后提交",
            type: "warning",
          });
          return;
        }
        parasm = {
          product_id: this.id,
          title: this.form3.title,
          type: this.typeNum,
          image: this.form3.image,
          jump_url: this.form3.jump_url,
          sort: this.form3.sort,
          id: this.form3.id,
          source: this.form3.source,
          summary: this.form3.summary,
        };
        relatedEdit(this.qs.stringify(parasm)).then((res) => {
          if (res.status == 200) {
            this.$message({
              message: res.msg,
              type: "success",
            });
            this.getRelated();
          }
        });
      } else {
        // 添加
        if (!this.form3.title || !this.form3.image) {
          this.$message({
            message: "请完善数据后提交",
            type: "warning",
          });
          return;
        }
        parasm = {
          product_id: this.id,
          title: this.form3.title,
          type: this.typeNum,
          image: this.form3.image,
          jump_url: this.form3.jump_url,
          sort: this.form3.sort,
          source: this.form3.source,
          summary: this.form3.summary,
        };
        createsRelated(this.qs.stringify(parasm)).then((res) => {
          if (res.status == 200) {
            this.$message({
              message: res.msg,
              type: "success",
            });
            this.getRelated();
          }
        });
      }
      if (this.stateDetail) {
        createMater(
          this.qs.stringify({
            type_id: this.stateDetail,
            file_type: "png",
            file_path: this.form3.image,
            expand: JSON.stringify({ parasm }),
          })
        );
      }
      this.form3 = {};
      this.stateDetail = "";
      this.activity = false;
    },
    uploadVideo(file) {
      // console.log(file);
      let newTime = new Date().getTime();
      this.qiToken.key = `${this.qiToken.key}${newTime}.mp4`;
    },
    imageUploadSuccess(obj, res, file) {
      // 图片上传成功
      if (obj.index || obj.index === 0) {
        this.form1[obj.index] = `http://voice.xunsheng.org.cn/${res.key}`;
      } else if (obj.type == "activity") {
        this.form3.image = `http://voice.xunsheng.org.cn/${res.key}`;
      } else {
        this.imgs.push(`http://voice.xunsheng.org.cn/${res.key}`);
        if (this.stateType) {
          createMater(
            this.qs.stringify({
              type_id: this.stateType,
              file_type: "png",
              file_path: `http://voice.xunsheng.org.cn/${res.key}`,
            })
          );
        }
      }
      this.videoFlag = false;
      this.qiToken = JSON.parse(sessionStorage.qiToken);
    },
    videoUploadSuccess(obj, res, file) {
      // 视频上传成功
      if (obj.index || obj.index === 0) {
        this.form1[obj.index] = `http://voice.xunsheng.org.cn/${res.key}`;
        this.uploadLoading.close();
        // console.log(this.form2);
      } else {
        this.form2.url = `http://voice.xunsheng.org.cn/${res.key}`;
        let b = JSON.parse(JSON.stringify(file.name));
        this.form2.name = b.substring(0, b.indexOf("."));
        // console.log(this.form2);
        this.picList = this.picList.concat(this.form2);
        this.form2 = {};
        if (this.stateType) {
          createMater(
            this.qs.stringify({
              type_id: this.stateType,
              file_type: "mp4",
              file_path: `http://voice.xunsheng.org.cn/${res.key}`,
            })
          );
        }
      }
      this.videoFlag = false;
      this.qiToken = JSON.parse(sessionStorage.qiToken);
    },
    delCodeVideo(index) {
      // 删除视频
      if (typeof index == "number") {
        this.form1.splice(index, 1, "");
      } else if (index == "image") {
        // 处理删除后  判断条件发送变化后视图不变化
        // this.form3.image = "";
        // console.log(this.form3);
        // this.$forceUpdate();
        this.form3.image = "";
        this.form3 = Object.assign({}, this.form3);
      } else {
        this.form2.url = "";
      }
    },
    deleTP(n) {
      let img = this.picList[n];
      img.is_del = 1;
      this.picList.splice(n, 1, img);
    },
    activityClose() {
      this.activity = false;
      this.form3 = {};
      this.stateDetail = "";
    },
    deletImg(index) {
      // 删除产品封面图;
      if (index == this.nIndex && index != 0) {
        let n = this.nIndex - 1;
        this.nIndex = n;
      } else if (index == 0 && this.imgs.length == 1) {
        this.nIndex = 0;
      } else if (index < this.nIndex) {
        this.nIndex -= 1;
      }
      this.imgs.splice(index, 1);
    },
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
      }
    },
    handleClose(none) {
      // 关闭活动集锦的弹窗
      if (this.dialogType == 1) {
        this.form3 = {};
      }
      none();
    },
    upload(index, name) {
      if (index == 1) {
        this.titleName = "图片上传";
        this.typeStu = 1;
        this.openUpload = true;
        // this.$refs.uploadPng.click();
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
    pushList(val) {
      if (val[1] == 1) {
        // 选择照片
        this.imgs = this.imgs.concat(val[0]);
      } else if (val[1] == 2) {
        // 选择视频
        let videoList = [];
        console.log(val[0]);
        videoList = val[0].map((item) => ({ url: item }));
        this.picList = this.picList.concat(videoList);
      }
    },
    gettableList(val) {
      // 给组件表单传参
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
      }
    },
    uploadAll(val) {
      // 素材库组件内新增
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
        this.$refs.videoUpload.click();
      } else if (val[0] == "添加集锦") {
        this.add(0, 0);
      } else if (val[0] == "添加评测") {
        this.add(1, 0);
      } else if (val[0] == "添加问题") {
        this.add(2, 0);
      } else {
        this.add(3, 0);
      }
    },
    changeChild(val) {
      // 组件弹窗是否关闭
      // console.log(val);
      this.openUpload = val;
    },
    async append(data) {
      // 新增说明书分类
      // console.log(data);
      if (data == "add") {
        // 第一级
        // let newChild={id:}
        let id;
        if (!this.data.length) {
          id = 1;
        } else {
          id = this.data[this.data.length - 1].id;
        }
        const newChild = { id: ++id, label: "请修改名称", children: [] };
        this.data.push(newChild);
        manualEdit(
          this.qs.stringify({
            id: this.form.id,
            name: this.stateName,
            type_json: JSON.stringify(this.data),
            type: this.form.type,
          })
        ).then((res) => {
          this.$message({
            message: "添加成功",
            type: "success",
          });
        });
      } else {
        // 子级
        // console.log(data);
        let idNum = "";
        if (!data.children.length) {
          idNum = data.id + "-" + 1;
        } else {
          let ids = data.children[data.children.length - 1].id.split("-");
          idNum = ids[0];
          for (let i = 1; i < ids.length; i++) {
            if (i == ids.length - 1) {
              ids[i] = ids[i] * 1 + 1;
            }
            idNum = idNum + "-" + ids[i];
          }
        }
        const newChild = {
          id: idNum,
          label: "请修改名称",
          children: [],
        };
        if (!data.children) {
          this.$set(data, "children", []);
        }
        data.children.push(newChild);
        await manualEdit(
          this.qs.stringify({
            id: this.form.id,
            name: this.stateName,
            type_json: JSON.stringify(this.data),
            type: this.form.type,
          })
        ).then((res) => {
          if (res.status == 200) {
            this.$message({
              message: "添加成功",
              type: "success",
            });
          }
        });
      }
    },
    updateName(data) {
      // console.log(data);
      this.dataNum = data.id;
    },
    remove(node, data) {
      // 删除说明书分类
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
      manualEdit(
        this.qs.stringify({
          id: this.form.id,
          type_json: JSON.stringify(this.data),
          del_ids: data.id,
          name: this.stateName,
          type: this.form.type,
        })
      ).then((res) => {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.showEd = false;
        this.productState = "";
      });
    },
  },
  watch: {
    productState(val) {
      this.mobHtml1 = val;
    },
  },
};
</script>
<style lang="scss">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.fun-code {
  background: white;
  .back-box {
    padding: 10px;
    box-sizing: border-box;
    color: #999;
    cursor: pointer;
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
  .fun-table-body {
    // width: 500px;
    margin-left: 20px;
    padding: 20px;
    box-sizing: border-box;
  }
  .fun-code-head {
    border-bottom: 1px solid #f5f5f5;
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
    box-sizing: border-box;
  }
}
.itemRich {
  display: inline-block;
  width: 900px;
  margin-bottom: 22px;
  .font {
    width: 100px;
    text-align: right;
    padding: 0 12px 0 0;
    font-size: 14px;
    color: #606266;
    display: inline-block;
    vertical-align: top;
    font-weight: 700;
  }
  .ueClass {
    width: 713px;
    display: inline-block;
  }
}
.upload-info {
  position: relative;
  margin-bottom: 10px;
  .code-img-tips {
    position: absolute;
    right: 0px;
    z-index: 888;
  }
}
.itemPic {
  height: 180px;
  overflow: hidden;
  display: inline-block;
  line-height: 20px;
  position: relative;
  margin-right: 10px;
  span {
    display: block;
    height: 20px;
    text-align: center;
    overflow: hidden;
    word-break: break-all;
    font-family: "微软雅黑", Tahoma, Geneva, Arial, Helvetica;
    font-size: 14px;
    font-weight: normal;
  }
  .detelePic {
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px;
  }
}
.marBot {
  margin-bottom: 10px;
}
.classInput {
  width: 220px;
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
.plot {
  position: relative;
  cursor: pointer;
  .imgLeft {
    width: 65px;
    position: absolute;
    left: 0;
    top: 0;
    // display: none;
  }
  &:hover {
    .imgLeft {
      display: block !important;
    }
  }
}
.itemContent {
  display: flex;
  vertical-align: text-top;
  .leftContent {
    // display: inline-block;
    width: 250px;
    height: 100%;
    margin-right: 40px;
  }
  .rightContent {
    width: 720px;
    // display: inline-block;
  }
}
.stateTab {
  .el-dialog__body {
    padding: 15px 20px 30px 20px;
  }
}
.el-tree-node__content {
  height: 30px;
}
.delteBtn {
  float: right;
  margin-right: 10px;

  ::before {
    clear: both;
    content: "";
  }
}
.upload-box1 {
  // 视频上传进度条
  width: 150px;
  height: 150px;
  margin-right: 10px;
  vertical-align: top;
  display: inline-block;
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
.leftTitName {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .nameFont {
    font-size: 20px;
    font-weight: 500;
    width: 200px;
  }
  .reStateName {
    cursor: pointer;
    color: #409eff;
  }
}
</style>
