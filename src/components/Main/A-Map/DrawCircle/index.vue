<template>
  <div></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
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

// 浮点数精度比较函数
const compareCoordinates = (a, b, precision = 6) => {
  const factor = Math.pow(10, precision);
  return (
    Math.round(a[0] * factor) === Math.round(b[0] * factor) &&
    Math.round(a[1] * factor) === Math.round(b[1] * factor)
  );
};

// 获取当前日期并格式化为YYYY-MM-DD
const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 计算日期差（天数）
const getDateDiff = (startDate, endDate) => {
  const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// 处理日期参数
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

// 聚合点样式（蓝色）
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

// 展开点样式（黄色）和点击事件处理
const renderMarker = (context) => {
  const size = 36;
  const borderWidth = 3;
  const marker = context.marker;

  // 创建标记内容
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

  // 设置扩展数据
  marker.setExtData(context.data); // 确保扩展数据被正确设置

  // 使用高德地图原生事件绑定
  marker.on('click', () => {
    handleMarkerClick(marker);
  });

  // 设置标记样式
  marker.setContent(content);
  marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
};


// 处理点击事件的统一方法
const handleMarkerClick = (marker) => {
  // 通过扩展数据获取关联信息
  const extData = marker.getExtData();
  if (extData) {
	console.log(extData);
    showInfoWindow(marker, extData[0].extData);
  }
};

// 显示信息窗口
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

// 初始化点聚合
const initCluster = (map) => {
  if (!map || !casePoints.value.length) return;
  
  clearCluster();
  
  AMap.plugin(["AMap.MarkerCluster"], () => {
    cluster = new AMap.MarkerCluster(
      map,
      casePoints.value.map(p => ({
        lnglat: p.lnglat,
        extData: p // 直接存储扩展数据
      })),
      {
        gridSize: 80,
        maxZoom: 16,
        minClusterSize: 2,
        renderClusterMarker,
        renderMarker,
        // 添加集群点击处理
        onClick: (cluster) => {
          const markers = cluster.getChildMarkers();
          if (markers.length === 1) {
            handleMarkerClick(markers[0]);
          }
        }
      }
    );
  });
};

// 清除点聚合
const clearCluster = () => {
  if (cluster) {
    // 先清除所有标记 一定要清除！
    cluster.setData([]);
    // 然后移除集群
    cluster.setMap(null);
    cluster = null;
  }
  if (infoWindow) {
    infoWindow.close();
    infoWindow = null;
  }
};

// 获取地图数据
const selectDate = computed(() => store.state.AmapStore.SelectDate);

const getData = async () => {
  try {
	casePoints.value = []; //清空数据
	
    const [startDate, endDate] = processDateParams(selectDate.value);
    
    const requestData = {
      "StartTime": startDate,
      "EndTime": endDate
    };
    
    const res = await GetMapData('/api/Statistics/GetCaseInfoForMap', JSON.stringify(requestData));
	console.log("地图数据",res);
	
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

// 监听日期变化
watch(
  selectDate,
  () => getData(),
  { immediate: true, deep: true }
);

// 监听地图实例变化
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
/* 修改高德地图弹窗样式 */
.amap-info-content {
  background-color: hsla(210, 100%, 90%, 0.8) !important; /* 半透明浅蓝色 */
  border: 2px solid hsl(210, 100%, 30%) !important; /* 深蓝色边框 */
  padding: 0 !important; /* 移除默认内边距 */
}

/* 覆盖 InfoWindow 的关闭按钮样式 */
.amap-info-close {
  color: #fff !important; /* 设置关闭按钮的文字颜色为纯白色 */
}

.custom-info-window {
  padding: 15px;
  min-width: 220px;
  color: #333; /* 文字颜色 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 添加轻微阴影 */
  border-radius: 8px; /* 圆角效果 */
}

.custom-info-window h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: hsl(210, 100%, 30%); /* 标题文字颜色为深蓝色 */
  font-weight: bold;
}

.custom-info-window p {
  margin: 5px 0;
  font-size: 14px;
  line-height: 1.4;
}
</style>