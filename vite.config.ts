import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Access-Control-Allow-Origin": "*", // 允许跨域，微前端必备
    },
    port: 5734, // 指定固定端口，方便主应用调用
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  css: {
    modules: {
      localsConvention: "camelCase", // 把 CSS 类名转换为驼峰格式
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true, // 启用 JavaScript 表达式
      },
    },
  },
});
