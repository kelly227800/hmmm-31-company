<template>
  <div class="container">
    <el-dialog
      :title="isEdit ? '修改目录' : '新增目录'"
      :visible="showDirectoryDialog"
      v-if="showDirectoryDialog"
      width="28%"
      @close="$emit('close')"
    >
      <el-form
        v-if="showDirectoryDialog"
        ref="directoryForm"
        :model="directoryForm"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="所属学科" prop="subject">
          <el-select v-model="directoryForm.subject" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目录名称" prop="name">
          <el-input
            v-model="directoryForm.name"
            placeholder="请输入目录名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { simple } from "@/api/hmmm/subjects";
import { add, update } from "@/api/hmmm/directorys";
export default {
  data() {
    return {
      options: [],
      directoryForm: {
        subject: "",
        name: "",
      },
      rules: {
        subject: [
          { required: true, message: "请选择所属学科", trigger: "submit" },
        ],
        name: [
          { required: true, message: "请输入目录名称", trigger: "submit" },
        ],
      },
    };
  },
  props: {
    showDirectoryDialog: {
      type: Boolean,
      required: true,
    },
    isEdit: {
      type: Boolean,
    },
    id: {
      type: Number,
    },
  },
  methods: {
    // 获取学科简单列表
    async getSimpleSubjects() {
      const { data } = await simple();
      this.options = data;
    },
    // 添加/修改目录
    async confirm() {
      try {
        await this.$refs.directoryForm.validate();
        // 新增对话框
        if (!this.isEdit) {
          await add({
            subjectID: this.directoryForm.subject,
            directoryName: this.directoryForm.name,
          });
        } else {
          // 修改对话框
          await update({
            id: this.id,
            subjectID: this.directoryForm.subject,
            directoryName: this.directoryForm.name,
          });
        }
        this.$refs.directoryForm.resetFields();
        this.$emit("close");
        this.$message.success("操作成功");
        this.$emit("update");
      } catch (err) {}
    },
  },
  created() {
    this.getSimpleSubjects();
  },
};
</script>

<style scoped lang="less"></style>
