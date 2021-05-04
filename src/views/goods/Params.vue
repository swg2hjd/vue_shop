<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert
        title="注意:只允许为第三级分类设置参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span style="margin-right:10px">选择商品分类:</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button
            type="primary"
            @click="addDialogVisible = true"
            size="mini"
            :disabled="isBtnDisabled"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <el-tag
                type="warning"
                v-for="(item, index) in tagsList"
                closable
                @close="handleTagClosed(item)"
                :key="index"
                >{{ item }}</el-tag
              >
              <!-- 输入的文本框 -->
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <!-- 添加按钮 -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput"
                >+ New Tag</el-button
              >
            </el-table-column>
            <el-table-column
              width="50px"
              type="index"
              label="序号"
            ></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id, scope.row.attr_name)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加静态属性按钮 -->
          <el-button
            type="primary"
            @click="addDialogVisible = true"
            size="mini"
            :disabled="isBtnDisabled"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <el-tag
                type="warning"
                v-for="(item, index) in tagsList"
                closable
                @close="handleTagClosed(item)"
                :key="index"
                >{{ item }}</el-tag
              >
              <!-- 输入的文本框 -->
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <!-- 添加按钮 -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput"
                >+ New Tag</el-button
              >
            </el-table-column>
            <el-table-column
              width="50px"
              type="index"
              label="序号"
            ></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id, scope.row.attr_name)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 级联选择框的配置对象
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true,
      },
      // 级联选择框双向绑定数组
      selectedCateKeys: [],
      // 激活的页签名
      activeName: "many",
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数表单对象
      addForm: {
        attr_name: "",
      },
      // 添加表单验证规则对象
      addFormRules: {
        attr_name: [{ required: true, message: "请输入参数", trigger: "blur" }],
      },
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 修改参数表单对象
      editForm: {},
      // 修改表单验证规则对象
      editFormRules: {
        attr_name: [{ required: true, message: "请输入参数", trigger: "blur" }],
      },
      tagsList: ["red", "blue", "green"],
      // 控制按钮与文本输入框的显示与隐藏
      inputVisible: false,
      // 文本框中输入的内容
      inputValue: "",
    };
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类失败");
      this.cateList = res.data;
    },

    // 级联选择分类发生变化
    handleChange() {
      this.getParamsData();
    },

    // 页签改变
    handleTabClick() {
      this.getParamsData();
    },

    // 获取参数的列表数据
    async getParamsData() {
      // console.log(this.selectedCateKeys);
      // 不是选择的三级分类 清空
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        return this.$message.warning("请选择三级分类");
      }
      // 获取对应参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("获取失败");
      // console.log(res);
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },

    // 监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },

    // 点击按钮添加参数
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("未输入内容");
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );

        if (res.meta.status !== 201) return this.$message.error("添加参数失败");
        this.$message.success("添加参数成功");
        this.addDialogVisible = false;
        this.getParamsData();
      });
    },

    // 点击按钮显示修改参数对话框
    async showEditDialog(attr_id) {
      // 查询当前参数信息
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200)
        return this.$message.error("获取参数信息失败");
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 点击按钮确定修改参数
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("未输入内容");
        const {
          data: res,
        } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        );
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error("修改参数失败");
        this.$message.success("修改参数成功");
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },

    // 根据id删除参数
    async removeParams(attr_id, attr_name) {
      const confirmRes = await this.$confirm(
        "此操作将永久删除该参数" + attr_name + ", 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmRes !== "confirm") return this.$message.error("已取消删除");

      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status != 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getParamsData();
    },

    // 文本框失去焦点或者按下enter
    handleInputConfirm() {
      console.log("ok");
      let inputValue = this.inputValue;
      if (inputValue) {
        this.tagsList.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    // 点击按钮显示文本输入框
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    // 删除参数标签
    handleTagClosed(item) {
      this.tagsList.splice(this.tagsList.indexOf(item), 1);
    },
  },

  created() {
    this.getCateList();
  },

  computed: {
    // 选择三级分类则启用
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) return true;
      return false;
    },
    // 选中的三级分类id
    cateId() {
      if (this.selectedCateKeys.length === 3) return this.selectedCateKeys[2];
      return null;
    },

    titleText() {
      if (this.activeName === "many") return "动态参数";
      return "静态属性";
    },
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}

.el-tag {
  margin: 10px;
}

.el-input {
  width: 150px;
}
</style>
