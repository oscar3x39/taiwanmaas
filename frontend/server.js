const express = require('express');
const path = require('path');

const app = express();
const port = 8888;

// 提供靜態文件
app.use(express.static(__dirname));

// 主頁路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`🌐 前端服務器已啟動在 http://localhost:${port}`);
  console.log(`📍 請在瀏覽器中打開 http://localhost:${port} 來使用交通路線規劃`);
});