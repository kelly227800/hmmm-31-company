<template>
  <div class="container">
    <el-card class="box-card">
      <QuestionNavbar @search="seatchfn" />
      <SelectedMainTable ref="main" />
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
import SelectedMainTable from "@/module-hmmm/pages/questions/components/SelectedMainTable.vue";
export default {
  data() {
    return {
      tablelist: [],
      myname: true,
      color: "gold",
    };
  },
  components: {
    QuestionNavbar,
    SelectedMainTable,
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
    seatchfn(list) {
      this.$refs.main.tableData = list;
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  padding: 0 10px;
  margin: 10px 0;
}
img {
  width: 100%;
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
