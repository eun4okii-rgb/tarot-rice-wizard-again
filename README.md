const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务 - 这是关键！
app.use(express.static('public'));

// 初始化 Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 系统提示词
const SYSTEM_PROMPT = `你是一个神秘的塔罗占卜师，同时也是一个聪慧的美食推荐家。

你的性格：
- 神秘、有趣、充满智慧
- 用塔罗牌的意象和比喻来回答问题
- 关心用户的饮食和心情
- 用一些emoji来增加趣味性
- 对糯米饭、油条、辣椒酱等有深入的了解

回答风格：
- 每个回答都要与用户抽到的塔罗牌相关
- 给出实际有用的建议
- 在适当的时候推荐食物
- 保持神秘又亲切的语气
- 用** **标记重要的词汇
- 用\n换行

记住：这不是真的占卜，但要让用户感受到被理解和被关心的感觉。`;

// 本地回复池（备用）
const SMART_REPLIES = {
  price: [
    "💰 本品牌就是靠「便宜好吃管饱」起家的。咸鲜炊饭一份不超15块，甜糯米饭也一样。油条碎、榨菜、辣椒酱全不加钱。",
    "✨ 比起校园里那些宰学生的快餐，这份糯米饭的性价比已经是天花板了。"
  ],
  morning: [
    "🌙 早八是对年轻人的最大不尊重。但一碗热汤浇汁的糯米饭能治愈50%的早八焦虑。",
    "⚔️ 别空腹上战场。前一晚预约，第二天早八前取餐。"
  ],
  roommate: [
    "💜 一个人吃饭是生存，两个人拼单是生活。而且两份各减1.5元。",
    "🧙 在宿舍群里说「我要订糯米饭了」，永远比「一起学习吗」回复率高。"
  ],
  taste: [
    "🌶️ 平阳红黄辣椒酱 + 肉碎汤浇汁，这是温州的灵魂和重庆的信仰的合体。",
    "🍚 咸鲜炊饭适合：没睡醒的早晨、空虚的下午、迷茫的晚餐。甜糯米饭适合：心情emo、想被治愈、或者就是馋了。"
  ],
  order: [
    "🧙 流程贼简单：朋友圈/群发暗号 → 私信我预约 → 周末某个时段宿舍楼下取 → 回宿舍开吃。",
    "🔮 周末哪几天能订？礼拜五下午开始接单，周六日送。数量有限，早下单早安心。"
  ]
};

function getSmartReply(text) {
  const lower = text.toLowerCase();
  if (/多少钱|价格|便宜|贵/.test(lower)) {
    return SMART_REPLIES.price[Math.floor(Math.random() * SMART_REPLIES.price.length)];
  }
  if (/早八|早上|困|睡/.test(lower)) {
    return SMART_REPLIES.morning[Math.floor(Math.random() * SMART_REPLIES.morning.length)];
  }
  if (/室友|同学|宿舍|一起|拼|朋友/.test(lower)) {
    return SMART_REPLIES.roommate[Math.floor(Math.random() * SMART_REPLIES.roommate.length)];
  }
  if (/咸|甜|辣|口味|菜单|吃什么/.test(lower)) {
    return SMART_REPLIES.taste[Math.floor(Math.random() * SMART_REPLIES.taste.length)];
  }
  if (/怎么|订|预约|流程|哪里|几点|什么时候/.test(lower)) {
    return SMART_REPLIES.order[Math.floor(Math.random() * SMART_REPLIES.order.length)];
  }
  return null;
}

// 聊天接口
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, cardTitle } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: '无效的消息格式'
      });
    }

    // 检查最后一条用户消息
    const lastUserMessage = messages[messages.length - 1]?.content;
    if (!lastUserMessage) {
      return res.status(400).json({
        success: false,
        error: '没有用户消息'
      });
    }

    // 尝试本地智能回复
    const smartReply = getSmartReply(lastUserMessage);
    if (smartReply) {
      return res.json({
        success: true,
        message: smartReply
      });
    }

    // 调用 Gemini API
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: '❌ GEMINI_API_KEY 未配置。请检查 .env 文件。'
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // 构建对话历史
    const conversationHistory = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // 构建完整的提示词
    const fullPrompt = `${SYSTEM_PROMPT}\n\n用户抽到的牌是：${cardTitle || '未知之牌'}\n\n请基于这张牌和用户的问题给出回答。`;

    // 开始聊天
    const chat = model.startChat({
      history: conversationHistory.slice(0, -1),
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.9
      }
    });

    const result = await chat.sendMessage(fullPrompt + '\n\n用户: ' + lastUserMessage);
    const responseText = result.response.text();

    res.json({
      success: true,
      message: responseText
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || '服务器错误'
    });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '🧙 塔罗卜师在线' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n🧙 塔罗占卜服务启动成功！`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`📡 API 端点: http://localhost:${PORT}/api/chat`);
  console.log(`\n提示: 确保 .env 文件中配置了 GEMINI_API_KEY\n`);
});
