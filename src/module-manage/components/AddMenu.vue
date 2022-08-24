<template>
  <el-dialog
    @close="onClose"
    :title="editRow.id ? '修改菜单' : '创建菜单'"
    :visible="visibleMenu"
    width="50%"
  >
    <el-form ref="form" :model="addForm" :rules="fromRules" label-width="120px">
      <el-form-item label="权限组名称 :">
        <el-radio
          :disabled="addForm.id ? true : false"
          v-model.trim="addForm.is_point"
          :label="false"
          >菜单</el-radio
        >
        <el-radio
          :disabled="addForm.id ? true : false"
          v-model.trim="addForm.is_point"
          :label="true"
          >权限点</el-radio
        >
      </el-form-item>

      <el-form-item label="权限组名称 :">
        <el-select ref="power" v-model.trim="title" placeholder="请选择">
          <!-- <el-option :value="0" :label="$t('table.powerNav')">主导航</el-option> -->
          <el-option class="treeSelect" v-model.trim="title" label="">
            <el-tree
              :data="tableData"
              default-expand-all
              :props="defaultProps"
              @node-click="powerNode"
              :expand-on-click-node="false"
              :render-content="renderContent"
            ></el-tree>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="权限代码 :" prop="code">
        <el-input v-model.trim="addForm.code"></el-input>
      </el-form-item>

      <el-form-item label="权限标题 :" prop="title">
        <el-input v-model.trim="addForm.title"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="onSave">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { list, add, update } from "@/api/base/menus.js";
export default {
  name: "AddMenu",
  data() {
    return {
      powerList: [],
      // tableData: [],
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
      fromRules: {
        code: [
          { required: true, message: "权限代码不能为空", trigger: "blur" },
        ],
        title: [
          { required: true, message: "权限标题不能为空", trigger: "blur" },
        ],
      },
    };
  },
  props: {
    visibleMenu: {
      type: Boolean,
      default: false,
    },
    // 父组件传过来的列表
    tableData: {
      type: Array,
      default: () => [],
    },
    // 修改项
    editRow: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    editRow: {
      immediate: true,
      handler() {
        if (this.editRow.id) {
          for (let key in this.addForm) {
            if (this.editRow[key]) {
              this.addForm[key] = this.editRow[key];
            }
          }
          this.addForm.id = this.editRow.id;
          // // 数据回显 寻找权限组的title
          this.findProweTitle(this.tableData, this.editRow.pid);
        }
      },
    },
  },
  created() {
    // this.getMenusList();
  },
  methods: {
    // 数据回显 寻找权限组的title
    findProweTitle(arr, pid) {
      // 利用find寻找
      return arr.find((item) => {
        if (item.id == pid) {
          this.title = item.title;
          return;
        } else if (item.childs) {
          return this.findProweTitle(item.childs, pid);
        }
      });
      // 利用map寻找
      // return arr.map((item) => {
      //   if (item.id == pid) {
      //     this.title = item.title;
      //     return item;
      //   } else if (item.childs) {
      //     return this.findProweTitle(item.childs, pid);
      //   }
      // });
    },
    async onClose() {
      this.addForm = {
        is_point: false,
        pid: "",
        code: "",
        title: "",
      };
      await this.$refs.form.resetFields();
      this.$emit("update:visibleMenu", false);
    },
    // 点击权限组
    powerNode(val) {
      if (val.is_point) {
        return;
      }
      this.addForm.pid = val.pid;
      this.title = val.title;
      this.$refs.power.blur();
    },
    async onSave() {
      // console.log("确定添加");
      await this.$refs.form.validate();
      if (this.addForm.id) {
        try {
          await update(this.addForm);
          this.$message.success("修改成功");
          this.onClose();
          this.$emit("addSuccess");
        } catch (error) {
          this.$message.error("修改失败，请稍后重试");
        }
      } else {
        try {
          // console.log(this.addForm);
          await add(this.addForm);
          this.onClose();
          this.$message.success("添加成功");
          this.$emit("addSuccess");
          // console.log(res);
        } catch (error) {
          this.$message.error("添加失败，请稍后重试");
        }
      }
    },
    // 权限点  创建权限组的禁用
    renderContent(h, { node, data, store }) {
      // 如果处于权限 则让权限点禁用

      if (data.is_point) {
        return (
          <span class="Disable">
            <span>{node.label}</span>
          </span>
        );
      } else {
        return (
          <span class="headerTree">
            <span>{node.label}</span>
          </span>
        );
      }
    },
  },
};
</script>

<style scoped lang="less">
.el-select-dropdown__item.selected {
  height: 200px;
  overflow: unset;
  background-color: #fff;
  // :deep(.el-tree-node__expand-icon.expanded) {
  //   display: none;
  // }
}
:deep(.Disable) {
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
