const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4070;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('testtest');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});