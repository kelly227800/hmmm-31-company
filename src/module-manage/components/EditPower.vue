<template>
  <el-dialog @close="onClose" title="提示" :visible="visible" width="30%">
    <!-- 表单 -->
    <el-form
      :model="ruleForm"
      :rules="formRules"
      ref="form"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="title">
        <el-input v-model.trim="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="权限分配" prop="treePower">
        <el-tree
          @check-change="checkChange"
          ref="myTree"
          @node-collapse="nodeCollapse"
          :default-checked-keys="defaultCheckedKeys"
          node-key="id"
          default-expand-all
          expand-on-click-node
          show-checkbox
          :data="treeData"
          :props="defaultProps"
        >
        </el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="onSave">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { list } from "@/api/base/menus.js";
import { detail, update, add } from "@/api/base/permissions";
export default {
  name: "EditOrAddPower",
  data() {
    return {
      ruleForm: {
        title: "",
      },
      formRules: {
        title: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
      },
      // 修改默认
      defaultProps: {
        children: "childs", //绑定childs为孩子
        label: "title",
      },
      treeData: [], // 树形数据
      defaultCheckedKeys: [], // 记住权限选中
    };
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false,
    },
    currentTreeNode: {
      type: Object,
    },
  },
  created() {
    this.getMenusList();
    this.getPower();
  },

  methods: {
    // 获取权限列表
    async getMenusList() {
      const { data } = await list();
      const res = JSON.stringify(data);
      // console.log(res);
      const reg1 = /points/gi; // 定义正则
      const treeData = JSON.parse(res.replace(reg1, "childs")); // 截取points替换为childs
      this.treeData = [
        { id: 0, title: "系统菜单和页面权限点", childs: [...treeData] },
      ];
    },
    // 编辑 根据id查看详情
    async getPower() {
      if (this.currentTreeNode.id) {
        const { data } = await detail(this.currentTreeNode);
        this.ruleForm.id = this.currentTreeNode.id;
        this.ruleForm.title = this.currentTreeNode.title;
        // console.log(data.permissions);
        this.defaultCheckedKeys = data.permissions;
      }
    },
    // 关闭
    async onClose() {
      this.ruleForm = { title: "" };
      this.defaultCheckedKeys = [];
      await this.$refs.form.resetFields();
      this.$emit("update:visible", false);
    },
    // 提交
    async onSave() {
      await this.$refs.form.validate();
      // console.log(1);
      // 根据id判断 是编辑 还是新增
      if (this.ruleForm.id) {
        try {
          await update({
            title: this.ruleForm.title,
            id: this.ruleForm.id,
            permissions: this.defaultCheckedKeys,
          });
          this.$message.success("修改成功");
          this.onClose();
          this.$emit("update");
        } catch (error) {
          this.$message.error("修改失败，请重试");
        }
      } else {
        // 新增
        try {
          await add({
            title: this.ruleForm.title,
            permissions: this.defaultCheckedKeys,
          });
          this.$message.success("添加成功");
          this.onClose();
          this.$emit("update");
        } catch (error) {
          this.$message.error("添加失败，请重试");
        }
      }
    },
    // 选中权限
    checkChange(data, checked, indeterminate) {
      const one = this.$refs.myTree.getCheckedNodes();
      let one2 = one.map((item) => item.id);
      this.defaultCheckedKeys = one2;
      // console.log(this.defaultCheckedKeys);
    },
    nodeCollapse(data, checked, indeterminate) {
      console.log(2);
    },
  },
};
</script>

<style scoped></style>
