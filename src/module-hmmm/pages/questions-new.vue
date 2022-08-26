<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>试题录入</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学科" prop="subjectID">
          <el-select
            v-model="form.subjectID"
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
        <el-form-item label="目录" prop="catalogID">
          <el-select v-model="form.catalogID" placeholder="请选择">
            <el-option
              v-for="item in subjectDirection"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业" prop="enterpriseID">
          <el-select v-model="form.enterpriseID" placeholder="请选择">
            <el-option
              v-for="item in companysList"
              :key="item.id"
              :label="item.company"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="province">
          <el-select
            v-model="form.province"
            placeholder="请选择"
            @change="areaFn"
          >
            <el-option
              v-for="item in provincesList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="city">
          <el-select v-model="form.city" placeholder="请选择">
            <el-option
              v-for="item in areaList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="方向" prop="direction">
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
          <el-radio-group v-model="form.questionType" @change="selectDiff">
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
        <el-form-item label="题干" class="local-quill-editor" prop="question">
          <quill-editor
            ref="myLQuillEditor"
            v-model="form.question"
            :options="editorOption"
            class="editor"
            @blur="onEditorBlur"
            @focus="onEditorFocus"
            @change="onEditorChange"
          >
          </quill-editor>
        </el-form-item>
        <!-- 单选表单 -->
        <el-form-item label="选项" v-if="isShow">
          <el-radio-group v-model="radioSelect">
            <div
              class="options-group"
              v-for="item in form.options"
              :key="item.code"
            >
              <el-radio :label="item.code" :checked="item.isRight"> </el-radio>
              <span
                ><el-input
                  v-model="item.title"
                  placeholder="请输入内容"
                ></el-input
              ></span>
              <UploadImg></UploadImg>
            </div>
          </el-radio-group>
        </el-form-item>
        <!-- 多选表单 -->
        <el-form-item label="选项" v-if="isShowS">
          <el-checkbox-group v-model="checkbox">
            <div
              class="options-group"
              v-for="item in form.options"
              :key="item.code"
            >
              <el-checkbox v-model="item.isRight" style="width: 48px">{{
                item.code + ":"
              }}</el-checkbox>
              <span
                ><el-input
                  v-model="item.title"
                  placeholder="请输入内容"
                ></el-input
              ></span>
              <UploadImg></UploadImg>
            </div>
          </el-checkbox-group>
        </el-form-item>
        <el-button
          type="danger"
          :disabled="isDisabled"
          v-if="addShow"
          @click="addOptions"
          >+增加选项与答案</el-button
        >
        <el-form-item label="解析视频">
          <el-input v-model="form.videoURL"></el-input>
        </el-form-item>
        <el-form-item label="答案解析" class="local-quill-editor" prop="answer">
          <quill-editor
            ref="myLQuillEditor"
            v-model="form.answer"
            :options="editorOption"
            class="editor"
            @blur="onEditorBlur"
            @focus="onEditorFocus"
            @change="onEditorChange"
          >
          </quill-editor>
        </el-form-item>
        <el-form-item label="题目备注">
          <el-input type="textarea" v-model="form.remarks"></el-input>
        </el-form-item>
        <el-form-item label="试题标签">
          <el-select v-model="form.tags" placeholder="请选择">
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
import { add as addBaseQuestions, detail } from "@/api/hmmm/questions.js";
import { simple as directorySimpleList } from "@/api/hmmm/directorys";
import { list as companysList } from "@/api/hmmm/companys.js";
import { provinces, citys } from "@/api/hmmm/citys";
import { direction } from "@/api/hmmm/constants";
import { simple as simpleTagList } from "@/api/hmmm/tags";
import hljs from "highlight.js";

// 工具栏配置项

export default {
  name: "question-new",
  data() {
    return {
      checkIndex: 0,
      isShow: true,
      isShowS: false,
      isDisabled: true,
      addShow: true,
      provincesList: [],
      areaList: [],
      directionList: [],
      subjectDirection: [],
      radioSelect: "",
      checkbox: [],
      checkboxList: ["A", "B", "C", "D"],
      value: "",
      subjectsList: [],
      companysList: [],
      tagList: [],
      form: {
        subjectID: "", //学科
        catalogID: "", // 目录
        enterpriseID: "", //企业
        province: "", // 城市
        city: "", // 地区
        direction: "", //方向
        questionType: "单选", //题型
        difficulty: "简单", //难度
        question: "", //题干
        options: [
          //选项
          { code: "A", title: "", img: "", isRight: false }, // code 代码 title 标题
          { code: "B", title: "", img: "", isRight: false }, // img 图片URL isRight 是否是正确答案
          { code: "C", title: "", img: "", isRight: false },
          { code: "D", title: "", img: "", isRight: false },
        ],
        videoURL: "", //解析视频
        answer: "", //答案解析
        remarks: "", //题目备注
        tags: "", //试题标签
      },
      editorOption: {
        modules: {
          toolbar: {
            container: toolbarOptions,
          },
          syntax: {
            highlight: (text) => {
              return hljs.highlightAuto(text).value;
            },
          },
        },
        theme: "snow",
        placeholder: "请输入正文",
        // Some Quill optiosn...
      },
      rules: {
        subjectID: [
          { required: true, message: "请选择学科", trigger: "change" },
        ],
        catalogID: [
          { required: true, message: "请选择目录", trigger: "change" },
        ],
        enterpriseID: [
          { required: true, message: "请选择企业", trigger: "change" },
        ],
        province: [
          {
            required: true,
            message: "请选择城市",
            trigger: "change",
          },
        ],
        city: [
          {
            required: true,
            message: "请选择地区",
            trigger: "change",
          },
        ],
        direction: [
          { required: true, message: "请选择方向", trigger: "change" },
        ],
        questionType: [
          { required: true, message: "请选择题目类型", trigger: "change" },
        ],
        difficulty: [
          { required: true, message: "请选择困难程度", trigger: "change" },
        ],
        question: [
          { required: true, message: "请输入题干", trigger: "change" },
        ],
        answer: [
          { required: true, message: "请输入答案解析", trigger: "change" },
        ],
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
    this.edit();
  },
  methods: {
    async edit() {
      if (this.$route.query.id) {
        const { data } = await detail({ id: this.$route.query.id });
        this.form = data;
      }
    },
    async onSubmit() {
      await this.$refs.form.validate();
      if ((this.form.difficulty = "简单")) {
        this.form.difficulty = "1";
      }
      if ((this.form.difficulty = "一般")) {
        this.form.difficulty = "2";
      }
      if ((this.form.difficulty = "困难")) {
        this.form.difficulty = "3";
      }
      if ((this.form.questionType = "单选")) {
        this.form.questionType = "1";
      }
      if ((this.form.questionType = "多选")) {
        this.form.questionType = "2";
      }
      if ((this.form.questionType = "简答")) {
        this.form.questionType = "3";
      }
      // console.log(this.radioSelect);
      this.form.options.forEach((item) => {
        if (item.code === this.radioSelect) {
          item.isRight = true;
        }
      });
      console.log(this.form.options);
      try {
        await addBaseQuestions(this.form);
        this.$message.success("添加成功");
        console.log(222);
        this.$refs.resetFields();
        this.form = [];
        this.$router.push("/questions/list");
      } catch (error) {}
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
      this.areaList = citys(this.form.province);
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
    // 切换试题类型
    selectDiff(val) {
      console.log(val);
      if (val === "单选") {
        (this.isShow = true), (this.isShowS = false), (this.isDisabled = true);
      }
      if (val === "多选") {
        console.log(1);
        (this.isShow = false), (this.isShowS = true), (this.isDisabled = false);
        console.log(2);
      }
      if (val === "简答") {
        (this.isShow = false),
          (this.isShowS = false),
          (this.isDisabled = false);
        this.addShow = false;
      }
    },
    addOptions() {
      console.log(111);
      const moreCheckboxList = [
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
      ];

      this.checkboxList.push(moreCheckboxList[this.checkIndex]);
      console.log(this.checkboxList);
      this.checkIndex++;
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
