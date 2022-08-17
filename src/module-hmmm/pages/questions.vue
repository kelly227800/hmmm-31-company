<template>
  <div class="container">
    <el-card class="box-card">
      <QuestionNavbar @search="seatchfn" />
      <SelectedMainTable ref="main" />
    </el-card>
  </div>
</template>

<script>
import QuestionNavbar from "./questions/components/QuestionNavbar.vue";
import SelectedMainTable from "@/module-hmmm/pages/questions/components/SelectedMainTable.vue";
export default {
  data() {
    return {
      tablelist: [],
    };
  },
  components: {
    QuestionNavbar,
    SelectedMainTable,
  },
  created() {},
  methods: {
    seatchfn(list) {
      this.$refs.main.tableData = list;
    },
  },
};
</script>

<style scoped lang="less">
.container {
  padding: 0 10px;
  margin: 10px 0;
}
</style>
