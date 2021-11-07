<template>
  <el-container class="home-container" :class="{ folded: isCollapse }">
    <!-- 页面头部 -->
    <el-header class="header">
      <div>
        <img src="@/assets/logo.png" alt="logo" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="danger" icon="el-icon-switch-button" @click="logout"
        >退出</el-button
      >
    </el-header>

    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside class="left">
        <div class="toggle-button" @click="toggleCollapse">
          |||
        </div>
        <!-- 侧边菜单栏区域 -->
        <el-menu
          background-color="#2e5bed"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="$route.path"
          ref="menuRef"
        >
          <div v-for="menu in menuList2" :key="menu.index">
            <el-menu-item v-if="!menu.children" :index="menu.index">
              <template slot="title">
                <i class="el-icon-delete"></i>
                <span>{{ menu.name }}</span>
              </template>
            </el-menu-item>
            <el-submenu v-else :index="menu.index">
              <template slot="title"
                ><i class="el-icon-delete"></i>
                <span>{{ menu.name }}</span></template
              >
              <el-menu-item
                v-for="menuChildren in menu.children"
                :key="menuChildren.index"
                :index="menuChildren.index"
              >
                <template slot="title">
                  <i class="el-icon-edit"></i>
                  <span>{{ menuChildren.name }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </div>

          <!-- 一级菜单 可点击 -->
          <el-menu-item index="/baidu">
            <template slot="title">
              <i class="el-icon-search"></i>
              <span>德华直播</span>
            </template>
          </el-menu-item>

          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>

              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧内容主体 -->

      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
const TestTable = () => import("../views/testTable/TestTable");
const BaiDu = () => import("../views/iframe/BaiDu");
export default {
  data() {
    return {
      route: this.$store.state.routes,
      menuList: [],
      iconObj: {
        "125": "el-icon-user",
        "102": "el-icon-s-order",
        "101": "el-icon-s-goods",
        "103": "el-icon-s-grid",
        "145": "el-icon-s-marketing",
      },
      isCollapse: false,
      menuList2: [
        {
          index: "1",
          name: "xixi",
          children: [
            {
              index: "/users",
              name: "haha",
            },
          ],
        },
        {
          index: "2",
          name: "dog",
          children: [
            {
              index: "/users",
              name: "aa",
            },
          ],
        },
        {
          index: "1",
          name: "xixi",
          children: [
            {
              index: "/users",
              name: "haha",
            },
          ],
        },
        {
          index: "/users",
          name: "aaaaaa",
        },
        {
          index: "/users",
          name: "aaaaaa",
        },
        {
          index: "1",
          name: "xixi",
          children: [
            {
              index: "/users",
              name: "haha",
            },
          ],
        },
        {
          index: "1",
          name: "xixi",
          children: [
            {
              index: "/users",
              name: "haha",
            },
          ],
        },
        {
          index: "/users",
          name: "aaaaaa",
        },
        {
          index: "/users",
          name: "aaaaaa",
        },
        {
          index: "/users",
          name: "aaaaaa",
        },
        {
          index: "/users",
          name: "aaaaaa",
        },
        {
          index: "/users",
          name: "aaaaaa",
        },
        {
          index: "/users",
          name: "aaaaaa",
        },
        {
          index: "/users",
          name: "aaaaaa",
        },
      ],
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    openMenu() {
      this.$refs.menuRef.open("125");
    },
    logout() {
      // 退出 清除token并返回登录页
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },

    addRouter() {
      this.$router.addRoutes(this.route);
    },

    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      console.log(res);
      this.menuList = res.data;
    },

    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style scope lang="less">
.home-container {
  height: 100%;
}
.header {
  position: fixed;
  width: 100%;
  background-color: #0840f5;
  display: flex;
  justify-content: space-between;
}
.el-header {
  align-items: center;
  color: #fff;
  font-size: 20px;
  padding-left: 10px;
  img {
    height: 40px;
    width: 40px;
  }
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
    }
  }
}

.el-aside {
  transition: width 0.4s;
  -webkit-transition: width 0.4s;
  overflow-x: hidden;
  height: calc(100vh - 60px);
  background-color: #577cf7;

  .el-menu {
    border-right: none;
  }
}

.main {
  margin: 60px 0 0 200px;
  background-color: #dfdcd1;
  height: calc(100vh - 60px);
  transition: margin-left 0.4s;
  -webkit-transition: margin-left 0.4s;
}

.folded {
  .toggle-button {
    transition: width 0.4s;
    -webkit-transition: width 0.4s;
    position: fixed;
    top: 60px;
    left: 0px;
    width: 65px;
    background-color: #f7b45d;
    color: #fff;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
    z-index: 2;
  }
}

.toggle-button {
  transition: width 0.4s;
  -webkit-transition: width 0.4s;
  z-index: 2;
  position: fixed;
  top: 60px;
  left: 0px;
  width: 197px;
  background-color: #f7b45d;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.folded {
  .left {
    position: fixed;
    top: 60px;
    left: 0px;
    width: 64px !important;
    height: calc(100vh - 60px);
  }
  .el-menu {
    span {
      display: none;
    }
  }

  .main {
    background-color: #dfdcd1;
    margin-left: 64px;
    transition: margin-left 0.4s;
    -webkit-transition: margin-left 0.4s;
  }
}

.left {
  position: fixed;
  top: 60px;
  left: 0px;
  width: 200px !important;
  height: calc(100vh - 60px);
}
</style>
