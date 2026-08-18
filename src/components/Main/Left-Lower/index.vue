<template>
  <div 
    class="scroll-container" 
    @mouseenter="pauseScroll" 
    @mouseleave="resumeScroll"
    @wheel="handleWheel"
    ref="container"
  >
    <div 
      class="scroll-wrapper" 
      ref="scrollWrapper" 
      :style="{ animationDuration: `${animationDuration}s`, animationPlayState: playState }"
    >
      <div 
        v-for="(item, index) in duplicatedData" 
        :key="index" 
        class="scroll-item"
      >
        <div class="right-content">
          <div class="top-line">
            <span class="title">{{ item.CASE_TITLE }}</span>
            <span class="time">{{ formatTime(item.OpTime) }}</span>
          </div>
          <div class="source-line">
            <span>工单编号：{{ item.CASE_SERIAL }}</span>
          </div>
          <div class="content-line">
            {{ item.CASE_CONTENT }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { GetCaseInfoForHotline } from '@/api/main/left/index';
import { ElMessage } from 'element-plus';

const scrollData = ref([]);
const animationDuration = ref(20);
const playState = ref('running');
let refreshTimer = null;

// 格式化时间显示
const formatTime = (timeStr) => {
  if (!timeStr) return '';
  return timeStr.replace('T', ' ').substring(0, 16);
};

// 复制数据以实现无缝滚动
const duplicatedData = computed(() => [...scrollData.value, ...scrollData.value]);

// 停止滚动
const pauseScroll = () => {
  playState.value = 'paused';
};

// 恢复滚动
const resumeScroll = () => {
  playState.value = 'running';
};

// 滚轮事件处理
const handleWheel = (event) => {
  const container = event.currentTarget;
  container.scrollTop += event.deltaY;

  if (container.scrollTop >= container.scrollHeight / 2) {
    container.scrollTop -= container.scrollHeight / 2;
  }

  if (container.scrollTop <= 0) {
    container.scrollTop += container.scrollHeight / 2;
  }
};

// 获取数据
const fetchData = async () => {
  try {
    const res = await GetCaseInfoForHotline('/api/Statistics/GetCaseInfoForHotline');
    
    if (res?.caseInfos?.length) {
      scrollData.value = res.caseInfos;
      calculateAnimationDuration();
    } else {
      scrollData.value = [];
      ElMessage.warning('未获取到便民热线数据');
    }
  } catch (error) {
    console.error("获取便民热线数据失败:", error);
    ElMessage.error('获取数据失败，请稍后重试');
  }
};

// 根据数据长度动态计算动画时长
const calculateAnimationDuration = () => {
  const itemCount = scrollData.value.length;
  animationDuration.value = itemCount * 5; // 每条数据滚动5秒
};

// 初始化定时器
const initTimer = () => {
  refreshTimer = setInterval(() => {
    fetchData();
  }, 5 * 60 * 1000); // 5分钟刷新一次
};

onMounted(() => {
  fetchData();
  initTimer();
});

onBeforeUnmount(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
});
</script>

<style lang="less" scoped>
.scroll-container {
  width: 100%;
  flex: 1;
  min-height: 0;
  height: 100%;
  overflow-y: auto;
  position: relative;

  /* 隐藏滚动条 */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.scroll-wrapper {
  display: flex;
  flex-direction: column;
  animation: scroll-up linear infinite;
  height: 200%;
}

@keyframes scroll-up {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}

.scroll-item {
  display: flex;
  margin-bottom: 15px;
  padding: 15px;
  background: rgba(9, 56, 116, 0.3);
  border: 1px solid rgba(2, 213, 223, 0.3);
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(9, 56, 116, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .right-content {
    flex: 1;
    position: relative;
    font-size: 14px;
    color: #e0e0e0;

    .top-line {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      align-items: center;

      .title {
        color: #2cd6df;
        font-weight: bold;
        font-size: 15px;
        max-width: 60%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .time {
        color: #aaa;
        font-size: 12px;
      }
    }

    .source-line {
      color: #888;
      margin-bottom: 6px;
      font-size: 12px;
    }

    .content-line {
      color: #ccc;
      font-size: 13px;
      line-height: 1.5;
    }
  }
}
</style>