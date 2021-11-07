<template>
  <el-container>
    <el-header class="header">
      <div class="sys-title">
        <span>记事本系统</span>
      </div>
    </el-header>

    <el-container :class="folder ? 'c-f' : ''">
      <el-aside class="left" :width="folder ? '64px' : '180px'">
        <div @click="folder = !folder" class="folder-button">
          <i :class="folder ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
        </div>

        <el-menu
          class="menu"
          :collapse-transition="false"
          :collapse="folder"
          router
          text-color="#000"
          background-color="#f2b7b7"
          :default-active="$route.path"
          unique-opened
        >
          <div v-for="menu in menuList" :key="menu.name">
            <el-menu-item :index="menu.path" v-if="!menu.children">
              <i style="" :class="[menu.icon, 'icon']"></i>
              <span slot="title">{{ menu.title }}</span>
            </el-menu-item>

            <el-submenu :index="menu.id" v-else>
              <template slot="title">
                <i style="margin-left:0px" :class="[menu.icon, 'icon']"></i>
                <span slot="title">{{ menu.title }}</span>
              </template>
              <el-menu-item
                :key="subMenu.name"
                v-for="subMenu in menu.children"
                :index="subMenu.path"
              >
                <template slot="title">
                  <i
                    style="margin-left:0px"
                    :class="[subMenu.icon, 'icon']"
                  ></i>
                  <span slot="title">{{ subMenu.title }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </div>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      folder: false,
      menuList: [
        {
          id: "1",
          title: "我的记事本",
          icon: "el-icon-edit",
          children: [
            {
              title: "查看",
              path: "/MyNotes",
              icon: "el-icon-edit",
            },
            {
              title: "说明",
              path: "/NotesExplain",
              icon: "el-icon-delete",
            },
          ],
        },
        {
          id: "2",
          title: "记事本管理",
          path: "/NotesManager",
          icon: "el-icon-setting",
        },
        {
          id: "3",
          title: "数据统计",
          icon: "el-icon-setting",
          children: [
            {
              title: "记事数据",
              path: "/TakeNotes",
              icon: "el-icon-edit",
            },
            {
              title: "时间数据",
              path: "/DeleteNotes",
              icon: "el-icon-delete",
            },
          ],
        },
        {
          id: "4",
          title: "记事本设置",
          path: "/NotesSetting",
          icon: "el-icon-setting",
        },
        {
          id: "45",
          title: "数据统计",
          icon: "el-icon-setting",
          children: [
            {
              title: "记事数据",
              path: "/TakeNotes",
              icon: "el-icon-edit",
            },
            {
              title: "时间数据",
              path: "/DeleteNotes",
              icon: "el-icon-delete",
            },
          ],
        },
        {
          id: "4",
          title: "记事本设置",
          path: "/NotesSetting",
          icon: "el-icon-setting",
        },
        {
          id: "4",
          title: "记事本设置",
          path: "/NotesSetting",
          icon: "el-icon-setting",
        },
        {
          id: "4",
          title: "记事本设置",
          path: "/NotesSetting",
          icon: "el-icon-setting",
        },
        {
          id: "4",
          title: "记事本设置",
          path: "/NotesSetting",
          icon: "el-icon-setting",
        },
        {
          id: "89",
          title: "记事本设置",
          path: "/NotesSetting",
          icon: "el-icon-setting",
        },
        {
          id: "4",
          title: "记事本设置",
          path: "/NotesSetting",
          icon: "el-icon-setting",
        },
        {
          id: "459",
          title: "数据统计",
          icon: "el-icon-setting",
          children: [
            {
              title: "记事数据",
              path: "/TakeNotes",
              icon: "el-icon-edit",
            },
            {
              title: "时间数据",
              path: "/DeleteNotes",
              icon: "el-icon-delete",
            },
          ],
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.left {
  background-color: #f2b7b7;
  transition: width 0.4s;
  -webkit-transition: width 0.4s;
  // overflow-x: hidden;
  .el-menu {
    border-right: none;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgb(235, 97, 97);
    transition: background-color 0.4s;
    -webkit-transition: background-color 0.4s;
  }
}

.header {
  background-color: rgb(113, 143, 242);
}

.main {
  background-color: #bfa;
  height: calc(100vh - 60px);
  transition: width 0.4s;
  -webkit-transition: width 0.4s;
}

.sys-title {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  span {
    color: #fff;
    font-size: 18px;
  }
}

.icon {
  color: #000;
}

.menu {
  height: calc(100vh - 80px);
  overflow: auto;
  overflow-x: hidden;
}

.folder-button {
  text-align: center;
  background-color: rgb(194, 192, 192);
  height: 20px;
  width: 100%;
  transition: width 0.4s;
  -webkit-transition: width 0.4s;
}

.c-f {
  span {
    display: none;
  }

  ::-webkit-scrollbar {
    /* background-color: #f78585; */
    /* 竖滚动的尺寸 */
    width: 2px;
    /* 横滚动的尺寸 */
    height: 3px;
    /* display: none; */
  }

  /deep/.el-icon-arrow-right:before {
    display: none;
  }
}
</style>
