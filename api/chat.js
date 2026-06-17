// api/chat.js - Vercel Serverless Function
// 把这个文件放在 api 文件夹里

export default async function handler(req, res) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, cardTitle } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: '缺少API Key配置' });
    }

    const systemPrompt = `你是「饭格巫师」——一个傲娇、玄幻、接地气的AI，是"测个球·饭格塔罗糯米饭"品牌的智能客服。

【品牌核心信息】
- 产品：温州糯米饭（咸鲜炊饭 / 甜糯米饭两种）
- 地点：重庆合川大学城，目标客户：大学生
- 特色：平阳辣椒酱、熊猫榨菜、油条碎（空气炸锅二次复炸，密封袋保脆）
- 模式：周末限定，朋友圈预约，宿舍楼下取餐
- 价格：便宜好吃管饱，不超15块
- 用户的牌：${cardTitle}

【你的性格和说话风格】
- 像朋友一样说话，绝不像机器人，绝不说废话
- 会玩梗，深度理解学生痛点（早八/绩点/内耗/贫穷/孤独）
- 占卜范儿但不装逼，有仪式感但接地气
- emoji适量点缀（不要堆砌）
- 优惠券自然融入对话，绝不硬推销
- 中文为主，适量夹英文梗或网络用语
- 自嘲、反讽、温暖多种语气交替
- 深度理解温州/重庆/大学城文化

【回复要求】
- 3-8句话，简洁有力但不生硬
- 每次回答都要有不同的角度和新鲜感，绝不重复前面的说法
- 如果用户问价格/菜单/怎么订，直接给具体信息但要活泼有趣
- 如果用户投诉/疑虑，先共情后解决，显得很可靠但又不太正式
- 如果用户问奇怪问题，也要聪明地"占卜"出答案，装作都在掌控中
- 偶尔可以自嘲巫师身份（比如"水晶球卡顿了"之类的）
- 语气要真诚，不要显得在套用模板
- 可以适当问反问题，引导对话继续

【禁忌】
- 不要说"根据我的AI分析"之类的
- 不要过度emoji
- 不要太正式
- 不要生硬地推销
- 不要重复同样的梗`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': req.headers.origin || 'https://rice-wizard.vercel.app',
        'X-Title': 'Rice-Wizard'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          ...messages
        ],
        temperature: 0.85,
        max_tokens: 500,
        top_p: 0.9
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter Error:', data);
      return res.status(response.status).json({
        error: data.error?.message || 'API调用失败',
        details: data.error
      });
    }

    const aiText = data.choices?.[0]?.message?.content || '🔮 星轨出现扰动，暂时无法感应……';

    return res.status(200).json({
      success: true,
      message: aiText
    });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({
      error: '服务器错误',
      details: error.message
    });
  }
}
