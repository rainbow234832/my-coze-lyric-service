// app.js

const express = require('express');
const axios = require('axios'); // 用于调用 Coze API
const app = express();

// 中间件：解析 JSON 请求体
app.use(express.json());

// ✅ 新增：处理根路径请求，避免显示 CloudBase 默认测试页
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Coze Lyric Proxy', 
    message: '服务已启动，可使用 /api/coze-lyric 接口生成歌词',
    time: new Date() 
  });
});

// 默认示例接口（保留）
app.get('/api/count', (req, res) => {
  res.json({ count: 1 });
});

// ✅ 核心接口：Coze 歌词生成代理
app.post('/api/coze-lyric', async (req, res) => {
  try {
    // 1. 接收小程序传来的参数
    const {
      start_cards,
      start_comment,
      mood_cards,
      mood_comment,
      rhythm_cards,
      rhythm_comment
    } = req.body;

    // 2. 组装 Coze 工作流需要的参数
    const cozeParams = {
      workflow_id: '7605408313219825705', // 你的歌词生成工作流 ID
      bot_id: '7605111774135975977',     // 如果工作流没用 Bot 功能，可删除此行
      parameters: {
        start_cards,
        start_comment,
        mood_cards,
        mood_comment,
        rhythm_cards,
        rhythm_comment
      }
    };

    // 3. 调用 Coze API
    const cozeResponse = await axios.post(
      'https://api.coze.cn/v1/workflow/stream_run',
      cozeParams,
      {
        headers: {
          'Authorization': 'Bearer cztei_qorFbN6pnyqZq7qv93S6D1skylcZy9SelOQDeEmEmImMvGh0eH1FFwM5LaFcg8nYP', // 你的 Coze Token
          'Content-Type': 'application/json'
        }
      }
    );

    // 4. 将 Coze 返回的数据原样返回给小程序
    res.json(cozeResponse.data);

  } catch (error) {
    console.error('调用 Coze API 失败:', error.response?.data || error.message);
    res.status(500).json({
      error: '调用 Coze 歌词生成失败',
      detail: error.message
    });
  }
});

// 云托管要求：导出 app 实例
module.exports = app;
