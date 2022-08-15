<template>
  <div>
    <el-alert
      :title="'数据一共' + total + '条'"
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
      <el-table-column
        prop="question"
        label="题干"
        align="center"
      ></el-table-column>
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
      <el-table-column
        prop="chkState"
        label="审核状态"
        align="center"
        :formatter="formatterState"
      ></el-table-column>
      <el-table-column
        prop="creator"
        label="审核意见"
        align="center"
        :formatter="formatterState"
      ></el-table-column>
      <el-table-column
        prop="creator"
        label="审核人"
        align="center"
        :formatter="formatterState"
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
          <el-button
            type="primary"
            icon="el-icon-view"
            circle
            plain
            @click="Previewfn"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-edit"
            circle
            plain
            @click="$router.push('/questions/new/' + row.id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            plain
          ></el-button
          ><el-button
            type="warning"
            icon="el-icon-check"
            circle
            plain
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
    <video
      v-if="isshow"
      controls
      autoplay
      src="http://v-cdn.zjol.com.cn/277004.mp4"
    ></video>
  </div>
</template>

<script>
import { status } from "@/api/hmmm/constants";
import { choice } from "@/api/hmmm/questions";

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
    };
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
        const { data } = await choice(this.params);
        this.total = data.counts;
        this.tableData = data.items;
      } else {
        this.params = {
          page: 1,
          pagesize: 5,
          chkState: this.chkState,
        };
        const { data } = await choice(this.params);
        this.total = data.counts;
        this.tableData = data.items;
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
      console.log(val);
      this.params.page = val;
      this.getchoice();
    },
    Previewfn() {
      this.isshow = !this.isshow;
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
</style>
