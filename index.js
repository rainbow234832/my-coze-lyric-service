// app.js（或 index.js，这是你云托管项目的唯一入口文件）

const express = require('express');
const axios = require('axios');

const app = express();

// 解析 POST 请求的 JSON 数据
app.use(express.json());

// ✅ 根路径 / ，访问域名首页时返回服务状态，不再显示群二维码或计数页面
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Coze Lyric Proxy（歌词生成代理服务）',
    message: '你的小程序歌词生成服务已启动！请使用接口 /api/coze-lyric 来生成歌词。',
    time: new Date().toISOString()
  });
});

// ✅ 示例接口（可选，可留可删）：GET /api/count，返回一个计数（默认模板带的，不影响主功能）
app.get('/api/count', (req, res) => {
  res.json({ count: 1 });
});

// ✅ 核心接口：POST /api/coze-lyric，用于接收小程序参数，调用 Coze 工作流生成歌词
app.post('/api/coze-lyric', async (req, res) => {
  try {
    // 1. 从小程序接收参数
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
      workflow_id: '7605408313219825705', // 你的 Coze 歌词生成工作流 ID
      bot_id: '7605111774135975977',     // 如果你的工作流没有使用 Bot 功能，这一行可以删掉
      parameters: {
        start_cards,
        start_comment,
        mood_cards,
        mood_comment,
        rhythm_cards,
        rhythm_comment
      }
    };

    // 3. 调用 Coze 官方 API
    const cozeResponse = await axios.post(
      'https://api.coze.cn/v1/workflow/stream_run',
      cozeParams,
      {
        headers: {
          'Authorization': 'Bearer cztei_qorFbN6pnyqZq7qv93S6D1skylcZy9SelOQDeEmEmImMvGh0eH1FFwM5LaFcg8nYP', // 你的 Coze API Token
          'Content-Type': 'application/json'
        }
      }
    );

    // 4. 把 Coze 返回的歌词数据原样返回给小程序
    res.json(cozeResponse.data);

  } catch (error) {
    console.error('调用 Coze API 失败:', error.response?.data || error.message);
    res.status(500).json({
      error: '调用 Coze 歌词生成失败',
      detail: error.message
    });
  }
});

// 导出 app，微信云托管需要这个
module.exports = app;
