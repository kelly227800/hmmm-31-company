<template>
  <div class="app-container">
    <el-card class="box-card">
      <!-- 头部 -->
      <div class="userSerch">
        <div class="seachLeft">
          <el-input
            size="small"
            v-model.trim="params.title"
            placeholder="根据用户名搜索"
          ></el-input>
          <el-button size="small" @click="params.title = ''">清空</el-button>
          <el-button size="mini" type="primary" @click="serchUser"
            >搜索</el-button
          >
        </div>
        <div class="seachLeft">
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="success"
            @click="addPower"
          >
            新增权限组
          </el-button>
        </div>
      </div>
      <!-- 记录 -->
      <el-alert :closable="false" type="info" show-icon>
        <template #title>共 {{ total }} 条记录 </template>
      </el-alert>

      <!-- 表格 -->
      <el-table
        ref="multipleTable"
        :data="permList"
        tooltip-effect="dark"
        style="width: 100%"
        :header-cell-style="{
          background: '#f4f4f5',
          color: '#909399',
          'text-align': 'center',
        }"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column align="center" prop="title" label="用户名">
        </el-table-column>
        <el-table-column
          align="center"
          prop="create_date"
          sortable
          label="日期"
        >
          <template slot-scope="{ row }">{{
            row.create_date | parseTimeByString
          }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <el-button
              @click="editPower(row)"
              style="
                width: 40px;
                height: 40px;
                border-radius: 50%;
                padding: 10px;
              "
              type="primary"
              icon="el-icon-edit"
              plain
            />
            <el-button
              @click="delPower(row)"
              style="
                width: 40px;
                height: 40px;
                border-radius: 50%;
                padding: 10px;
              "
              icon="el-icon-delete"
              type="danger"
              plain
            />
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <el-pagination
          background
          layout="prev, pager, next,sizes,jumper"
          :total="total"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="params.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </el-card>
    <!-- 编辑权限弹框 -->
    <EditPower
      @update="getPermList"
      v-if="showEditPower"
      :currentTreeNode="editPowerObj"
      :visible.sync="showEditPower"
    />
  </div>
</template>

<script>
import { list, remove } from "@/api/base/permissions";
import EditPower from "../components/EditPower.vue";
import { parseTimeByString } from "@/filters";
export default {
  data() {
    return {
      permList: [],
      total: 0,
      // 请求
      params: {
        page: 1,
        pagesize: 10,
        title: "",
      },
      showEditPower: false,
      editPowerObj: {},
    };
  },
  watch: {
    permList: {
      immediate: true,
      deep: true,
      handler() {},
    },
  },
  components: {
    EditPower,
  },
  created() {
    this.$message.success("刘超开发，代码和我总得跑一个");
    this.getPermList(this.params);
  },

  methods: {
    // 获取列表
    async getPermList(params) {
      const { data } = await list(params);
      this.total = data.counts;
      this.permList = data.list;
      // console.log(data.list);
    },
    // 搜索用户
    serchUser() {
      console.log(this.params.title);
      this.getPermList(this.params);
    },
    // 新增权限组
    addPower() {
      this.editPowerObj = {};
      this.showEditPower = true;
    },
    editPower(row) {
      this.editPowerObj = row;
      this.showEditPower = true;
      console.log(this.editPowerObj);
    },
    // 删除
    async delPower(row) {
      try {
        const res = await remove(row);
        console.log(res);
        this.$message.success("删除成功");
        // 一页删除完  就显示上一页
        if (this.permList.length === 1) {
          console.log(this.params.page);
          this.params.page--;
          console.log(this.params.page);
          this.getPermList(this.params);
        } else {
          this.getPermList(this.params);
        }
      } catch (error) {
        this.$message.error("删除失败，请重试");
      }
    },
    // 更改每一页多少条的时候触发
    handleSizeChange(val) {
      this.params.pagesize = val;
      this.getPermList(this.params);
    },
    // 切换到不同页数的时候触发
    handleCurrentChange(val) {
      console.log("qwert");
      this.params.page = val;
      this.getPermList(this.params);
    },
  },
};
</script>

<style scoped lang="less">
.box-card {
  width: 100%;
  height: 100%;
  background-color: #fff;
  // 搜索框
  .userSerch {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .seachLeft {
      display: flex;
      align-items: center;
      .el-button--default {
        margin-left: 15px;
      }
    }
  }
  // 记录
  .el-alert {
    margin: 20px 0;
  }
}
</style>
