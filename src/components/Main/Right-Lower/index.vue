<template>
  <div class="chart-container">
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import * as echarts from 'echarts';
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { GetCaseCountByArea } from '@/api/main/right/index'

const store = useStore();
const chart = ref(null);
const chartData = ref([]);
let chartInstance = null;

// 初始化图表
const initChart = () => {
  if (!chart.value) return;
  chartInstance = echarts.init(chart.value);
  updateChart();
};

// 更新图表数据
const updateChart = () => {
  if (!chartInstance) return;
  
  // 按Count值从大到小排序
  const sortedData = [...chartData.value].sort((a, b) => b.Count - a.Count);
  
  chartInstance.setOption({
    title: {
      text: '各区结案数量',
      textStyle: {
        color: '#fff',
        fontSize: 20,
      },
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow' // 阴影指示器
      },
      formatter: params => {
        const data = params[0].data;
        return `${data.Name}<br/>
                结案数量: ${data.Count}<br/>
                占比: ${data.Percentage.toFixed(2)}%`;
      }
    },
    legend: {
      data: ['结案'],
      textStyle: {
        color: '#fff',
      },
      top: '10%',
    },
    grid: {
      left: '4%',
      right: '4%',
      bottom: '6%',
      top: '22%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: sortedData.map(item => item.Name),
      axisLabel: {
        color: '#fff',
        interval: 0,
        rotate: 40,
        fontSize: 11,
        margin: 12,
        overflow: 'truncate',
        width: 56
      },
      axisLine: {
        lineStyle: {
          color: '#2cd6df',
        },
      },
      axisTick: {
        alignWithLabel: true // 刻度与标签对齐
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#fff',
      },
      axisLine: {
        lineStyle: {
          color: '#2cd6df',
        },
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(44, 214, 223, 0.2)',
        },
      },
    },
    series: [
      {
        name: '结案',
        type: 'bar', // 修改为柱状图
        barWidth: '60%', // 柱子宽度
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut',
        data: sortedData.map(item => ({
          value: item.Count,
          Name: item.Name,
          Count: item.Count,
          Percentage: item.Percentage
        })),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#00f541' }, // 顶部颜色
            { offset: 1, color: '#00a2ff' }  // 底部颜色
          ]),
          borderRadius: [4, 4, 0, 0] // 柱子圆角
        },
        label: {
          show: true,
          position: 'top',
          color: '#fff',
          formatter: '{c}'
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#00ffaa' },
              { offset: 1, color: '#0099ff' }
            ])
          }
        }
      },
    ]
  }, {
    // 更新选项配置，启用过渡动画
    notMerge: false,
    lazyUpdate: false,
    silent: false,
    replaceMerge: undefined
  });
};

// 获取数据方法
const selectDate = computed(() => store.state.AmapStore.SelectDate);

const getData = async () => {
  try {
    const requestData = {
      "StartTime": selectDate.value?.length ? selectDate.value[0] : "",
      "EndTime": selectDate.value?.length ? selectDate.value[1] : ""
    };
    
    const res = await GetCaseCountByArea('/api/Statistics/GetCaseCountByArea', JSON.stringify(requestData));
    
    if (res?.areaCounts?.length) {
      chartData.value = res.areaCounts;
      updateChart();
    } else {
      chartData.value = [];
      updateChart();
    }
  } catch (error) {
    console.error("获取各区结案数据失败:", error);
    ElMessage.error('获取数据失败，请稍后重试');
  }
};

// 监听日期变化
watch(selectDate, (newVal) => {
  if (newVal) {
    getData();
  }
}, { deep: true });

onMounted(() => {
  initChart();
  getData();
  
  // 窗口大小变化时重新调整图表大小
  window.addEventListener('resize', () => {
    chartInstance?.resize();
  });
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>