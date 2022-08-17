<template>
  <el-dialog
    @close="onClose"
    title="创建菜单"
    :visible="visibleMenu"
    width="50%"
  >
    <el-form ref="form" :model="addForm" label-width="120px">
      <el-form-item label="权限组名称 :">
        <el-radio v-model="addForm.is_point" :label="false">菜单</el-radio>
        <el-radio v-model="addForm.is_point" :label="true">权限点</el-radio>
      </el-form-item>

      <el-form-item label="权限组名称 :">
        <el-select ref="power" v-model="title" placeholder="请选择">
          <!-- <el-option :value="0" :label="$t('table.powerNav')">主导航</el-option> -->
          <el-option class="treeSelect" :value="title">
            <el-tree
              :data="tableData"
              default-expand-all
              :props="defaultProps"
              @node-click="powerNode"
              :expand-on-click-node="false"
              :render-content="renderContent"
            >
            </el-tree>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="权限代码 :">
        <el-input v-model="addForm.code"></el-input>
      </el-form-item>

      <el-form-item label="权限标题 :">
        <el-input v-model="addForm.title"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="onSave">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { list, add } from "@/api/base/menus.js";
export default {
  name: "AddMenu",
  data() {
    return {
      powerList: [],
      addForm: {
        is_point: false,
        pid: "",
        code: "",
        title: "",
      },
      title: "主导航", //权限组显示选中的值
      defaultProps: {
        children: "childs",
        label: "title",
      },
    };
  },
  props: {
    visibleMenu: {
      type: Boolean,
      default: false,
    },
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    this.getPowerList();
    console.log(this.tableData);
  },

  methods: {
    async getPowerList() {
      const { data } = await list();
      // console.log(data);
      this.powerList = data;
    },
    onClose() {
      this.$emit("update:visibleMenu", false);
    },
    powerNode(val) {
      // console.log(val.title);
      // console.log(val.pid);
      this.addForm.pid = val.pid;
      this.title = val.title;
      this.$refs.power.blur();
    },
    async onSave() {
      // console.log("确定添加");
      console.log(this.addForm);
      const res = await add(this.addForm);
      console.log(res);
    },
    // 权限点  创建权限组的禁用
    renderContent(h, { node, data, store }) {
      if (data.is_point) {
        console.log(data);
        // data.disabled = true;
      }
    },
  },
};
</script>

<style scoped lang="less">
.el-select-dropdown__item {
  height: 200px;
  overflow: unset;
  background-color: #fff;
  // :deep(.el-tree-node__expand-icon.expanded) {
  //   display: none;
  // }
}
</style>
