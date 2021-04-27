<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="roleList" style="width: 100%" border stripe>
        <!-- 展开列 -->
        <el-table-column label="*" type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="i1"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级，三级权限 -->
              <el-col :span="19">
                <!-- 渲染二级 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="i2"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag
                      @close="removeRightById"
                      closable
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="i3"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <el-table-column align="center" type="index" label="序号" width="50px">
        </el-table-column>

        <el-table-column align="center" label="角色名称" prop="roleName">
        </el-table-column>

        <el-table-column align="center" label="角色描述" prop="roleDesc">
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >

            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showRightsDialogVisible(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色弹框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
    >
      <el-form :model="addRoleForm" ref="addRoleFormRef" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>git

        <el-form-item label="角色id">
          <el-input v-model="addRoleForm.id"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialogVisible"
      width="50%"
      @close="setRightsDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      addRoleDialogVisible: false,
      addRoleForm: {
        roleDesc: "desc",
        roleName: "swg",
        id: 123,
      },
      setRightsDialogVisible: false,
      // 获取的权限数据
      rightsList: [],
      // 树形控件属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中节点id值数组
      defKeys: [],
      // 当前即将分配权限角色的id
      roleId: "",
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取所有角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.roleList = res.data;
    },

    // 点击确定添加角色
    async addRole() {
      const { data: res } = await this.$http.post(`roles`, this.addRoleForm);
      console.log(res);
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
      this.addRoleDialogVisible = !this.addRoleDialogVisible;
    },

    // 根据id删除权限
    async removeRightById() {
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
      // const { data: res } = await this.$http.delete("users/" + id);
      // 模拟删除
      const res = {
        meta: {
          status: 200,
        },
      };
      if (res.meta.status !== 200)
        return this.$message.error("删除用户数据失败");
      this.$message.success("删除用户数据成功");
    },

    // 展示分配权限的对话框
    async showRightsDialogVisible(role) {
      this.roleId = role.id;
      // 获取权限数据
      const { data: res } = await this.$http.get("rights/tree");
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取权限数据失败");
      this.rightsList = res.data;
      this.getLeafKeys(role, this.defKeys);
      this.setRightsDialogVisible = true;
    },

    // 递归获取三级权限id 保存到defKeys中
    getLeafKeys(node, arr) {
      // node不包含children 则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },

    // 监听分配权限对话框关闭
    setRightsDialogClosed() {
      this.defKeys = [];
    },

    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      console.log(idStr);
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr,
        }
      );
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error("分配权限失败");
      this.$message.success("分配权限成功");
      // 刷新角色列表
      this.getRolesList();
      this.setRightsDialogVisible = !this.setRightsDialogVisible;
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
