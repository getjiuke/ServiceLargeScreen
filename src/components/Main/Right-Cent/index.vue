<template>
  <div class="chart-container">
    <div class="controls">
      <span class="control-label">查询天数：</span>
      <el-select v-model="queryDays" placeholder="选择天数" size="small" @change="getData">
        <el-option v-for="item in dayOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import * as echarts from 'echarts';
import { GetCaseStatsWithFullDateRange } from '@/api/main/right/index';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

const store = useStore();
const chart = ref(null);
const chartData = ref([]);
let chartInstance = null;

// 查询天数相关
const queryDays = ref(31); // 默认查询31天
const dayOptions = ref([
  { value: 7, label: '最近7天' },
  { value: 14, label: '最近14天' },
  { value: 21, label: '最近21天' },
  { value: 31, label: '最近31天' }
]);

// 初始化图表
const initChart = () => {
  if (!chart.value) {
    console.error("DOM 容器未挂载");
    return;
  }
  chartInstance = echarts.init(chart.value);
};

// 格式化日期显示为 M-D 格式
const formatDateLabel = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    console.error("无效的日期字符串:", dateStr);
    return "";
  }
  return `${date.getMonth() + 1}-${date.getDate()}`;
};

// 更新图表数据
const updateChart = () => {
  if (!chartInstance || !chartData.value.length) return;

  // 按日期升序排序
  const sortedData = [...chartData.value].sort((a, b) =>
    new Date(a.StatDate) - new Date(b.StatDate)
  );

  chartInstance.setOption({
    title: {
      text: `结案趋势（${sortedData.length}天）`,
      textStyle: {
        color: '#fff',
        fontSize: 20,
      },
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      formatter: params => {
        const dataIndex = params[0].dataIndex;
        const data = sortedData[dataIndex];
        return `${data.StatDateStr}<br/>
                结案数量: ${data.CaseCount}`;
      }
    },
    legend: {
      data: ['结案'],
      textStyle: {
        color: '#fff',
      },
      top: '9%',
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '15%',
      top: '20%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: sortedData.map(item => formatDateLabel(item.StatDate)),
      boundaryGap: false, // 让折线图从 X 轴起点开始
      axisLabel: {
        color: '#fff',
        rotate: 0, // 标签旋转角度
        interval: Math.ceil(sortedData.length / 10), // 动态计算显示间隔
      },
      axisLine: {
        lineStyle: {
          color: '#2cd6df',
        },
      },
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
        type: 'line', // 修改为折线图
        data: sortedData.map(item => ({
          value: item.CaseCount,
          StatDateStr: item.StatDateStr,
          CaseCount: item.CaseCount,
        })),
        smooth: true, // 平滑曲线
        animation: true,
        animationDuration: 1000,
        animationEasing: 'quarticOut',
        animationThreshold: 2000,
        progressiveThreshold: 3000,
        progressive: 500,
        itemStyle: {
          color: '#00f541', // 折线点的颜色
        },
        lineStyle: {
          width: 3, // 折线宽度
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 245, 70, 0.6)' }, // 渐变起始颜色
            { offset: 1, color: 'rgba(0, 245, 70, 0.1)' }, // 渐变结束颜色
          ]),
        },
      },
    ],
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
    // 如果选择了特定日期范围，则使用该范围；否则使用最近指定天数的数据
    let requestData;
    if (selectDate.value?.length) {
      // 如果有选定的日期范围，使用日期范围
      requestData = {
        "Date": selectDate.value[0],
        "QueryDays": queryDays.value
      };
    } else {
      // 否则使用最近指定天数的数据
      requestData = {
        "Date": "",
        "QueryDays": queryDays.value
      };
    }

    const res = await GetCaseStatsWithFullDateRange('/api/Statistics/GetCaseStatsWithFullDateRange', JSON.stringify(requestData));

    if (res?.statsWithCounts?.length) {
      chartData.value = res.statsWithCounts;
      updateChart();
    } else {
      ElMessage.warning('暂无结案趋势数据');
      chartData.value = [];
      updateChart();
    }
  } catch (error) {
    console.error("获取结案趋势数据失败:", error);
    ElMessage.error('获取数据失败，请稍后重试');
  }
};

// 监听日期变化
watch(selectDate, (newVal) => {
  if (newVal) {
    // 添加一个小的延时，使切换更平滑
    setTimeout(() => {
      getData();
    }, 100);
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

.controls {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(21, 79, 116, 0.5);
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid rgba(2, 213, 223, 0.5);
}

.control-label {
  color: #2cd6df;
  font-size: 14px;
}

:deep(.el-select) {
  width: 120px;
}

:deep(.el-select .el-input__wrapper) {
  background-color: rgba(0, 0, 0, 0.3) !important;
  box-shadow: 0 0 0 1px rgba(2, 213, 223, 0.3) inset !important;
  padding: 0 8px;
  border-radius: 4px;
}

:deep(.el-select .el-input__wrapper):hover {
  box-shadow: 0 0 0 1px rgba(2, 213, 223, 0.6) inset !important;
}

:deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(2, 213, 223, 0.8) inset !important;
}

:deep(.el-select .el-input__inner) {
  color: #fff;
  background-color: transparent !important;
}

:deep(.el-popper) {
  background: rgba(21, 79, 116, 0.9);
  border: 1px solid rgba(2, 213, 223, 0.8);
  backdrop-filter: blur(5px);
}

:deep(.el-popper .el-select-dropdown__item) {
  color: #2cd6df;
}

:deep(.el-popper .el-select-dropdown__item.hover),
:deep(.el-popper .el-select-dropdown__item:hover) {
  background: rgba(2, 213, 223, 0.2);
  color: #fff;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>