<template>
  <div class="add-form">
    <el-dialog :title="dialogTitle" :visible="visible" @close="onClose">
      <el-form
        :rules="ruleInline"
        ref="dataForm"
        :model="formBase"
        label-position="left"
        label-width="150px"
        style="width: 80%; margin-left: 10px"
      >
        <el-form-item label="企业名称" prop="shortName">
          <el-input v-model="formBase.shortName"></el-input>
        </el-form-item>
        <el-form-item label="所属公司" prop="company">
          <el-input v-model="formBase.company"></el-input>
          <p>https://www.tianyancha.com （在此可查询所属公司全称及简称）</p>
        </el-form-item>
        <el-form-item label="城市" :inline="true">
          <div style="display: flex">
            <el-form-item prop="province" style="width: 50%">
              <el-select
                style="width: 100%"
                v-model="formBase.province"
                @change="handleProvince"
              >
                <el-option
                  :label="item"
                  :value="item"
                  v-for="(item, index) in cityList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="city" style="width: 50%">
              <el-select style="width: 100%" v-model="formBase.city">
                <el-option
                  :label="item"
                  :value="item"
                  v-for="(item, index) in areaList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="方向（企业标签）" prop="tags">
          <el-input v-model="formBase.tags"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入"
            v-model="formBase.remarks"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSave">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { add, detail, update } from "@/api/hmmm/companys.js";
import { provinces, citys } from "@/api/hmmm/citys.js";
export default {
  name: "CompanysAdd",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    var validatorCity = (rule, value, callback) => {
      if (!this.formBase.province) {
        callback(new Error(" "));
      } else {
        callback();
      }
    };
    return {
      formBase: {
        isFamous: true, //是否为名企
        shortName: "", //企业简称
        company: "", //所属公司
        province: "", //城市
        city: "", //地区
        tags: "", //标签
        remarks: "", //备注
      },
      cityList: provinces(),
      areaList: citys(),
      // 表单验证
      ruleInline: {
        shortName: [
          { required: true, message: "企业简称不能为空", trigger: "blur" },
        ],
        province: [
          { required: true, message: "请选择省份", trigger: "change" },
        ],
        city: [{ validator: validatorCity, trigger: "change" }],
        tags: [{ required: true, message: "请输入标签", trigger: "blur" }],
        remarks: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      params: this.$parent.$parent.params,
      flag: 0, //0表示添加，1表示修改
    };
  },
  computed: {
    dialogTitle() {
      return this.flag ? "编辑用户" : "添加用户";
    },
  },
  methods: {
    // 弹窗取消关闭的时候
    onClose() {
      this.$emit("update:visible", false);
      this.$refs.dataForm.resetFields();
      this.formBase = {
        isFamous: true, //是否为名企
        shortName: "", //企业简称
        company: "", //所属公司
        province: "", //城市
        city: "", //地区
        tags: "", //标签
        remarks: "", //备注
      };
    },
    // 选省获取到市
    handleProvince(val) {
      this.areaList = citys(val);
      this.formBase.city = this.areaList[0];
    },
    // 保存的时候
    async onSave() {
      await this.$refs.dataForm.validate();
      try {
        if (this.flag) {
          await update(this.formBase);
        } else {
          await add(this.formBase);
        }
        this.onClose();
        this.$emit("render", this.params);
      } catch (err) {
        this.$message.error("操作失败");
      }
    },
    async editDate(id) {
      this.flag = 1;
      const res = await detail({ id });
      this.formBase = res.data;
      this.formBase.isFamous = this.formBase.isFamous ? true : false;
    },
  },
};
</script>
<style>
.el-form--label-left .el-form-item__label {
  text-align: right;
}
.el-form-item--medium {
  margin-bottom: 22px;
}
.el-dialog__footer {
  text-align: center;
}
</style>
