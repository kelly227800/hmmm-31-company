<template>
  <div class="container" style="padding: 10px; background-color: #f0f2f5">
    <div class="content">
      <!-- 搜索框 -->
      <el-form :inline="true" :model="directorysForm">
        <el-row type="flex" flex="start">
          <!-- 目录 -->
          <el-col :span="18">
            <el-form-item label="目录名称" class="nameInput">
              <el-input size="small" v-model="directorys.name"></el-input>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item label="状态">
              <el-select v-model="directorys.status" placeholder="请选择">
                <!-- <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option> -->
              </el-select>
            </el-form-item>
            <!-- 按钮 -->
            <el-form-item>
              <el-button size="small" @click="directorysForm.value = ''"
                >清除</el-button
              >
              <el-button type="primary" size="small" @click="onSearch"
                >搜索</el-button
              ></el-form-item
            >
          </el-col>
          <!-- 新增 -->
          <el-col :span="6" style="text-align: right">
            <el-button type="success" size="small">新增目录</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!-- 消息提示 -->
      <el-alert
        :title="'数据一共' + total + '条'"
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
      >
        <el-table-column label="序号"> </el-table-column>
        <el-table-column label="所属学科"> </el-table-column>
        <el-table-column label="目录名称"> </el-table-column>
        <el-table-column label="创建者"> </el-table-column>
        <el-table-column label="创建日期"> </el-table-column>
        <el-table-column label="面试题数量"> </el-table-column>
        <el-table-column label="状态"> </el-table-column>
        <el-table-column label="操作"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 17,
      directorys: {
        name: "",
        status: "",
      },
      tableData: [],
    };
  },
  methods: {
    // 处理表头样式
    headerRow() {
      return "background:#fafafa";
    },
    onSearch() {},
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
</style>
