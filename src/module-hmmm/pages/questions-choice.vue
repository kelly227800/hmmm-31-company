<template>
  <div class="container">
    <el-card class="box-card">
      <QuestionNavbar @search="seatchfn" />
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="待审核" name="0"></el-tab-pane>
        <el-tab-pane label="已审核" name="1"></el-tab-pane>
        <el-tab-pane label="已拒绝" name="2"></el-tab-pane>
      </el-tabs>
      <MainTable ref="main" :chkState="activeName" />
    </el-card>
  </div>
</template>

<script>
import QuestionNavbar from "./questions/components/QuestionNavbar.vue";
import MainTable from "@/module-hmmm/pages/questions/components/MainTable.vue";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      activeName: Cookies.get("hmmm-activeName") || "all",
    };
  },
  components: {
    QuestionNavbar,
    MainTable,
  },
  methods: {
    handleClick() {
      setTimeout(async () => {
        Cookies.set("hmmm-activeName", this.activeName);
        await this.$refs.main.getchoice();
      });
    },
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
