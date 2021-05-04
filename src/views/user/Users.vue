<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>

        <el-col :span="3">
          <el-button
            icon="el-icon-user"
            type="primary"
            @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>

        <el-col :span="1">
          <el-button icon="el-icon-refresh" type="plain" @click="getUserList"
            >刷新</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe align="center" valign="middle">
        <el-table-column
          align="center"
          type="index"
          label="序号"
          width="50"
        ></el-table-column>
        <el-table-column
          align="center"
          label="用户名"
          prop="username"
        ></el-table-column>
        <el-table-column
          align="center"
          label="角色"
          prop="role_name"
        ></el-table-column>
        <el-table-column
          align="center"
          label="邮箱"
          prop="email"
        ></el-table-column>
        <el-table-column
          align="center"
          label="电话"
          prop="mobile"
        ></el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" show-password></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            $message.info('取消修改');
            editDialogVisible = false;
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="eidtUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配新角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户名称:{{ userInfo.username }}</p>
        <p>当前的用户角色:{{ userInfo.role_name }}</p>
        <el-select v-model="selectedRoleId" placeholder="请选择新角色">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义邮箱验证规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      // cb() 检验通过
      if (regEmail.test(value)) return cb();
      cb(new Error("请输入合法的邮箱格式"));
    };

    // 自定义手机号验证规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[0-9]{10}$/;
      if (regMobile.test(value)) return cb();
      cb(new Error("请输入合法的手机号"));
    };

    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,

      // 添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },

      // 添加表单的用户验证规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3到10个字符之间",
            trigger: "blur",
          },
        ],

        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6到15个字符之间",
            trigger: "blur",
          },
        ],

        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          // validator:校验规则
          { validator: checkEmail, trigger: "blur" },
        ],

        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },

      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,

      // 查询到的用户
      editForm: {},

      // 编辑表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          // validator:校验规则
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },

      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,

      // 需要被分配角色的用户信息
      userInfo: {},

      // 所有角色的数据列表
      rolesList: [],

      // 选中的角色id
      selectedRoleId: "",
    };
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败");
      this.$message.success("获取用户列表成功");
      this.userList = res.data.users;
      this.total = res.data.total;
      console.log(res);
    },

    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },

    // 监听页码值改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },

    // 监听switch开关状态的改变
    async userStateChange(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功");
    },

    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },

    // 点击按钮添加用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        // 表单预校验未通过
        if (!valid) return this.$message.error("表单数据格式不正确");
        // 表单预校验通过
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) return this.$message.error("添加失败");
        this.$message.success("添加成功");
        // 隐藏添加用户对话框
        this.addDialogVisible = false;
        // 刷新用户列表数据
        this.getUserList();
      });
    },

    //展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) return this.$message.error("查询失败");
      this.editForm = res.data;
      this.editDialogVisible = !this.editDialogVisible;
    },

    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    // 提交修改用户信息
    eidtUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("表单数据格式不正确");
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("修改用户数据失败");
        this.$message.success("修改用户数据成功");
        // 关闭修改用户对话框
        this.editDialogVisible = false;
        // 更新修改后的用户列表
        this.getUserList();
      });
    },

    // 根据id删除用户
    async removeUserById(id) {
      // 弹框询问是否删除
      const confirmRes = await this.$confirm(
        "此操作将永久删除该用户数据, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 用户确实删除 返回值为confirm 取消删除 返回值为cancel
      // console.log(confirmRes)
      // 用户取消删除
      if (confirmRes !== "confirm") return this.$message.info("已取消删除");
      // 用户确认删除
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status !== 200)
        return this.$message.error("删除用户数据失败");
      this.$message.success("删除用户数据成功");
      // 刷新用户列表
      this.getUserList();
    },

    // 点击分配角色按钮
    async setRole(userInfo) {
      this.userInfo = userInfo;
      // 获得所有角色数据
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.rolesList = res.data;
      this.setRoleDialogVisible = true;
    },

    // 点击确定按钮分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId)
        return this.$message.error("请选择要分配的新角色");
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId,
        }
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.getUserList();
      this.setRoleDialogVisible = false;
    },
    // 分配角色对话框关闭
    setRoleDialogClosed() {
      this.selectedRoleId = "";
      this.userInfo = [];
    },
  },
  created() {
    this.getUserList();
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}

.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}

.el-table {
  margin-top: 10px;
}

.el-pagination {
  margin-top: 15px;
}
</style>
