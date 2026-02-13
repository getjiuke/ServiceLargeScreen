import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as echarts from 'echarts';
import DataVVue3 from '@kjgl77/datav-vue3';
import 'animate.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

// 创建 Vue 实例
const app = createApp(App);
app.use(ElementPlus);
app.use(store);
app.use(router);
app.use(DataVVue3);
app.config.globalProperties.$echarts = echarts;
app.mixin({
  mounted() {
    AOS.init({
      duration: 1200,
    });
  }
});
app.mount('#app');