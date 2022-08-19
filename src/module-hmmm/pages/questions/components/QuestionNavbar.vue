<template>
  <div class="container">
    <div class="navbar-top">
      <span class="top-left-text">说明：目前支持学科和关键字条件筛选</span>
      <el-button
        type="success"
        icon="el-icon-edit"
        size="small"
        @click="$router.push('/questions/new')"
        >新增试题</el-button
      >
    </div>
    <el-form ref="form" :model="formData" size="small">
      <el-row>
        <el-col :span="6">
          <el-form-item label="学科" label-width="80px">
            <el-select
              v-model="formData.subjectID"
              placeholder="请选择"
              style="width: 100%"
              @change="disciplinefn"
            >
              <el-option
                v-for="item in disciplineSimplelist"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="6">
          <el-form-item label="二级目录" label-width="80px">
            <el-select
              v-model="formData.catalogID"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in directoryslist"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="6">
          <el-form-item label="标签" label-width="80px">
            <el-select
              v-model="formData.tags"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in tagslist"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="6">
          <el-form-item label="关键字" label-width="80px">
            <el-input
              v-model="formData.keyword"
              placeholder="根据题干搜索"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="6">
          <el-form-item label="试题类型" label-width="80px">
            <el-select
              v-model="formData.questionType"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in questionTypelist"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="6">
          <el-form-item label="难度" label-width="80px">
            <el-select
              v-model="formData.difficulty"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in difficultylist"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="6">
          <el-form-item label="方向" label-width="80px">
            <el-select
              v-model="formData.direction"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in directionlist"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="6">
          <el-form-item label="录入人" label-width="80px">
            <el-select
              v-model="formData.creatorID"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in Entrantlist"
                :key="item.id"
                :label="item.username"
                :value="item.id"
              ></el-option>
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="6">
          <el-form-item label="题目备注" label-width="80px">
            <el-input v-model="formData.remarks"></el-input> </el-form-item
        ></el-col>
        <el-col :span="6">
          <el-form-item label="企业简称" label-width="80px">
            <el-input v-model="formData.shortName"></el-input> </el-form-item
        ></el-col>
        <el-col :span="6">
          <el-form-item label="城市" label-width="80px">
            <el-select
              placeholder="请选择"
              style="width: 49%; margin-right: 4px"
              v-model="formData.province"
              @change="provincefn"
            >
              <el-option
                v-for="(item, index) in provinceslist"
                :key="index"
                :label="item"
                :value="item"
              ></el-option> </el-select
            ><el-select
              v-model="formData.city"
              placeholder="请选择"
              style="width: 49%"
            >
              <el-option
                v-for="(item, index) in cityslist"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="6">
          <el-row type="flex" justify="end">
            <el-form-item>
              <el-button @click="clearfn">清除</el-button>
              <el-button type="primary" @click="Searchfn">搜索</el-button>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { simple as disciplinesimple } from "@/api/hmmm/subjects";
import { simple } from "@/api/hmmm/directorys";
import { simple as tagssimple } from "@/api/hmmm/tags";
import { provinces, citys } from "@/api/hmmm/citys";
import { questionType, difficulty, direction } from "@/api/hmmm/constants";
import { list } from "@/api/base/users";
import { choice } from "@/api/hmmm/questions";
export default {
  name: "QuestionNavbar",
  data() {
    return {
      formData: {
        subjectID: "",
        catalogID: "",
        tags: "",
        keyword: "",
        questionType: "",
        difficulty: "",
        direction: "",
        creatorID: "",
        remarks: "",
        shortName: "",
        province: "",
        city: "",
        page: 1,
        pagesize: 5,
      },
      disciplineSimplelist: [],
      directoryslist: [],
      tagslist: [],
      provinceslist: [],
      cityslist: [],
      questionTypelist: [],
      difficultylist: [],
      directionlist: [],
      Entrantlist: [],
    };
  },
  props: {},
  created() {
    this.getprovinces();
  },
  methods: {
    async disciplinefn(val) {
      const { data } = await simple({ subjectID: val });
      this.directoryslist = data;
      const { data: tagsdata } = await tagssimple({ subjectID: val });
      this.tagslist = tagsdata;
    },
    async getprovinces() {
      const { data: discipline } = await disciplinesimple();
      this.disciplineSimplelist = discipline;
      this.provinceslist = provinces();
      this.questionTypelist = questionType;
      this.difficultylist = difficulty;
      this.directionlist = direction;
      const { data } = await list();
      this.Entrantlist = data.list;
    },
    provincefn(val) {
      this.cityslist = citys(val);
    },
    clearfn() {
      this.formData = {
        subjectID: "",
        catalogID: "",
        tags: "",
        keyword: "",
        questionType: "",
        difficulty: "",
        direction: "",
        creatorID: "",
        remarks: "",
        shortName: "",
        province: "",
        city: "",
      };
      this.cityslist = [];
      this.directoryslist = [];
      this.tagslist = [];
    },
    async Searchfn() {
      const data = { page: 1, pagesize: 5 };
      for (let key in this.formData) {
        if (this.formData[key]) data[key] = this.formData[key];
      }
      const {
        data: { items },
      } = await choice(data);
      this.$emit("search", items);
    },
  },
};
</script>

<style scoped lang="less">
.navbar-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  .top-left-text {
    font-size: 12px;
    color: pink;
  }
}
</style>
