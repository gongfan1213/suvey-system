require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');
const responsesRouter = require('./routes/responses');

const app = express();

// 允许所有来源的跨域请求
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API 路由 - 放在静态文件前面
app.use('/api/responses', responsesRouter);

// 静态文件服务
const frontendPath = path.join(__dirname, 'frontend/dist');
const devPath = path.join(__dirname, 'frontend/public');

try {
  const fs = require('fs');
  if (fs.existsSync(path.join(frontendPath, 'index.html'))) {
    app.use(express.static(frontendPath));
    console.log('使用生产环境前端文件');
  } else {
    app.use(express.static(devPath));
    console.log('使用开发环境前端文件');
    // 如果是开发环境，也尝试提供src目录
    app.use(express.static(path.join(__dirname, 'frontend/src')));
  }
} catch (error) {
  console.error('静态文件路径错误:', error);
}

// 前端路由 - 确保在API路由之后
app.get('*', (req, res) => {
  try {
    const fs = require('fs');
    const prodIndexPath = path.join(frontendPath, 'index.html');
    const devIndexPath = path.join(devPath, 'index.html');
    
    if (fs.existsSync(prodIndexPath)) {
      res.sendFile(prodIndexPath);
    } else if (fs.existsSync(devIndexPath)) {
      res.sendFile(devIndexPath);
    } else {
      res.status(404).send('前端文件未找到，请先构建前端项目 Frontend files not found, please build the frontend project first');
    }
  } catch (error) {
    res.status(500).send('服务器错误 Server error: ' + error.message);
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: '服务器内部错误 Internal server error',
    details: err.message 
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`服务器运行在端口 Server is running on port ${port}`);
  console.log(`访问 http://localhost:${port} 查看应用`);
});