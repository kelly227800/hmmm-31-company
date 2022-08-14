<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="序号" align="center"></el-table-column>
      <el-table-column
        prop="number"
        label="企业编号"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="shortName"
        label="企业简称"
        align="center"
      ></el-table-column>
      <el-table-column prop="tags" label="标签" align="left"></el-table-column>
      <el-table-column
        prop="creatorID"
        label="创建者"
        align="center"
      ></el-table-column>
      <el-table-column label="创建日期" align="center">
        <template slot-scope="{ row }">
          {{ row.addDate | parseTimeByString }}
        </template></el-table-column
      >
      <el-table-column
        prop="remarks"
        label="备注"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="state"
        label="状态"
        align="center"
        :formatter="formatterState"
      ></el-table-column>
      <!-- slot-scope="scope" -->
      <el-table-column prop="address" label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            plain
          ></el-button>
          <el-tooltip class="item" effect="dark" content="禁用" placement="top">
            <el-button
              type="warning"
              icon="el-icon-close"
              circle
              plain
              v-show="scope.row.state === 1"
              @click="changeStateFn(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="启用" placement="top">
            <el-button
              type="success"
              icon="el-icon-check"
              circle
              plain
              v-show="scope.row.state === 0"
              @click="changeStateFn(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            plain
            @click="delFn(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// 数据
import { status } from "@/api/hmmm/constants";
// 接口
import { remove, disabled } from "@/api/hmmm/companys";
export default {
  data() {
    return {
      params: this.$parent.$parent.params,
      showState: "",
    };
  },

  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
  },

  created() {},

  methods: {
    // 状态 表单里面下拉框的一个转换
    formatterState(row, column, cellValue, index) {
      const findItem = status.find((item) => item.value == cellValue);
      return findItem ? findItem.label : "未知";
    },
    // 点击删除按钮的时候
    delFn(row) {
      this.$confirm("此操作将永久删除用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await remove(row);
          this.$message({
            type: "success",
            message: "成功删除用户!",
          });
          this.$emit("renderAgain", this.params);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 点击切换状态图标
    async changeStateFn(row) {
      const findItem = status.find((item) => item.value == row.state);
      const info = findItem ? findItem.label : "未知";
      this.$confirm(`现在是${info}状态, 是否进行操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await disabled(row);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.$emit("renderAgain", this.params);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
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
