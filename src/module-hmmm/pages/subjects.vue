<template>
<<<<<<< HEAD
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
=======
  <el-card class="box-card">
    <div class="container">
      <!-- 头部 -->

      <div slot="left" class="flex">
        学科名称
        <el-input
          ref="ipnut"
          v-model="input"
          placeholder="请输入内容"
          class="input-sousuo"
        ></el-input>

        <el-button @click="remove">清除</el-button>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
      <div slot="right">
        <el-button type="success" icon="el-icon-edit" @click="addbtn"
          >新增学科</el-button
        >
      </div>

      <div class="shuju">
        <i class="el-icon-info"></i><span>数据一共{{ total }}条</span>
      </div>
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="序号" sortable="" type="index" />

        <el-table-column label="学科名称" width="180" prop="subjectName">
        </el-table-column>
        <el-table-column label="创建者" width="180" prop="username">
        </el-table-column>
        <el-table-column label="创建日期" width="180" prop="addDate">
          <template slot-scope="{ row }">
            {{ row.addDate }}
          </template>
        </el-table-column>
        <el-table-column
          label="前台是否显示"
          width="180"
          :formatter="formatterenableState"
          prop="isFrontDisplay"
        >
        </el-table-column>
        <el-table-column label="二级目录" width="180" prop="twoLevelDirectory">
        </el-table-column>
        <el-table-column label="标签" width="180" prop="tags">
        </el-table-column>
        <el-table-column label="题目数量" prop="totals"> </el-table-column>

        <el-table-column label="操作" width="280">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="xueke(row)"
              >学科分类</el-button
            >
            <el-button type="text" size="small" @click="biaoqian(row)"
              >学科标签</el-button
            >
            <el-button type="text" size="small" @click="xiugai(row)"
              >修改</el-button
            >
            <el-button type="text" size="small" @click="delbtn(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :total="total"
        :page-sizes="[5, 10, 20, 30]"
        @size-change="handleSizeChange"
        layout="prev, pager, next,sizes"
      />
    </div>
    <!-- //新增弹窗 -->
    <el-dialog :title="addor" :visible.sync="dialogVisible" width="35%">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="学科名称" prop="name">
          <el-input v-model="form.subjectName"></el-input>
        </el-form-item>
        <span style="margin: 0 10px">是否显示</span>
        <el-switch
          v-model="form.isFrontDisplay"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="postadd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除弹框 -->
    <el-dialog title="提示" :visible.sync="isshow" width="30%">
      <span
        ><i class="el-icon-warning-outline"></i> 此操作将永久删除该学科,
        是否继续?</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="delet">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { list, add, update, remove } from "@/api/hmmm/subjects.js";
import { hireType } from "@/api/hmmm/constants.js";
// import { formdate } from "@/filters";
// import employees from "@/components/employees";
export default {
  data() {
    return {
      input: "",
      tableData: [],
      Pages: {
        page: 1,
        pagesize: 10,
      },
      total: 0,
      dialogVisible: false,
      form: {
        subjectName: "",
        isFrontDisplay: 0,
      },
      rules: {
        name: [
          { required: true, message: "请输入学科名称", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      findItem: true,
      isshow: false,
    };
  },
  created() {
    this.list();
  },
  components: {
    // employees,
  },
  computed: {
    addor() {
      return this.form.id ? "编辑" : "添加";
    },
  },
  methods: {
    //学科跳转
    xueke(val) {
      // const id = val.id;
      // const name = val.subjectName;
      this.$router.push({
        path: "/subjects/directorys",
        query: { val },
      });
      // console.log(val);
      // this.$emit("xuekeguanli", val);
    },
    //标签跳转
    biaoqian(val) {
      this.$router.push({
        path: "/subjects/tags",
        query: { val },
      });
    },
    //切页触发
    handleCurrentChange(val) {
      this.Pages.page = val;
      this.list();
    },
    //选择一页展示多少个触发
    handleSizeChange(val) {
      this.Pages.pagesize = val;
      this.list();
    },
    async list() {
      const res = await list(this.Pages);
      console.log(res);
      this.tableData = res.data.items;
      this.total = res.data.counts;
    },
    //判断是否前台显示
    formatterenableState(rrow, column, cellValue, indexow) {
      const findItem = hireType.find((item) => item.id === cellValue);
      // console.log(cellValue)
      return findItem ? findItem.label : "未知";
    },
    //查找
    async search() {
      const res = await list({
        subjectName: this.input || null,
      });
      this.tableData = res.data.items;
      this.total = res.data.counts;
    },
    remove() {
      this.input = "";
    },
    //新增
    onClose() {
      this.isshow = false;
      this.dialogVisible = false;
      this.form.subjectName = "";
    },
    addbtn() {
      this.dialogVisible = true;
    },
    async postadd() {
      if (this.form.id) {
        await update(this.form);
        this.$message.success("修改成功");
        this.onClose();
        this.list();
      } else {
        try {
          await add({
            isFrontDisplay: this.form.isFrontDisplay,
            subjectName: this.form.subjectName,
          });
          this.onClose();
          this.$message.success("添加成功");
          this.list();
        } catch (error) {}
      }
    },
    //修改
    xiugai(val) {
      console.log(val);
      this.dialogVisible = true;
      this.form = val;
    },
    //删除
    delbtn(val) {
      this.isshow = true;
      this.form = val;
    },
    async delet() {
      await remove(this.form);
      this.$message.success("删除成功");
      this.onClose();
      this.list();
>>>>>>> feature/questions-new
    },
  },
};
</script>

<<<<<<< HEAD
<style scoped lang="less"></style>
=======
<style scoped lang="less">
.container {
  padding: 15px;
  background-color: #fff;
}
.flex {
  display: flex;
  align-items: center;
  .input-sousuo {
    width: 300px;
    margin: 0 20px;
  }
}
.shuju {
  margin: 10px 0;
  background-color: #f4f4f5;
  color: #99a7b4;
  height: 35px;
  line-height: 35px;
  padding-left: 15px;
  span {
    padding-left: 15px;
  }
}
</style>
>>>>>>> feature/questions-new
