const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

// 获取环境变量

// 添加调试信息
console.log('MongoDB 连接信息:');
console.log('URI:', mongoUri);
console.log('数据库:', dbName);
console.log('集合:', collectionName);

// 获取所有调查响应
router.get('/', async (req, res) => {
  let client;
  try {
    console.log('尝试连接到 MongoDB...');
    client = await MongoClient.connect(mongoUri);
    console.log('MongoDB 连接成功');
    
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    console.log('查询数据...');
    const responses = await collection.find({}).toArray();
    console.log(`找到 ${responses.length} 条记录`);
    
    res.json(responses);
  } catch (error) {
    console.error('获取数据错误:', error);
    res.status(500).json({ 
      error: '数据库连接错误 Database connection error',
      details: error.message,
      stack: error.stack
    });
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB 连接已关闭');
    }
  }
});

// 提交新的调查响应
router.post('/', async (req, res) => {
  let client;
  try {
    console.log('收到新的提交:', req.body);
    
    const newResponse = {
      ...req.body,
      timestamp: new Date()
    };
    
    console.log('尝试连接到 MongoDB...');
    client = await MongoClient.connect(mongoUri);
    console.log('MongoDB 连接成功');
    
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    console.log('插入数据...');
    const result = await collection.insertOne(newResponse);
    console.log('数据插入成功:', result.insertedId);
    
    res.status(201).json({
      ...newResponse,
      _id: result.insertedId
    });
  } catch (error) {
    console.error('提交数据错误:', error);
    res.status(500).json({ 
      error: '数据库连接错误 Database connection error',
      details: error.message,
      stack: error.stack
    });
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB 连接已关闭');
    }
  }
});

module.exports = router;