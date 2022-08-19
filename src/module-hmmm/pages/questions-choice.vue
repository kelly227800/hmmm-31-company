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
    <el-dialog
      class="dialogmyname"
      width="100%"
      :visible="myname"
      :show-close="false"
    >
      <div class="myname" :style="{ color: color }">
        <i>姜</i><i>河</i><i>南</i>
      </div>
    </el-dialog>
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
      myname: true,
      color: "gold",
    };
  },
  components: {
    QuestionNavbar,
    MainTable,
  },
  created() {
    this.showmyname();
  },
  methods: {
    showmyname() {
      const times = setInterval(() => {
        this.color = `rgb(
        ${Math.floor(Math.random() * 256)},
        ${Math.floor(Math.random() * 256)},
        ${Math.floor(Math.random() * 256)},
        0.8
      )`;
      }, 1);
      setTimeout(() => {
        this.myname = false;
        clearInterval(times);
      }, 3000);
    },
    handleClick() {
      setTimeout(() => {
        Cookies.set("hmmm-activeName", this.activeName);
        this.$refs.main.params.page = 1;
        this.$refs.main.getchoice();
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
::v-deep .dialogmyname {
  .el-dialog {
    background: transparent;
  }
  .el-dialog__header {
    background: unset;
  }
  .myname {
    height: 500px;
    // text-align: center;
    // line-height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    justify-content: space-around;
    font-size: 300px;
  }
}
</style>
