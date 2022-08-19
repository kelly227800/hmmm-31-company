<template>
  <div class="add-form">
    <el-dialog :title="dialogTitle" :visible="visible" @close="onClose">
      <el-form
        :rules="ruleInline"
        ref="dataForm"
        :model="formBase"
        label-position="left"
        label-width="100px"
        style="width: 100%"
      >
        <el-form-item label="文章标题：" prop="title">
          <el-input
            v-model="formBase.title"
            placeholder="请输入文章标题"
          ></el-input>
        </el-form-item>

        <el-form-item
          class="form-item-content"
          prop="articleBody"
          label="文章内容"
        >
          <quill-editor
            ref="myQuillEditor"
            v-model="formBase.articleBody"
            class="editor"
            :options="editorOption"
          />
        </el-form-item>

        <el-form-item label="视频地址：" prop="videoURL">
          <el-input
            v-model="formBase.videoURL"
            placeholder="请输入视频地址"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSave">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { add, update } from "@/api/hmmm/articles.js";
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
  [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
  ["blockquote"], // 引用
  ["code-block", "image", "link"], // 代码块、链接、图片
];
export default {
  name: "ArticlesAdd",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      formBase: {
        title: "",
        articleBody: "",
        videoURL: "",
      },
      // 表单验证
      ruleInline: {
        title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
        articleBody: [
          { required: true, message: "请输入文章内容", trigger: "blur" },
        ],
      },
      params: this.$parent.$parent.params,

      editorOption: {
        // 编辑框操作事件
        theme: "snow", // or 'bubble'
        placeholder: "",
        modules: {
          toolbar: {
            container: toolbarOptions,
          },
        },
      },
      flag: 0, //0表示添加，1表示修改
    };
  },
  computed: {
    dialogTitle() {
      return this.flag ? "修改文章" : "新增文章";
    },
  },
  methods: {
    // 弹窗取消关闭的时候
    onClose() {
      this.$emit("update:visible", false);
      this.$refs.dataForm.resetFields();
      this.formBase = {
        title: "",
        articleBody: "",
        videoURL: "",
      };
    },
    // 保存的时候
    async onSave() {
      await this.$refs.dataForm.validate();
      try {
        if (this.flag) {
          await update(this.formBase);
        } else {
          await add(this.formBase);
        }
        this.onClose();
        this.$emit("render", this.params);
      } catch (err) {
        this.$message.error("操作失败");
      }
    },
    // 修改的时候
    async editDate(row) {
      this.flag = 1;
      this.formBase.id = row.id;
      this.formBase.title = row.title;
      this.formBase.articleBody = row.articleBody;
      this.formBase.videoURL = row.videoURL;
    },
  },
};
</script>
<style>
.ql-editor {
  height: 200px !important;
}
</style>
