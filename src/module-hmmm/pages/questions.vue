<template>
  <div class="container">
    <el-card class="box-card">
      <QuestionNavbar />
      <MainTable />
    </el-card>
  </div>
</template>

<script>
import QuestionNavbar from "./questions/components/QuestionNavbar.vue";
import MainTable from "@/module-hmmm/pages/questions/components/MainTable.vue";
export default {
  data() {
    return {};
  },
  components: {
    QuestionNavbar,
    MainTable,
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
