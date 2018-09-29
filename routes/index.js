const express = require('express');
const router = express.Router();
const firebase = require('../functions/firebase');
const functions = require('../functions/functions');
const check = require('../functions/check');

router.get('/', (req, res) => {
    res.status(200).send('Hi! How are you?');
});

router.get('/message', (req, res) => {
    functions.getMessage().then(message => res.status(200).send(message));
});

router.post('/pixel', (req, res) => {
    console.log('x', req.body.x);
    console.log('y', req.body.y);
    console.log('color', req.body.color);
    console.log('key', req.body.key);
    const x = Math.floor(Math.random() * 10000);
    const y = Math.floor(Math.random() * 10000);
    const color = '#' + Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString();

    if (!check.isValidCoordinate(req.body.color)) throw new Error('Invalid X,Y position!');
    if (!check.isValidColor(req.body.color)) throw new Error('Invalid color!');
    firebase.addPixel(x, y, color).then(() => res.status(201).send('success'));
});

router.get('/pixels', (req, res) => {
    firebase.getPixels()
        .then(data => res.status(200).send(JSON.stringify(data)));
});

module.exports = router;
