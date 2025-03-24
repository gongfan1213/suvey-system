require('dotenv').config(); // 确保加载 .env 文件
const { MongoClient } = require('mongodb');

// 从环境变量中读取 MongoDB 配置
const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DATABASE || 'surveyDB';
const collectionName = process.env.MONGO_COLLECTION || 'responses';

// 初始化 MongoDB 客户端
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// 获取数据库和集合
async function init() {
    try {
        await client.connect();
        console.log('已连接到 MongoDB');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        console.log(`已连接到数据库: ${dbName}, 集合: ${collectionName}`);

        return collection;
    } catch (error) {
        console.error('MongoDB 初始化失败:', error);
        throw error; // 抛出错误以便 server.js 捕获
    }
}

module.exports = { init };