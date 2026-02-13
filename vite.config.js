import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  server: {
    port: 8083,
    open: true,
    fs: {
      allow: [path.resolve(__dirname, './')], // 允许访问项目的根目录
    },
  },
  plugins: [vue()],
  base: '/', // 设置为相对路径
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
  },
  build: {
    outDir: 'dist',
    // rollupOptions: {
    //   output: {
    //     assetFileNames: (assetInfo) => {
    //       if (/\.(png|jpe?g|gif|svg|webp)$/.test(assetInfo.name)) {
    //         return 'static/images/[name].[hash][extname]';
    //       }
    //       return 'static/[name].[hash][extname]';
    //     }
    //   }
    // }
  },
  // 添加预览服务器配置
  preview: {
    port: 4200,
	// 防止304
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  }
});