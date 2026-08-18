<template>
  <div id="map-container" class="full-screen-map"></div>
  <slot v-if="map" :mapInstance="map"></slot>
</template>

<script setup>
import { onMounted, shallowRef, onUnmounted, markRaw } from 'vue';
import { AMAP_KEY, AMAP_SECURITY_CODE, MAP_CENTER, MAP_ZOOM } from '@/config/map';

window._AMapSecurityConfig = {
  securityJsCode: AMAP_SECURITY_CODE,
};

const map = shallowRef(null);
const plugins = ['AMap.MarkerCluster'];

const loadSDK = () => {
  return new Promise((resolve, reject) => {
    if (window.AMap) return resolve();
    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&plugin=${plugins.join(',')}`;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const initMap = async () => {
  try {
    await loadSDK();
    const instance = new AMap.Map('map-container', {
      zoom: MAP_ZOOM,
      center: MAP_CENTER,
      viewMode: '2D',
      mapStyle: 'amap://styles/darkblue',
      touchZoom: true,
      scrollWheel: true,
      doubleClickZoom: false,
    });
    map.value = markRaw(instance);
  } catch (error) {
    console.error('地图初始化失败:', error);
  }
};

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
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  background: #0a1628;
}

#map-container {
  width: 100%;
  height: 100%;
}
</style>
