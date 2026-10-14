# 开发阶段
FROM node:22-alpine AS dev
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm install -g pnpm && pnpm config set registry https://registry.npmmirror.com && pnpm install --frozen-lockfile
COPY . .
EXPOSE 5734
CMD ["pnpm", "start"]

# 生产构建阶段
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm install -g pnpm && pnpm config set registry https://registry.npmmirror.com && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# 生产阶段 - 用 Nginx 提供静态文件
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
