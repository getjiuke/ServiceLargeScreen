<template>
  <div id="map-container" class="full-screen-map"></div>
  <slot v-if="map" :mapInstance="map"></slot>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';

// 安全配置需在脚本加载前设置
window._AMapSecurityConfig = {
  securityJsCode: 'e192183abe8fca5ad21c40571a70b879',
};

const map = ref(null);
const plugins = ref(['AMap.Zoom', 'AMap.MarkerCluster']); // 显式声明需要的插件

const loadSDK = () => {
  return new Promise((resolve, reject) => {
    if (window.AMap) return resolve();
    
    // 注意：请在此处替换为您自己的高德地图API密钥
    const key = 'YOUR_AMAP_API_KEY';
    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${key}&plugin=${plugins.value.join(',')}`;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const initMap = async () => {
  try {
    await loadSDK();
    
    // 配置Canvas优化参数
    const ctx = document.createElement('canvas').getContext('2d');
    if (ctx && typeof ctx.getContextAttributes === 'function') {
      ctx.getContextAttributes().willReadFrequently = true;
    }

    map.value = new AMap.Map('map-container', {
      zoom: 14,
      center: [117.195968, 39.125582],
      viewMode: '2D',	// 提高性能优
      mapStyle: 'amap://styles/darkblue',
      touchZoom: true,
      scrollWheel: true,
      doubleClickZoom: false ,// 减少事件监听
    });

    // 添加被动事件监听
    const container = map.value.getContainer();
    container.addEventListener('touchmove', () => {}, { passive: true });
    container.addEventListener('wheel', () => {}, { passive: true });

  } catch (error) {
    console.error('地图初始化失败:', error);
  }
};

// 优化销毁逻辑
const destroyMap = () => {
  if (map.value) {
    map.value.destroy();
    map.value = null;
  }
};

onMounted(initMap);
onUnmounted(destroyMap);
</script>

<style scoped>
.full-screen-map {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  touch-action: none; /* 优化移动端手势 */
}

#map-container {
  width: 100%;
  height: 100%;
   /* 强制覆盖地图默认光标 */
  /* :deep(div[style*="cursor"]) { 
    cursor: pointer !important;
  } */
}
</style>