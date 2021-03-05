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
              <div style="display: flex">
                <template v-if="imgs[0]">
                  <div
                    @click.stop="selectPic(index)"
                    v-for="(item, index) of imgs"
                    class="upload-box plot"
                    :key="index"
                  >
                    <img :src="item" alt="" /><span
                      @click.stop="deletImg(index)"
                      ><i class="el-icon-close"></i
                    ></span>
                    <div class="imgLeft" v-show="nIndex == index">
                      <img src="@/assets/icon/fm.png" alt="" />
                    </div>
                  </div>
                </template>
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
                  <div class="upload-box relaFa">
                    <i class="el-icon-plus"></i>
                    <div class="absChild">建议尺寸750*421</div>
                  </div>
                </el-upload>
                <!-- <div class="upload-box plot" v-else>
                  <img :src="form.dialogImageUrl" alt="" /><span
                    @click="form.dialogImageUrl = ''"
                    ><i class="el-icon-close"></i
                  ></span>
                </div> -->
              </div>
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
        <el-tab-pane label="说明书" name="second">
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
            <ue
              class="ueClass"
              v-if="!ids"
              :value="productState"
              :ueConfig="ueConfig"
              @input="setProductState"
              :mobHtml="mobHtml"
            ></ue>
          </div>
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
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
              @click="add(0, 2)"
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
            @click="add(1, 2)"
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
            @click="add(2, 2)"
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
              @click="add(3, 2)"
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
              @click="VisiblePic = true"
              >视频<i class="el-icon-upload el-icon--right"
            /></el-button>
          </div>
          <template v-for="(item, index) of picList">
            <div v-if="item.is_del != 1" :key="index" class="itemPic">
              <video height="150px" controls :src="item.url" />
              <span>{{ item.name }}</span>
              <el-button class="detelePic" type="warning" @click="deleTP(index)"
                >删 除</el-button
              >
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
          <el-upload
            class="upload-demo"
            :data="qiToken"
            action="http://upload.qiniup.com"
            :headers="headers"
            accept=".jpg,.png"
            :on-error="uploadToken"
            :before-upload="uploadPic"
            v-if="!form3.image"
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
          <div class="upload-box" v-else>
            <img :src="form3.image" alt="" /><span @click="form3.image = ''"
              ><i class="el-icon-close"></i
            ></span>
          </div>
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
      </el-form>
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
          :show-file-list="false"
          :on-success="videoUploadSuccess.bind(null, {})"
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
} from "@/api/product";
import { mapGetters } from "vuex";
import { getQiToken } from "@/api/user";
import ue from "@/components/ue";
import { getToken } from "@/utils/auth";
import { publicPath } from "@/main";
import { Loading } from "element-ui";
export default {
  name: "ProductEdit",
  components: {
    ue,
  },
  data() {
    return {
      headers: { Authorization: "Bearer " + getToken() },
      id: this.$route.query.id,
      activeName: "first",
      addList: [], //扩展字段列表
      ids: this.$route.query.id,
      pageed: this.$route.query.page,
      nIndex: 0, //默认封面图
      editState: [
        { label: "开启", value: 1 },
        { label: "关闭", value: 0 },
      ],
      form: {
        name: "",
        unique: "",
        dialogImageUrl: "",
        factory: "",
        listed: "",
        show: 1,
        sort: 0,
      },
      form2: {},
      form1: [],
      imgs: [], //基础信息封面图集
      dialogType: 1, //打开弹窗的方式
      tableData: [], //活动集锦列表
      tableData1: [], //产品评测
      tableData2: [], //常见问题
      tableData3: [], //网络商城
      dialogVisible: false,
      getproductDetail: "",
      typeNum: 0,
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
  },
  computed: {
    ...mapGetters(["userinfo"]),
  },
  methods: {
    selectPic(n) {
      // 选中主页图片
      this.nIndex = n;
    },
    //查询产品码
    queryDetails() {
      let loading = this.$loading({
        text: "加载中...",
      });
      let params = {
        id: this.id,
      };
      productDetails(this.qs.stringify(params)).then((res) => {
        loading.close();
        for (let i = 0; i < res.data.data.picture.length; i++) {
          this.imgs.push(res.data.data.picture[i].value);
          if (res.data.data.picture[i].main == 1) {
            this.nIndex = i;
          }
        }
        this.form.name = res.data.data.name;
        this.form.unique = res.data.data.unique;
        // this.form.dialogImageUrl = res.data.data.image;
        this.form.show = res.data.data.show;
        this.form.factory = res.data.data.factory;
        this.form.listed = res.data.data.listed;
        this.form.sort = res.data.data.sort;
        this.picList = res.data.data.video;
        for (let i = 0; i < this.picList.length; i++) {
          this.picList[i].url = JSON.parse(
            JSON.stringify(this.picList[i].video_url)
          );
          this.picList[i].name = JSON.parse(
            JSON.stringify(this.picList[i].video_name)
          );
          this.picList[i].is_del = 0;
        }
        this.getproductState = res.data.data.expand.manual;
        this.getproductDetail = res.data.data.expand.details;
        this.productState = JSON.parse(JSON.stringify(this.getproductState));
        this.productDetail = JSON.parse(JSON.stringify(this.getproductDetail));
        this.addList = res.data.data.muse_expand;
        for (let i = 0; i < this.addList.length; i++) {
          this.form1.push(this.addList[i].value);
        }
      });
    },
    uploadToken(err, file, fileList) {
      getQiToken({}).then((res) => {
        let str = res.data.data;
        str.token = JSON.parse(JSON.stringify(str.upToken));
        str.key = JSON.parse(JSON.stringify(str.path));
        delete str.path;
        delete str.upToken;
        sessionStorage.setItem("qiToken", JSON.stringify(str));
      });
      this.uploadLoading.close();

      this.qiToken = JSON.parse(sessionStorage.qiToken);
      this.$message.error("Token失效，请重新上传");
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
    onSubmit() {
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
        let params = {
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
        };
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
    handlePictureCardPreview(file) {
      this.dialogVisible = true;
    },
    uploadProgress() {
      this.uploadLoading = Loading.service({
        text: "上传中...",
      });
    },
    back() {
      // this.$router.go(-1);
      this.$router.push({
        name: "ProductCode",
        params: {
          page: this.pageed,
        },
      });
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
      if (this.form3.id) {
        // 修改
        if (!this.form3.title || !this.form3.image) {
          this.$message({
            message: "请完善数据后提交",
            type: "warning",
          });
          return;
        }
        let parasm = {
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
        let parasm = {
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
      this.form3 = {};
      this.activity = false;
    },
    uploadVideo() {
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
        // this.form.dialogImageUrl = `http://voice.xunsheng.org.cn/${res.key}`;
      }
      this.uploadLoading.close();
      this.qiToken = JSON.parse(sessionStorage.qiToken);
    },
    videoUploadSuccess(obj, res, file) {
      // 视频上传成功
      if (obj.index || obj.index === 0) {
        this.form1[obj.index] = `http://voice.xunsheng.org.cn/${res.key}`;
        this.uploadLoading.close();
        console.log(this.form2);
      } else {
        this.form2.url = `http://voice.xunsheng.org.cn/${res.key}`;
        let b = JSON.parse(JSON.stringify(file.name));
        this.form2.name = b.substring(0, b.indexOf("."));
        console.log(this.form2);
      }
      this.uploadLoading.close();
      this.qiToken = JSON.parse(sessionStorage.qiToken);
    },
    delCodeVideo(index) {
      // 删除视频
      if (typeof index == "number") {
        this.form1.splice(index, 1, "");
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
  },
};
</script>
<style lang="scss" scoped>
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
</style>
