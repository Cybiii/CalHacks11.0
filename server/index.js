const express = require('express');
const app = express();
const port = 3000; 



app.get('/', (req, res) => {
  res.send('Hello from the Express.js backend!');
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'Data from the backend' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});