<template>
  <div class="dropdown-container" ref="container">
    <!-- 下拉框 -->
    <div class="dropdown" ref="dropdown">
      <div 
        class="item" 
        v-for="(item, index) in data.allItems" 
        :key="index"
        @mouseenter="handleMouseEnter(item, $event)"
        @mouseleave="handleMouseLeave"
      >
        <div class="sub-title">{{ item.title }}</div>
        <div class="data-row">
          <span class="value">{{ item.value }}</span>
          <span class="percentage">{{ item.percentage }}%</span>
        </div>
      </div>
    </div>

    <!-- 使用Teleport将小类面板渲染到body层 -->
    <Teleport to="body">
      <transition name="fade">
        <div 
          class="small-type-panel" 
          v-show="shouldShowPanel" 
          @mouseenter="handlePanelEnter"
          @mouseleave="handlePanelLeave"
          :style="panelStyle"
          ref="smallPanel"
        >
          <div class="panel-header">{{ currentBigType?.title }} - 小类统计</div>
          <div class="panel-content">
            <div 
              class="small-item" 
              v-for="(item, idx) in smallTypeData" 
              :key="idx"
            >
              <div class="small-title">{{ item.Name }}</div>
              <div class="small-data-row">
                <span class="small-value">{{ item.Description }}</span>
                <span class="small-percentage">{{ item.Proportion }}%</span>
              </div>
            </div>
            <div class="no-data" v-if="!smallTypeData.length && !loading">暂无小类数据</div>
            <div class="loading" v-if="loading">加载中...</div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed, watch, ref, nextTick } from 'vue';
import { GetAllBigType, GetAllSmallType } from '@/api/main/left/index';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

const store = useStore();
const data = reactive({
  allItems: [] 
});

// 小类数据相关状态
const smallTypeData = ref([]);
const showSmallPanel = ref(false);
const currentBigType = ref(null);
const panelPosition = ref({ x: 0, y: 0 });
const loading = ref(false);
const smallPanel = ref(null);
const container = ref(null);
const dropdown = ref(null);
const lastRequestedId = ref(null);
const hideTimer = ref(null);
const isMouseInPanel = ref(false);
const isMouseInDropdown = ref(false);

// 计算属性：是否应该显示面板
const shouldShowPanel = computed(() => {
  return showSmallPanel.value || loading.value;
});

// 计算面板样式
const panelStyle = computed(() => ({
  left: `${panelPosition.value.x - 5}px`,
  top: `${panelPosition.value.y}px`,
  'min-width': '280px',
  'max-width': '400px',
}));

// 获取数据方法
const selectDate = computed(() => store.state.AmapStore.SelectDate);

const getData = async () => {
  try {
    const requestData = {
      "StartTime": selectDate.value?.length ? selectDate.value[0] : "",
      "EndTime": selectDate.value?.length ? selectDate.value[1] : ""
    };

    const res = await GetAllBigType('/api/Statistics/GetAllBigType', JSON.stringify(requestData));

    if (res?.areaCounts?.length) {
      const sortedData = res.areaCounts
        .sort((a, b) => b.Description - a.Description);

      data.allItems = sortedData.map(item => ({
        id: item.ClassBigID,
        title: item.Name,
        value: item.Description,
        percentage: parseFloat(item.Proportion).toFixed(1)
      }));
    } else {
      data.allItems = [];
    }
  } catch (error) {
    console.error("获取巡查上报数据失败:", error);
    ElMessage.error('获取数据失败，请稍后重试');
  }
};

// 获取小类数据
const getSmallTypeData = async (classBigId) => {
  if (lastRequestedId.value === classBigId && smallTypeData.value.length > 0) return;
  
  smallTypeData.value = [];  
  loading.value = true;
  lastRequestedId.value = classBigId;
  showSmallPanel.value = true; // 确保在请求开始时显示面板
  
  try {
    const requestData = {
      "StartTime": selectDate.value?.length ? selectDate.value[0] : "",
      "EndTime": selectDate.value?.length ? selectDate.value[1] : "",
      "ClassBigID": classBigId
    };

    const res = await GetAllSmallType('/api/Statistics/GetAllSmallType', JSON.stringify(requestData));

    smallTypeData.value = res?.smallCounts?.length ? res.smallCounts : [];
  } catch (error) {
    console.error("获取小类数据失败:", error);
    smallTypeData.value = [];
    ElMessage.error('获取小类数据失败');
  } finally {
    loading.value = false;
    
    // 数据加载完成后检查鼠标是否还在相关区域
    if (!isMouseInPanel.value && !isMouseInDropdown.value) {
      // 延迟隐藏以确保平滑过渡
      setTimeout(() => {
        if (!isMouseInPanel.value && !isMouseInDropdown.value) {
          showSmallPanel.value = false;
        }
      }, 300);
    }
  }
};

// 鼠标进入大类项
const handleMouseEnter = async (item, event) => {
  cancelHide();
  isMouseInDropdown.value = true;
  currentBigType.value = item;
  
  // 获取触发元素位置
  const targetRect = event.target.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // 初始位置
  let posX = targetRect.right + 10;
  let posY = targetRect.top;

  // 获取面板尺寸（预估）
  const panelWidth = 280;
  const panelHeight = 400;

  // 右侧边界检测
  if (posX + panelWidth > viewportWidth) {
    posX = targetRect.left - panelWidth - 10;
  }

  // 底部边界检测
  if (posY + panelHeight > viewportHeight) {
    posY = viewportHeight - panelHeight - 10;
  }

  panelPosition.value = { x: posX, y: posY };
  
  // 立即显示面板
  showSmallPanel.value = true;
  await getSmallTypeData(item.id);
};

// 鼠标离开大类项
const handleMouseLeave = () => {
  isMouseInDropdown.value = false;
  // 只有当鼠标也不在面板内时才隐藏
  if (!isMouseInPanel.value) {
    startHide();
  }
};

// 鼠标进入面板
const handlePanelEnter = () => {
  cancelHide();
  isMouseInPanel.value = true;
};

// 鼠标离开面板
const handlePanelLeave = () => {
  isMouseInPanel.value = false;
  if (!isMouseInDropdown.value) {
    startHide();
  }
};

// 开始隐藏面板
const startHide = () => {
  // 如果正在加载，不立即隐藏
  if (loading.value) return;
  
  hideTimer.value = setTimeout(() => {
    if (!isMouseInPanel.value && !isMouseInDropdown.value && !loading.value) {
      showSmallPanel.value = false;
    }
  }, 300);
};

// 取消隐藏面板
const cancelHide = () => {
  clearTimeout(hideTimer.value);
};

// 监听日期变化
watch(selectDate, (newVal) => {
  if (newVal) {
    getData();
    lastRequestedId.value = null;
  }
}, { deep: true });

// 组件挂载时获取数据
onMounted(() => {
  getData();

  // 动态调整滚动区域高度
  const containerEl = document.querySelector('.left-cent');
  if (containerEl) {
    const containerHeight = containerEl.clientHeight;
    dropdown.value.style.maxHeight = `${containerHeight - 60}px`;
  }
});
</script>

<style scoped>
/* 容器样式 */
.dropdown-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;
}

/* 下拉框样式 */
.dropdown {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-height: 310px;
  overflow-y: auto;
  padding: 10px;
  padding-bottom: 40px;
  background: rgba(0, 0, 0, 0);
  scrollbar-width: thin;
  scrollbar-color: #02d5df transparent;
}

/* 自定义滚动条样式 */
.dropdown::-webkit-scrollbar {
  width: 8px;
}
.dropdown::-webkit-scrollbar-thumb {
  background-color: #02d5df;
  border-radius: 4px;
}
.dropdown::-webkit-scrollbar-track {
  background: transparent;
}

/* 数据项样式 */
.item {
  width: calc(50% - 5px);
  background: rgba(9, 56, 116, 0.5);
  border: 2px solid #02d5df;
  border-radius: 8px;
  padding: 10px;
  color: #fff;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s;
}

.item:hover {
  background: rgba(9, 56, 116, 0.8);
  transform: translateY(-2px);
}

.sub-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}

.data-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.value {
  font-size: 18px;
  font-weight: bold;
  color: #2cd6df;
}

.percentage {
  font-size: 14px;
  color: #ffa500;
}

/* 小类浮动面板样式 */
.small-type-panel {
  position: fixed;
  width: 280px;
  max-height: 400px;
  background: rgba(9, 56, 116, 0.95);
  border: 2px solid #02d5df;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
  overflow: hidden;
  scrollbar-width: thin;
  scrollbar-color: #02d5df transparent;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.panel-header {
  padding: 12px;
  background: rgba(2, 213, 223, 0.3);
  font-size: 14px;
  font-weight: bold;
  color: #02d5df;
  border-bottom: 1px solid #02d5df;
}

.panel-content {
  max-height: 350px;
  overflow-y: auto;
  padding: 10px;
}

.small-item {
  padding: 10px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  transition: all 0.2s;
}

.small-item:hover {
  background: rgba(2, 213, 223, 0.1);
}

.small-title {
  font-size: 13px;
  color: #fff;
  margin-bottom: 5px;
}

.small-data-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.small-value {
  font-size: 14px;
  color: #2cd6df;
}

.small-percentage {
  font-size: 12px;
  color: #ffa500;
}

.no-data, .loading {
  padding: 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
}
</style>