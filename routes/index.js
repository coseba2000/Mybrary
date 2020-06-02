const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

// exporter le router
module.exports = router;
