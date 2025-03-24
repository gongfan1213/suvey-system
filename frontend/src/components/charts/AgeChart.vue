<template>
  <div ref="chartDiv" style="width: 100%; height: 300px;"></div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default {
  name: 'AgeChart',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const chartDiv = ref(null);
    let root = null;
    let chart = null;
    
    const processData = (data) => {
      // 按年龄段分组
      const ageGroups = {
        "18-25": 0,
        "26-35": 0,
        "36-45": 0,
        "46-55": 0,
        "56+": 0
      };
      
      data.forEach(response => {
        const age = response.age;
        if (age >= 18 && age <= 25) ageGroups["18-25"]++;
        else if (age >= 26 && age <= 35) ageGroups["26-35"]++;
        else if (age >= 36 && age <= 45) ageGroups["36-45"]++;
        else if (age >= 46 && age <= 55) ageGroups["46-55"]++;
        else if (age >= 56) ageGroups["56+"]++;
      });
      
      return Object.entries(ageGroups).map(([category, value]) => ({
        category,
        value
      }));
    };
    
    const createChart = () => {
      // 创建root元素
      root = am5.Root.new(chartDiv.value);
      
      // 设置主题
      root.setThemes([am5themes_Animated.new(root)]);
      
      // 创建图表
      chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: "panX",
          wheelY: "zoomX",
          layout: root.verticalLayout
        })
      );
      
      // 创建X轴
      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "category",
          renderer: am5xy.AxisRendererX.new(root, {}),
          tooltip: am5.Tooltip.new(root, {})
        })
      );
      
      // 创建Y轴
      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {})
        })
      );
      
      // 创建数据系列
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: "年龄分布",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          categoryXField: "category",
          tooltip: am5.Tooltip.new(root, {
            labelText: "{categoryX}: {valueY}"
          })
        })
      );
      
      // 添加柱状图颜色
      series.columns.template.setAll({
        cornerRadiusTL: 5,
        cornerRadiusTR: 5,
        fillOpacity: 0.8,
        strokeOpacity: 0
      });
      
      // 设置数据
      const chartData = processData(props.data);
      xAxis.data.setAll(chartData);
      series.data.setAll(chartData);
      
      // 添加图例
      const legend = chart.children.push(am5.Legend.new(root, {}));
      legend.data.setAll(chart.series.values);
      
      // 添加动画
      chart.appear(1000, 100);
    };
    
    const updateChart = () => {
      if (chart && root) {
        const chartData = processData(props.data);
        chart.series.getIndex(0).data.setAll(chartData);
      }
    };
    
    onMounted(() => {
      createChart();
    });
    
    watch(() => props.data, () => {
      updateChart();
    }, { deep: true });
    
    return {
      chartDiv
    };
  }
}
</script>