const express = require('express');
const cors = require('cors');
const { init } = require('./db');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 初始化 MongoDB 集合
let collection;
init()
    .then(c => {
        collection = c;
        console.log('MongoDB 集合已初始化');
    })
    .catch(err => {
        console.error('MongoDB 初始化失败:', err);
        process.exit(1); // 如果初始化失败，退出程序
    });

// API端点
app.post('/api/submit', async (req, res) => {
    if (!collection) {
        return res.status(500).json({ error: '数据库未初始化' });
    }

    try {
        await collection.insertOne(req.body);
        res.sendStatus(201);
    } catch (error) {
        console.error('存储失败:', error);
        res.status(500).json({ error: '数据存储失败' });
    }
});

app.get('/api/chart-data', async (req, res) => {
    if (!collection) {
        return res.status(500).json({ error: '数据库未初始化' });
    }

    try {
        // 统计评分分布
        const ratings = await collection.aggregate([
            { $group: { _id: "$rating", count: { $sum: 1 } } },
            { $project: { rating: "$_id", count: 1, _id: 0 } }
        ]).toArray();

        // 统计年龄段分布
        const ages = await collection.aggregate([
            { 
                $group: { 
                    _id: { $floor: { $divide: ["$age", 10] } }, 
                    count: { $sum: 1 } 
                } 
            },
            { 
                $project: { 
                    ageGroup: { 
                        $concat: [
                            { $toString: { $multiply: ["$_id", 10] } }, 
                            "-", 
                            { $toString: { $add: [{ $multiply: ["$_id", 10] }, 9] } }
                        ] 
                    }, 
                    count: 1, 
                    _id: 0 
                } 
            }
        ]).toArray();

        res.json({ ratings, ages });
    } catch (error) {
        console.error('数据查询失败:', error);
        res.status(500).json({ error: '数据查询失败' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`服务器运行中：http://localhost:${PORT}`));