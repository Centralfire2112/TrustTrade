const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`TrustTrade running on http://localhost:${PORT}`);
});
