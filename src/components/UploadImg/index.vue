<template>
  <div>
    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="3"
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <el-button size="small" type="primary">上传图片</el-button>
    </el-upload>
    <el-dialog :visible.sync="isShow" width="80%">
      <img :src="imgSrc" alt="" />
    </el-dialog>
  </div>
</template>

<script>
// id:AKIDiFVUDfqkPntiGYZJm21jAMHvIODl10i9
// key:D9pELBj12mFSO2PVLtABvOaU8VbPxEI5
import COS from "cos-js-sdk-v5";

// SECRETID 和 SECRETKEY请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
const cos = new COS({
  SecretId: "AKIDiFVUDfqkPntiGYZJm21jAMHvIODl10i9",
  SecretKey: "D9pELBj12mFSO2PVLtABvOaU8VbPxEI5",
});
console.log(cos);
export default {
  name: "UploadImg",
  data() {
    return {
      fileList: [
        {
          name: "",
          url: "",
        },
      ],
      imgSrc: "",
      isShow: false,
      loading: false,
    };
  },

  created() {},

  methods: {
    upLoadImg({ file }) {
      console.log(file);
      // console.log("上传图片");
      cos.putObject(
        {
          Bucket: "hmhr-31-1313341613" /* 必须 */,
          Region: "ap-shanghai" /* 存储桶所在地域，必须字段 */,
          Key: "file.name" /* 必须 */,
          StorageClass: "STANDARD",
          Body: file, // 上传文件对象
          onProgress: function (progressData) {
            console.log(JSON.stringify(progressData));
          },
        },
        (err, data) => {
          if (!err && data.statusCode === 200) {
            this.$emit("onSuccess", {
              url: "https:" + data.Location,
            });
          }
        }
      );
    },
    onChange(file, fileList) {
      console.log("狗子");
      this.fileList = fileList;
    },
    onRemove(file, fileList) {
      console.log(file);
      this.fileList = fileList;
    },
    onPreview(file) {
      console.log(file);
      this.isShow = true;
      this.imgSrc = file.url;
    },
    beforeUpload(file) {
      const types = ["image/jpeg", "image/gif"];
      if (!types.includes(file.type)) {
        this.$message.error("请选择" + types.join("、") + "图片");
        return false;
      }
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        this.$message.error("选择图片的大小不能超过2mb");
        return false;
      }
      console.log("上传前检查");
    },
    handlePreview() {},
    handleRemove() {},
    beforeRemove() {},
    handleExceed() {},
  },
};
</script>

<style scoped lang="less">
:deep(.el-upload-list__item-name) {
  color: #606266;
  display: none;
  margin-right: 40px;
  overflow: hidden;
  padding-left: 4px;
  text-overflow: ellipsis;
  -webkit-transition: color 0.3s;
  transition: color 0.3s;
  white-space: nowrap;
}
:deep(.el-upload-list__item .el-icon-upload-success) {
  color: #67c23a;
  display: none;
}
.el-button--small {
  padding: 9px 15px;
  font-size: 12px;
  border-radius: 3px;
  width: 100px;
  height: 60px;
  color: #303133;
  /* #409eff */
}
:deep(.el-button--primary) {
  /* color: #fff; */
  background-color: transparent;
  border: 1px dashed #303133;
}
</style>
