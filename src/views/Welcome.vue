<template>
  <div class="welcome">
    <div class="content">
      <span>电商后台管理系统</span>
    </div>
  </div>
</template>

<script>
import { getUserLists } from "../http/api/api.js";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 20,
      },
    };
  },
  methods: {
    getUserList() {
      getUserLists(this.queryInfo).then((res) => {
        console.log(res);
      });
    },
  },
  mounted() {
    this.getUserList();
  },
};
</script>

<style scoped>
.welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #dcdfe6;
}

.content {
  font-size: 30px;
  color: #f56c6c;
}
</style>
