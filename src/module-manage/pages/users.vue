<template>
  <div class="app-container">
    <el-card class="box-card">
      <!-- 头部 -->
      <div class="userSerch">
        <div class="seachLeft">
          <el-input
            size="small"
            v-model.trim="params.username"
            placeholder="根据用户名搜索"
          ></el-input>
          <el-button size="small" @click="params.username = ''">清空</el-button>
          <el-button size="mini" type="primary" @click="serchUser"
            >搜索</el-button
          >
        </div>
        <div class="seachLeft">
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="success"
            @click="addUser"
          >
            新增用户
          </el-button>
        </div>
      </div>
      <!-- 记录 -->
      <el-alert :closable="false" type="info" show-icon>
        <template #title>共 {{ total }} 条记录 </template>
      </el-alert>
      <!-- 表格 -->
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中..."
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{
          background: '#f4f4f5',
          color: '#909399',
          'text-align': 'center',
        }"
      >
        <el-table-column align="center" prop="id" label="序号">
        </el-table-column>
        <el-table-column align="center" prop="email" label="邮箱">
        </el-table-column>
        <el-table-column align="center" prop="phone" label="联系电话">
        </el-table-column>
        <el-table-column align="center" prop="username" label="用户名">
        </el-table-column>
        <el-table-column
          align="center"
          prop="permission_group_title"
          label="权限组名称"
        >
        </el-table-column>
        <el-table-column align="center" prop="role" label="角色">
        </el-table-column>
        <el-table-column
          style="padding-left: 5px; padding-right: 5px"
          align="center"
          label="操作"
        >
          <template slot-scope="{ row }">
            <el-button
              @click="editUser(row)"
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
              v-if="row.id !== 2"
              @click="delUser(row)"
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
    <!-- 添加用户弹框 -->
    <UserAdd
      v-if="visible"
      :visible.sync="visible"
      :userItem="userItem"
      @add-success="getUserList"
    ></UserAdd>
  </div>
</template>

<script>
import PageTool from "../components/page-tool.vue";
import UserAdd from "../components/AddUser.vue";
import { list, remove } from "@/api/base/users";

export default {
  data() {
    return {
      username: "", // 搜索框
      tableData: [{ date: "" }, { name: "" }],
      visible: false,
      text: "123",
      pageTitle: "123",
      // 添加弹框的from绑定
      formBase: {
        username: "",
        email: "",
        password: "",
        role: "",
        permission_group_id: "",
        phone: "",
        introduction: "",
      },
      // 请求
      params: {
        page: 1,
        pagesize: 10,
        username: "",
      },
      total: 0,
      //
      tableData: [],
      userItem: {},
      loading: false,
    };
  },
  components: {
    PageTool,
    UserAdd,
  },
  created() {
    this.getUserList();
    // this.$message.success(" 刘超  ，代码和我总得跑一个");
  },
  mounted() {
    this.$message.success(" 刘超  ，代码和我总得跑一个");
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      this.loading = true;
      const { data } = await list(this.params);
      // console.log(data);
      this.tableData = data.list;
      this.total = data.counts;
      this.loading = false;
    },
    // 更改每一页多少条的时候触发
    handleSizeChange(val) {
      console.log(val);
      this.params.pagesize = val;
      this.getUserList();
    },
    // 切换到不同页数的时候触发
    handleCurrentChange(val) {
      console.log(val);
      this.params.page = val;
      this.getUserList();
    },
    // 搜索用户
    serchUser() {
      // console.log(this.params);
      // if (this.params.username == "") {
      //   return this.$message.error("搜索不能为空");
      // }
      this.getUserList();
    },
    // 编辑用户
    editUser(row) {
      // console.log(row);
      this.userItem = row;
      this.visible = true;
    },
    // 添加用户
    addUser() {
      this.userItem = {};
      this.visible = true;
    },
    // 删除用户
    async delUser(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await remove(row);
        this.$message.success("用户已删除");
        // 一页删除完  就显示上一页
        if (this.tableData.length === 1) {
          console.log(this.params.page);
          this.params.page--;
          console.log(this.params.page);
          this.getUserList();
        } else {
          this.getUserList();
        }
      });
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

  .pages {
    margin-top: 20px;
    ::v-deep .el-pagination {
      display: flex;
      // align-items: center;
      justify-content: end;
    }
  }
}
</style>
