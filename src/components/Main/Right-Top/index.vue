<template>
  <div class="chart-container">
    <!-- 右侧图表区域 -->
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import * as echarts from 'echarts';
import { GetSourceRatio } from '@/api/main/right/index';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

const store = useStore();
const chart = ref(null);
const chartData = ref([]);
let chartInstance = null;

// 处理接口数据，转换为图表需要的格式
const processChartData = (apiData) => {
  if (!Array.isArray(apiData) || apiData.length === 0) return [];

  // 计算总数
  const totalCount = apiData.reduce((sum, item) => sum + item.Count, 0);

  // 确保总数大于 0
  if (totalCount <= 0) {
    console.warn('数据总数为 0，无法计算占比');
    return [];
  }

  // 转换数据并计算占比
  return apiData.map(item => ({
    value: item.Count,
    name: item.Name,
    number: item.Count, // 直接使用 Count 作为显示数字
    percentage: item.Count / totalCount, // 动态计算占比
    color: getColorByName(item.Name) // 根据名称分配颜色
  }));
};

// 根据来源名称分配颜色
const getColorByName = (name) => {
  const colorMap = {
    '市容委平台转': '#2cd6df',
    '便民服务热线': '#f7f732',
    '巡查员发现': '#00ff48',
    '区采集员上报': '#2cd6df',
    '市巡查员上报': '#f7f732',
    '微信举报': '#00ff48'
  };
  return colorMap[name] || '#5470c6'; // 默认颜色
};

// 初始化图表
const initChart = () => {
  if (!chart.value) return;

  chartInstance = echarts.init(chart.value);
  updateChart();
};

// 更新图表数据
const updateChart = () => {
  if (!chartInstance) return;

  chartInstance.setOption({
    title: {
      text: '来源占比',
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 20
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: params => {
        return `${params.name}<br/>
                数量: ${params.data.number}<br/>
                占比: ${(params.data.percentage * 100).toFixed(2)}%`;
      }
    },
    legend: {
      orient: 'vertical',
      left: '2%',
      top: '20%',
      textStyle: {
        color: '#fff',
        fontSize: 16
      },
      data: chartData.value.map(item => item.name),
      formatter: function (name) {
        const item = chartData.value.find(d => d.name === name);
        return `${item.name} ${item.number}`;
      }
    },
    series: [{
      name: '上报数量',
      type: 'pie',
      radius: '65%',
      center: ['70%', '50%'],
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut',
      itemStyle: {
        borderRadius: 8,
        borderColor: '#1a2a3f',
        borderWidth: 2
      },
      label: {
        show: true,
        position: 'inside',
        formatter: ({ percent }) => `${percent.toFixed(1)}%`,
        color: '#ffffff'
      },
      labelLine: {
        show: false
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      data: chartData.value
    }]
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
const loading = ref(false);

const getData = async () => {
  try {
    loading.value = true;
    const requestData = {
      "StartTime": selectDate.value?.length ? selectDate.value[0] : "",
      "EndTime": selectDate.value?.length ? selectDate.value[1] : ""
    };

    const res = await GetSourceRatio('/api/Statistics/GetSourceRatio', JSON.stringify(requestData));

    if (res?.sourceRatio?.length) {
      chartData.value = processChartData(res.sourceRatio);
      updateChart();
    } else {
      // 显示默认数据或空状态
      chartData.value = [];
      updateChart();
    }
  } catch (error) {
    console.error("获取来源占比数据失败:", error);
    ElMessage.error('获取数据失败，请稍后重试');
  } finally {
    loading.value = false;
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

  // 图表点击事件
  chartInstance?.on('click', (params) => {
    handleLegendClick(params.dataIndex);
  });
});

// 处理图例点击
const handleLegendClick = (index) => {
  chartInstance?.dispatchAction({
    type: 'toggleSelect',
    seriesIndex: 0,
    dataIndex: index
  });

  chartInstance?.dispatchAction({
    type: 'highlight',
    seriesIndex: 0,
    dataIndex: index
  });
};
</script>

<style scoped>
.chart-container {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>