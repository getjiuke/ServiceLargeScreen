<template>
  <div></div>
</template>

<script setup>
import { ref, onBeforeUnmount, watch, computed } from 'vue';
import { GetMapData } from '@/api/main/map/index'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const store = useStore();
const props = defineProps({
  mapInstance: Object
});

let cluster = null;
let infoWindow = null;
const casePoints = ref([]);

const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDateDiff = (startDate, endDate) => {
  const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const processDateParams = (dates) => {
  let [startDate, endDate] = dates || [];
  const currentDate = getCurrentDate();
  startDate = startDate || currentDate;
  endDate = endDate || currentDate;
  if (getDateDiff(startDate, endDate) > 31) {
    const newEndDate = new Date(startDate);
    newEndDate.setDate(newEndDate.getDate() + 31);
    endDate = newEndDate.toISOString().split('T')[0];
  }
  return [startDate, endDate];
};

const renderClusterMarker = (context) => {
  const count = context.count;
  const maxSize = 50;
  const size = Math.min(maxSize, 30 + Math.pow(count, 0.2) * 10);
  const div = document.createElement('div');
  div.style.backgroundColor = 'hsla(210, 100%, 50%, 0.7)';
  div.style.width = div.style.height = `${size}px`;
  div.style.border = 'solid 1px hsla(210, 100%, 50%, 1)';
  div.style.borderRadius = '50%';
  div.style.boxShadow = '0 0 5px hsla(210, 100%, 90%, 1)';
  div.innerHTML = count;
  div.style.lineHeight = `${size}px`;
  div.style.color = 'white';
  div.style.fontSize = '14px';
  div.style.textAlign = 'center';
  div.style.cursor = 'pointer';
  context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
  context.marker.setContent(div);
};

const renderMarker = (context) => {
  const size = 36;
  const borderWidth = 3;
  const marker = context.marker;
  const content = document.createElement('div');
  content.style.cssText = `
    background-color: hsla(45, 100%, 50%, 0.7);
    width: ${size}px;
    height: ${size}px;
    border: ${borderWidth}px solid hsl(45, 100%, 40%);
    border-radius: 50%;
    box-shadow: hsl(45, 100%, 50%) 0px 0px 3px;
    cursor: pointer;
  `;
  marker.setExtData(context.data);
  marker.on('click', () => {
    handleMarkerClick(marker);
  });
  marker.setContent(content);
  marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
};

const handleMarkerClick = (marker) => {
  const extData = marker.getExtData();
  if (extData) {
    showInfoWindow(marker, extData[0].extData);
  }
};

const showInfoWindow = (marker, pointData) => {
  if (!infoWindow) {
    infoWindow = new AMap.InfoWindow({
      offset: new AMap.Pixel(0, -5),
      autoMove: true,
      closeWhenClickMap: true
    });
  }
  infoWindow.setContent(`
    <div class="custom-info-window">
      <h4>案件ID: ${pointData.CaseMainID}</h4>
      <p>位置编码：${pointData.PositionCode}</p>
    </div>
  `);
  infoWindow.open(props.mapInstance, marker.getPosition());
};

const initCluster = (map) => {
  if (!map || !casePoints.value.length || !window.AMap) return;
  clearCluster();
  AMap.plugin(["AMap.MarkerCluster"], () => {
    cluster = new AMap.MarkerCluster(
      map,
      casePoints.value.map(p => ({
        lnglat: p.lnglat,
        extData: p
      })),
      {
        gridSize: 80,
        maxZoom: 16,
        minClusterSize: 2,
        renderClusterMarker,
        renderMarker,
      }
    );
  });
};

const clearCluster = () => {
  if (cluster) {
    cluster.setData([]);
    cluster.setMap(null);
    cluster = null;
  }
  if (infoWindow) {
    infoWindow.close();
    infoWindow = null;
  }
};

const selectDate = computed(() => store.state.AmapStore.SelectDate);

const getData = async () => {
  try {
    casePoints.value = [];
    const [startDate, endDate] = processDateParams(selectDate.value);
    const requestData = {
      "StartTime": startDate,
      "EndTime": endDate
    };
    const res = await GetMapData('/api/Statistics/GetCaseInfoForMap', JSON.stringify(requestData));
    if (res?.caseInfos?.length) {
      casePoints.value = res.caseInfos.map(item => ({
        CaseMainID: item.CaseMainID,
        lnglat: [parseFloat(item.Longitude), parseFloat(item.Latitude)],
        PositionCode: item.PositionCode
      }));
      if (props.mapInstance) {
        initCluster(props.mapInstance);
      }
    } else {
      clearCluster();
      casePoints.value = [];
    }
  } catch (error) {
    console.error("获取地图数据失败:", error);
    ElMessage.error('获取地图数据失败，请稍后重试');
  }
};

watch(
  selectDate,
  () => getData(),
  { immediate: true, deep: true }
);

watch(
  () => props.mapInstance,
  (newMap) => {
    if (newMap && casePoints.value.length) {
      initCluster(newMap);
    }
  },
  { immediate: true }
);

onBeforeUnmount(clearCluster);
</script>

<style>
.amap-info-content {
  background-color: hsla(210, 100%, 90%, 0.8) !important;
  border: 2px solid hsl(210, 100%, 30%) !important;
  padding: 0 !important;
}

.amap-info-close {
  color: #fff !important;
}

.custom-info-window {
  padding: 15px;
  min-width: 220px;
  color: #333;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.custom-info-window h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: hsl(210, 100%, 30%);
  font-weight: bold;
}

.custom-info-window p {
  margin: 5px 0;
  font-size: 14px;
  line-height: 1.4;
}
</style>
