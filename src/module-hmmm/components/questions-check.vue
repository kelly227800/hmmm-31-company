<template>
  <div class="container">
    <el-dialog
      @close="onclose"
      title="题目审核"
      :visible="centerDialogVisible"
      width="30%"
    >
      <el-radio v-model="radio" :label="1">通过</el-radio>
      <el-radio v-model="radio" :label="2">拒绝</el-radio>
      <el-input
        v-model="Auditopinion"
        placeholder="请输入审核意见"
        type="textarea"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onclose">取 消</el-button>
        <el-button type="primary" @click="onyes">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { choiceCheck } from "@/api/hmmm/questions";
export default {
  name: "QuestionsCheck",
  data() {
    return {
      radio: 1,
      Auditopinion: "",
    };
  },
  props: {
    centerDialogVisible: {
      type: Boolean,
    },
    Auditid: {},
  },
  methods: {
    onclose() {
      this.$emit("update:centerDialogVisible", false);
      this.radio = 1;
      this.Auditopinion = "";
    },
    async onyes() {
      if (this.Auditopinion.trim() === "") {
        this.$message({
          message: "请输入审核意见",
          type: "warning",
        });
      } else {
        await choiceCheck({
          chkRemarks: this.Auditopinion,
          chkState: this.radio,
          id: this.Auditid,
        });
        this.$message.success("操作成功");
        this.onclose();
        this.$emit("updata");
      }
    },
  },
};
</script>

<style scoped lang="less"></style>
