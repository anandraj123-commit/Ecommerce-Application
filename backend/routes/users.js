const express = require('express');
const router = express.Router();

// Route to handle GET requests to /users
router.get('/', (req, res) => {
  res.send('GET request to /users');
});

// Route to handle POST requests to /users
router.post('/', (req, res) => {
  res.send('POST request to /users');
});

// Route to handle PUT requests to /users/:id
router.put('/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`PUT request to /users/${userId}`);
});

// Route to handle DELETE requests to /users/:id
router.delete('/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`DELETE request to /users/${userId}`);
});
module.exports = router;