<template>
  <el-form label-width="80px" :model="formCompany" size="small">
    <el-row>
      <el-col :span="6">
        <el-form-item label="标签名称">
          <el-input v-model="formCompany.tags" placeholder="请输入"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="城市">
          <el-select
            v-model="formCompany.region"
            placeholder="请选择"
            style="width: 100%"
            @change="provincesFn"
          >
            <el-option
              :label="item"
              :value="item"
              v-for="(item, index) in cityList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="地区">
          <el-select
            v-model="formCompany.city"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              :label="item"
              :value="item"
              v-for="(item, index) in areaList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="企业简称">
          <el-input v-model="formCompany.shortName" placeholder=""></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="状态">
          <el-select
            v-model="formCompany.state"
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
      </el-col>
      <el-col :span="6" style="padding-left: 40px">
        <el-button size="small" @click="clearClick">清除</el-button>
        <el-button type="primary" size="small" @click="searchClick"
          >搜索</el-button
        >
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="end">
          <el-button
            type="success"
            size="small"
            icon="el-icon-edit"
            @click="showAdd"
            >新增用户</el-button
          >
        </el-row>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { provinces, citys } from "@/api/hmmm/citys";
import { status } from "@/api/hmmm/constants";
export default {
  data() {
    return {
      formCompany: {
        page: 1,
        pagesize: this.$parent.$parent.params.pagesize,
        tags: "", //标签名称
        province: "", //城市
        city: "", //地区
        shortName: "", //企业简称
        state: "", //状态：1启用0禁用
      },
      statusList: status,
      cityList: provinces(),
      areaList: citys(),
    };
  },

  created() {},

  methods: {
    // 清除按钮
    clearClick() {
      this.formCompany = {
        page: 1,
        pagesize: 10,
        tags: "", //标签名称
        province: "", //城市
        city: "", //地区
        shortName: "", //企业简称
        state: "", //状态：1启用0禁用
      };
      this.provincesFn("");
      this.$emit("render", this.formCompany);
    },
    // 城市下拉框值改变的时候
    provincesFn(val) {
      this.areaList = citys(val);
      this.formCompany.city = this.areaList[0];
    },
    // 搜索按钮
    searchClick() {
      this.$emit("render", this.formCompany);
    },
    // 新增用户按钮
    showAdd() {
      this.$emit("showAdd");
    },
  },
};
</script>

<style scoped></style>
