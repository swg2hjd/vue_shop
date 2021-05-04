<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// import * as echarts from "echarts";
const echarts = require("echarts");
export default {
  data() {
    return {};
  },
  created() {},

  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"), "light");

    const { data: res } = await this.$http.get("reports/type/1");
    if (res.meta.status !== 200)
      return this.$message.error("获取折线图数据失败");

    // 指定图表的配置项和数据
    // var option = {
    //   title: {
    //     text: "ECharts 入门示例",
    //   },
    //   tooltip: {},
    //   legend: {
    //     data: ["销量"],
    //   },
    //   xAxis: {
    //     data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
    //   },
    //   yAxis: {},
    //   series: [
    //     {
    //       name: "销量",
    //       type: "bar",
    //       data: [5, 20, 36, 10, 10, 20],
    //     },
    //   ],
    // };

    // 使用刚指定的配置项和数据显示图表。
    // myChart.setOption(option);

    // 高亮配置
    res.data.emphasis = {
      itemStyle: {
        // 高亮时点的颜色。
        color: "blue",
      },
      label: {
        show: true,
        // 高亮时标签的文字。
        formatter: "This is a emphasis label.",
      },
    };
    myChart.setOption(res.data);
  },
  methods: {},
};
</script>

<style lang="less" scoped></style>
