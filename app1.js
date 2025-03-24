const express = require('express');
const bodyParser = require('body-parser');
const cosmos = require('@azure/cosmos');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());



const client = new cosmos.CosmosClient({ endpoint, key });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // 提供静态文件服务

app.post('/submit', async (req, res) => {
    try {
      const { container } = client.database(databaseId).container(containerId);
      const item = req.body; // Get form data
      await container.items.create(item); // Store data in CosmosDB
      res.redirect('/results.html'); // Redirect to results page
    } catch (error) {
      console.error(error);
      res.status(500).send('Error submitting survey.');
    }
  });
  
// 添加数据接口
app.get('/api/ratings', async (req, res) => {
    const querySpec = {
      query: "SELECT c.rating, c.timestamp FROM c ORDER BY c.timestamp"
    };
    const { resources } = await client.database(databaseId)
      .container(containerId)
      .items.query(querySpec)
      .fetchAll();
    res.json(resources);
  });
// 端口配置修正
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`); // 移除多余HTML标签
  });
