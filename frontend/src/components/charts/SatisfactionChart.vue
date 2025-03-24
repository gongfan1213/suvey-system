<template>
  <div>
    <apexchart
      type="radar"
      height="300"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: 'SatisfactionChart',
  components: {
    apexchart: VueApexCharts
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const processData = (data) => {
      // 按满意度评分分组
      const satisfactionGroups = {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
        6: 0, 7: 0, 8: 0, 9: 0, 10: 0
      };
      
      data.forEach(response => {
        const satisfaction = response.satisfaction;
        if (satisfaction >= 1 && satisfaction <= 10) {
          satisfactionGroups[satisfaction]++;
        }
      });
      
      return Object.values(satisfactionGroups);
    };
    
    const series = ref([
      {
        name: '用户数量 User Count',
        data: processData(props.data)
      }
    ]);
    
    const chartOptions = ref({
      chart: {
        toolbar: {
          show: false
        }
      },
      xaxis: {
        categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        labels: {
          style: {
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        labels: {
          formatter: function(val) {
            return val.toFixed(0);
          }
        }
      },
      title: {
        text: '满意度评分分布 Satisfaction Rating Distribution',
        align: 'center'
      },
      colors: ['#008FFB'],
      plotOptions: {
        radar: {
          size: 140,
          polygons: {
            strokeColors: '#e9e9e9',
            fill: {
              colors: ['#f8f8f8', '#fff']
            }
          }
        }
      },
      markers: {
        size: 4,
        colors: ['#008FFB'],
        strokeColors: '#fff',
        strokeWidth: 2
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return val + ' 用户 Users';
          }
        }
      },
      dataLabels: {
        enabled: true,
        background: {
          enabled: true,
          borderRadius: 2
        }
      }
    });
    
    watch(() => props.data, () => {
      series.value = [
        {
          name: '用户数量 User Count',
          data: processData(props.data)
        }
      ];
    }, { deep: true });
    
    return {
      chartOptions,
      series
    };
  }
}
</script>