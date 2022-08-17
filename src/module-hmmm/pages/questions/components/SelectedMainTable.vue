<template>
  <div v-loading="tableloading">
    <el-alert
      :title="'数据一共 ' + total + ' 条'"
      type="info"
      show-icon
      :closable="false"
    >
    </el-alert>
    <el-table :data="tableData" style="width: 100%">
      <!-- <el-table-column prop="id" label="序号" align="center"></el-table-column> -->
      <el-table-column
        prop="number"
        label="试题编号"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="subject"
        label="学科"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="catalog"
        label="目录"
        align="center"
      ></el-table-column>
      <el-table-column prop="questionType" label="题型" align="center">
      </el-table-column>
      <el-table-column label="题干" align="center">
        <template slot-scope="{ row }">
          <div v-html="row.question"></div>
        </template>
      </el-table-column>
      <el-table-column
        prop="addDate"
        label="录入时间"
        align="center"
        :formatter="formatterState"
      ></el-table-column>
      <el-table-column
        prop="difficulty"
        label="难度"
        align="center"
        :formatter="formatterState"
      ></el-table-column
      ><el-table-column
        prop="creator"
        label="录入人"
        align="center"
        :formatter="formatterState"
      ></el-table-column>
      <!-- slot-scope="scope" -->
      <el-table-column prop="address" label="操作" width="200" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            icon="el-icon-view"
            circle
            plain
            @click="Previewfn(row.id)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-edit"
            circle
            plain
            @click="upgo(row.id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            plain
            @click="del(row.id)"
          ></el-button
          ><el-button
            type="warning"
            icon="el-icon-check"
            circle
            plain
            @click="add(row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end" align="middle" style="height: 60px">
      <el-pagination
        background
        layout="prev, pager, next,sizes,jumper"
        :total="total"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="params.pagesize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
    <QuestionsPreview
      v-if="showQuestionsPreview"
      :showQuestionsPreview="showQuestionsPreview"
      :questionDetail="questionDetail"
      @close="showQuestionsPreview = false"
    />
  </div>
</template>

<script>
import { status } from "@/api/hmmm/constants";
import { list, remove, choiceAdd, detail } from "@/api/hmmm/questions";
import QuestionsPreview from "../../../components/questions-preview.vue";
export default {
  data() {
    return {
      tableData: [],
      params: {
        page: 1,
        pagesize: 5,
      },
      total: 0,
      tableloading: false,
      showQuestionsPreview: false,
      questionDetail: {},
    };
  },
  components: {
    QuestionsPreview,
  },

  props: {
    chkState: {
      type: String,
      default: () => "all",
    },
  },

  created() {
    this.getchoice();
  },

  methods: {
    async getchoice() {
      if (this.chkState === "all") {
        this.params = {
          page: 1,
          pagesize: 5,
        };
        this.tableloading = true;
        const { data } = await list(this.params);
        this.total = data.counts;
        this.tableData = data.items;
        this.tableloading = false;
      } else {
        this.params = {
          page: 1,
          pagesize: 5,
          chkState: this.chkState,
        };
        this.tableloading = true;

        const { data } = await list(this.params);
        this.total = data.counts;
        this.tableData = data.items;
        this.tableloading = false;
      }
    },
    formatterState(row, column, cellValue, index) {
      const findItem = status.find((item) => item.value == cellValue);
      return findItem ? findItem.label : "未知";
    },
    handleSizeChange(val) {
      this.params.pagesize = val;
      this.getchoice();
    }, // 切换到不同页数的时候触发
    handleCurrentChange(val) {
      this.params.page = val;
      this.getchoice();
    },
    async Previewfn(id) {
      this.showQuestionsPreview = true;
      const { data } = await detail({ id });
      this.questionDetail = data;
      console.log(this.questionDetail.videoURL);
      if (!this.questionDetail.videoURL?.endsWith(".mp4")) {
        this.questionDetail.videoURL = "../../../../assets/默认地址.mp4";
      }
    },
    upgo(id) {
      this.$router.push({
        name: "questions-new",
        query: { id },
      });
    },
    del(id) {
      this.$confirm("此操作将永久删除该题目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          console.log(id);
          await remove({ id });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除",
          // });
        });
    },

    add(id) {
      this.$confirm("此操作将该题目加入精选, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await choiceAdd({ id, choiceState: 1 });
          this.$message({
            type: "success",
            message: "加入精选成功",
          });
          this.getchoice();
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除",
          // });
        });
    },
  },
};
</script>

<style scoped lang="scss">
/* ::v-deep .el-table .cell {
  text-align: center;
} */
::v-deep .el-table th.is-leaf {
  border-bottom: 2px solid #e8e8e8 !important;
}
</style>
