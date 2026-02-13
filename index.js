// index.js（云托管实际运行的入口文件）

const express = require('express');
const axios = require('axios');

const app = express();

// 解析 POST 请求的 JSON 数据
app.use(express.json());

// ✅ 根路径 / ，访问域名时返回服务状态，不再显示 CloudBase 默认页
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Coze Lyric Proxy',
    message: '服务已启动，请用 /api/coze-lyric 接口生成歌词',
    time: new Date().toISOString()
  });
});

// ✅ 示例接口（可留可删）
app.get('/api/count', (req, res) => {
  res.json({ count: 1 });
});

// ✅ 核心接口：调用 Coze 生成歌词
app.post('/api/coze-lyric', async (req, res) => {
  try {
    const {
      start_cards,
      start_comment,
      mood_cards,
      mood_comment,
      rhythm_cards,
      rhythm_comment
    } = req.body;

    const cozeParams = {
      workflow_id: '7605408313219825705',
      bot_id: '7605111774135975977',
      parameters: {
        start_cards,
        start_comment,
        mood_cards,
        mood_comment,
        rhythm_cards,
        rhythm_comment
      }
    };

    const cozeResponse = await axios.post(
      'https://api.coze.cn/v1/workflow/stream_run',
      cozeParams,
      {
        headers: {
          'Authorization': 'Bearer cztei_qorFbN6pnyqZq7qv93S6D1skylcZy9SelOQDeEmEmImMvGh0eH1FFwM5LaFcg8nYP',
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(cozeResponse.data);
  } catch (error) {
    console.error('调用 Coze 失败:', error.response?.data || error.message);
    res.status(500).json({ error: '调用 Coze 失败', detail: error.message });
  }
});

// 导出 app，云托管需要
module.exports = app;
