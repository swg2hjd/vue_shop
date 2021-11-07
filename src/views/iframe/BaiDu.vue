<template>
  <div id="content">
    <iframe
      id="myiframe"
      src="https://www.huya.com/243547"
      frameborder="0"
      width="100%"
      height="1000px"
      scrolling="no"
      seamless="seamless"
    ></iframe>
    <div id="printTest">
    
      <!-- <table id="mytable">
        <tr>
          <td>姓名<input type="text" v-model="name" /></td>
          <td>年龄<input type="text" /></td>
          <td>性别<input type="text" /></td>
          <td>国籍<input type="text" /></td>
        </tr>

        <tr>
          <td colspan="2">
            <div style="width:8%;display:inline-block">电话</div>
            <input type="text" style="width:90%" />
          </td>
          <td colspan="2">手机<input type="text" /></td>
        </tr>
      </table> -->
    </div>

    <el-button v-print="'#myiframe'">打印</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "swg",
    };
  },
  mounted() {
    // function changeFrameHeight() {
    //   var ifm = document.getElementById("myiframe");
    //   console.log(document.documentElement.clientHeight);
    //   ifm.height = document.documentElement.clientHeight - 4;
    // }
    // changeFrameHeight();
    console.log("aaa");
    // window.onresize = function() {
    //   changeFrameHeight();
    // };
  },
};
</script>

<style lang="less" scoped>
html { overflow-x:hidden; }
</style>
