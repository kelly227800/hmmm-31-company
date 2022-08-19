<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>试题录入</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="学科">
          <el-select
            v-model="form.subjects"
            placeholder="请选择"
            @change="subjectFn"
            ref="subId"
          >
            <el-option
              v-for="item in subjectsList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目录">
          <el-select v-model="form.catalog" placeholder="请选择">
            <el-option
              v-for="item in subjectDirection"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业">
          <el-select v-model="form.company" placeholder="请选择">
            <el-option
              v-for="item in companysList"
              :key="item.id"
              :label="item.company"
              :value="item.company"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市">
          <el-select v-model="form.city" placeholder="请选择" @change="areaFn">
            <el-option
              v-for="item in provincesList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
          <el-select v-model="form.area" placeholder="请选择">
            <el-option
              v-for="item in areaList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="方向">
          <el-select v-model="form.direction" placeholder="请选择">
            <el-option
              v-for="item in directionList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提醒">
          <el-radio-group v-model="form.remind" @change="selectDiff">
            <el-radio label="单选"></el-radio>
            <el-radio label="多选"></el-radio>
            <el-radio label="简答"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="难度">
          <el-radio-group v-model="form.difficulty">
            <el-radio label="简单"></el-radio>
            <el-radio label="一般"></el-radio>
            <el-radio label="困难"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题干" class="local-quill-editor">
          <quill-editor
            ref="myLQuillEditor"
            v-model="form.stem"
            :options="form.editorOption"
            class="editor"
            @blur="onEditorBlur"
            @focus="onEditorFocus"
            @change="onEditorChange"
          >
          </quill-editor>
        </el-form-item>
        <el-form-item label="选项" v-if="isShow">
          <el-radio-group v-model="form.options">
            <div class="options-group">
              <el-radio label="A"> </el-radio>
              <span
                ><el-input
                  v-model="form.Ainput"
                  placeholder="请输入内容"
                ></el-input
              ></span>
              <UploadImg></UploadImg>
            </div>
            <div class="options-group">
              <el-radio label="B"></el-radio>
              <el-input
                v-model="form.Binput"
                placeholder="请输入内容"
              ></el-input>
              <UploadImg></UploadImg>
            </div>

            <div class="options-group">
              <el-radio label="C"> </el-radio>
              <el-input
                v-model="form.Cinput"
                placeholder="请输入内容"
              ></el-input>
              <UploadImg></UploadImg>
            </div>
            <div class="options-group">
              <el-radio label="D"></el-radio>
              <el-input
                v-model="form.Dinput"
                placeholder="请输入内容"
              ></el-input>
              <UploadImg></UploadImg>
            </div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选项" v-if="isShowS">
          <el-checkbox-group v-model="form.options">
            <div class="options-group">
              <el-checkbox label="A"> </el-checkbox>
              <span
                ><el-input
                  v-model="form.Ainput"
                  placeholder="请输入内容"
                ></el-input
              ></span>
              <UploadImg></UploadImg>
            </div>
            <div class="options-group">
              <el-checkbox label="B"></el-checkbox>
              <el-input
                v-model="form.Binput"
                placeholder="请输入内容"
              ></el-input>
              <UploadImg></UploadImg>
            </div>

            <div class="options-group">
              <el-checkbox label="C"> </el-checkbox>
              <el-input
                v-model="form.Cinput"
                placeholder="请输入内容"
              ></el-input>
              <UploadImg></UploadImg>
            </div>
            <div class="options-group">
              <el-checkbox label="D"></el-checkbox>
              <el-input
                v-model="form.Dinput"
                placeholder="请输入内容"
              ></el-input>
              <UploadImg></UploadImg>
            </div>
          </el-checkbox-group>
        </el-form-item>
        <el-button type="danger" :disabled="isDisabled" v-if="addShow"
          >+增加选项与答案</el-button
        >
        <el-form-item label="解析视频">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="答案解析" class="local-quill-editor">
          <quill-editor
            ref="myLQuillEditor"
            v-model="form.parse"
            :options="form.editorOption"
            class="editor"
            @blur="onEditorBlur"
            @focus="onEditorFocus"
            @change="onEditorChange"
          >
          </quill-editor>
        </el-form-item>
        <el-form-item label="题目备注">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item label="试题标签">
          <el-select v-model="form.region" placeholder="请选择">
            <el-option
              v-for="item in tagList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 引入样式和quillEditor
import UploadImg from "@/components/UploadImg";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import { toolbarOptions } from "../tools";
import { simple as simpleList } from "@/api/hmmm/subjects.js";
import { simple as directorySimpleList } from "@/api/hmmm/directorys";
import { list as companysList } from "@/api/hmmm/companys.js";
import { provinces, citys } from "@/api/hmmm/citys";
import { direction } from "@/api/hmmm/constants";
import { simple as simpleTagList } from "@/api/hmmm/tags";

// 工具栏配置项

export default {
  name: "question-new",
  data() {
    return {
      isShow: true,
      isShowS: false,
      isDisabled: true,
      addShow: true,
      provincesList: [],
      areaList: [],
      directionList: [],
      subjectDirection: [],

      value: "",
      subjectsList: [],
      companysList: [],
      tagList: [],
      form: {
        Ainput: "",
        Binput: "",
        Cinput: "",
        Dinput: "",
        catalog: "",
        company: "",
        name: "",
        city: "",
        area: "",
        direction: "",
        remind: "单选",
        difficulty: "",
        options: "",
        subjects: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
        stem: "",
        parse: "",
        editorOption: {
          modules: {
            toolbar: toolbarOptions,
          },
          theme: "snow",
          placeholder: "请输入正文",
          // Some Quill optiosn...
        },
      },
    };
  },
  components: {
    quillEditor,
    UploadImg,
  },
  created() {
    this.getSimpleList();
    this.getCompanysList();
    this.getProvincesList();
    this.directionList = direction;
    // console.log(this.directionList);
    // console.log(direction);
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    // 失去焦点事件
    onEditorBlur(e) {
      console.log("onEditorBlur: ", e);
    },
    // 获得焦点事件
    onEditorFocus(e) {
      console.log("onEditorFocus: ", e);
    },
    // 内容改变事件
    onEditorChange(e) {
      console.log("onEditorChange: ", e);
    },
    async getSimpleList() {
      const { data } = await simpleList();
      // console.log(data);
      this.subjectsList = data;
      // console.log(this.subjectsList);
    },
    async getCompanysList() {
      const {
        data: { items },
      } = await companysList({ pagesize: 10000 });
      this.companysList = items;
      // console.log(items);
    },
    getProvincesList() {
      // console.log(11);
      this.provincesList = provinces();

      // console.log(this.provincesList);
    },
    areaFn() {
      // console.log(11);
      this.areaList = citys(this.form.city);
      // console.log(this.areaList);
    },
    async subjectFn(val) {
      // console.log(val);
      const { data } = await directorySimpleList({ subjectID: val });
      // console.log(res);
      const res = await simpleTagList({ subjectID: val });

      this.tagList = res.data;
      // console.log(res);
      this.subjectDirection = data;
    },
    selectDiff(val) {
      if (val === "单选") {
        (this.isShow = true), (this.isShowS = false), (this.isDisabled = true);
      }
      if (val === "多选") {
        (this.isShow = false), (this.isShowS = true), (this.isDisabled = false);
      }
      if (val === "简答") {
        (this.isShow = false),
          (this.isShowS = false),
          (this.isDisabled = false);
        this.addShow = false;
      }
    },
  },
};
</script>

<style scoped lang="less">
.local-quill-editor {
  width: 520px;
  height: 260px;
  margin-bottom: 20px;
}
:deep(.ql-editor) {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: 1.42;
  height: 200px;
  outline: none;
  overflow-y: auto;
  padding: 12px 15px;
  -o-tab-size: 4;
  tab-size: 4;
  -moz-tab-size: 4;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
}
// .editor {
//   height: 500px;
//   width: 520px;
//   height: 240px;
//   // margin-bottom: 20px;
// }
.options-group {
  display: flex;
}
</style>
