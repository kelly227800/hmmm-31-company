<template>
  <el-card class="articles-container">
    <!-- 头部表单部分 -->
    <div class="head-input">
      <headInput @render="getArticlesInfo" @showAdd="showAdd"></headInput>
    </div>
    <!-- 中间提示部分 -->
    <div class="middle-alert">
      <el-alert
        :title="`数据一共 ${total} 条`"
        type="info"
        show-icon
        :closable="false"
      ></el-alert>
    </div>
    <!-- 主体表格部分 -->
    <div class="main-table">
      <mainTable
        :tableData="tableData"
        @renderAgain="getArticlesInfo"
        :params="params"
        @showChange="showChange"
        @showMore="showMore"
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
      @render="getArticlesInfo"
      ref="dialogChange"
    ></addDialog>
    <!-- 预览 -->
    <moreDialog :visible.sync="dialogMoreVisible" ref="dialogMore"></moreDialog>
  </el-card>
</template>

<script>
// 引用的组件
import headInput from "../components/articles/headInput";
import mainTable from "../components/articles/mainTable";
import addDialog from "../components/articles/addDialog";
import moreDialog from "../components/articles/moreDialog";
// 引用的接口
import { list } from "@/api/hmmm/articles.js";
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
      dialogMoreVisible: false, //预览的弹层
    };
  },

  components: {
    headInput,
    mainTable,
    addDialog,
    moreDialog,
  },

  created() {
    // alert("姚淑怡");
    this.getArticlesInfo(this.params);
  },

  methods: {
    async getArticlesInfo(params) {
      let searchList = {};
      // 判断传的数据中，有没有值为空值，空值则直接请求时候不传
      for (const key in params) {
        if (params[key] || params[key] === 0) {
          searchList[key] = params[key];
        }
      }
      let res = await list(searchList);
      if (res.data.page > res.data.pages) {
        searchList.page = res.data.pages;
        res = await list(searchList);
      }
      this.tableData = res.data.items;
      this.total = res.data.counts;
    },
    // 更改每一页多少条的时候触发
    handleSizeChange(val) {
      this.params.pagesize = val;
      this.getArticlesInfo(this.params);
    },
    // 切换到不同页数的时候触发
    handleCurrentChange(val) {
      this.params.page = val;
      this.getArticlesInfo(this.params);
    },
    // 新增按钮触发新增弹层
    showAdd() {
      this.dialogAddVisible = true;
    },
    // 修改
    showChange(row) {
      this.dialogAddVisible = true;
      this.$refs.dialogChange.editDate(row);
    },
    // 预览
    showMore(row) {
      this.dialogMoreVisible = true;
      this.$refs.dialogMore.moreDate(row);
    },
  },
};
</script>

<style scoped lang="less">
.articles-container {
  margin: 10px;
  background-color: #fff;
  .middle-alert {
    margin-bottom: 10px;
  }
}
</style>
