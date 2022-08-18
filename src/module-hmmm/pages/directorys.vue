<template>
  <div class="container" style="padding: 10px; background-color: #f0f2f5">
    <div class="content">
      <!-- 搜索框 -->
      <el-form :inline="true" :model="directorysForm">
        <el-row type="flex" flex="start">
          <!-- 目录 -->
          <el-col :span="18">
            <el-form-item label="目录名称" class="nameInput">
              <el-input size="small" v-model="directorysForm.name"></el-input>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item label="状态">
              <el-select v-model="directorysForm.status" placeholder="请选择">
                <el-option label="启用" value="1"> </el-option>
                <el-option label="禁用" value="0"> </el-option>
              </el-select>
            </el-form-item>
            <!-- 按钮 -->
            <el-form-item>
              <el-button size="small" @click="clearForm">清除</el-button>
              <el-button type="primary" size="small" @click="onSearch"
                >搜索</el-button
              ></el-form-item
            >
          </el-col>
          <!-- 新增 -->
          <el-col :span="6" style="text-align: right">
            <el-button
              type="success"
              size="small"
              @click="showDirectoryDialog = true"
              ><i class="el-icon-edit"></i>新增目录</el-button
            >
          </el-col>
        </el-row>
      </el-form>
      <!-- 消息提示 -->
      <el-alert
        :title="'数据一共' + counts + '条'"
        type="info"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 表格 -->
      <el-table
        :data="tableData"
        style="width: 97%; margin: 0 auto"
        :header-cell-style="headerRow"
        @cell-click="clickCell"
      >
        <el-table-column label="序号" type="index" width="80px">
        </el-table-column>
        <el-table-column label="所属学科" prop="subjectName"> </el-table-column>
        <el-table-column label="目录名称" prop="directoryName">
        </el-table-column>
        <el-table-column label="创建者" prop="username"> </el-table-column>
        <el-table-column label="创建日期" prop="addDate">
          <template slot-scope="{ row }">
            {{ row.addDate | parseTimeByString }}
          </template>
        </el-table-column>
        <el-table-column label="面试题数量" prop="totals"> </el-table-column>
        <el-table-column
          label="状态"
          prop="state"
          :formatter="statusFormatter"
        ></el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="{ row }">
            <el-link
              type="primary"
              :underline="false"
              @click="changeStateFn(row)"
              >{{ row.state == 1 ? "禁用" : "启用" }}</el-link
            >
            <el-link
              :type="row.state == 0 ? 'primary' : 'info'"
              :underline="false"
              :disabled="row.state == 1"
              @click="editDirectory(row)"
              >修改</el-link
            >
            <el-link
              :type="row.state == 0 ? 'primary' : 'info'"
              :underline="false"
              :disabled="row.state == 1"
              @click="clickDel(row)"
              >删除</el-link
            >
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
              :total="Number(counts)"
              :current-page="page"
              :page-size="pagesize"
              :page-sizes="[5, 10, 20, 50]"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            >
            </el-pagination></el-row
        ></el-col>
      </el-row>
      <!-- 新增/修改目录对话框 -->
      <DirectorysAdd
        ref="directorysAdd"
        :id="Number(id)"
        :isEdit="isEdit"
        :showDirectoryDialog="showDirectoryDialog"
        @close="closeDialog"
        @update="getDirectoryList"
      />
      <!-- 删除对话框 -->
      <el-dialog
        class="delDialog"
        title="提示"
        :visible.sync="delDirectoryDialog"
        width="420px"
        style="margin-top: 27.5vh; font-size: 18px"
      >
        <div class="text">
          <span class="el-icon-warning"></span>
          <span>此操作将永久删除该目录，是否继续？</span>
        </div>
        <span slot="footer">
          <el-button size="small" @click="delDirectoryDialog = false"
            >取消</el-button
          >
          <el-button size="small" type="primary" @click="confirmDel"
            >确定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { list, changeState, remove } from "@/api/hmmm/directorys";
import { status } from "@/api/hmmm/constants";
import DirectorysAdd from "../components/directorys-add";
export default {
  data() {
    return {
      id: "",
      counts: "",
      directorysForm: {
        name: "",
        status: "",
      },
      tableData: [],
      page: 1,
      pagesize: 10,
      subjectID: "",
      isEdit: false,
      showDirectoryDialog: false,
      delDirectoryDialog: false,
    };
  },
  methods: {
    clickCell(row, column, cell, event) {
      // console.log(row);
    },
    // 处理表头样式
    headerRow() {
      return "background:#fafafa";
    },
    // 利用列格式化属性处理状态数据
    statusFormatter(row, column, cellValue, index) {
      let obj = status.find((item) => item.value == cellValue);
      return "已" + obj.label;
    },
    // 页面尺寸变化
    handleSizeChange(val) {
      this.pagesize = val;
      this.getDirectoryList();
    },
    // 页码变化
    handleCurrentChange(val) {
      this.page = val;
      this.getDirectoryList();
    },
    // 清空表单
    clearForm() {
      this.directorysForm.name = "";
      this.directorysForm.status = "";
    },
    // 改变目录状态
    async changeStateFn(row) {
      try {
        await changeState({
          id: row.id,
          state: row.state == 1 ? 0 : 1,
        });
        this.getDirectoryList();
        this.$message.success("操作成功");
      } catch (err) {
        this.$message.error("操作失败");
      }
    },
    // 修改目录
    editDirectory(row) {
      this.id = row.id;
      this.isEdit = true;
      this.showDirectoryDialog = true;
      const form = this.$refs.directorysAdd.directoryForm;
      form.name = row.directoryName;
      form.subject = row.subjectID;
    },
    // 点击删除
    clickDel(row) {
      this.delDirectoryDialog = true;
      this.id = row.id;
    },
    // 删除目录
    async confirmDel() {
      try {
        await remove({ id: Number(this.id) });
        this.delDirectoryDialog = false;
        this.$message.success("操作成功");
        this.getDirectoryList();
      } catch (err) {
        this.$message.error("操作失败");
      }
    },
    // 获取目录列表
    async getDirectoryList() {
      let query = {};
      // 搜索框无关键字
      if (
        this.directorysForm.name === "" &&
        this.directorysForm.status === ""
      ) {
        query = { page: this.page, pagesize: this.pagesize };
      } else if (
        // 搜索框有目录名称无状态选择
        this.directorysForm.name !== "" &&
        this.directorysForm.status === ""
      ) {
        query = {
          page: this.page,
          pagesize: this.pagesize,
          directoryName: this.directorysForm.name,
        };
      } else if (
        // 搜索框无目录名称有状态选择
        this.directorysForm.status !== "" &&
        this.directorysForm.name === ""
      ) {
        query = {
          page: this.page,
          pagesize: this.pagesize,
          state: this.directorysForm.status,
        };
      } else {
        // 搜索框有目录名称有状态选择
        query = {
          page: this.page,
          pagesize: this.pagesize,
          state: this.directorysForm.status,
          directoryName: this.directorysForm.name,
        };
      }
      const {
        data,
        data: { items, counts },
      } = await list(query);
      this.tableData = items;
      this.counts = counts;
      console.log(data);
    },
    // 搜索
    onSearch() {
      this.page = 1;
      this.getDirectoryList();
    },
    // 关闭新增/修改对话框
    closeDialog() {
      const form = this.$refs.directorysAdd.directoryForm;
      form.name = "";
      form.subject = "";
      this.showDirectoryDialog = false;
      this.isEdit = false;
    },
  },
  created() {
    // 获取初始数据
    this.getDirectoryList();
  },
  components: {
    DirectorysAdd,
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
.el-alert--info {
  margin: 0 auto;
  width: 97%;
  margin-bottom: 20px;
}
.nameInput {
  padding-left: 10px;
}
.el-link {
  margin-right: 10px;
}
.el-icon-edit {
  margin-right: 5px;
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
.el-pagination {
  margin: 20px;
}
</style>
