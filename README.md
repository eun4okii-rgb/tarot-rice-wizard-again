<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>测个球 · 饭格塔罗</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Nunito:wght@400;600;700;900&display=swap');

*{margin:0;padding:0;box-sizing:border-box;}

:root{
  --bg:#1a0a2e;
  --bg2:#0d0520;
  --purple:#9b59b6;
  --lavender:#b39ddb;
  --gold:#f9d976;
  --cream:#f0e6ff;
  --card-back:#2d1b5e;
  --card-border:#5e3a9b;
  --glow:rgba(155,89,182,0.5);
}

html,body{height:100%;overflow:hidden;}

body{
  font-family:'Nunito','PingFang SC',sans-serif;
  background:var(--bg);
  color:var(--cream);
  display:flex;
  flex-direction:column;
  height:100vh;
  position:relative;
  overflow:hidden;
}

#stars{position:fixed;inset:0;pointer-events:none;z-index:0;}
.star-dot{position:absolute;border-radius:50%;background:white;animation:twinkle var(--d,3s) infinite var(--dl,0s);}
@keyframes twinkle{0%,100%{opacity:var(--o1,.2)}50%{opacity:var(--o2,.8)}}

.app{position:relative;z-index:1;height:100vh;display:flex;flex-direction:column;}

.topbar{padding:18px 24px 12px;text-align:center;border-bottom:1px solid rgba(155,89,182,0.2);flex-shrink:0;}
.brand-title{font-family:'Cinzel',serif;font-size:20px;color:var(--gold);letter-spacing:2px;text-shadow:0 0 20px rgba(249,217,118,0.5);}
.brand-sub{font-size:11px;color:var(--lavender);margin-top:3px;letter-spacing:1px;}

.main{flex:1;display:flex;flex-direction:column;overflow:hidden;}

.stage{flex-shrink:0;padding:20px 16px 0;display:flex;flex-direction:column;align-items:center;gap:12px;}

.ritual-text{font-size:13px;color:var(--lavender);text-align:center;letter-spacing:0.5px;min-height:18px;transition:opacity 0.5s;}

.spread{display:flex;gap:10px;justify-content:center;align-items:flex-end;padding:8px 0;}

.card{width:72px;height:112px;border-radius:10px;cursor:pointer;position:relative;transform-style:preserve-3d;transition:transform 0.7s cubic-bezier(.4,0,.2,1), box-shadow 0.3s;flex-shrink:0;}
.card:nth-child(1){transform:rotate(-6deg);}
.card:nth-child(2){transform:rotate(-2deg) translateY(-6px);}
.card:nth-child(3){transform:rotate(-2deg) translateY(-6px);}
.card:nth-child(4){transform:rotate(2deg) translateY(-2px);}
.card:nth-child(5){transform:rotate(6deg) translateY(4px);}

.card:hover{filter:brightness(1.2);box-shadow:0 0 20px var(--glow);z-index:10;}
.card.picked{transform:rotate(0deg) translateY(-20px) scale(1.05)!important;box-shadow:0 0 30px var(--gold),0 0 60px rgba(249,217,118,0.3);z-index:20;cursor:default;}
.card.flipped{transform:rotate(0deg) translateY(-20px) scale(1.05) rotateY(180deg)!important;}
.card.others-fade{opacity:0.3;pointer-events:none;transform:translateY(10px) scale(0.9)!important;}

.card-face,.card-back{position:absolute;inset:0;border-radius:10px;backface-visibility:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;border:1.5px solid var(--card-border);}

.card-back{background:linear-gradient(160deg,#2d1b5e,#1a0a3e);background-image:radial-gradient(circle at 50% 30%,rgba(155,89,182,0.3) 0%,transparent 60%);}
.card-back-symbol{font-size:28px;opacity:0.6;}
.card-back-border{position:absolute;inset:5px;border:1px solid rgba(155,89,182,0.3);border-radius:7px;}

.card-face{background:linear-gradient(160deg,#3d1f6e,#1e0940);transform:rotateY(180deg);padding:6px;gap:4px;}
.card-face-emoji{font-size:26px;}
.card-face-title{font-size:9px;font-family:'Cinzel',serif;color:var(--gold);text-align:center;letter-spacing:0.5px;line-height:1.3;}
.card-face-sub{font-size:8px;color:var(--lavender);text-align:center;}

.chat-area{flex:1;overflow-y:auto;padding:12px 14px;display:flex;flex-direction:column;gap:10px;scrollbar-width:none;}
.chat-area::-webkit-scrollbar{display:none;}

.msg-row{display:flex;gap:8px;align-items:flex-end;}
.msg-row.user{flex-direction:row-reverse;}

.avatar{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#5e3a9b,#9b59b6);display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;box-shadow:0 0 10px rgba(155,89,182,0.4);}

.bubble{max-width:75%;padding:10px 13px;border-radius:16px;font-size:13px;line-height:1.65;}
.bubble.ai{background:rgba(45,27,94,0.8);border:1px solid rgba(155,89,182,0.3);color:var(--cream);border-bottom-left-radius:4px;backdrop-filter:blur(10px);}
.bubble.user{background:linear-gradient(135deg,#7c4dbd,#9c6dd8);color:white;border-bottom-right-radius:4px;}
.bubble strong{color:var(--gold);}
.bubble em{color:var(--lavender);font-style:italic;}

.typing-dots{display:flex;gap:4px;padding:4px 2px;}
.typing-dots span{width:6px;height:6px;border-radius:50%;background:var(--lavender);animation:bounce 1.2s infinite;}
.typing-dots span:nth-child(2){animation-delay:.2s;}
.typing-dots span:nth-child(3){animation-delay:.4s;}
@keyframes bounce{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-5px);opacity:1}}

.input-bar{padding:10px 12px 16px;display:flex;gap:8px;background:rgba(13,5,32,0.8);border-top:1px solid rgba(155,89,182,0.2);flex-shrink:0;backdrop-filter:blur(10px);}
.input-bar textarea{flex:1;padding:10px 14px;background:rgba(45,27,94,0.6);border:1px solid rgba(155,89,182,0.4);border-radius:20px;color:var(--cream);font-family:inherit;font-size:13px;outline:none;resize:none;height:42px;line-height:1.4;transition:border-color .2s;}
.input-bar textarea:focus{border-color:var(--purple);}
.input-bar textarea::placeholder{color:rgba(179,157,219,0.4);}
.send-btn{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#7c4dbd,#9c6dd8);border:none;color:white;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 0 15px rgba(155,89,182,0.4);transition:transform .15s,box-shadow .2s;flex-shrink:0;}
.send-btn:hover{transform:scale(1.08);box-shadow:0 0 25px rgba(155,89,182,0.7);}
.send-btn:disabled{opacity:0.4;cursor:not-allowed;transform:none;}

.reset-btn{position:fixed;top:14px;right:16px;z-index:100;background:rgba(45,27,94,0.7);border:1px solid rgba(155,89,182,0.4);color:var(--lavender);font-size:11px;padding:5px 10px;border-radius:20px;cursor:pointer;font-family:inherit;backdrop-filter:blur(10px);}
.reset-btn:hover{border-color:var(--gold);color:var(--gold);}

.orb{position:fixed;border-radius:50%;pointer-events:none;filter:blur(60px);z-index:0;}

.welcome-note{text-align:center;color:rgba(179,157,219,0.5);font-size:11px;padding:8px;}

/* Modal */
.modal{position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(5px);}
.modal-content{background:linear-gradient(160deg,#2d1b5e,#1a0a3e);border:1px solid rgba(155,89,182,0.3);border-radius:20px;padding:30px;max-width:400px;width:90%;color:var(--cream);}
.modal-title{font-size:18px;font-weight:bold;color:var(--gold);margin-bottom:15px;text-align:center;}
.modal-input{width:100%;padding:12px;background:rgba(45,27,94,0.6);border:1px solid rgba(155,89,182,0.4);border-radius:10px;color:var(--cream);font-family:inherit;font-size:13px;margin-bottom:15px;outline:none;}
.modal-input:focus{border-color:var(--purple);}
.modal-btn{width:100%;padding:12px;background:linear-gradient(135deg,#7c4dbd,#9c6dd8);border:none;color:white;border-radius:10px;cursor:pointer;font-weight:bold;font-size:14px;transition:transform .2s;}
.modal-btn:hover{transform:scale(1.05);}
.modal-note{font-size:11px;color:var(--lavender);text-align:center;margin-top:10px;}
</style>
</head>
<body>

<div id="stars"></div>

<div class="orb" style="width:300px;height:300px;background:rgba(100,40,180,0.12);top:-50px;left:-50px;"></div>
<div class="orb" style="width:200px;height:200px;background:rgba(180,100,255,0.08);bottom:100px;right:-30px;"></div>

<!-- API Key Modal -->
<div id="keyModal" class="modal">
  <div class="modal-content">
    <div class="modal-title">🔮 饭格巫师需要你的能量</div>
    <input type="password" id="apiKeyInput" class="modal-input" placeholder="粘贴你的OpenRouter API Key (sk-or-v1-...)" />
    <button class="modal-btn" onclick="setAPIKey()">确认</button>
    <div class="modal-note">💡 没有Key？去 https://openrouter.ai 免费申请</div>
  </div>
</div>

<button class="reset-btn" onclick="resetAll()">🔄 重新占卜</button>

<div class="app">
  <div class="topbar">
    <div class="brand-title">✦ 测个球 · 饭格塔罗 ✦</div>
    <div class="brand-sub">Rice-Wizard · Sees all · Feeds all</div>
  </div>

  <div class="main">
    <div class="stage" id="stage">
      <div class="ritual-text" id="ritual-text">🔮 心中默念你今天最想吃什么，然后抽一张牌</div>
      <div class="spread" id="spread"></div>
    </div>

    <div class="chat-area" id="chat">
      <div class="welcome-note">✦ 牌面随机 · 命运自选 ✦</div>
    </div>

    <div class="input-bar">
      <textarea id="userInput" placeholder="跟巫师说点什么…" onkeydown="handleKey(event)" disabled></textarea>
      <button class="send-btn" id="sendBtn" onclick="sendMsg()" disabled>↑</button>
    </div>
  </div>
</div>

<script>
// ── Starfield ──────────────────────────────────────────────
const starEl = document.getElementById('stars');
for(let i=0;i<120;i++){
  const d=document.createElement('div');
  d.className='star-dot';
  const sz=Math.random()*2+0.5;
  d.style.cssText=`width:${sz}px;height:${sz}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--d:${(Math.random()*4+2).toFixed(1)}s;--dl:${(Math.random()*4).toFixed(1)}s;--o1:${(Math.random()*0.3+0.05).toFixed(2)};--o2:${(Math.random()*0.6+0.3).toFixed(2)};`;
  starEl.appendChild(d);
}

// ── State ──────────────────────────────────────────────────
let API_KEY = localStorage.getItem('rice-wizard-key') || '';
let pickedCard = null;
let chatHistory = [];
let isTyping = false;
let cardPicked = false;

// ── Tarot Deck ──────────────────────────────────────────────
const DECK = [
  {id:'sun',emoji:'☀️',title:'THE SUN\n太阳',sub:'满足·温暖·圆满'},
  {id:'moon',emoji:'🌙',title:'THE MOON\n月亮',sub:'直觉·神秘·夜宵'},
  {id:'star',emoji:'⭐',title:'THE STAR\n星星',sub:'希望·清新·治愈'},
  {id:'knight',emoji:'⚔️',title:'THE KNIGHT\n骑士',sub:'行动·冲劲·孤勇'},
  {id:'wheel',emoji:'🎡',title:'THE WHEEL\n命运轮',sub:'转机·随机·惊喜'},
  {id:'tower',emoji:'🗼',title:'THE TOWER\n高塔',sub:'爆发·崩塌·重生'},
  {id:'hermit',emoji:'🕯️',title:'THE HERMIT\n隐者',sub:'沉淀·独处·内省'},
  {id:'fool',emoji:'🃏',title:'THE FOOL\n愚者',sub:'出发·随性·新章'},
  {id:'lovers',emoji:'💜',title:'THE LOVERS\n恋人',sub:'连接·分享·羁绊'},
  {id:'world',emoji:'🌍',title:'THE WORLD\n世界',sub:'圆满·丰收·巅峰'},
];

// ── API Key Management ──────────────────────────────────────
function setAPIKey(){
  const input = document.getElementById('apiKeyInput');
  const key = input.value.trim();
  
  if(!key.startsWith('sk-or-v1-')){
    alert('❌ Key格式不对！需要以 sk-or-v1- 开头');
    return;
  }
  
  API_KEY = key;
  localStorage.setItem('rice-wizard-key', key);
  document.getElementById('keyModal').style.display = 'none';
}

// Check if need key
if(!API_KEY){
  document.getElementById('keyModal').style.display = 'flex';
}else{
  document.getElementById('keyModal').style.display = 'none';
}

// ── Init Spread ─────────────────────────────────────────────
function initSpread(){
  const spread = document.getElementById('spread');
  spread.innerHTML='';
  const shuffled=[...DECK].sort(()=>Math.random()-0.5);
  const shown = shuffled.slice(0,5);
  shown.forEach((card)=>{
    const el=document.createElement('div');
    el.className='card';
    el.dataset.cardId=card.id;
    el.innerHTML=`
      <div class="card-back">
        <div class="card-back-border"></div>
        <div class="card-back-symbol">🍚</div>
      </div>
      <div class="card-face">
        <div class="card-face-emoji">${card.emoji}</div>
        <div class="card-face-title">${card.title}</div>
        <div class="card-face-sub">${card.sub}</div>
      </div>`;
    el.onclick=()=>flipCard(el, card);
    spread.appendChild(el);
  });
}

// ── Flip Card ───────────────────────────────────────────────
function flipCard(el, card){
  if(cardPicked) return;
  cardPicked=true;
  pickedCard=card;

  document.getElementById('ritual-text').textContent='✨ 命运之牌已翻开……';

  el.classList.add('picked');
  document.querySelectorAll('.card').forEach(c=>{if(c!==el) c.classList.add('others-fade');});

  setTimeout(()=>{el.classList.add('flipped');},400);

  setTimeout(()=>{
    document.getElementById('userInput').disabled=false;
    document.getElementById('sendBtn').disabled=false;
    document.getElementById('userInput').focus();
    startReading(card);
  },1200);
}

// ── Start Reading ───────────────────────────────────────────
function startReading(card){
  chatHistory = [{role:'user',content:`我抽到了${card.title}这张牌。`}];
  callAI();
}

// ── Call AI (OpenRouter) ────────────────────────────────────
async function callAI(){
  showTyping();

  try {
    const systemPrompt = `你是「饭格巫师」——一个傲娇、玄幻、接地气的AI，是"测个球·饭格塔罗糯米饭"品牌的智能客服。

【品牌核心信息】
- 产品：温州糯米饭（咸鲜炊饭 / 甜糯米饭两种），地点：重庆合川大学城
- 特色：平阳辣椒酱、熊猫榨菜、油条碎（空气炸锅二次复炸，密封袋保脆）
- 模式：周末限定，朋友圈预约，宿舍楼下取餐
- 价格：便宜好吃管饱，不超15块
- 用户的牌：${pickedCard?.title}

【你的性格】
- 像朋友一样说话，绝不像机器人
- 会玩梗，懂学生痛点（早八/绩点/内耗/贫穷）
- 占卜范儿但不装逼，有仪式感
- emoji适量，优惠券自然融入
- 3-8句话，简洁有力，每次角度不同
- 中文为主，可夹英文梗
- 深度理解温州/重庆/大学城文化`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Rice-Wizard'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {role: 'system', content: systemPrompt},
          ...chatHistory
        ],
        temperature: 0.85,
        max_tokens: 500,
        top_p: 0.9
      })
    });

    const data = await response.json();
    hideTyping();

    if (!response.ok) {
      const errMsg = data.error?.message || `HTTP ${response.status}`;
      appendAI(`🔮 水晶球出现干扰：${errMsg}`);
      return;
    }

    const aiText = data.choices?.[0]?.message?.content || '🔮 星轨扰动……';
    appendAI(aiText);
    chatHistory.push({role:'assistant',content:aiText});

  } catch (error) {
    hideTyping();
    appendAI(`🔮 网络出现问题：${error.message}`);
  }
}

// ── UI Functions ────────────────────────────────────────────
function appendAI(text){
  const chat=document.getElementById('chat');
  const row=document.createElement('div');
  row.className='msg-row ai';
  row.innerHTML=`<div class="avatar">🧙</div><div class="bubble ai">${text.replace(/\n/g,'<br>')}</div>`;
  chat.appendChild(row);
  scrollBottom();
}

function appendUser(text){
  const chat=document.getElementById('chat');
  const row=document.createElement('div');
  row.className='msg-row user';
  row.innerHTML=`<div class="bubble user">${escHtml(text)}</div>`;
  chat.appendChild(row);
  scrollBottom();
}

function escHtml(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function showTyping(){
  isTyping=true;
  const chat=document.getElementById('chat');
  const row=document.createElement('div');
  row.className='msg-row ai';
  row.id='typing-indicator';
  row.innerHTML=`<div class="avatar">🧙</div><div class="bubble ai"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  chat.appendChild(row);
  scrollBottom();
}

function hideTyping(){
  isTyping=false;
  document.getElementById('typing-indicator')?.remove();
}

function scrollBottom(){
  const c=document.getElementById('chat');
  c.scrollTop=c.scrollHeight;
}

// ── Message Send ────────────────────────────────────────────
async function sendMsg(){
  if(!cardPicked||isTyping) return;
  const ta=document.getElementById('userInput');
  const text=ta.value.trim();
  if(!text) return;
  ta.value='';
  ta.style.height='42px';
  appendUser(text);
  chatHistory.push({role:'user',content:text});
  callAI();
}

function handleKey(e){
  if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg();}
}

document.getElementById('userInput').addEventListener('input',function(){
  this.style.height='42px';
  this.style.height=Math.min(this.scrollHeight,100)+'px';
});

// ── Reset ───────────────────────────────────────────────────
function resetAll(){
  cardPicked=false;pickedCard=null;chatHistory=[];isTyping=false;
  document.getElementById('chat').innerHTML='<div class="welcome-note">✦ 牌面随机 · 命运自选 ✦</div>';
  document.getElementById('ritual-text').textContent='🔮 心中默念你今天最想吃什么，然后抽一张牌';
  document.getElementById('userInput').disabled=true;
  document.getElementById('sendBtn').disabled=true;
  document.getElementById('userInput').value='';
  initSpread();
}

// ── Boot ────────────────────────────────────────────────────
initSpread();
</script>
</body>
</html>
