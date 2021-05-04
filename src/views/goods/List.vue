<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入查询的商品名称"
            v-model.trim="queryGoodsName"
            @input="searchInput"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchGoodsByGoodsName"
              >查询</el-button
            >
          </el-input>
        </el-col>
        <!--添加按钮 -->
        <el-col :span="2" :push="1">
          <el-button
            type="primary"
            icon="el-icon-goods"
            @click="showAddGoodsForm"
            >添加商品</el-button
          >
        </el-col>

        <el-col :span="2" :push="2">
          <el-button type="primary" icon="el-icon-refresh" @click="getGoodsList"
            >刷新商品</el-button
          >
        </el-col>
      </el-row>

      <!-- 商品数据表格 -->
      <el-table :data="goodsList" border stripe align="center">
        <el-table-column
          width="50px"
          label="序号"
          type="index"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="goods_id"
          label="商品ID"
          align="center"
        ></el-table-column>

        <el-table-column
          label="商品名称"
          prop="goods_name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="商品价格"
          prop="goods_price"
          align="center"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditGoods(scope.row.goods_id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeGoods(scope.row.goods_id, scope.row.goods_name)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页条区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 3, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        v-show="showPage"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑商品对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 编辑商品表单 -->
      <el-form
        :model="editGoodsForm"
        :rules="editGoodsFormRules"
        ref="goodsFormRef"
        label-width="100px"
      >
        <el-form-item label="商品id">
          <el-input v-model="editGoodsForm.goods_id" disabled></el-input>
        </el-form-item>

        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodsForm.goods_name"></el-input>
        </el-form-item>

        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editGoodsForm.goods_price"></el-input>
        </el-form-item>

        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editGoodsForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加商品对话框 -->
    <el-dialog
      title="添加商品"
      :visible.sync="addGoodsFormDialogVisible"
      width="50%"
      @close="addGoodsFormClosed"
    >
      <!-- 添加商品表单 -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsFormRules"
        ref="addGoodsFormRef"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="addGoodsForm.goods_name"></el-input>
        </el-form-item>

        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="addGoodsForm.goods_price"></el-input>
        </el-form-item>

        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="addGoodsForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addGoodsFormDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询商品条件
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      // 商品数据
      goodsList: [],
      // 数据个数
      total: 0,
      // 编辑对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑对话框的表单对象
      editGoodsForm: {
        goods_id: "",
        goods_name: "",
        goods_price: "",
        goods_weight: "",
      },
      // 编辑对话框的表单验证规则对象
      editGoodsFormRules: {
        goods_name: [
          { required: true, message: "请输入内容", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入内容", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入内容", trigger: "blur" },
        ],
      },

      // 控制添加商品对话框的显示与隐藏
      addGoodsFormDialogVisible: false,
      // 添加商品表单对象
      addGoodsForm: { goods_name: "", goods_price: "", goods_weight: "" },
      // 添加对话框的表单验证规则对象
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: "请输入内容", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入内容", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入内容", trigger: "blur" },
        ],
      },
      // 要查询的商品名称
      queryGoodsName: "",
      // 控制分页条的显示
      showPage: true,
    };
  },

  created() {
    this.getGoodsList();
  },

  methods: {
    async getGoodsList() {
      // 显示分页条
      this.showPage = true;
      // 查询到所有数据
      const { data: res1 } = await this.$http2.get("goods");
      if (res1.meta.status !== 200)
        return this.$message.error("获取商品列表失败");
      this.$message.success("获取商品总条数成功");
      // console.log(res1);
      // 获取所有数据条数
      this.total = res1.data.goods.length;

      // 通过条件分页查询商品数据
      let { data: res2 } = await this.$http2.get(
        `goods/${this.queryInfo.pagenum}/${this.queryInfo.pagesize}`
      );
      if (res2.meta.status !== 200)
        return this.$message.error("获取商品列表失败");
      // console.log(res2);

      // 该查询的分页没有数据 (该页是最后一页，数据全被删除了)
      while (res2.data.goods.length === 0) {
        // 查找上一页，直到有数据的页
        this.queryInfo.pagenum--;
        const { data: res3 } = await this.$http2.get(
          `goods/${this.queryInfo.pagenum}/${this.queryInfo.pagesize}`
        );
        // 保存数据给res2
        res2 = res3;
      }
      // 保存分页数据
      this.goodsList = res2.data.goods;
      this.$message.success("获取商品列表成功");
    },

    // 移除商品
    async removeGoods(goods_id, goods_name) {
      const confirmRes = await this.$confirm(
        "此操作将永久删除商品[" + goods_name + "], 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmRes !== "confirm") return this.$message.info("取消删除");
      const { data: res } = await this.$http2.delete(`goods/${goods_id}`);
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getGoodsList();
    },

    // 展示编辑对话框
    async showEditGoods(goods_id) {
      //  获取该条商品数据
      const { data: res } = await this.$http2.get(`goods/${goods_id}`);
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.editGoodsForm = res.data.goods;
      this.editDialogVisible = true;
    },

    // 编辑对话框的关闭
    editDialogClosed() {
      this.$refs.goodsFormRef.resetFields();
    },

    // 提交编辑内容
    editGoods() {
      // 表单预校验
      this.$refs.goodsFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("有未输入的项");
        const { data: res } = await this.$http2.put(
          `goods`,
          this.editGoodsForm
        );
        if (res.meta.status !== 200) return this.$message.error("修改数据失败");
        this.$message.success("修改数据成功");
        this.editDialogVisible = false;
        this.getGoodsList();
      });
    },

    // pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },

    // pagenum改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },

    // 展示添加商品对话框
    showAddGoodsForm() {
      this.addGoodsFormDialogVisible = true;
    },

    // 添加商品对话框的关闭
    addGoodsFormClosed() {
      this.$refs.addGoodsFormRef.resetFields();
    },

    // 点击确定添加商品
    addGoods() {
      this.$refs.addGoodsFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("存在未填入的项");
        const { data: res } = await this.$http2.post(
          `goods`,
          this.addGoodsForm
        );
        if (res.meta.status !== 200) return this.$message.error("添加失败");
        this.$message.success("添加成功");
        this.addGoodsFormDialogVisible = false;
        this.getGoodsList();
      });
    },

    // 点击查询商品
    async searchGoodsByGoodsName() {
      if (this.queryGoodsName === "") return this.$message.error("输入为空");
      const { data: res } = await this.$http2.get(
        `goodsname/${this.queryGoodsName}`
      );
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("没有对应查询的数据");
      this.$message.success("查询商品成功");
      this.goodsList = res.data.goods;
      this.showPage = false;
    },
    // 监听搜索框输入内容
    searchInput(e) {
      // 为空则返回所有数据
      if (e === "") this.getGoodsList();
    },
  },
};
</script>

<style lang="less" scoped></style>
