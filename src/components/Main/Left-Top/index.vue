<template>
  <div class="left-top-container">
    <div class="row">
      <div
        v-for="(item, index) in data.row1"
        :key="index"
        class="column"
      >
        <div class="big-number" :class="item.color">{{ item.value }}</div>
        <div class="small-text">{{ item.label }}</div>
      </div>
    </div>
    
    <div class="row">
      <div
        v-for="(item, index) in data.row2"
        :key="index"
        class="column"
      >
        <div class="big-number" :class="item.color">{{ item.value }}</div>
        <div class="small-text">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject, watch, computed, reactive } from 'vue';
import { GetBaseStatistics } from '@/api/main/left/index'
import { useStore } from 'vuex'

const store = useStore();
const loading = ref(false);

// 初始化数据
const data = reactive({
  row1: [
    { value: '0', label: '覆盖面积（km²）', color: 'blue' },
    { value: '0', label: '单元网格', color: 'blue' },
  ],
  row2: [
    { value: '0', label: '案件数', color: 'orange' },
    { value: '0', label: '巡查人员', color: 'orange' },
  ],
});

// 计算属性获取日期范围
const selectDate = computed(() => store.state.AmapStore.SelectDate);

// 格式化数字显示
const formatNumber = (num) => {
  if (typeof num === 'number') {
    // 如果是面积值，保留3位小数
    if (num.toString().includes('.')) {
      return num.toFixed(3);
    }
    return num.toString();
  }
  return num;
};

// 获取数据方法
const getData = async () => {
  try {
    loading.value = true;
    
    // 根据接口文档，需要传递JSON字符串
    const requestData = {
		"StartTime": selectDate.value?.length ? selectDate.value[0] : "",
		"EndTime": selectDate.value?.length ? selectDate.value[1] : ""
    };
	
    const res = await GetBaseStatistics('/api/Statistics/GetBaseStatistics', JSON.stringify(requestData));
    
    if (res) {
      // 更新数据 - 根据接口文档字段名
      data.row1[0].value = formatNumber(res.AreaSize);
      data.row1[1].value = formatNumber(res.GridCount);
      data.row2[0].value = formatNumber(res.CaseCount);
      data.row2[1].value = formatNumber(res.InspectorCount);
    } else {
      // ElMessage.warning('获取数据为空');
    }
  } catch (error) {
    console.error("获取基础统计数据失败:", error);
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

// 组件挂载时获取数据
onMounted(() => {
	getData();
});

</script>

<style scoped>
.left-top-container {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: transparent;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50%;
  border-bottom: 1px solid rgba(2, 213, 223, 0.8);
}

.row:last-child {
  border-bottom: none;
}

.column {
  flex: 1;
  text-align: center;
  border-right: 1px solid rgba(2, 213, 223, 0.8);
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.column:last-child {
  border-right: none;
}

.big-number {
  font-size: 32px;
  font-weight: bold;
  transition: all 0.5s ease; /* 添加数字变化动画 */
}

.blue {
  color: #2cd6df;
}

.orange {
  color: #ffa500;
}

.small-text {
  font-size: 14px;
  color: #fff;
  margin-top: 8px;
}
</style>