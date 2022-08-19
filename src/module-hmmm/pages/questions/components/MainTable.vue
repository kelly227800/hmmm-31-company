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
        width="210px"
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
      <el-table-column
        prop="questionType"
        label="题型"
        align="center"
        :formatter="forquestionType"
      >
      </el-table-column>
      <el-table-column label="题干" align="center" width="180px">
        <template slot-scope="{ row }">
          <div v-html="row.question"></div>
        </template>
      </el-table-column>
      <el-table-column label="录入时间" align="center" width="180px">
        <template slot-scope="{ row }">
          {{ row.addDate | parseTimeByString }}
        </template>
      </el-table-column>
      <el-table-column
        prop="difficulty"
        label="难度"
        align="center"
        :formatter="fordifficulty"
      ></el-table-column
      ><el-table-column
        prop="creator"
        label="录入人"
        align="center"
        width="120px"
      ></el-table-column>
      <el-table-column
        prop="chkState"
        label="审核状态"
        align="center"
        :formatter="forchkType"
      ></el-table-column>
      <el-table-column
        label="审核意见"
        align="center"
        width="180px"
      >
      <template slot-scope="{ row }">
          <div v-html="row.remarks"></div>
        </template>
      </el-table-column>
      <el-table-column
        prop="creator"
        label="审核人"
        align="center"
        width="120px"
      ></el-table-column>
      <el-table-column
        prop="publishState"
        label="发布状态"
        align="center"
        :formatter="formatterState"
      ></el-table-column>
      <!-- slot-scope="scope" -->
      <el-table-column prop="address" label="操作" width="200" align="center">
        <template slot-scope="{ row }">
          <div class="btn">
            <span @click="Previewfn(row.id)">预览</span>
            <span
              :class="{ updown: row.chkState !== 0 }"
              @click="Audit(row.id, row.chkState)"
              >审核</span
            >
            <span
              :class="{ updown: row.publishState === 1 }"
              @click="upgo(row.id, row.publishState)"
              >修改</span
            >
            <span v-if="row.publishState === 0" @click="Shelves(row.id)"
              >上架</span
            >
            <span v-else @click="Takeitdown(row.id)">下架</span>
            <span
              :class="{ updown: row.publishState === 1 }"
              @click="del(row.id, row.publishState)"
              >删除</span
            >
          </div>
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

    <QuestionsCheck
      v-if="centerDialogVisible"
      :centerDialogVisible.sync="centerDialogVisible"
      :Auditid="Auditid"
      @updata="getchoice"
    />
    <QuestionsPreview
      v-if="showQuestionsPreview"
      :showQuestionsPreview="showQuestionsPreview"
      :questionDetail="questionDetail"
      @close="showQuestionsPreview = false"
    />
  </div>
</template>

<script>
import {
  publishType,
  difficulty,
  questionType,
  chkType,
} from "@/api/hmmm/constants";
import { choice, remove, choicePublish, detail } from "@/api/hmmm/questions";
import QuestionsCheck from "../../../components/questions-check.vue";
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
      isshow: false,
      tableloading: false,
      centerDialogVisible: false,
      showQuestionsPreview: false,
      questionDetail: {},
      Auditid: "",
    };
  },
  components: {
    QuestionsCheck,
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
          page: this.params.page,
          pagesize: this.params.pagesize,
        };
        this.tableloading = true;
        const { data } = await choice(this.params);
        this.total = data.counts;
        this.tableData = data.items;
        this.tableloading = false;
      } else {
        this.params = {
          page: this.params.page,
          pagesize: this.params.pagesize,
          chkState: this.chkState,
        };
        this.tableloading = true;

        const { data } = await choice(this.params);
        this.total = data.counts;
        this.tableData = data.items;
        this.tableloading = false;
      }
    },
    formatterState(row, column, cellValue, index) {
      const findItem = publishType.find((item) => 3 - item.value == cellValue);
      return findItem ? findItem.label : "待发布";
    },
    fordifficulty(row, column, cellValue, index) {
      const findItem = difficulty.find((item) => item.value == cellValue);
      return findItem ? findItem.label : "未知";
    },
    forquestionType(row, column, cellValue, index) {
      const findItem = questionType.find((item) => item.value == cellValue);
      return findItem ? findItem.label : "未知";
    },
    forchkType(row, column, cellValue, index) {
      const findItem = chkType.find((item) => item.value == cellValue + 1);
      return findItem ? findItem.label : "待审核";
    },
    handleSizeChange(val) {
      this.params.pagesize = val;
      this.getchoice();
    }, // 切换到不同页数的时候触发
    handleCurrentChange(val) {
      console.log(val);
      this.params.page = val;
      this.getchoice();
    },
    async Previewfn(id) {
      this.showQuestionsPreview = true;
      const { data } = await detail({ id });
      this.questionDetail = data;
      console.log(this.questionDetail.videoURL.endsWith(".mp4"));
      if (!this.questionDetail.videoURL.endsWith(".mp4")) {
        this.questionDetail.videoURL = "https://v-cdn.zjol.com.cn/277004.mp4";
      }
    },
    upgo(id, publishState) {
      if (publishState === 0) {
        this.$router.push({
          name: "questions-new",
          query: { id },
        });
      }
    },
    del(id, publishState) {
      if (publishState === 0) {
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
            this.getchoice();
          })
          .catch(() => {
            // this.$message({
            //   type: "info",
            //   message: "已取消删除",
            // });
          });
      }
    },
    async Shelves(id) {
      this.$confirm("您确认上架这道题目吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          console.log(id);
          await choicePublish({ id, publishState: 1 });

          this.$message({
            type: "success",
            message: "上架成功!",
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
    async Takeitdown(id) {
      this.$confirm("您确认上架这道题目吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          console.log(id);
          await choicePublish({ id, publishState: 0 });

          this.$message({
            type: "success",
            message: "下架成功!",
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
    Audit(id, chkState) {
      if (chkState === 0) {
        this.centerDialogVisible = true;
        this.Auditid = id;
      }
    },
  },
};
</script>

<style scoped>
/* ::v-deep .el-table .cell {
  text-align: center;
} */
::v-deep .el-table th.is-leaf {
  border-bottom: 2px solid #e8e8e8 !important;
}
.btn {
  color: #409eff;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}
.updown {
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
