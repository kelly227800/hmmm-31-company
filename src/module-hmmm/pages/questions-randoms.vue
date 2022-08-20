<template>
  <div class="container" style="padding: 10px; background-color: #f0f2f5">
    <div class="content">
      <!-- 搜索框 -->
      <el-form :inline="true" :model="randomsForm">
        <el-row type="flex">
          <el-col>
            <el-form-item label="关键字" class="randomSearchInput">
              <el-input
                size="small"
                v-model="randomsForm.value"
                placeholder="根据编号搜索"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-row type="flex" justify="end">
              <el-button size="small" @click="randomsForm.value = ''"
                >清除</el-button
              >
              <el-button type="primary" size="small" @click="onSearch"
                >搜索</el-button
              >
            </el-row>
          </el-col>
        </el-row>
      </el-form>
      <!-- 消息提示 -->
      <el-alert
        :title="'数据一共' + total + '条'"
        type="info"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 表格 -->
      <el-table
        style="width: 97%; margin: 0 auto"
        :data="randomsList"
        :header-cell-style="headerRow"
      >
        <el-table-column prop="id" label="编号" width="220px">
        </el-table-column>
        <el-table-column
          prop="questionType"
          label="题型"
          :formatter="questionTypeFormatter"
        >
        </el-table-column>
        <el-table-column label="题目编号" width="220px">
          <template slot-scope="{ row }">
            <el-link
              type="primary"
              :underline="false"
              v-for="(item, index) in row.questionIDs"
              :key="index"
              @click.native="clickQuestion(row.questionIDs, $event)"
              >{{ item.number }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column width="180px" prop="addTime" label="录入时间">
        </el-table-column>
        <el-table-column width="140px" prop="totalSeconds" label="答题时间(s)">
        </el-table-column>
        <el-table-column width="140px" prop="accuracyRate" label="正确率(%)">
        </el-table-column>
        <el-table-column width="140px" prop="userName" label="录入人">
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="{ row }">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              circle
              @click="showDelDialog(row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row type="flex">
        <el-col>
          <el-row type="flex" justify="end">
            <el-pagination
              background
              layout="prev, pager, next, sizes,jumper"
              :total="total"
              :page-size="pagesize"
              :page-sizes="[20, 30, 50, 100]"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            >
            </el-pagination></el-row
        ></el-col>
      </el-row>
      <!-- 删除对话框 -->
      <el-dialog
        class="delDialog"
        title="提示"
        :visible.sync="delRandomsDialog"
        width="420px"
        style="margin-top: 27.5vh; font-size: 18px"
      >
        <div class="text">
          <span class="el-icon-warning"></span>
          <span>此操作将永久删除该题组，是否继续？</span>
        </div>
        <span slot="footer">
          <el-button size="small" @click="delRandomsDialog = false"
            >取消</el-button
          >
          <el-button size="small" type="primary" @click="confirmDel"
            >确定</el-button
          >
        </span>
      </el-dialog>
      <!-- 试题预览框 -->
      <QuestionsPreview
        :showQuestionsPreview="showQuestionsPreview"
        :questionDetail="questionDetail"
        @close="showQuestionsPreview = false"
      />
    </div>
  </div>
</template>

<script>
import QuestionsPreview from "../components//questions-preview.vue";
import { randoms, removeRandoms, detail } from "@/api/hmmm/questions";
import { questionType } from "@/api/hmmm/constants";
export default {
  data() {
    return {
      questionDetail: {},
      randomsData: {},
      randomsList: [],
      randomsForm: {
        value: "",
      },
      id: "",
      total: 0,
      page: 1,
      pagesize: 20,
      keyword: "",
      isDel: false,
      delRandomsDialog: false,
      showQuestionsPreview: false,
    };
  },
  components: {
    QuestionsPreview,
  },
  methods: {
    // 点击搜索根据编号查询
    onSearch() {
      this.page = 1;
      this.keyword = this.randomsForm.value;
      this.getData();
    },
    // 点击删除按钮出现删除对话框 获取当前行数据id
    showDelDialog(id) {
      this.delRandomsDialog = true;
      this.id = id;
    },
    // 删除组题列表
    async confirmDel() {
      try {
        this.isDel = true;
        await removeRandoms({ id: this.id });
        this.$message.success("删除成功");
        this.getData();
      } catch (err) {
        this.$message.error("删除失败");
      } finally {
        this.isDel = false;
        this.delRandomsDialog = false;
      }
    },
    // 获取组题数据
    async getData() {
      // 如果删除时页面只剩一条数据
      if (this.isDel && this.randomsList.length == 1) {
        this.page--;
      }
      try {
        const query = {
          page: this.page,
          pagesize: this.pagesize,
          keyword: this.keyword,
        };
        const {
          data,
          data: { items, counts },
        } = await randoms(query);
        // console.log(data);
        this.randomsData = data;
        this.randomsList = items;
        this.total = counts;
      } catch (err) {
        this.$message.error("获取组题列表失败");
      }
    },
    // 利用列格式化属性处理题型数据
    questionTypeFormatter(row, column, cellValue, index) {
      let obj = questionType.find((item) => item.value == cellValue);
      return obj ? obj.label : "未知";
    },
    // 处理表头样式
    headerRow() {
      return "background:#fafafa";
    },
    // 页面尺寸变化
    handleSizeChange(val) {
      this.pagesize = val;
      this.getData();
    },
    // 页码变化
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },
    // 获取试题详情数据
    async getQuestionsDetail(questionId) {
      try {
        const { data } = await detail({ id: questionId });
        this.questionDetail = data;
        console.log(this.questionDetail);
        this.showQuestionsPreview = true;
      } catch (err) {
        this.$message.error("获取试题数据失败");
      }
    },
    // 点击试题编号
    clickQuestion(questionIDs, e) {
      let number = e.target.innerHTML;
      let item = questionIDs.find((item) => item.number === number);
      let questionId = item.id;
      this.getQuestionsDetail(questionId);
    },
  },
  created() {
    // 获取初始数据
    this.getData();
    this.$notify({
      title: "金倩倩",
      type: "success",
      duration: 3000,
    });
  },
};
</script>

<style scoped lang="scss">
.content {
  background-color: #fff;
}
.el-form {
  padding: 20px;
  padding-bottom: 0;
}
.randomSearchInput {
  padding-left: 20px;
}
.el-alert--info {
  margin: 0 auto;
  width: 97%;
  margin-bottom: 20px;
}
.el-pagination {
  margin: 20px;
}
::v-deep .delDialog {
  border-radius: 4px;
  .el-dialog__header {
    padding: 15px 15px 10px;
    background: unset;
    line-height: 1;
    border-radius: 4px;
    .el-dialog__title {
      color: #303133;
    }
    .el-dialog__close {
      color: #fff;
      color: #303133;
    }
  }
  .el-icon-warning {
    margin-right: 10px;
    font-size: 22px;
    color: #e6a23c;
  }
  .el-dialog__body {
    padding: 5px 20px;
  }
  .el-dialog__footer {
    padding: 10px 20px 10px;
  }
}
.text {
  display: flex;
  align-items: center;
}
</style>
