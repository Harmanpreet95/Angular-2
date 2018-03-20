const express = require('express');

const publicweb = process.env.PUBLICWEB || './';
const app = express();

app.use(express.static(publicweb));
console.log(`serving ${publicweb}`);
console.log(`serving port ${process.env.PORT}`);
app.get('*', (req, res) => {
  res.sendFile(`index.html`, { root: publicweb });
});

const port = process.env.PORT || '3000';
app.listen(port, () => console.log(`API running on localhost:${port}`));
