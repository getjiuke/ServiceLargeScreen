<template>
  <div class="main-container">
    <!-- 地图组件 -->
    <a-map v-slot="{ mapInstance }">
      <draw-circle :mapInstance="mapInstance" />
    </a-map>
    
    <!-- 顶部标题 -->
    <div class="header-title">
      <h1>市政道路巡查管理平台</h1>
    </div>
    
    <div class="header-table">
      <!-- <TableTop/> -->
    </div>
    
    <!-- 左侧组件 -->
    <div class="left-top">
      <LeftTop />
    </div>
    <div class="left-cent">
      <div class="component-title">
        <p>巡查人上报案件</p>
      </div>
      <LeftCent />
    </div>
    <div class="left-lower">
      <div class="component-title">
        <p>12345案件</p>
      </div>
      <LeftLower />
    </div>
    
    <!-- 右侧组件 -->
    <div class="right-top">
      <RightTop/>
    </div>
    <div class="right-cent">
      <RightLower/>
    </div>
    <div class="right-lower">
      <RightCent/>
    </div>
    
    <!-- 功能图标 -->
    <div class="menu-icon" @click="toggleMenu">←</div>
    <div class="date-range-container">
      <DateRangePicker />
    </div>
    <div class="date-icon">{{ currentDate }}</div>
  </div>
</template>

<script setup>
import { ref, watch, computed,onMounted,onBeforeUnmount } from 'vue';
import AMap from '@/components/Main/A-Map/index.vue';
import DrawCircle from '@/components/Main/A-Map/DrawCircle/index.vue';
import TableTop from '@/components/Main/Top-Table/index.vue';
import LeftTop from '@/components/Main/Left-Top/index.vue';
import LeftCent from '@/components/Main/Left-Cent/index.vue';
import LeftLower from '@/components/Main/Left-Lower/index.vue';
import RightTop from '@/components/Main/Right-Top/index.vue';
import RightCent from '@/components/Main/Right-Cent/index.vue';
import RightLower from '@/components/Main/Right-Lower/index.vue';
import DateRangePicker from '@/components/Main/DateRangePicker/index.vue';
import { ElMessage } from 'element-plus'
import { RefreshToken } from '@/api/login/index';
import { useRouter } from 'vue-router';
import {useStore} from 'vuex' //引入vuex实例

const UseStore = useStore(); //注册vuex实例对象
const router = useRouter();  // 路由实例

const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
});

const toggleMenu = () => {
  window.location.href = '/';  // 这会完全重新加载应用
};

// Token刷新相关
let refreshTimer = null;
const refreshInterval = 10 * 60 * 1000; // 10分钟刷新一次
let preRefreshTimer = null; // 用于刷新前提示的定时器
const preRefreshTime = 5 * 1000; // 提前5秒提示

const showRefreshMessage = () => {
  ElMessage({
    message: 'Token 即将刷新',
    type: 'warning',
    duration: 3000, // 显示 3 秒
    showClose: true,
  });
};

const refreshToken = async () => {
  try {
    // 清除预刷新提示定时器
    if (preRefreshTimer) {
      clearTimeout(preRefreshTimer);
      preRefreshTimer = null;
    }

    const response = await RefreshToken(); // 调用 API 刷新 Token
    console.log(response);

    if (response.Token) {
      sessionStorage.setItem('Token', JSON.stringify(response.Token)); // 存储新 Token
      ElMessage.success('Token 刷新成功');
      console.log('Token 刷新成功');

      // 设置下一次刷新前的提示
      preRefreshTimer = setTimeout(() => {
        showRefreshMessage();
      }, refreshInterval - preRefreshTime);
    } else {
      console.error('Token 刷新失败:', response.msg);
      ElMessage.error(`Token 刷新失败: ${response.msg || '未知错误'}`);
    }
  } catch (error) {
    console.error('Token 刷新异常:', error);
    ElMessage.error(`Token 刷新异常: ${error.message || '未知错误'}`);
  }
};

const initTokenRefresh = () => {
  if (refreshTimer) clearInterval(refreshTimer); // 清除之前可能存在的定时器
  if (preRefreshTimer) clearTimeout(preRefreshTimer); // 清除预刷新提示定时器

  // 设置定时刷新
  refreshTimer = setInterval(() => {
    refreshToken(); // 调用刷新 Token 的方法
  }, refreshInterval);

  // 设置第一次刷新前的提示
  preRefreshTimer = setTimeout(() => {
    showRefreshMessage();
  }, refreshInterval - preRefreshTime);
};

onMounted(() => {
	initTokenRefresh();
});

onBeforeUnmount(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
  if (preRefreshTimer) {
    clearTimeout(preRefreshTimer);
    preRefreshTimer = null;
  }
});
</script>

<style lang="less" scoped>
.main-container {
  position: relative;
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  background: #0a1628;

  // 通用组件样式
  [class^="left-"], [class^="right-"] {
    position: absolute;
    background: rgba(10, 32, 54, 0.72);
    border: 1px solid rgba(2, 213, 223, 0.8);
    border-radius: 8px;
    padding: 0px;
    color: #fff;
    backdrop-filter: blur(5px);
    overflow: hidden;
    z-index: 2;
  }

  .header-title {
    position: absolute;
    top: 10px;
    left: 50%;
    text-align: center;
    transform: translateX(-50%);
    color: #2aa9d6;
    font-size: 20px;
    text-shadow: 0 0 10px rgba(44, 214, 223, 0.5);
    z-index: 2;
    width: 580px;
    height: 80px;
    pointer-events: none;

    h1 {
      margin: 0;
      line-height: 70px;
      font-size: 36px;
      letter-spacing: 4px;
    }
  }
  
  .header-table {
    position: absolute;
    z-index: 2;
	top: 120px;
    left: 35%;
  	width: 580px;
	height: 100px;
  }
  
  .component-title {
    width: 100%;
    flex-shrink: 0;
    text-align: center;
    margin: 0;
    padding: 0;
    line-height: 1;
    color: #2cd6df;
    font-size: 16px;
    font-weight: bold;
    background: rgba(21, 79, 116, 0.3);
    border-bottom: 1px solid rgba(2, 213, 223, 0.8);
    
    p {
      margin: 0;
      padding: 8px 0;
      line-height: 1;
    }
  }

  // 左侧定位
  .left-top {
    top: 90px;
    left: 20px;
    width: 480px;
    height: 300px;
  }

  .left-cent {
    top: 410px;
    left: 20px;
    width: 480px;
    height: 310px;
    padding-top: 0;
    display: flex;
    flex-direction: column;
  }

  .left-lower {
    bottom: 20px;
    left: 20px;
    width: 480px;
    height: 310px;
    padding-top: 0;
    display: flex;
    flex-direction: column;
  }

  // 右侧定位
  .right-top {
    top: 90px;
    right: 20px;
    width: 480px;
    height: 300px;
  }

  .right-cent {
    top: 410px;
    right: 20px;
    width: 480px;
    height: 310px;
  }

  .right-lower {
    bottom: 20px;
    right: 20px;
    width: 1380px;
    height: 310px;
  }

  // 顶部工具：限制在标题栏高度内，避免压住右侧图表
  .menu-icon, .date-icon, .date-range-container {
    position: absolute;
    top: 18px;
    height: 40px;
    color: #2cd6df;
    z-index: 3;
    box-sizing: border-box;
  }

  .menu-icon {
    left: 24px;
    padding: 0 10px;
    font-size: 24px;
    line-height: 40px;
    cursor: pointer;
  }

  .date-icon {
    right: 24px;
    padding: 0 12px;
    font-size: 16px;
    line-height: 40px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
  }
  
  .date-range-container {
    right: 170px;
    padding: 0;
    display: flex;
    align-items: center;
  }
}
</style>