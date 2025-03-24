# 在线调查系统 (Ajax版)

COMP7270 Web和移动编程 & COMP7980 动态Web和移动编程 - HKBU - 2025春季

## 项目描述

这是一个使用Vue.js和Express.js构建的在线调查系统，具有以下特点：

- 使用Bootstrap进行响应式网页设计
- 实现了三种不同类型的交互式图表（使用amCharts和ApexCharts.js）
- 采用两层架构：Vue.js单页应用前端和Express.js后端
- 使用Ajax异步处理表单提交，无需页面刷新
- 使用Azure CosmosDB存储调查响应
- 使用Oruga UI实现可搜索的响应数据表格

## 安装与运行

### 前提条件

- Node.js (v14+)
- npm (v6+)
- Azure CosmosDB账户

### 环境变量

在运行应用之前，请设置以下环境变量：

# 运行在线调查系统项目的步骤

## 1. 安装依赖并构建项目

首先，在项目根目录下运行以下命令来安装所有依赖并构建项目：

```bash
cd c:\Users\宫凡\Downloads\survey-system\survey-system
npm run setup
```

这个命令会：
- 安装后端依赖
- 安装前端依赖
- 构建前端项目

## 2. 导入模拟数据（可选）

如果您想使用模拟数据测试系统，可以运行：

```bash
cd c:\Users\宫凡\Downloads\survey-system\survey-system
node scripts/import-mock-data.js
```

## 3. 启动服务器

有两种方式可以启动服务器：

### 方式一：普通启动（生产模式）推荐使用这一种

```bash
cd c:\Users\宫凡\Downloads\survey-system\survey-system
npm start
```

### 方式二：开发模式启动（支持热重载）

```bash
cd c:\Users\宫凡\Downloads\survey-system\survey-system
npm run dev
```

## 4. 访问应用

启动服务器后，打开浏览器访问：

```
http://localhost:3000
```

## 注意事项

1. 确保您已经正确配置了 CosmosDB 的连接信息（在 `.env` 文件中）
2. 如果遇到依赖安装问题，可以尝试使用 `--legacy-peer-deps` 参数
3. 如果遇到构建错误，可以查看控制台输出的错误信息进行排查
4. 确保您的计算机已安装 Node.js（v14+）和 npm（v6+）
# 使用npm run dev运行

