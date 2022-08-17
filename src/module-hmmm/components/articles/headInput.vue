<template>
  <el-form :inline="true" label-width="80px" :model="formArticles" size="small">
    <el-form-item label="关键字">
      <el-input
        v-model="formArticles.keyword"
        placeholder="根据文章标题搜索"
      ></el-input>
    </el-form-item>
    <el-form-item label="状态">
      <el-select
        v-model="formArticles.state"
        placeholder="请选择"
        style="width: 100%"
      >
        <el-option
          :label="item.label"
          :value="item.value"
          v-for="item in statusList"
          :key="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button size="small" @click="clearClick">清除</el-button>
      <el-button type="primary" size="small" @click="searchClick"
        >搜索</el-button
      >
    </el-form-item>
    <el-button
      type="success"
      size="small"
      icon="el-icon-edit"
      @click="showAdd"
      style="float: right"
      >新增技巧</el-button
    >
  </el-form>
</template>
<script>
import { status } from "@/api/hmmm/constants";
export default {
  data() {
    return {
      formArticles: {
        page: 1,
        pagesize: 10,
        keyword: "",
        state: "",
      },
      statusList: status,
    };
  },

  created() {},

  methods: {
    // 清除按钮
    clearClick() {
      this.formArticles = {
        page: 1,
        pagesize: 10,
        keyword: "",
        state: "",
      };
      this.$emit("render", this.formArticles);
    },
    // 搜索按钮
    searchClick() {
      this.$emit("render", this.formArticles);
    },
    // 新增用户按钮
    showAdd() {
      this.$emit("showAdd");
    },
  },
};
</script>

<style scoped></style>
