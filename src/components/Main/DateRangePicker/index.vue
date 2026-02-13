<template>
  <div class="date-range-picker">
    <el-config-provider :locale="zhCn">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
        :shortcuts="shortcuts"
        @change="handleDateChange"
        @clear="handleClear"
        clearable
      />
    </el-config-provider>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { useStore } from 'vuex'; // 引入 Vuex 实例

const UseStore = useStore(); // 注册 Vuex 实例对象
const emit = defineEmits(['date-change']);

// 获取当前日期
const getCurrentDate = () => {
  const today = new Date();
  return [formatDate(today), formatDate(today)]; // 初始值为当天
};

// 格式化日期为 "YYYY-MM-DD"
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 初始化 dateRange，可以默认值为当前日期
const dateRange = ref([]);

// 快捷选项
const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];

// 清空时触发
const handleClear = () => {
  dateRange.value = ["", ""]; // 设置为空字符串数组
  handleDateChange(["", ""]); // 触发事件并传递空字符串数组
};

const SelectDate = computed(() => UseStore.state.AmapStore.SelectDate);

// 日期改变时触发
const handleDateChange = (val) => {
  // 避免与清空重复触发
  if(val == null){
	return;
  };
  emit('date-change', val); // 向父组件传递值
  UseStore.commit('AmapStore/SetSelectDate', val); // 更新 Vuex 状态
};
</script>

<style lang="less" scoped>
.date-range-picker {
  :deep(.el-date-editor) {
    --el-date-editor-width: 280px;
    --el-date-editor-monthrange-width: 280px;
    background: rgba(21, 79, 116, 0.3) !important;
    border-radius: 4px;

    .el-range-separator {
      color: #2cd6df;
      width: auto;
    }

    .el-range-input {
      background: transparent;
      color: #2cd6df;
    }

    .el-range__icon, .el-range__close-icon {
      color: #2cd6df;
    }

    .el-input__wrapper {
      background: transparent !important;
      border: 1px solid rgba(2, 213, 223, 0.8);
      box-shadow: none;

      &:hover {
        border-color: rgba(2, 213, 223, 1);
      }
    }

    .el-input__inner::placeholder {
      color: rgba(44, 214, 223, 0.7);
    }
  }

  :deep(.el-picker__popper) {
    background: rgba(21, 79, 116, 0.9);
    border: 1px solid rgba(2, 213, 223, 0.8);

    .el-date-range-picker__header {
      color: #2cd6df;

      div {
        color: #2cd6df;
      }
    }

    .el-date-range-picker__content {
      color: #2cd6df;
    }

    .el-date-table th {
      color: rgba(44, 214, 223, 0.8);
    }

    .el-date-table td.in-range .el-date-table-cell {
      background: rgba(44, 214, 223, 0.2);
    }

    .el-date-table td.current:not(.disabled) .el-date-table-cell {
      color: #2cd6df;
      font-weight: bold;
    }

    .el-date-table-cell {
      color: rgba(44, 214, 223, 0.8);
    }

    .el-date-table-cell.today .el-date-table-cell__text {
      color: #2cd6df;
      font-weight: bold;
    }
  }
}
</style>