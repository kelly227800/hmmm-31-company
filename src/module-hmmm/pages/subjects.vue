<template>
  <div class="container">
    <el-link @click="toDirectory">学科分类</el-link>
    <br />
    <el-link @click="toTag">学科标签</el-link>
  </div>
</template>

<script>
export default {
  methods: {
    toDirectory() {
      this.$router.push({
        name: "subjects-directorys",
        query: { id: "16", name: "大数据" },
      });
    },
    toTag() {
      this.$router.push({
        name: "subjects-tags",
        query: { id: "16", name: "大数据" },
      });
    },
  },
};
</script>

<style scoped lang="less"></style>
