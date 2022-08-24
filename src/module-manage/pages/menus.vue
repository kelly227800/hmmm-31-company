<template>
  <div class="app-container">
    <el-card class="box-card">
      <!-- 新建 -->
      <div class="addUser">
        <el-button
          size="mini"
          icon="el-icon-edit"
          type="success"
          @click="addMenu"
        >
          添加菜单
        </el-button>
      </div>
      <!-- 表格 -->
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中..."
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'childs', hasChildren: 'hasChildren' }"
        :header-cell-style="{
          background: '#f4f4f5',
          color: '#909399',
          'text-align': 'center',
        }"
      >
        <el-table-column label="标题" width="180">
          <template slot-scope="{ row }">
            <i class="el-icon-folder-opened icon" v-if="row.childs" />
            <i
              class="el-icon-document-remove icon"
              v-if="!row.childs && !row.is_point"
            />
            <i class="el-icon-view icon" v-if="row.is_point" />
            {{ row.title }}
          </template>
          <!-- <template slot-scope="{ row }">
            <i class="el-icon-folder-opened"></i>
            <span style="margin-left: 10px">{{ row.title }}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="权限点代码" prop="code" width="900">
        </el-table-column>
        <el-table-column label="操作">
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
    </el-card>

    <!-- 新增菜单弹框 -->
    <AddMenu
      v-if="visibleMenu"
      :visibleMenu.sync="visibleMenu"
      :tableData="dialogTreeTable"
      @addSuccess="getMenusList"
      :editRow="editRow"
    ></AddMenu>
  </div>
</template>

<script>
import AddMenu from "../components/AddMenu.vue";
import { list, remove } from "@/api/base/menus.js";
export default {
  data() {
    return {
      tableData: [],
      visibleMenu: false,
      treeProps: {
        children: "childs", //绑定childs为孩子
      },
      editRow: {}, // 编辑项
      dialogTreeTable: [],
      loading: false,
    };
  },
  components: {
    AddMenu,
  },
  created() {
    this.getMenusList();
  },
  mounted() {
    this.$message.success(" 刘超  ，代码和我总得跑一个");
  },

  methods: {
    // 获取菜单列表
    async getMenusList() {
      this.loading = true;

      const { data } = await list();
      const res = JSON.stringify(data);
      // console.log(res);
      const reg1 = /points/gi; // 定义正则
      this.tableData = JSON.parse(res.replace(reg1, "childs")); // 截取points替换为childs
      this.dialogTreeTable = [
        { id: 0, title: "主导航", childs: [...this.tableData] },
      ]; // 截取points替换为childs
      this.loading = false;
    },
    addMenu() {
      this.editRow = {};
      this.visibleMenu = true;
    },
    editUser(row) {
      this.editRow = row;
      this.visibleMenu = true;
    },
    async delUser(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        try {
          // console.log(row.id);
          await remove(row);
          this.$message.success("删除成功");
          this.getMenusList();
        } catch (error) {
          this.$message.error("删除失败，请重试");
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.box-card {
  .addUser {
    display: flex;
    justify-content: end;
  }
  .icon {
    margin-right: 10px;
  }
  :deep(.el-table__expand-icon) {
    display: none;
  }
}
</style>
