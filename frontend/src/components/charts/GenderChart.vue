<template>
  <div ref="chartDiv" style="width: 100%; height: 300px;"></div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default {
  name: 'GenderChart',
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
      // 按性别分组
      const genderGroups = {
        "男Male": 0,
        "女Female": 0,
        "其他Other": 0
      };
      
      data.forEach(response => {
        const gender = response.gender;
        if (genderGroups.hasOwnProperty(gender)) {
          genderGroups[gender]++;
        }
      });
      
      return Object.entries(genderGroups).map(([category, value]) => ({
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
        am5percent.PieChart.new(root, {
          layout: root.verticalLayout,
          innerRadius: am5.percent(40)
        })
      );
      
      // 创建数据系列
      const series = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: "value",
          categoryField: "category",
          alignLabels: false
        })
      );
      
      series.labels.template.setAll({
        textType: "circular",
        centerX: 0,
        centerY: 0
      });
      
      // 设置数据
      const chartData = processData(props.data);
      series.data.setAll(chartData);
      
      // 添加图例
      const legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15
      }));
      
      legend.data.setAll(series.dataItems);
      
      // 添加动画
      series.appear(1000, 100);
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