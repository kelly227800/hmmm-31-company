<template>
  <div class="container">
    <el-dialog
      title="题目预览"
      :visible="showQuestionsPreview"
      v-if="showQuestionsPreview"
      width="62%"
      @close="closePreview"
    >
      <!-- 顶部试题信息展示区 -->
      <el-row>
        <el-col :span="6"
          ><div>【题型】：{{ questionType }}题</div></el-col
        >
        <el-col :span="6"
          ><div>【编号】：{{ questionDetail.id }}</div></el-col
        >
        <el-col :span="6"
          ><div>【难度】：{{ questionDifficulty }}</div></el-col
        >
        <el-col :span="6"
          ><div>【标签】：{{ questionDetail.tags }}</div></el-col
        >
      </el-row>
      <el-row class="lineTwo">
        <el-col :span="6"
          ><div>【学科】：{{ questionDetail.subjectName }}</div></el-col
        >
        <el-col :span="6"
          ><div>【目录】：{{ questionDetail.directoryName }}</div></el-col
        >
        <el-col :span="6"
          ><div>【方向】：{{ questionDetail.direction }}</div></el-col
        >
        <el-col :span="6"><div></div></el-col>
      </el-row>
      <el-divider class="dividerOne"></el-divider>
      <!-- 题干展示区 -->
      <div>
        <div>【题干】：</div>
        <div class="questions" v-html="questionDetail.question"></div>
        <!-- 单选题盒子 -->
        <div v-if="questionDetail.questionType == 1">
          <p>单选题 选项：（以下选中的选项为正确答案）</p>
          <el-radio-group v-model="radio">
            <div
              class="option"
              v-for="item in questionDetail.options"
              :key="item.id"
            >
              <el-radio :label="item.title"></el-radio>
            </div>
          </el-radio-group>
        </div>
        <!-- 多选题盒子 -->
        <div v-else-if="questionDetail.questionType == 2">
          <p>多选题 选项：（以下选中的选项为正确答案）</p>
          <el-checkbox-group v-model="checkList">
            <div
              class="option"
              v-for="item in questionDetail.options"
              :key="item.id"
            >
              <el-checkbox :label="item.title"></el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
        <el-divider class="dividerTwo"></el-divider>
      </div>
      <!-- 参考答案 -->
      <div>
        <div class="reference">
          【参考答案】：<el-button
            type="danger"
            size="small"
            @click="showVideo = true"
            >视频答案预览</el-button
          >
        </div>
        <!-- 视频展示区 -->
        <div class="video">
          <span
            class="el-icon-close"
            v-if="showVideo"
            @click="showVideo = false"
          ></span>
          <video
            style="width: 400px; height: 300px"
            v-if="showVideo"
            controls
            autoplay
            :src="questionDetail.videoURL"
          ></video>
        </div>
      </div>
      <el-divider class="dividerThree"></el-divider>
      <!-- 答案解析 -->
      <div>
        【答案解析】：
        <div v-html="questionDetail.answer" style="display: inline-block"></div>
      </div>
      <el-divider class="dividerFour"></el-divider>
      <!-- 题目备注 -->
      <div>
        【题目备注】：
        <div
          v-html="questionDetail.remarks"
          style="display: inline-block"
        ></div>
      </div>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closePreview">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { questionType, difficulty } from "@/api/hmmm/constants";
export default {
  data() {
    return {
      questionsPreview: true,
      showVideo: false,
    };
  },
  props: {
    showQuestionsPreview: {
      type: Boolean,
      default: false,
    },
    questionDetail: {
      type: Object,
    },
  },
  computed: {
    questionType() {
      let obj = questionType.find(
        (item) => item.value == this.questionDetail.questionType
      );
      return obj ? obj.label : "未知";
    },
    questionDifficulty() {
      let obj = difficulty.find(
        (item) => item.value == this.questionDetail.difficulty
      );
      return obj ? obj.label : "未知";
    },
    radio: {
      get() {
        let obj = this.questionDetail.options.find((item) => item.isRight == 1);
        return obj?.title;
      },
      set(val) {},
    },
    checkList: {
      get() {
        const arr = [];
        this.questionDetail.options.forEach((item) => {
          if (item.isRight == 1) {
            arr.push(item.title);
          }
        });
        console.log(arr);
        return arr;
      },
      set(val) {},
    },
  },
  methods: {
    // 关闭预览框
    closePreview() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped lang="scss">
.el-divider {
  margin: 20px 0;
}
.lineTwo {
  padding: 20px 0 0 0;
}
.questions {
  color: blue;
}
.option {
  padding: 8px 0;
}
// 分割线margin设置
.dividerOne {
  margin-bottom: 10px;
}
.dividerTwo {
  margin: 12px 0 10px 0;
}
.dividerThree {
  margin-top: 10px;
}
.dividerFour {
  margin-bottom: 10px;
}
.video {
  position: relative;
  .el-icon-close {
    position: absolute;
    left: 405px;
    top: 15px;
  }
}
</style>
