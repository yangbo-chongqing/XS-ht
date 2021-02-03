<template>
  <div class="body">
    <div class="top">
      <div class="topFont">
        <span class="leftError" :title="fontContent"
          >问题：{{ fontContent }}</span
        >
        <span class="rightStatus">状态：312312312</span>
      </div>
    </div>
    <div class="centerbody">
      <div class="content">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. At officia
        unde praesentium rem mollitia, autem repellat. Laborum doloribus omnis
        debitis id velit, suscipit temporibus corporis eveniet excepturi rem
        obcaecati doloremque. Tempore at placeat sint quibusdam mollitia odit
        nihil aperiam! Quaerat sint non rem, maiores perferendis aliquam
        obcaecati eius dolor distinctio porro nemo magni molestias vero nostrum
        fuga officiis blanditiis dolorem? Vitae quae necessitatibus, iusto
        nostrum consequatur quis optio vel fugiat sunt praesentium tempora
        distinctio itaque, magnam soluta incidunt rerum nulla autem in ratione
        repellendus totam! Veritatis tenetur tempora maxime voluptatibus
        repellendus voluptates rem doloribus sint ipsam maiores dicta, harum
        libero dolorum voluptatem, nam, alias iste fugiat mollitia vel optio
        deserunt minima? Numquam tenetur porro neque quisquam, blanditiis
        perspiciatis, iure amet laudantium mollitia cumque voluptas dolores
        obcaecati quod deleniti cum quo? Laborum nemo quisquam, placeat non
        inventore nobis cumque dolorem asperiores veritatis quaerat voluptates
        deserunt voluptatem cum iusto odit vero esse animi similique beatae,
        distinctio repellendus eveniet vitae accusamus? Unde aliquam iusto at
        alias ratione optio error commodi voluptas recusandae esse officiis
        eveniet a, perferendis expedita velit modi doloribus consequuntur! Rem,
        ad incidunt deserunt illum totam corrupti repellat culpa laboriosam
        placeat voluptatum cumque quae molestiae enim laborum sapiente voluptas
        architecto asperiores facilis? Odit, consectetur dolorum. Officia
        deleniti architecto facilis quibusdam sed minima dolorum suscipit quia,
        eligendi amet blanditiis! Consequuntur voluptate ab sit provident nemo
        veritatis. Officia dolorum error at excepturi aperiam tenetur quibusdam
        dolore, iste dignissimos aliquid perferendis sint sed in reiciendis vel
        corrupti amet? Illo est labore consequatur eum dignissimos velit cumque
        expedita voluptatem. Adipisci, vero. Quam dignissimos illo facilis
        magni, animi vel rem ipsam optio? Dolores ut officia dignissimos libero
        voluptatum optio dicta numquam modi atque, distinctio quam laboriosam.
        Aperiam voluptates ipsam exercitationem odit soluta velit cumque aliquam
        similique. Dolor impedit in debitis perspiciatis. Quia necessitatibus
        architecto odio, iste voluptatibus omnis vero distinctio provident
        tempore maiores veniam delectus quaerat, nisi et cumque dicta, illum
        nihil repellendus. Impedit, sequi. Eligendi a inventore beatae quaerat
        tenetur voluptate obcaecati, sequi natus doloribus autem rerum nisi in
        hic blanditiis sapiente modi id molestiae laborum est. Quasi assumenda
        sit id velit, voluptatem blanditiis culpa nam dolor rem nulla rerum
        itaque dolore natus optio corporis accusantium similique illum odio
        eligendi porro pariatur animi sed facere saepe! Temporibus ducimus
        exercitationem, animi dolorum ea, itaque minus iure harum saepe
        dignissimos deleniti in nesciunt atque aut vitae. Asperiores quos iste
        sunt ab molestiae, officiis quis accusamus nesciunt dignissimos dolor
        possimus quia tenetur repudiandae ipsa molestias consequatur doloremque
        maiores modi, corrupti, neque enim mollitia deleniti minima? Nostrum
        exercitationem, quaerat dignissimos consequatur magni incidunt facilis
        adipisci, laudantium at molestias et rerum. Numquam blanditiis itaque
        sed, tenetur fuga culpa obcaecati eligendi perspiciatis aperiam
        molestias voluptates aliquid id delectus, dignissimos doloremque
        explicabo commodi est illo possimus laborum facere? Tempora est unde at
        veniam magnam, quia quidem accusamus dicta fugit dolores deleniti vero
        aliquam, molestias consectetur harum, aut dolorem officiis fuga animi
        ipsam rem provident magni quisquam omnis. Facilis saepe unde, aspernatur
        minima deleniti enim nam, eligendi natus provident sed, et ad est.
      </div>
      <div class="bottomInput">
        <div class="picIcon">
          <el-upload
            class="upload-demo"
            :data="qiToken"
            action="http://upload.qiniup.com"
            :headers="headers"
            accept=".jpg,.png"
            :on-error="uploadToken"
            :before-upload="uploadPic"
            :on-success="imageUploadSuccess"
            :show-file-list="false"
          >
            <i class="el-icon-picture"></i>
          </el-upload>
        </div>
        <div class="send-box">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            class="resizeNone"
            v-model="textarea"
            @keyup.enter.native="add(111)"
          >
          </el-input>
        </div>
        <div style="text-align: right">
          <el-button type="primary" style="margin: 8px 5px 0 0" size="mini"
            >发 送</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getQiToken } from "@/api/user";
import { getToken } from "@/utils/auth";

export default {
  data() {
    return {
      bodyHeight: 180,
      headers: { Authorization: "Bearer " + getToken() },

      textarea: "",
      qiToken: {},
      fontContent:
        "问题：2009年,W3C 提出了一种新的方案---Flex布局,可以简便、完整、响应式地实现各种页面布局。目前,它已经得到了所有浏览器的支持,这意味着,现在就能很安全地使用这现在就能很安全地使用这现在就能很安全地使用这",
    };
  },
  methods: {
    add(e) {
      console.log(e);
      this.textarea = "";
    },
    imageUploadSuccess() {
      // 图片上传成功
      this.form1[obj.index] = `http://voice.xunsheng.org.cn/${res.key}`;
      this.qiToken = JSON.parse(sessionStorage.qiToken);
    },
    uploadToken(err, file, fileList) {
      console.log(err);
      getQiToken({}).then((res) => {
        let str = res.data.data;
        str.token = JSON.parse(JSON.stringify(str.upToken));
        str.key = JSON.parse(JSON.stringify(str.path));
        delete str.path;
        delete str.upToken;
        sessionStorage.setItem("qiToken", JSON.stringify(str));
      });
      this.qiToken = JSON.parse(sessionStorage.qiToken);
      this.$message.error("Token失效，请重新上传");
    },
    uploadPic(file) {
      let newTime = new Date().getTime();
      this.qiToken.key = `${this.qiToken.key}${newTime}.png`;
    },
  },
  created() {
    this.qiToken = JSON.parse(sessionStorage.qiToken);
  },
};
</script>
<style lang="scss" scoped>
.body {
  width: 800px;
  height: 660px;
  margin: 0 auto;
  .top {
    width: 100%;
    height: 60px;
    background-color: #f1e9e9;
    .topFont {
      box-sizing: border-box;
      margin-left: 10px;
      padding-top: 10px;
      color: #343036;
      display: flex;
      justify-content: space-between;
      .leftError {
        padding-right: 60px;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .rightStatus {
        padding-right: 10px;
      }
    }
  }
  .centerbody {
    position: relative;
    border-top: 1px solid #e7e7e7;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #fff;
    padding: 5px;
    .content {
      position: relative;
      user-select: text;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 100%;
      height: 460px;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 20px;
      background-color: #fff;
    }
    .bottomInput {
      box-sizing: border-box;
      position: relative;
      width: 100%;
      //   padding-bottom: 10px;
      background-color: #fff;
      border-top: 1px solid #e7e7e7;
      .picIcon {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        height: 32px;
        margin-bottom: 5px;
        padding-top: 12px;
        padding-left: 20px;
        width: 100%;
        .el-icon-picture {
          font-size: 22px;
          cursor: pointer;
          &:hover {
            color: #409fff;
          }
        }
      }
      .send-box {
        box-sizing: border-box;
        margin-top: 10px;
        width: 100%;
      }
    }
  }
}
</style>
<style lang="scss" >
.resizeNone {
  .el-textarea__inner {
    //el_input中的隐藏属性 取消文本域可拖动大小
    resize: none !important; //主要是这个样式
  }
}
</style>