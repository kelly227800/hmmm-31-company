<template>
  <div class="add-form">
    <el-dialog
      title="预览文章"
      :visible="visible"
      @close="onClose"
      width="800px"
    >
      <div class="title">
        <h2>{{ moreList.title }}</h2>
        <div class="text">
          <span> {{ moreList.createTime | parseTimeByString }} </span>
          <span> {{ moreList.username }} </span>
          <span class="el-icon-view"></span>
          <span> {{ moreList.visits }} </span>
        </div>
      </div>
      <div class="content" v-html="moreList.articleBody"></div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "ArticlesAdd",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      moreList: {},
    };
  },
  methods: {
    // 弹窗取消关闭的时候
    onClose() {
      this.$emit("update:visible", false);
    },
    // 点击预览按钮的时候触发
    async moreDate(row) {
      this.moreList = row;
    },
  },
};
</script>
<style lang="scss" scoped>
.title {
  padding: 0px 0px 10px;
  h2 {
    margin: 0px;
  }
  .text {
    margin: 10px 0 0 10px;
    span {
      margin: 0 3px;
    }
  }
}
.content {
  background: #f5f5f5;
  padding: 10px;
}
</style>
