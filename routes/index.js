const express = require('express');
const router = express.Router();
const firebase = require('../functions/firebase');
const functions = require('../functions/functions');
const check = require('../functions/check');

router.get('/', (req, res) => {
    res.status(200).send('Hi! How are you?');
});

router.get('/message', (req, res) => {
    functions.getMessage().then(message => res.status(200).json({ message: message }));
});

router.post('/pixel', (req, res) => {

    if (!check.isValidCoordinate(req.body.x, req.body.y))
        throw new Error('Invalid X,Y position!');

    if (!check.isValidColor(req.body.color))
        throw new Error('Invalid color!');

    if (!check.canChangePixel(req.body.key))
        throw new Error(functions.getMessage(req.body.key));

    firebase.setPixel(req.body.x, req.body.y, req.body.color)
        .then(action => res.status(201).json({
            message: `Pixel set successfully at position (x=${ req.body.x }, y=${ req.body.y })!`,
            action: action
        }));
});

router.get('/pixels', (req, res) => {
    firebase.getPixels()
        .then(data => res.status(200).json(JSON.stringify(data)));
});

module.exports = router;
