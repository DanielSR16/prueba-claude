const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello World 🚀' });
});

app.get('/action', (req, res) => {
  let list = [];

  for (let i = 0; i < 10; i++) {
    list.push(i);
  }

  res.json({ list });
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);



});
