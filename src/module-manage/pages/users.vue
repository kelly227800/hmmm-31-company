<template>
  <div class="app-container">
    <el-card class="box-card">
      <!-- 头部 -->
      <div class="userSerch">
        <div class="seachLeft">
          <el-input
            size="small"
            v-model="username"
            placeholder="根据用户名搜索"
          ></el-input>
          <el-button size="small">清空</el-button>
          <el-button size="mini" type="primary">搜索</el-button>
        </div>
        <div class="seachLeft">
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="success"
            @click="addClick"
          >
            新增用户
          </el-button>
        </div>
      </div>
      <!-- 记录 -->
      <el-alert :closable="false" type="info" show-icon>
        <template #title>共 {{ counts }} 条记录 </template>
      </el-alert>
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
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
      <PageTool></PageTool>
    </el-card>
    <!-- 添加用户弹框 -->
    <UserAdd
      ref="useradd"
      :formBase="formBase"
      :text="text"
      :pageTitle="pageTitle"
    ></UserAdd>
  </div>
</template>

<script>
import PageTool from "../components/page-tool.vue";
import UserAdd from "../components/user-add.vue";
import { list } from "@/api/base/users";

export default {
  data() {
    return {
      username: "", // 搜索框
      tableData: [{ date: "" }, { name: "" }],
      dialogFormVisible: true,
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
      text: "新增",
      pageTitle: "用户",
      // 请求
      pages: {
        page: 1,
        pagesize: 10,
        keyword: "",
      },
      counts: 0,
      //
      tableData: [],
    };
  },
  components: {
    PageTool,
    UserAdd,
  },
  created() {
    this.getUserList();
  },

  methods: {
    addClick() {
      this.$refs.useradd.dialogFormVisible = true;
      // console.log(this.$refs.useradd.dialogFormVisible);
    },
    async getUserList() {
      const { data } = await list();
      console.log(data);
      this.tableData = data.list;
      this.counts = data.counts;
    },
  },
};
</script>

<style scoped lang="less">
.box-card {
  width: 100%;
  height: 100%;
  background-color: pink;
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
