<template>
  <div>
    <h1>首页</h1>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
  export default {
    methods:{
      logout(){
        // 退出 清除token并返回登录页 
        window.sessionStorage.removeItem('token')
        this.$router.push('/login')
      }
    }
  }
</script>

<style scoped>

</style>