<template>
  <el-card class="company-container">
    <!-- 头部表单部分 -->
    <div class="head-input">
      <headInput @render="getCompanyInfo" @showAdd="showAdd"></headInput>
    </div>
    <!-- 中间提示部分 -->
    <div class="middle-alert">
      <el-alert
        :title="`共${total}条记录`"
        type="info"
        show-icon
        :closable="false"
      ></el-alert>
    </div>
    <!-- 主体表格部分 -->
    <div class="main-table">
      <mainTable
        :tableData="tableData"
        @renderAgain="getCompanyInfo"
        :params="params"
        @showChange="showChange"
      ></mainTable>
    </div>
    <!-- 底部页码部分 -->
    <div class="bottom-page">
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <el-pagination
          background
          layout="prev, pager, next,sizes,jumper"
          :total="total"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="params.pagesize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </div>
    <!-- 弹层部分 -->
    <!-- 新增、修改 -->
    <addDialog
      :visible.sync="dialogAddVisible"
      @render="getCompanyInfo"
      ref="dialog"
    ></addDialog>
  </el-card>
</template>

<script>
// 引用的组件
import headInput from "../components/companys/headInput";
import mainTable from "../components/companys/mainTable";
import addDialog from "../components/companys/addDialog";
// 引用的接口
import { list } from "@/api/hmmm/companys.js";
export default {
  data() {
    return {
      params: {
        page: 1,
        pagesize: 10,
      },
      tableData: [], //表格需要的数据
      total: 0, //一共的条数
      dialogAddVisible: false, //新建的弹层
    };
  },

  components: {
    headInput,
    mainTable,
    addDialog,
  },

  created() {
    this.open1();
    this.getCompanyInfo(this.params);
  },

  methods: {
    open1() {
      this.$notify({
        message: "姚淑怡",
        type: "success",
      });
    },
    async getCompanyInfo(params) {
      let searchList = {};
      // 判断传的数据中，有没有值为空值，空值则直接请求时候不传
      for (const key in params) {
        if (params[key]) {
          searchList[key] = params[key];
        }
      }
      let res = await list(searchList);
      if (res.data.page > res.data.pages) {
        searchList.page = res.data.pages;
        console.log(searchList);
        res = await list(searchList);
      }
      this.tableData = res.data.items;
      this.total = res.data.counts;
    },
    // 更改每一页多少条的时候触发
    handleSizeChange(val) {
      this.params.pagesize = val;
      this.getCompanyInfo(this.params);
    },
    // 切换到不同页数的时候触发
    handleCurrentChange(val) {
      this.params.page = val;
      this.getCompanyInfo(this.params);
    },
    // 新增按钮触发新增弹层
    showAdd() {
      this.dialogAddVisible = true;
    },
    showChange(id) {
      this.dialogAddVisible = true;
      this.$refs.dialog.editDate(id);
    },
  },
};
</script>

<style scoped lang="less">
.company-container {
  margin: 20px;
  background-color: #fff;
  .middle-alert {
    margin-bottom: 20px;
  }
}
</style>
