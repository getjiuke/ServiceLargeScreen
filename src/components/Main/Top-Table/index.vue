<template>
  <div class="table-top">
    <div v-for="(item, index) in items" :key="index" class="table-item">
      <img :src="item.icon" alt="icon" class="item-icon"/>
      <div class="item-value">{{ item.value }}</div>
      <div class="item-title">{{ item.title }}</div>
    </div>
  </div>
</template>

<script setup>

const items = [
  {
    icon: '/img/main/Top/orderWith.png',
    value: '3387',
    title: '立案'
  },
  {
    icon: '/img/main/Top/orderOK.png',
    value: '2831',
    title: '处置'
  },
  {
    icon: '/img/main/Top/orderOK.png',
    value: '2789',
    title: '结案'
  },
  {
    icon: '/img/main/Top/Man.png',
    value: '104',
    title: '人员'
  }
];
</script>

<style lang="less" scoped>
.table-top {
  display: flex;
  justify-content: space-between; // 使用space-between代替space-around来减少间距
  align-items: center;
  width: 100%;
  height: 100%; // 根据内容自动调整高度
  
  .table-item {
    background: rgba(9, 56, 116, 0.5);
    border: 1px solid rgba(2, 213, 223, 0.8);
    border-radius: 8px;
    padding: 1px;
    color: #fff;
    text-align: center;
    margin: 2px; // 减少外边距
    flex: 1; // 让每个item尽量占用相同的空间
    min-width: 70px; // 设置最小宽度确保内容不会太拥挤
    max-width: 150px; // 设置最大宽度限制
    
    .item-icon {
      width: 35px;
      height: 35px;
      margin-bottom: 5px; // 增加一点底部间距
    }

    .item-value {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .item-title {
      font-size: 18px;
    }
  }
}
</style>