const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const LINE_ACCESS_TOKEN = 'YOUR_LINE_ACCESS_TOKEN';  //TCT6GXW8NOiSwETn5GlyeCLrOHyT8jwM7fYvrGv9ADFLQu8bbIm/tYquqVXVvEsGiTX9QS5vLTJZmi8MUUmSCD72i66aePSCnLELH02z0zajiGKUH7F07JYIIW0lZ7tFuWhR5SOMzhJAHFjzit8eIgdB04t89/1O/w1cDnyilFU=

// Webhookエンドポイント
app.post('/webhook', (req, res) => {
  console.log('📨 受信したメッセージ:', JSON.stringify(req.body, null, 2));
  
  // 受信したイベントがメッセージタイプか確認
  const events = req.body.events;
  events.forEach(async (event) => {
    if (event.type === 'message' && event.message.type === 'text') {
      const userMessage = event.message.text;
      const replyToken = event.replyToken;

      // LINEに返信するためのメッセージ
      const replyMessage = {
        replyToken: replyToken,
        messages: [
          {
            type: 'text',
            text: `あなたが送ったメッセージは: "${userMessage}"`
          }
        ]
      };

      // LINEのMessaging APIを使ってメッセージを返信
      try {
        await axios.post('https://api.line.me/v2/bot/message/reply', replyMessage, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`  // アクセストークンを使って認証
          }
        });
        console.log('✅ メッセージを返信しました！');
      } catch (error) {
        console.error('❌ メッセージ送信に失敗:', error);
      }
    }
  });

  // LINEに受信完了を伝える
  res.sendStatus(200);
});

// Glitch用にサーバーを立ち上げ
const listener = app.listen(process.env.PORT, () => {
  console.log('🚀 Webhookサーバー起動！');
});
