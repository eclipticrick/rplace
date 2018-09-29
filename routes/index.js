const express = require('express'),
      router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send('index');
});
router.get('/setPixel', (req, res) => {
    res.status(200).send('index');
});

module.exports = router;
