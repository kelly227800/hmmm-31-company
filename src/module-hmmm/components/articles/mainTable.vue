<template>
  <div>
    <el-table :data="tableData">
      <el-table-column type="index" label="序号" width="80px"></el-table-column>
      <el-table-column prop="title" label="文章标题" width="400px">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.title }}</span>
          <a
            href="javascript:;"
            class="url"
            @click="clickURL(scope.row)"
            v-if="scope.row.videoURL !== null"
          >
            <i class="el-icon-film"></i>
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="visits" label="阅读数"></el-table-column>
      <el-table-column prop="username" label="录入人"></el-table-column>
      <el-table-column label="录入时间">
        <template slot-scope="{ row }">
          {{ row.createTime | parseTimeByString }}
        </template>
      </el-table-column>
      <el-table-column
        width="100px"
        prop="state"
        label="状态"
        :formatter="formatterState"
      ></el-table-column>
      <el-table-column prop="address" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="showMore(scope.row)">预览</el-button>
          <el-button
            v-show="scope.row.state === 0"
            type="text"
            @click="changeStateFn(scope.row)"
            >启用</el-button
          >
          <el-button
            v-show="scope.row.state === 1"
            type="text"
            @click="changeStateFn(scope.row)"
            >禁用</el-button
          >
          <el-button
            type="text"
            @click="showChange(scope.row)"
            :disabled="scope.row.state === 1"
            >修改</el-button
          >
          <el-button
            type="text"
            @click="delFn(scope.row)"
            :disabled="scope.row.state === 1"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- <video
      src="https://v-cdn.zjol.com.cn/276984.mp4"
      ref="vueMiniPlayer"
    ></video> -->
    <video id="myVideo" class="video-js">
      <source src="https://v-cdn.zjol.com.cn/276984.mp4" type="video/mp4" />
    </video>
  </div>
</template>

<script>
// 数据
import { status } from "@/api/hmmm/constants";
// 接口
import { remove, changeState } from "@/api/hmmm/articles";
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
      return findItem ? "已" + findItem.label : "未知";
    },
    // 点击触发修改弹层
    showChange(id) {
      this.$emit("showChange", id);
    },
    // 点击删除按钮的时候
    delFn(row) {
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await remove(row);
          this.$message({
            type: "success",
            message: "删除成功!",
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
      await changeState({
        id: row.id,
        state: row.state === 1 ? 0 : 1,
      });
      this.$message.success("操作成功!");
      this.$emit("renderAgain", this.params);
    },
    // 点击触发预览弹层
    showMore(id) {
      this.$emit("showMore", id);
    },
    // 视频跳转问题
    clickURL(row) {
      console.log(row.videoURL);
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

.url {
  margin-left: 5px;
  color: #00f;
}
</style>
