<template>
  <div class="add-form">
    <el-dialog @close="onClose" title="创建用户" :visible="visible" width="30%">
      <!-- from表单 -->

      <el-form
        :model="addForm"
        :rules="fromRules"
        ref="from"
        label-width="150px"
        class="demo-addForm"
      >
        <el-form-item label="用户名:" prop="username">
          <el-input
            v-model="addForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input
            placeholder="请输入密码"
            v-model="addForm.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="角色:" prop="role">
          <el-input v-model="addForm.role" placeholder="请选择角色"></el-input>
        </el-form-item>
        <el-form-item label="权限组名称:" prop="permission_group_id">
          <el-select v-model="addForm.permission_group_id" placeholder="请选择">
            <el-option
              v-for="item in powerList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话:" prop="phone">
          <el-input
            placeholder="请输入电话"
            maxlength="11"
            v-model="addForm.phone"
          ></el-input>
        </el-form-item>
        <el-form-item label="介绍:" prop="introduction">
          <el-input
            type="textarea"
            v-model="addForm.introduction"
            placeholder="说点什么吧"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { add } from "@/api/base/users";
import { simple } from "@/api/base/permissions";
export default {
  name: "AddUser",
  data() {
    return {
      addForm: {
        email: "",
        introduction: "",
        password: "",
        permission_group_id: "",
        phone: "",
        role: "",
        username: "",
        avatar:
          "https://c-ssl.dtstatic.com/uploads/blog/202106/21/20210621200041_d1642.thumb.1000_0.jpeg",
      },
      fromRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 10,
            message: "密码最少5位, 最大10位",
            trigger: "blur",
          },
        ],
        permission_group_id: [
          { required: true, message: "请选择权限组", trigger: "change" },
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        role: [{ required: true, message: "请输入角色", trigger: "blur" }],
        introduction: [
          { required: true, message: "请输入个人介绍", trigger: "blur" },
        ],
      },
      //   权限组
      powerList: [],
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.simple();
  },

  methods: {
    async simple() {
      const { data } = await simple();
      console.log(data);
      this.powerList = data;
    },
    //隐藏
    onClose() {
      //   清除表单校验规则
      this.$refs.from.resetFields();
      (this.addForm = {
        email: "",
        introduction: "",
        password: "",
        permission_group_id: "",
        phone: "",
        role: "",
        username: "",
        avatar:
          "https://c-ssl.dtstatic.com/uploads/blog/202106/21/20210621200041_d1642.thumb.1000_0.jpeg",
      }),
        this.$emit("update:visible", false);
    },
    // 提交表单
    async onSubmit() {
      // 提交前校验
      this.$refs.from.validate();
      try {
        await add(this.addForm);
        // console.log(data);
        this.$message.success("添加成功");
        this.onClose();
        this.$emit("add-success");
      } catch (error) {
        console.log("未知错误");
      }
    },
  },
};
</script>

<style scoped lang="less">
.el-form-item {
  width: 70%;
}
:deep(.el-dialog__footer) {
  text-align: center;
}
</style>
