const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Backend is running!'));
app.listen(3000, () => console.log('Server started on port 5001'));

