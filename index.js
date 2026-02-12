// app.js

const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// 默认示例接口
app.get('/api/count', (req, res) => {
  res.json({ count: 1 });
});

// ✅ 新增：Coze 歌词生成代理接口
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

module.exports = app;
