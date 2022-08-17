<template>
  <div class="container">
    <el-card class="box-card">
      <QuestionNavbar />
      <SelectedMainTable />
    </el-card>
  </div>
</template>

<script>
import QuestionNavbar from "./questions/components/QuestionNavbar.vue";
import SelectedMainTable from "@/module-hmmm/pages/questions/components/SelectedMainTable.vue";
export default {
  data() {
    return {};
  },
  components: {
    QuestionNavbar,
    SelectedMainTable,
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang="less">
.container {
  padding: 0 10px;
  margin: 10px 0;
}
</style>
